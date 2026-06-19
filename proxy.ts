import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const { pathname } = request.nextUrl;

    const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
    
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
    
    let isAuthenticated = Boolean(accessToken);

    const response = NextResponse.next();

    if (!accessToken && refreshToken) {
        try {
        const sessionResponse = await checkSession();

        const setCookie = sessionResponse.headers["set-cookie"];

        if (setCookie) {
            const cookiesArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

            cookiesArray.forEach((cookie) => {
            response.headers.append("set-cookie", cookie);
            });
        }

        isAuthenticated = true;
        } catch {
        isAuthenticated = false;
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

export const config = { matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"], };
