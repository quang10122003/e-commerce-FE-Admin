import { AxiosHeaders } from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { getApiErrorMessage } from "@/lib/axios/error";
import { createBackendPrivateApiClient } from "@/lib/axios/backend-private";
import { createBackendPublicApiClient } from "@/lib/axios/backend-public";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
  REFRESH_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  ROLE_COOKIE_KEY,
} from "@/lib/auth/constants";
import type { AuthResponse } from "@/types/auth/authRepone";
import type { ApiResponseType } from "@/types/apiRepone/apiType";

export type ProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ForwardRequestOptions = {
  accessToken?: string;
  refreshToken?: string;
};

type RefreshAuthResult = {
  accessToken: string;
  payload?: ApiResponseType<AuthResponse>;
};

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API;

// bắn lỗi nếu ko có base url backend
function ensureBackendApiBaseUrl() {
  if (!BACKEND_API_BASE_URL) {
    throw new Error("Backend API base URL is not configured.");
  }

  return BACKEND_API_BASE_URL;
}


// chuẩn hóa URL path trước khi forward sang backend
export function getProxyTargetPath(path: string[]) {
  const normalizedPath = (path ?? [])
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return normalizedPath ? `/${normalizedPath}` : "/";
}


// hàm cấu hinh herder  cho request đến backend
function buildForwardHeaders(request: NextRequest) {
  const headers = new AxiosHeaders();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (accept) {
    headers.set("Accept", accept);
  }

  return headers;
}

// hàm set body cho request đến backend
async function readForwardBody(request: NextRequest, method: HttpMethod) {
  if (method === "GET") {
    return undefined;
  }

  const rawBody = await request.arrayBuffer();
  return rawBody.byteLength > 0 ? rawBody : undefined;
}

function getHeaderAsString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return "";
}

function parseJsonPayload(buffer: ArrayBuffer, contentType: unknown) {
  if (!getHeaderAsString(contentType).includes("application/json")) {
    return null;
  }

  try {
    return JSON.parse(new TextDecoder("utf-8").decode(buffer)) as unknown;
  } catch {
    return null;
  }
}

function applyAuthCookies(response: NextResponse, payload: unknown) {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("data" in payload) ||
    typeof payload.data !== "object" ||
    payload.data === null
  ) {
    return;
  }

  const data = payload.data as {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
  };

  if (!data.accessToken || !data.refreshToken || !data.role) {
    return;
  }

  response.cookies.set(ACCESS_TOKEN_COOKIE_KEY, data.accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE_KEY, data.refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  });

  response.cookies.set(ROLE_COOKIE_KEY, data.role, {
    httpOnly: true,
    path: "/",
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_SECONDS,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE_KEY, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE_KEY, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(ROLE_COOKIE_KEY, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

// call api reftoken 
async function refreshBackendAccessToken(refreshToken: string): Promise<RefreshAuthResult | null> {
  const client = createBackendPublicApiClient({
    baseURL: ensureBackendApiBaseUrl(),
  });

  try {
    const response = await client.post<ApiResponseType<AuthResponse>>("/auth/refresh", {
      refreshToken,
    });

    if (!response.data.success || !response.data.data?.accessToken) {
      return null;
    }

    return {
      accessToken: response.data.data.accessToken,
      payload: response.data,
    };
  } catch {
    return null;
  }
}


// hàm gửi request sang backend 
async function performBackendRequest(
  request: NextRequest,
  method: HttpMethod,
  targetPath: string,
  headers: AxiosHeaders,
  body: ArrayBuffer | undefined,
  options: ForwardRequestOptions,
) {
  const client = options.accessToken
    ? createBackendPrivateApiClient({
      accessToken: options.accessToken,
      baseURL: ensureBackendApiBaseUrl(),
    })
    : createBackendPublicApiClient({
      baseURL: ensureBackendApiBaseUrl(),
    });

  return client.request<ArrayBuffer>({
    data: body,
    headers,
    method,
    // giữ nguyên dữ liệu backend trả về
    responseType: "arraybuffer",

    url: `${targetPath}${request.nextUrl.search}`,
    // trả nguyên status http backend trả về client 
    validateStatus: () => true,
  });
}

export async function forwardRequest(
  request: NextRequest,
  context: ProxyContext,
  method: HttpMethod,
  options: ForwardRequestOptions = {},
) {
  ensureBackendApiBaseUrl();

  // cấu hình url call api backend 
  const { path } = await context.params;

  const targetPath = getProxyTargetPath(path);

  //lấy heders 
  const headers = buildForwardHeaders(request);
  
  // lấy body 
  const body = await readForwardBody(request, method);

  // biến lưu data trả về từ backend khi reftoken   
  let refreshedAuthPayload: ApiResponseType<AuthResponse> | null = null;

  try {
    let backendResponse = await performBackendRequest(
      request,
      method,
      targetPath,
      headers,
      body,
      options,
    );

    // cấu hình inteceptor repone khi call api backend mà trả về 401 or 403 
    if (
      backendResponse.status === 401 &&
      options.accessToken &&
      options.refreshToken
    ) {
      const refreshed = await refreshBackendAccessToken(options.refreshToken);

      // tồn tại data trả về khi reftoken thành công 
      if (refreshed?.payload) {
        refreshedAuthPayload = refreshed.payload;
      }

      // gọi lại endpoint backend khi đã có acctoken mới
      if (refreshed?.accessToken) {
        backendResponse = await performBackendRequest(
          request,
          method,
          targetPath,
          headers,
          body,
          {
            accessToken: refreshed.accessToken,
            refreshToken: options.refreshToken,
          },
        );
      }
    }
// lấy header từ backend rồi gắn lại vào response của Next.js để browser hiểu đúng dữ liệu.
    const responseHeaders = new Headers();
    const responseContentType = backendResponse.headers["content-type"];
    const contentDisposition = backendResponse.headers["content-disposition"];

    if (typeof responseContentType === "string") {
      responseHeaders.set("Content-Type", responseContentType);
    }

    if (typeof contentDisposition === "string") {
      responseHeaders.set("Content-Disposition", contentDisposition);
    }

    const response = new NextResponse(backendResponse.data, {
      status: backendResponse.status,
      headers: responseHeaders,
    });

    // aplay token mới vào coki
    if (refreshedAuthPayload) {
      applyAuthCookies(response, refreshedAuthPayload);
    }

    return {
      payload: parseJsonPayload(backendResponse.data, responseContentType),
      response,
      targetPath,
    };
  } catch (error) {
    return {
      payload: null,
      response: NextResponse.json(
        {
          success: false,
          message: error instanceof Error
            ? error.message
            : getApiErrorMessage(error, "Failed to reach backend service."),
        },
        { status: 502 },
      ),
      targetPath,
    };
  }
}

export function setLoginCookies(response: NextResponse, payload: unknown) {
  applyAuthCookies(response, payload);
}
