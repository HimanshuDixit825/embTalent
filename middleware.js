import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/select", // Tech selection main page (landing page)
  "/tech/(.*)", // All tech selection routes
  "/create-jd", // Create JD page
  "/experience", // Experience page
  "/chat", // Chat page
  "/auth/sign-in(.*)", // Sign in page
  "/auth/sign-up(.*)", // Sign up page
  "/api/webhook/clerk", // Clerk webhook
  "/api/users/duplicate", // Duplicate users API
  "/api/chat", // Chat API
  "/api/analyze-pdf", // PDF analysis API
  "/api/lead-line-item", // Lead line item API
  "/api/auth/me", // Auth check endpoint
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = new URL(request.url);

  // Redirect root to /select
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/select", request.url));
  }

  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  try {
    // This will throw an error if user is not authenticated
    await auth.protect();
    // If we get here, user is authenticated
    return NextResponse.next();
  } catch (error) {
    // User is not authenticated, redirect to /select instead of sign-in
    const selectUrl = new URL("/select", request.url);
    return NextResponse.redirect(selectUrl);
  }
});

export const config = {
  matcher: [
    // Exclude Next.js static files, webhook, and public routes
    "/((?!_next|api/webhook/clerk|select|tech|create-jd|experience|chat|.*\\.[\\w]+$).*)",
    // Include API routes except webhook and duplicate users
    "/(api(?!/webhook/clerk|/users/duplicate|/analyze-pdf|/chat|/lead-line-item|/auth/me))(.*)",
  ],
};
