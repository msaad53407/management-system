import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/api/user"]);

export default clerkMiddleware((auth, _req) => {
  //setting role to member if not already set by default.
  if (
    !auth().sessionClaims?.metadata?.role &&
    auth().userId &&
    auth().sessionId
  ) {
    clerkClient.users.updateUserMetadata(auth().userId!, {
      publicMetadata: {
        role: "member",
      },
    });
  }

  if (!isPublicRoute(_req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
