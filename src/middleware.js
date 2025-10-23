import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // ✅ หน้า login และ detail เป็น public
  const isPublicPage =
    pathname === "/login" ||
    pathname === "/detail" ||
    pathname === "/positions" ||
    pathname === "/report" ||
    pathname === "/main" ||
    pathname.startsWith("/detail/") ||
    pathname.startsWith("/positions/") ||
    pathname.startsWith("/report/");


  const isPublicApi =
    pathname === "/api/detail" || pathname.startsWith("/api/detail/") ||
    pathname === "/api" || pathname.startsWith("/api/")


  // ✅ static asset / public folder
  const isStaticAsset =
    pathname.startsWith("/images/") || // public/images
    pathname.endsWith(".svg") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".webmanifest") ||
    pathname === "/favicon.ico" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/_next/"); // Next internal

  // ✅ auth API ก็ให้ผ่าน
  const isAuthApi = pathname.startsWith("/api/auth");

  // ✅ อนุญาต static asset, public page, public API, auth API ก่อนตรวจ token
  if (isStaticAsset || isPublicPage || isPublicApi || isAuthApi) {
    return NextResponse.next();
  }

  // ❌ ถ้าไม่มี token → redirect ไป login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // ✅ ถ้ามี token แล้ว ไปหน้า login → redirect /main
  if (token && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/main";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/).*)"], // แค่จับหน้า web ไม่จับ API
};
