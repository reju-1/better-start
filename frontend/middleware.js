import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = ["/login", "/register"];
const authRoutes = ["/dashboard/:path*"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY)?.value;

  if (token && publicRoutes.includes(pathname)) {
    try {
      const decoded = jwtDecode(token);
      const { exp } = decoded;

      if (!exp || Date.now() < exp * 1000) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      return NextResponse.next();
    }
  }

  if (authRoutes.some((_route) => pathname.startsWith("/dashboard"))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const decoded = jwtDecode(token);
      const { company_id, role, exp } = decoded;

      if (exp && Date.now() >= exp * 1000) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const isProfileIncomplete = company_id === null && role === null;
      const isSettingsPage = pathname === "/dashboard/settings";

      if (isProfileIncomplete && !isSettingsPage) {
        return NextResponse.redirect(
          new URL("/dashboard/settings", request.url)
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware Error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
