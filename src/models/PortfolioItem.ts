import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolioItem extends Document {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  user: mongoose.Types.ObjectId | Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const PortfolioItem =
  (mongoose.models?.PortfolioItem as Model<IPortfolioItem>) ||
  mongoose.model<IPortfolioItem>("PortfolioItem", PortfolioItemSchema);

export default PortfolioItem;
