import mongoose, { Schema, Document, Types } from "mongoose";
import "./User";
import "./Service";
import { UserDocument } from "./User";
import { ServiceDocument } from "./Service";

export interface OrderDocument extends Document {
  user: UserDocument;
  service: ServiceDocument;
  designer?: UserDocument;
  workers: UserDocument[];
  status: "pending" | "in_progress" | "completed" | "cancelled";
  description: string;
  budget: number;
  address: string;
  clientName: string;
  clientPhone: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    designer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    workers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    startDate: Date,
    endDate: Date,
  },
  {
    timestamps: true,
  },
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({
  description: "text",
  address: "text",
  clientName: "text",
});

export default mongoose.models.Order ||
  mongoose.model<OrderDocument>("Order", OrderSchema);
