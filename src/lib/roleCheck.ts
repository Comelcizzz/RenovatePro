import { User } from "@/types";

export enum UserRole {
  Admin = "admin",
  Designer = "designer",
  Worker = "worker",
  User = "user",
}

export function checkRole(
  user: User | null,
  allowedRoles: UserRole[],
): boolean {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role as UserRole);
}

export function isAdmin(user: User | null): boolean {
  return checkRole(user, [UserRole.Admin]);
}

export function isDesigner(user: User | null): boolean {
  return checkRole(user, [UserRole.Designer, UserRole.Admin]);
}

export function isWorker(user: User | null): boolean {
  return checkRole(user, [UserRole.Worker, UserRole.Admin]);
}
