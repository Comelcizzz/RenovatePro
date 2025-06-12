import { z } from "zod";
import { OrderStatus, PaymentStatus } from "@/types";

export const orderInputSchema = z.object({
  services: z.array(z.string()).min(1, "At least one service is required"),
  totalAmount: z.number().positive("Total amount must be positive"),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
});

export const orderUpdateSchema = z.object({
  services: z
    .array(z.string())
    .min(1, "At least one service is required")
    .optional(),
  totalAmount: z.number().positive("Total amount must be positive").optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
});

export const orderFilterSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});
