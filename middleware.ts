import { clerkMiddleware, createRouteMatcher, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(['/create(.*)']);
const ALLOWED_USER_ID = "user_2vjJoTOhJZ2fjcMWHwjhXMDKPpk";

export default clerkMiddleware(async (auth, request) => {
  // Check if the route is protected
  if (isProtectedRoute(request)) {
    const session = await auth();
    
    // If user is not logged in or not the allowed user, redirect to home
    if (!session?.userId || session.userId !== ALLOWED_USER_ID) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};