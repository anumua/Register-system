import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isAuthPage = pathname === "/login";
  const isAuthApi = pathname.startsWith("/api/auth");
  const isNextInternal =
    pathname.startsWith("/_next") || pathname === "/favicon.ico";
  const isStaticAsset =
    pathname.startsWith("/images/") ||
    pathname.startsWith("/file.svg") ||
    pathname.startsWith("/globe.svg") ||
    pathname.startsWith("/next.svg") ||
    pathname.startsWith("/vercel.svg") ||
    pathname.startsWith("/window.svg") ||
    pathname.startsWith("/service_logo.jpg") ||
    pathname.startsWith("/manifest.webmanifest") ||
    pathname.startsWith("/sw.js");

  const isAnyApi = pathname.startsWith("/api/");

  // ✅ Public pages (เข้าได้โดยไม่ต้อง login)
  const isPublicPage =
    pathname === "/login" ||
    pathname === "/detail" ||
    pathname.startsWith("/detail/");

  // ✅ Public API
  const isPublicApi =
    pathname === "/api/detail" || pathname.startsWith("/api/detail/") || pathname === "/api/refresh_view";

  // ✅ Internal asset หรือ API auth → ผ่าน
  if (isNextInternal || isAuthApi || isStaticAsset) {
    return NextResponse.next();
  }

  // ✅ อนุญาต API ที่เป็น public (/api/detail/…)
  if (!token && isAnyApi) {
    if (isPublicApi) return NextResponse.next();
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ หน้า public (login, detail) → เข้าถึงได้เสมอ
  if (isPublicPage) {
    return NextResponse.next();
  }

  // ❌ ถ้าไม่มี token → redirect ไป /login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ✅ ถ้ามี token แล้ว แต่ไปหน้า login → redirect /main
  if (token && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/main";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
