// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (token && pathname === "/") {
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dasboard", request.url));
    } else if (token.role === "USER") {
      return NextResponse.redirect(new URL("/favorits", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dasboard", "/favorits",],
}
