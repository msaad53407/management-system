import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = (role: Roles | Roles[]) => {
  const userRole = auth().sessionClaims?.metadata?.role;
  if (!userRole) {
    return false;
  }
  
  if (!Array.isArray(role) && userRole !== role) {
    return false;
  }
  if (Array.isArray(role) && !role.includes(userRole)) {
    return false;
  }

  return true;
};
