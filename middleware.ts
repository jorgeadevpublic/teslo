// import { NextResponse, URLPattern } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
// import { jwt } from "./utils";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	/*const token = request.cookies.get("token")?.value || "";
	const { origin, pathname } = request.nextUrl;
	try {
		await jwt.isValidToken(token);
		return NextResponse.next();
	} catch (error) {
		return NextResponse.next();
		// return NextResponse.redirect(`${ origin }/auth/login?page=${ pathname }`);
	}*/
	
	const { origin, pathname } = request.nextUrl;
	const session: any = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
	console.log({ session });
	if (!session) {
		console.log({ pathname });
		if (pathname.startsWith("/checkout") || pathname.startsWith("/admin")) {
			return NextResponse.redirect(`${ origin }/auth/login?page=${ pathname }`);
		} else if (pathname.startsWith("/api/admin")) {
			return new Response(JSON.stringify({ message: "Unauthorized" }), {
				status: 401,
				headers: {
					"Content-Type": "application/json",
				}
			});
		}
	}
	
	const role = session.user.role;
	const validRoles = ["admin", "seo", "super-admin"];
	if (pathname.startsWith("/checkout")) {
		return NextResponse.next();
	}
	
	if (pathname.startsWith("/admin")) {
		if (!validRoles.includes(role)) {
			return NextResponse.redirect(origin);
		}
		return NextResponse.next();
	}
	
	if (pathname.startsWith("/api/admin")) {
		if (!validRoles.includes(role)) {
			return new Response(JSON.stringify({ message: "Unauthorized" }), {
				status: 401,
				headers: {
					"Content-Type": "application/json",
				}
			});
		}
		return NextResponse.next();
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		"/checkout/address",
		"/checkout/summary",
		"/admin",
		"/admin/users",
		"/admin/orders",
		"/api/admin/dashboard",
		"/api/admin/users",
		"/api/admin/orders",
	],
};