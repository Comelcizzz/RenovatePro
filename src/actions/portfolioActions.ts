"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import PortfolioItem from "@/models/PortfolioItem";
import { getSession } from "@/lib/auth";

interface PortfolioItemData {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

export async function createPortfolioItem(
  data: PortfolioItemData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();
    if (session?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    const newPortfolioItem = new PortfolioItem(data);
    await newPortfolioItem.save();

    revalidatePath("/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Failed to create portfolio item:", error);
    return { success: false, error: "Failed to create portfolio item." };
  }
}
