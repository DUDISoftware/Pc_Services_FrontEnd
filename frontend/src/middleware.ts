import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";   // 👉 Tạm thời comment lại cho test

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "my-secret-key");

// async function verifyToken(token: string) {
//   try {
//     const { payload } = await jwtVerify(token, SECRET);
//     return payload as { role?: string; userId?: string };
//   } catch (e) {
//     return null;
//   }
// }

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // ✅ Check cho admin (Tạm thời bỏ qua role check)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 👉 Bỏ qua role check, chỉ cần có token là vào admin
    // const payload = await verifyToken(token);
    // if (!payload?.role || payload.role !== "admin") {
    //   return NextResponse.redirect(new URL("/auth/login", req.url));
    // }
  }

  // ✅ Nếu admin đã login mà vào "/" → đưa vào dashboard
  if (pathname === "/") {
    if (token) {
      // const payload = await verifyToken(token);
      // if (payload?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      // }
    }
    // Nếu chưa login thì cho vào trang user home
    return NextResponse.redirect(new URL("/user/home", req.url));
  }

  // ✅ User side không cần check → cho đi thẳng
  return NextResponse.next();
}

// Áp dụng middleware cho root và admin
export const config = {
  matcher: ["/", "/admin/:path*"],
};
