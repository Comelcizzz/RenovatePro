import { useAuth } from "./useAuth";
import { UserRole } from "@/lib/roleCheck";

export function useRole() {
  const { session: user } = useAuth();

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role as UserRole);
  };

  const isAdmin = () => hasRole([UserRole.Admin]);
  const isDesigner = () => hasRole([UserRole.Designer, UserRole.Admin]);
  const isWorker = () => hasRole([UserRole.Worker, UserRole.Admin]);
  const isUser = () =>
    hasRole([UserRole.User, UserRole.Designer, UserRole.Worker, UserRole.Admin]);

  return {
    hasRole,
    isAdmin,
    isDesigner,
    isWorker,
    isUser,
  };
}

