import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { UserRole } from "@/lib/roleCheck";

export function hasRole(user: { role: UserRole }, allowedRoles: UserRole[]) {
  return allowedRoles.includes(user.role);
}

export async function withAuth(
  request: NextRequest,
  allowedRoles: UserRole[] = [
    UserRole.User,
    UserRole.Designer,
    UserRole.Worker,
    UserRole.Admin,
  ],
) {
  try {
    const tokenStr = request.headers.get("authorization")?.split(" ")[1];

    if (!tokenStr) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(tokenStr);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!hasRole(decoded as { role: UserRole }, allowedRoles)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 },
      );
    }

    return decoded;
  } catch (error) {
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 },
    );
  }
}

export async function withRoleCheck(
  request: NextRequest,
  allowedRoles: UserRole[],
) {
  const user = await withAuth(request, allowedRoles);
  if (user instanceof NextResponse) return user;
  return user;
}
