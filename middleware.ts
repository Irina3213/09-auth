import { NextRequest } from "next/server";
import { proxy } from "./middleware/proxy"; // Імпорт з папки

export async function middleware(request: NextRequest) {
  return await proxy(request);
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
    "/auth/:path*",
    "/api/:path*",
  ],
};
