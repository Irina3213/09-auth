import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/api")) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      console.error("Помилка: NEXT_PUBLIC_API_URL не визначено в .env файлі");
      return NextResponse.next();
    }

    const targetPath = url.pathname.replace(/^\/api/, "");
    const targetUrl = new URL(targetPath, backendUrl);

    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
}
