import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { UserRole } from "@/lib/roleCheck";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (
    !session ||
    ![UserRole.Admin, UserRole.Designer].includes(session.role as UserRole)
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    if (!role || !Object.values(UserRole).includes(role as UserRole)) {
      return NextResponse.json(
        { message: "Valid role parameter is required" },
        { status: 400 },
      );
    }

    const query = { role: role };

    const users = await User.find(query).select("name email");

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
