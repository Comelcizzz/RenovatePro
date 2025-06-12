"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDocument } from "@/models/Order";
import { UserJWTPayload as SessionPayload } from "@/lib/auth";
import { toast } from "sonner";
import { OrderForm } from "./OrderForm";
import { PlusCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { UserRole } from "@/lib/roleCheck";
import { formatDisplayName } from "@/lib/utils";

interface OrdersTableProps {
  session: SessionPayload | null;
}

const orderStatuses = ["pending", "in_progress", "completed", "cancelled"];

export function OrdersTable({ session }: OrdersTableProps) {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDocument | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const canCreate =
    session?.role === UserRole.Admin || session?.role === UserRole.User;
  const isDesigner = session?.role === UserRole.Designer;

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      });
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      if (statusFilter) params.set("status", statusFilter);

      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error("An error occurred while fetching orders");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, statusFilter, sortConfig]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFormSubmit = () => {
    fetchOrders();
    setSelectedOrder(null);
  };

  const handleCreate = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (order: OrderDocument) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleTakeProject = async (order: OrderDocument) => {
    if (!session || session.role !== UserRole.Designer) {
      toast.error("Only designers can take projects.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designer: session.id }),
      });

      if (response.ok) {
        toast.success("You have taken the project!");
        fetchOrders();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to take the project.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const handleDelete = async (order: OrderDocument) => {
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Order deleted successfully");
        fetchOrders();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete order");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the order");
    }
  };

  const columns = [
    {
      key: "service",
      header: "Service",
      render: (order: OrderDocument) => order.service?.name || "N/A",
    },
    {
      key: "user",
      header: "Client Email",
      render: (order: OrderDocument) => order.user?.email || "N/A",
    },
    {
      key: "clientPhone",
      header: "Client Phone",
      render: (order: OrderDocument) => order.clientPhone || "N/A",
    },
    {
      key: "address",
      header: "Address",
      render: (order: OrderDocument) => order.address || "N/A",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (order: OrderDocument) => formatDisplayName(order.status),
    },
    {
      key: "budget",
      header: "Budget",
      sortable: true,
      render: (order: OrderDocument) => `$${order.budget}`,
    },
    {
      key: "designer",
      header: "Designer",
      render: (order: OrderDocument) => order.designer?.name || "Not assigned",
    },
    {
      key: "workers",
      header: "Workers",
      render: (order: OrderDocument) =>
        order.workers?.length > 0
          ? order.workers.map((w: any) => w.name).join(", ")
          : "None",
    },
    {
      key: "createdAt",
      header: "Created At",
      sortable: true,
      render: (order: OrderDocument) =>
        new Date(order.createdAt).toLocaleDateString(),
    },
  ];

  const isOrderEditable = (order: OrderDocument): boolean => {
    if (!session) return false;
    const isOwner = order.user?._id === session.id;
    const isAssignedDesigner = order.designer?._id === session.id;
    const isAssignedWorker = order.workers?.some(
      (w: any) => w._id.toString() === session.id,
    );
    const isAdmin = session.role === UserRole.Admin;

    if (isAdmin || isAssignedDesigner || isAssignedWorker) return true;
    if (isOwner && order.status === "pending") return true;

    return false;
  };

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm w-full glass"
        />
        <div className="flex w-full md:w-auto gap-4">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="glass w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {orderStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatDisplayName(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canCreate && (
            <Button onClick={handleCreate} className="btn-primary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create
            </Button>
          )}
        </div>
      </div>
      <DataTable
        data={orders}
        columns={columns}
        onEdit={handleEdit}
        isEditable={isOrderEditable}
        onDelete={handleDelete}
        onTakeProject={isDesigner ? handleTakeProject : undefined}
        session={session}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      <OrderForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        order={selectedOrder}
        onFormSubmit={handleFormSubmit}
        session={session}
      />
    </>
  );
}
