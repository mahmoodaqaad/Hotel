import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("jwt")?.value;

    // Helper to check if we are on login or register pages
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isDashboardPage = pathname.startsWith("/dashboard");
    const isProfile = pathname.startsWith("/profile");

    // If it's not a page we care about, skip early
    if (!isAuthPage && !isDashboardPage && !isProfile) {
        return NextResponse.next();
    }

    let user = null;

    if (token) {
        try {
            const secretKey = process.env.JWT_SECRET_KEY;
            if (secretKey) {
                const secret = new TextEncoder().encode(secretKey);
                const { payload } = await jwtVerify(token, secret);
                user = payload;
            }
        } catch (error) {
            // Token is invalid or expired - just treat as unauthenticated
        }
    }

    // ✅ If authenticated user tries to access /login or /register -> Redirect to Home
    if (user && isAuthPage) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // ❌ If unauthenticated user tries to access /dashboard routes -> Redirect to Login
    if ((!user && isDashboardPage )|| (!user && isProfile)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/profile/:path*", "/dashboard/:path*"],
};
