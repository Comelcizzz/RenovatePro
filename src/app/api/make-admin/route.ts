import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const userEmail = "bidlovdkiyivan@gmail.com";

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { message: `User with email ${userEmail} not found` },
        { status: 404 },
      );
    }

    user.role = "admin";
    await user.save();

    return NextResponse.json({
      message: `User ${userEmail} has been made an admin.`,
      user,
    });
  } catch (error) {
    console.error("Failed to make user admin:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the user" },
      { status: 500 },
    );
  }
}
