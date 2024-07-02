import "server-only";

import { auth } from "@clerk/nextjs/server";

export const isAuthenticated = () => {
  const { userId, sessionId } = auth();

  if (!userId || !sessionId) {
    return false;
  }

  return true;
};
