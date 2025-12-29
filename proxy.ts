import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const privateRoutes = ["/notes", "/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Логіка ПРОКСІ (запити до API)
  if (pathname.startsWith("/api")) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) return NextResponse.next();

    const targetPath = pathname.replace(/^\/api/, "");
    const targetUrl = new URL(targetPath, backendUrl);

    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    return NextResponse.rewrite(targetUrl);
  }

  // 2. Логіка АВТОРИЗАЦІЇ
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;
  const res = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
        {
          headers: { Cookie: `refreshToken=${refreshToken}` },
        }
      );

      if (response.ok) {
        isAuthenticated = true;
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
          res.headers.set("set-cookie", setCookie);
        }
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/api/:path*",
  ],
};
