import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  forwardRequest,
  setLoginCookies,
  type ProxyContext,
} from "@/lib/bff/proxy";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: ProxyContext) {
  return (await forwardRequest(request, context, "GET")).response;
}

export async function POST(request: NextRequest, context: ProxyContext) {
  const forwarded = await forwardRequest(request, context, "POST");

  if (forwarded.targetPath === "/auth/logout") {
    const response = NextResponse.json({
      success: true,
      message: "Logged out",
    });
    clearAuthCookies(response);
    return response;
  }

  if (
    forwarded.targetPath === "/auth/login" &&
    forwarded.response.status >= 200 &&
    forwarded.response.status < 300
  ) {
    setLoginCookies(forwarded.response, forwarded.payload);
  }

  return forwarded.response;
}

export async function PUT(request: NextRequest, context: ProxyContext) {
  return (await forwardRequest(request, context, "PUT")).response;
}

export async function PATCH(request: NextRequest, context: ProxyContext) {
  return (await forwardRequest(request, context, "PATCH")).response;
}

export async function DELETE(request: NextRequest, context: ProxyContext) {
  return (await forwardRequest(request, context, "DELETE")).response;
}
