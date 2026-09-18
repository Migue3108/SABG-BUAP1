import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    const redirectUrl = new URL("/", request.url);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/capitulo-1/:path*",
    "/capitulo-2/:path*",
    "/capitulo-3/:path*",
    "/capitulo-4/:path*",
    "/capitulo-5/:path*",
    "/capitulo-6/:path*",
    "/capitulo-7/:path*",
    "/capitulo-8/:path*",
    "/recursos/:path*",
    "/perfil/:path*",
    "/preferencias/:path*",
    "/seguimiento/:path*",
    "/ayuda/:path*",
  ],
};
