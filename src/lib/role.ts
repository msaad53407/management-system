import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = (role: Roles) => {
  if (auth().sessionClaims?.metadata?.role !== role) {
    return false;
  }

  return true;
};
