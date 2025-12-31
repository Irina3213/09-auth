import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "../lib/api/serverApi"; // перевірте шлях до lib

const BACKEND_URL = "https://auth-backend-production-c662.up.railway.app";
const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ВИПРАВЛЕННЯ 404: Проксіюємо запити /auth та /api на бекенд
  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    const targetUrl = new URL(pathname + request.nextUrl.search, BACKEND_URL);
    return NextResponse.rewrite(targetUrl);
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;
  let sessionResponse: Response | null = null;

  // 2. ПЕРЕВІРКА СЕСІЇ (Вимога ментора)
  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();
      sessionResponse = res as unknown as Response;
      if (sessionResponse && sessionResponse.ok) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 3. РЕДИРЕКТИ
  let response: NextResponse;
  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isAuthRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  // 4. КОПІЮВАННЯ SET-COOKIE (Вимога ментора)
  if (sessionResponse) {
    const setCookie = sessionResponse.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
  }

  return response;
}
