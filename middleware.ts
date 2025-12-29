import { NextResponse } from "next/server"; // <-- ПЕРЕВІРТЕ ЦЕЙ ІМПОРТ
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { proxy } from "./proxy";

const privateRoutes = ["/notes", "/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  // 1. Проксіювання запитів
  if (request.nextUrl.pathname.startsWith("/api")) {
    return proxy(request);
  }

  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;

  // Змінюємо назву змінної на 'res', щоб не було конфлікту з класом 'NextResponse'
  const res = NextResponse.next();

  // 2. Оновлення сесії
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
          res.headers.set("set-cookie", setCookie); // Використовуємо res
        }
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  }

  // 3. Перенаправлення (Використовуємо велику літеру NextResponse для методів класу)
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return res; // Повертаємо нашу відповідь
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
