"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { UserRole } from "@/lib/roleCheck";

interface AuthSession {
  id: string;
  email: string;
  role: UserRole;
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const token = Cookies.get("token");
      if (token) {
        // This is not ideal as verifyJWT is a server function.
        // For a real app, you would fetch the session from an API endpoint.
        // Let's simulate the session decoding for now.
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join(""),
          );

          const payload = JSON.parse(jsonPayload) as AuthSession;
          setSession(payload);
        } catch {
          setSession(null);
        }
      }
      setLoading(false);
    }

    getSession();
  }, []);

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    if (!session) return false;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(session.role);
  };

  return { session, loading, hasRole };
}
