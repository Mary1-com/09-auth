import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

function matchRoute(pathname: string, routes: string[]) {
    return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
function applySetCookie(response: NextResponse, setCookie: string[] | string | undefined) {
    if (!setCookie) {
        return false;
    }

    const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

    let hasNewTokens = false;

    cookiesArray.forEach((cookieString) => {
        const [cookiePair] = cookieString.split(";");
        const [name, ...valueParts] = cookiePair.split("=");
        const value = valueParts.join("=");

        if (!name || !value) {
        return;
        }

        const cookieName = name.trim();

        if (cookieName === "accessToken" || cookieName === "refreshToken") {
        hasNewTokens = true;
        }

        response.cookies.set(cookieName, value);
    });

    return hasNewTokens;
}
    
export async function proxy(request: NextRequest) {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const { pathname } = request.nextUrl;

    const isPrivateRoute = matchRoute(pathname, privateRoutes);
    const isPublicRoute = matchRoute(pathname, publicRoutes);

    let isAuthenticated = Boolean(accessToken);

    const response = NextResponse.next();

    if (!accessToken && refreshToken) {
        try {
            const sessionResponse = await checkSession();
            const setCookie = sessionResponse.headers["set-cookie"];
            const hasNewTokens = applySetCookie(response, setCookie);

            isAuthenticated = hasNewTokens;
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

    export const config = {
    matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};