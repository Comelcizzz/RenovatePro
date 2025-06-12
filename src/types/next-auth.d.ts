import "next-auth";
import { UserRole } from "@/lib/roleCheck";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    name?: string | null;
    email?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
