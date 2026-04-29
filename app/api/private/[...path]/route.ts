import type { NextRequest } from "next/server";
import { forwardRequest, type ProxyContext } from "@/lib/bff/proxy";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
} from "@/lib/auth/constants";

export const dynamic = "force-dynamic";

async function handlePrivateRequest(
  request: NextRequest,
  context: ProxyContext,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
) {
  return (
    await forwardRequest(request, context, method, {
      accessToken: request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)?.value,
      refreshToken: request.cookies.get(REFRESH_TOKEN_COOKIE_KEY)?.value,
    })
  ).response;
}

export async function GET(request: NextRequest, context: ProxyContext) {
  return handlePrivateRequest(request, context, "GET");
}

export async function POST(request: NextRequest, context: ProxyContext) {
  return handlePrivateRequest(request, context, "POST");
}

export async function PUT(request: NextRequest, context: ProxyContext) {
  return handlePrivateRequest(request, context, "PUT");
}

export async function PATCH(request: NextRequest, context: ProxyContext) {
  return handlePrivateRequest(request, context, "PATCH");
}

export async function DELETE(request: NextRequest, context: ProxyContext) {
  return handlePrivateRequest(request, context, "DELETE");
}
