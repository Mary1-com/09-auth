import { NextResponse, type NextRequest } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

async function isAuthenticated(request: NextRequest) {
    try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
            headers: {
            Cookie: request.headers.get("cookie") ?? "",
            },
        }
        );

        return response.ok;
    } catch {
        return false;
    }
    }

    export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPrivateRoute = privateRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const auth = await isAuthenticated(request);

    if (isPrivateRoute && !auth) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (isPublicRoute && auth) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    return NextResponse.next();
    }

    export const config = {
    matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};