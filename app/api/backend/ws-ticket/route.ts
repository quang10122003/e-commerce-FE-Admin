import { buildErrorResponse, getApiErrorMessage } from "@/lib/util/apiError";
import { getServerSession } from "@/server/auth-session";
import { fetchBackendRaw } from "@/server/backend-fetch";
import type { ApiResponse } from "@/types/api";
import { WsTicketResponse } from "@/types/chat";
import { NextResponse } from "next/server";


async function readJson<TData>(response: Response) {
  return (await response.json().catch(() => null)) as TData | null;
}

export async function POST() {
  // Route nay chay o Next server, nen doc duoc access token trong httpOnly cookie.
  // Client chi goi route nay de xin ws-ticket ngan han, khong bao gio nhin thay access token that.
  const session = await getServerSession();

  if (!session.accessToken) {
    return NextResponse.json(
      buildErrorResponse("Ban can dang nhap de cap WebSocket ticket."),
      { status: 401 },
    );
  }

  try {
    // Dung fetchBackendRaw thay vi serverPrivateFetch de giu lai status goc tu backend.
    // serverPrivateFetch se throw khi backend tra non-2xx, luc do route mat thong tin 401/403/500 chinh xac.
    const backendResponse = await fetchBackendRaw("/auth/ws-ticket", {
      accessToken: session.accessToken,
      method: "POST",
    });

    // Backend cua du an tra theo chuan ApiResponse<T>.
    // Neu response khong phai JSON, coi nhu loi gateway vi Next khong doc duoc payload backend.
    const payload = await readJson<ApiResponse<WsTicketResponse>>(backendResponse);

    if (!payload) {
      return NextResponse.json(
        buildErrorResponse("Backend khong tra ve JSON hop le."),
        { status: 502 },
      );
    }

    // Tra ve dung status backend gui len: 401 van la 401, 403 van la 403, 500 van la 500.
    // Nho vay client co the xu ly dung tinh huong thay vi bi gom tat ca thanh unauthorized.
    if (!backendResponse.ok || !payload.success || !payload.data) {
      return NextResponse.json(payload, { status: backendResponse.status });
    }

    // Thanh cong thi chi tra data can cho STOMP CONNECT: ticket, tokenType, expiresInSeconds.
    // Khong tra ca ApiResponse de client socket dung gon hon.
    return NextResponse.json(payload.data, { status: backendResponse.status });
  } catch (error) {
    // Loi mang, backend down, DNS/timeout... khong phai loi auth cua user nen tra 502.
    return NextResponse.json(
      buildErrorResponse(
        getApiErrorMessage(error, "Khong the cap WebSocket ticket."),
      ),
      { status: 502 },
    );
  }
}
