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
    console.log(role.includes(userRole));
    console.log('Hello');
    return false;
  }

  return true;
};
