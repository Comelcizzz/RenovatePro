"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { IPortfolioItem } from "@/models/PortfolioItem";
import { UserJWTPayload as SessionPayload } from "@/lib/auth";
import { toast } from "sonner";
import { PortfolioForm } from "./PortfolioForm";
import { PlusCircle } from "lucide-react";
import { UserRole } from "@/lib/roleCheck";

interface PortfolioTableProps {
  session: SessionPayload | null;
}

export function PortfolioTable({ session }: PortfolioTableProps) {
  const [items, setItems] = useState<IPortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IPortfolioItem | null>(null);

  const canManage =
    session?.role === UserRole.Admin ||
    session?.role === UserRole.Designer ||
    session?.role === UserRole.Worker;

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/portfolio");
      const data = await response.json();

      if (response.ok) {
        setItems(data || []);
      } else {
        toast.error(data.message || "Failed to fetch portfolio items");
      }
    } catch (error) {
      toast.error("An error occurred while fetching portfolio items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.id) {
      fetchItems();
    }
  }, [session?.id, fetchItems]);

  const handleFormSubmit = () => {
    fetchItems();
    setSelectedItem(null);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: IPortfolioItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: IPortfolioItem) => {
    try {
      const response = await fetch(`/api/portfolio/${item._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Portfolio item deleted successfully");
        fetchItems();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete item");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the item");
    }
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "category", header: "Category" },
    {
      key: "description",
      header: "Description",
      render: (item: IPortfolioItem) => (
        <p className="max-w-[300px] truncate" title={item.description}>
          {item.description}
        </p>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (item: IPortfolioItem) =>
        new Date(item.createdAt).toLocaleDateString(),
    },
  ];

  if (session?.role === UserRole.Admin) {
    columns.unshift({
      key: "user",
      header: "User",
      render: (item: IPortfolioItem) => (item.user as any)?.name || "N/A",
    });
  }

  if (isLoading) {
    return <div className="text-center p-8">Loading portfolio...</div>;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        {canManage && (
          <Button onClick={handleCreate} className="btn-primary">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>
      <DataTable
        data={items}
        columns={columns}
        onEdit={canManage ? handleEdit : undefined}
        onDelete={canManage ? handleDelete : undefined}
        session={session}
      />
      {canManage && (
        <PortfolioForm
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          portfolioItem={selectedItem}
          onFormSubmit={handleFormSubmit}
        />
      )}
    </>
  );
}
