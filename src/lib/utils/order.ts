import { OrderStatus, PaymentStatus } from "@/types";

export function calculateTotalAmount(services: { price: number }[]): number {
  return services.reduce((total, service) => total + service.price, 0);
}

export function canUpdateOrderStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
): boolean {
  const statusFlow: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED],
    [OrderStatus.IN_PROGRESS]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  return statusFlow[currentStatus].includes(newStatus);
}

export function canUpdatePaymentStatus(
  currentStatus: PaymentStatus,
  newStatus: PaymentStatus,
): boolean {
  const statusFlow: Record<PaymentStatus, PaymentStatus[]> = {
    [PaymentStatus.PENDING]: [PaymentStatus.PAID, PaymentStatus.FAILED],
    [PaymentStatus.PAID]: [PaymentStatus.REFUNDED],
    [PaymentStatus.FAILED]: [PaymentStatus.PENDING],
    [PaymentStatus.REFUNDED]: [],
  };

  return statusFlow[currentStatus].includes(newStatus);
}

export function formatOrderStatus(status: OrderStatus): string {
  return status.toLowerCase().replace("_", " ");
}

export function formatPaymentStatus(status: PaymentStatus): string {
  return status.toLowerCase();
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
    [OrderStatus.IN_PROGRESS]: "bg-purple-100 text-purple-800",
    [OrderStatus.COMPLETED]: "bg-green-100 text-green-800",
    [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
  };

  return colors[status];
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [PaymentStatus.PAID]: "bg-green-100 text-green-800",
    [PaymentStatus.FAILED]: "bg-red-100 text-red-800",
    [PaymentStatus.REFUNDED]: "bg-gray-100 text-gray-800",
  };

  return colors[status];
}
