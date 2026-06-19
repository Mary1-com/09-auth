import { NextResponse, type NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken");
    const refreshToken = request.cookies.get("refreshToken");

    const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
    
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
    
    let isAuthenticated = Boolean(accessToken);

    const response = NextResponse.next();

    if (!accessToken && refreshToken) {
        const session = await checkSession();

        if (session.success) {
        isAuthenticated = true;

        session.setCookie?.forEach((cookie) => {
            response.headers.append("set-cookie", cookie);
        });
        }
    }

    if (isPrivateRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
    }

    export const config = {
    matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};