import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

interface Order {
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
  status: "pending" | "in_progress" | "completed" | "cancelled";
  totalPrice: number;
  address: string;
  clientPhone: string;
  notes?: string;
  scheduledDate: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export function useOrders() {
  const [state, setState] = useState<OrderState>({
    orders: [],
    loading: true,
    error: null,
  });
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const token = localStorage.getItem("token");
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setState({ orders: data, loading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch orders",
      }));
    }
  };

  const createOrder = async (
    orderData: Omit<Order, "_id" | "user" | "createdAt" | "updatedAt">,
  ) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const token = localStorage.getItem("token");
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const newOrder = await response.json();
      setState((prev) => ({
        orders: [newOrder, ...prev.orders],
        loading: false,
        error: null,
      }));

      return newOrder;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to create order",
      }));
      throw error;
    }
  };

  const updateOrder = async (orderId: string, orderData: Partial<Order>) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await response.json();
      setState((prev) => ({
        orders: prev.orders.map((order) =>
          order._id === orderId ? updatedOrder : order,
        ),
        loading: false,
        error: null,
      }));

      return updatedOrder;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to update order",
      }));
      throw error;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      setState((prev) => ({
        orders: prev.orders.filter((order) => order._id !== orderId),
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to delete order",
      }));
      throw error;
    }
  };

  return {
    orders: state.orders,
    loading: state.loading,
    error: state.error,
    createOrder,
    updateOrder,
    deleteOrder,
    refreshOrders: fetchOrders,
  };
}
