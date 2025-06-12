"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { UserRole } from "@/lib/roleCheck";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { hasRole } = useRole();

  useEffect(() => {
    if (!hasRole(allowedRoles)) {
      router.push("/unauthorized");
    }
  }, [hasRole, allowedRoles, router]);

  return <>{children}</>;
}
