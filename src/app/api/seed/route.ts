import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { seedPortfolio } from "@/lib/dummy-data";

export async function GET() {
  await dbConnect();
  await seedPortfolio();
  return NextResponse.json({ message: "Database seeded successfully" });
}
