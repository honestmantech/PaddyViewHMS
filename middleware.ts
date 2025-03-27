import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

export async function middleware(request: NextRequest) {
  // Exclude public routes
  const publicPaths = ["/login", "/register", "/api/auth/login", "/api/auth/register"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for token
  const token = request.cookies.get("token")?.value

  if (!token) {
    // Redirect to login if accessing a protected page
    if (!request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Return 401 for API routes
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", (decoded as any).id)
    requestHeaders.set("x-user-role", (decoded as any).role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Token is invalid
    if (!request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

