import { ADMIN_ROLE } from "@/types/auth";

export { ADMIN_ROLE };

export const REFRESHTOKEN_TOKEN_COOKIE_KEY ="refreshToken"
export const ACCESS_TOKEN_COOKIE_KEY = "accessToken";
export const ROLE_COOKIE_KEY = "role";

// 60 p
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
// 3 ngày
export const REFRESHTOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 3;

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
