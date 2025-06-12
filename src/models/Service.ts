import mongoose, { Schema, Document } from "mongoose";

export interface ServiceDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

ServiceSchema.index({ name: "text", description: "text" });
ServiceSchema.index({ category: 1 });

export default mongoose.models.Service ||
  mongoose.model<ServiceDocument>("Service", ServiceSchema);
