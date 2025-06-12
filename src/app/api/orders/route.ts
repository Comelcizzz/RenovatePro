import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { UserRole } from "@/lib/roleCheck";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = (page - 1) * limit;

    let query: Record<string, any> = {};

    switch (session.role) {
      case UserRole.Admin:
        break;
      case UserRole.Designer:
        query.designer = session.id;
        break;
      case UserRole.Worker:
        query.workers = session.id;
        break;
      case UserRole.User:
      default:
        query.user = session.id;
        break;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("service", "name")
      .populate("designer", "name")
      .populate("workers", "name")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const { service, description, budget, address, clientName, clientPhone } =
      body;

    if (
      !service ||
      !description ||
      !budget ||
      !address ||
      !clientName ||
      !clientPhone
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (body.designer === "") {
      delete body.designer;
    }

    const newOrder = new Order({
      user: session.id,
      service,
      description,
      budget,
      address,
      clientName,
      clientPhone,
      designer: body.designer,
    });

    await newOrder.save();
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
