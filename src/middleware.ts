import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

export default clerkMiddleware((auth, _req: NextRequest) => {
  if (!isPublicRoute(_req)) {
    auth().protect();
  }

  if (isPublicRoute(_req)) {
    if (auth().sessionId) {
      return NextResponse.redirect(new URL("/dashboard", _req.url));
    }
  }

  if (!isPublicRoute(_req)) {
    if (_req.nextUrl.searchParams.get("redirect_url")) {
      return NextResponse.redirect(
        _req.nextUrl.searchParams.get("redirect_url")!
      );
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
