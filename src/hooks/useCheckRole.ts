import { Roles } from "@/types/globals";
import { useUser } from "@clerk/nextjs";

export const useCheckRole = () => {
  const userRole = useUser().user?.publicMetadata?.role as Roles | undefined;
  return (role: Roles | Roles[]) => {
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
};
