import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import { buildErrorResponse, getApiErrorMessage } from "@/lib/util/apiError";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse } from "@/types/auth";
import { clearSession, getRequestSession, setLoginSession } from "./auth-session";
import { fetchBackendRaw } from "./backend-fetch";

export type BackendProxyRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const LOCAL_LOGOUT_PATH = "/auth/logout";
// api public
const PUBLIC_BACKEND_PATHS = new Set(["/auth/login", "/auth/signup"]);

const REQUEST_HEADERS = ["accept", "content-type"];

const RESPONSE_HEADERS = ["content-type", "content-disposition", "cache-control"];

function isEmptyResponse(status: number) {
  return status === 204 || status === 205 || status === 304;
}

// build api để gọi backend
async function buildBackendPath(
  request: NextRequest,
  context: BackendProxyRouteContext,
) {
  // lấy ra mảng 
  const { path } = await context.params;
  // ghép thành url 
  const pathname = `/${path.map(encodeURIComponent).join("/")}`;

  
  return {
    pathname,
    pathWithSearch: `${pathname}${request.nextUrl.search}`,
  };
}

// lấy herder để gọi api next  
function pickRequestHeaders(request: NextRequest) {
  const headers = new Headers();

  for (const name of REQUEST_HEADERS) {
    const value = request.headers.get(name);

    if (value) {
      headers.set(name, value);
    }
  }

  return headers;
}
// lấy herder để trả về từ repone của next   
function pickResponseHeaders(headers: Headers) {
  const nextHeaders = new Headers();

  for (const name of RESPONSE_HEADERS) {
    const value = headers.get(name);

    if (value) {
      nextHeaders.set(name, value);
    }
  }

  return nextHeaders;
}

// lấy body của request next 
async function readRequestBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const body = await request.arrayBuffer();

  return body.byteLength > 0 ? body : undefined;
}

function parseJson(buffer: ArrayBuffer, contentType: string | null) {
  if (!contentType?.includes("application/json") || buffer.byteLength === 0) {
    return null;
  }

  try {
    return JSON.parse(new TextDecoder().decode(buffer)) as unknown;
  } catch {
    return null;
  }
}

// kiểm trả repone backend có đúng mấu của repone login k 
function isLoginPayload(payload: unknown): payload is ApiResponse<AuthResponse> {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("success" in payload) ||
    !("data" in payload) ||
    typeof payload.data !== "object" ||
    payload.data === null
  ) {
    return false;
  }

  const data = payload.data as Partial<AuthResponse>;

  return (
    typeof data.accessToken === "string" &&
    typeof data.role === "string"
  );
}

function jsonResponse(payload: ApiResponse<null>, status: number) {
  return NextResponse.json(payload, { status });
}

function handleLocalLogout() {
  const response = jsonResponse(
    {
      data: null,
      error: null,
      message: "Đăng xuất thành công.",
      success: true,
      timestamp: new Date().toISOString(),
    },
    200,
  );

  clearSession(response);

  return response;
}

// Trục client đi vào đây: browser gọi Next API, Next đọc cookie rồi proxy sang backend.
export async function handleBackendProxyRequest(
  request: NextRequest,
  context: BackendProxyRouteContext,
) {
  const { pathname, pathWithSearch } = await buildBackendPath(request, context);

  if (pathname === LOCAL_LOGOUT_PATH) {
    return handleLocalLogout();
  }
  // lấy token từ request 
  const session = getRequestSession(request);

  // check xem có phải api public k 
  const isPublicPath = PUBLIC_BACKEND_PATHS.has(pathname);

  
  try {
    const backendResponse = await fetchBackendRaw(pathWithSearch, {
      accessToken: isPublicPath ? undefined : session.accessToken,
      body: await readRequestBody(request),
      headers: pickRequestHeaders(request),
      method: request.method,
    });
//  đọc toàn bộ body mà backend trả về, dưới dạng dữ liệu thô ArrayBuffer
    const buffer = await backendResponse.arrayBuffer();

    const contentType = backendResponse.headers.get("content-type");

    const payload = parseJson(buffer, contentType);
    const response = new NextResponse(
      isEmptyResponse(backendResponse.status) ? null : buffer,
      {
        headers: pickResponseHeaders(backendResponse.headers),
        status: backendResponse.status,
      },
    );

    // nếu login thành công thì set token vào cooki 
    if (
      pathname === "/auth/login" &&
      backendResponse.ok &&
      isLoginPayload(payload) &&
      payload.data
    ) {
      setLoginSession(response, payload.data);
    }

    // Chưa có interceptor renew token: nếu backend báo 401 cho private API thì clear session.
    // if (!isPublicPath && backendResponse.status === 401) {
    //   clearSession(response);
    // }

    return response;
  } catch (error) {
    return jsonResponse(
      buildErrorResponse(
        getApiErrorMessage(error, "Không thể kết nối backend."),
      ),
      502,
    );
  }
}
