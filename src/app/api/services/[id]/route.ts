import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { UserRole } from "@/lib/roleCheck";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  try {
    const service = await Service.findById(params.id);
    if (!service) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error(`Error fetching service ${params.id}:`, error);
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
  if (
    !session ||
    ![UserRole.Admin, UserRole.Designer].includes(session.role as UserRole)
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const updatedService = await Service.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error(`Error updating service ${params.id}:`, error);
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
  if (
    !session ||
    ![UserRole.Admin, UserRole.Designer].includes(session.role as UserRole)
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  try {
    const deletedService = await Service.findByIdAndDelete(params.id);

    if (!deletedService) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error deleting service ${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
