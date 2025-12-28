import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const privateRoutes = ["/notes", "/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;
  const nextResponse = NextResponse.next();

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
          nextResponse.headers.set("set-cookie", setCookie);
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

  return nextResponse;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/login", "/register"],
};
