import "server-only";

import { currentUser } from "@clerk/nextjs/server";

export const isAuthenticated = async () => {
  const user = await currentUser();

  if (!user || !user?.id){
    return false;
  }

  return true;
};
