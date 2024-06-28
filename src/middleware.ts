import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";

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
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
