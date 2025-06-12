import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order, { OrderDocument } from "@/models/Order";
import { UserRole } from "@/lib/roleCheck";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const order = await Order.findById(params.id)
      .populate("user", "name email")
      .populate("service", "name")
      .populate("designer", "name email")
      .populate("workers", "name email");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const isOwner = order.user.toString() === session.id;
    const isAdmin = session.role === UserRole.Admin;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const isDesigner = order.designer?.toString() === session.id;
    const isWorker = order.workers.some(
      (w: any) => w._id.toString() === session.id,
    );

    if (!isAdmin && !isOwner && !isDesigner && !isWorker) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`Error fetching order ${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;
  await connectDB();

  try {
    const body = await request.json();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const isOwner = order.user.toString() === session.id;
    const isAdmin = session.role === UserRole.Admin;
    const isDesigner = session.role === UserRole.Designer;
    const isAssignedDesigner = order.designer?.toString() === session.id;
    const isAssignedWorker = order.workers.some(
      (w: any) => w._id.toString() === session.id,
    );

    if (isOwner && !isAdmin && order.status !== "pending") {
      return NextResponse.json(
        { message: "You can only edit an order when it is pending." },
        { status: 403 },
      );
    }

    if (
      body.designer &&
      order.designer &&
      !isAdmin &&
      body.designer !== order.designer.toString()
    ) {
      return NextResponse.json(
        {
          message:
            "This project already has a designer. Only an admin can reassign it.",
        },
        { status: 403 },
      );
    }

    if (body.user && !isAdmin) {
      return NextResponse.json(
        { message: "Only admins can change the order's owner." },
        { status: 403 },
      );
    }

    const updates: Partial<OrderDocument> = {};
    const userAllowedFields = [
      "description",
      "budget",
      "address",
      "clientName",
      "clientPhone",
      "service",
    ];
    const designerAllowedFields = [...userAllowedFields, "status", "workers"];
    const adminAllowedFields = [...designerAllowedFields, "designer", "user"];
    const workerAllowedFields = ["status"];

    let allowedFields: string[] = [];
    if (isAdmin) {
      allowedFields = adminAllowedFields;
    } else if (isAssignedDesigner) {
      allowedFields = designerAllowedFields;
    } else if (isOwner) {
      allowedFields = userAllowedFields;
    } else if (isAssignedWorker) {
      allowedFields = workerAllowedFields;
    }

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as any)[field] = body[field];
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    })
      .populate("user", "name email")
      .populate("service", "name")
      .populate("designer", "name email")
      .populate("workers", "name email");

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order not found after update" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (
      order.user.toString() !== session.id &&
      session.role !== UserRole.Admin
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Order.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error deleting order ${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
