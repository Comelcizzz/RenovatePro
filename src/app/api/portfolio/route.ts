import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import PortfolioItem from "@/models/PortfolioItem";
import { UserRole } from "@/lib/roleCheck";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (
    !session ||
    ![UserRole.Admin, UserRole.Designer, UserRole.Worker].includes(
      session.role as UserRole,
    )
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const { title, description, imageUrl, category } = body;

    if (!title || !description || !imageUrl || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newPortfolioItem = new PortfolioItem({
      ...body,
      user: session.id,
    });

    await newPortfolioItem.save();
    return NextResponse.json(newPortfolioItem, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  try {
    const query: Record<string, any> = {};

    if (session.role !== UserRole.Admin) {
      query.user = session.id;
    }

    const portfolioItems = await PortfolioItem.find(query).populate(
      "user",
      "name role",
    );

    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
