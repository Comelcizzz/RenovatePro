import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import PortfolioItem from "@/models/PortfolioItem";
import { UserRole } from "@/lib/roleCheck";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const itemToUpdate = await PortfolioItem.findById(params.id);

    if (!itemToUpdate) {
      return NextResponse.json(
        { message: "Portfolio item not found" },
        { status: 404 },
      );
    }

    const isOwner =
      itemToUpdate.user && itemToUpdate.user.toString() === session.id;
    const isAdmin = session.role === UserRole.Admin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedItem = await PortfolioItem.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(`Error updating portfolio item ${params.id}:`, error);
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
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  try {
    const itemToDelete = await PortfolioItem.findById(params.id);

    if (!itemToDelete) {
      return NextResponse.json(
        { message: "Portfolio item not found" },
        { status: 404 },
      );
    }

    const isOwner =
      itemToDelete.user && itemToDelete.user.toString() === session.id;
    const isAdmin = session.role === UserRole.Admin;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await PortfolioItem.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Portfolio item deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error deleting portfolio item ${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
