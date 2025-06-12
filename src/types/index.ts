import { type FieldValues, type UseFormProps } from "react-hook-form";
import { type z } from "zod";

// User types
export type UserRole = "user" | "designer" | "worker" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

// Service types
export interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  service: {
    _id: string;
    title: string;
    price: number;
  };
  worker?: {
    _id: string;
    name: string;
    email: string;
  };
  status: OrderStatus;
  totalPrice: number;
  address: string;
  clientPhone: string;
  notes?: string;
  scheduledDate: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Order creation types
export interface CreateOrderData {
  service: string;
  totalPrice: number;
  address: Address;
  contactPhone: string;
  notes?: string;
  scheduledDate: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ServiceGridProps {
  services: Service[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export interface ServicesPageProps {
  searchParams: { page?: string };
}

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export interface FormSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export interface FormProps<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  schema: z.ZodType<T, z.ZodTypeDef, T>;
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: UseFormProps<T>["defaultValues"];
  children: React.ReactNode;
}
