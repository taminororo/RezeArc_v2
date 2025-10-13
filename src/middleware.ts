// /src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, origin, href } = req.nextUrl;
  const email = req.auth?.user?.email ?? "";

  const isAdminPath = pathname.startsWith("/admin");
  const allowed = email.endsWith("nagaokaut.ac.jp");

  if (isAdminPath && !allowed) {
    const signin = new URL("/api/auth/signin", origin);
    signin.searchParams.set("callbackUrl", href); // ログイン後に元のURLへ戻す
    return NextResponse.redirect(signin);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"], // /admin配下すべてを対象
};
