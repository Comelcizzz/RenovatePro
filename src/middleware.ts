import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { UserRole } from "./lib/roleCheck";

const AUTH_PAGES = ["/login", "/register"];
const ADMIN_PAGES = ["/admin"];
const DESIGNER_PAGES = ["/designer-dashboard"];
const WORKER_PAGES = ["/worker-dashboard"];
const USER_PAGES = ["/dashboard"];

const isAuthPage = (pathname: string) => {
  return AUTH_PAGES.some((page) => pathname.startsWith(page));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (isAuthPage(pathname)) {
    if (token) {
      try {
        const payload = await verifyJWT(token);
        if (payload) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (err) {}
    }
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const payload = await verifyJWT(token);
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const { role } = payload;

    if (
      ADMIN_PAGES.some((page) => pathname.startsWith(page)) &&
      role !== UserRole.Admin
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (
      DESIGNER_PAGES.some((page) => pathname.startsWith(page)) &&
      role !== UserRole.Designer
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (
      WORKER_PAGES.some((page) => pathname.startsWith(page)) &&
      role !== UserRole.Worker
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (
      USER_PAGES.some((page) => pathname.startsWith(page)) &&
      role !== UserRole.User
    ) {
      if (
        ![UserRole.Admin, UserRole.Designer, UserRole.Worker].includes(
          role as UserRole,
        )
      ) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  } catch (err) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/designer-dashboard/:path*",
    "/worker-dashboard/:path*",
    "/login",
    "/register",
  ],
};
