"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { ServiceDocument } from "@/models/Service";
import { toast } from "sonner";
import { ServiceForm } from "./ServiceForm";
import { PlusCircle } from "lucide-react";
import { UserJWTPayload as SessionPayload } from "@/lib/auth";
import { UserRole } from "@/lib/roleCheck";
import { useDebounce } from "@/hooks/useDebounce";

interface ServicesTableProps {
  session: SessionPayload | null;
}

export function ServicesTable({ session }: ServicesTableProps) {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceDocument | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const canManage =
    session?.role === UserRole.Admin || session?.role === UserRole.Designer;

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      });
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      if (categoryFilter) params.set("category", categoryFilter);

      const response = await fetch(`/api/services?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setServices(data.services || []);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to fetch services");
      }
    } catch (error) {
      toast.error("An error occurred while fetching services");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, categoryFilter, sortConfig]);

  const serviceCategories = useMemo(() => {
    const categories = new Set(services.map((s) => s.category));
    return Array.from(categories);
  }, [services]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleFormSubmit = () => {
    fetchServices();
    setSelectedService(null);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service: ServiceDocument) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (service: ServiceDocument) => {
    try {
      const response = await fetch(`/api/services/${service._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Service deleted successfully");
        fetchServices();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete service");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the service");
    }
  };

  const columns = [
    { key: "name", header: "Name", sortable: true },
    {
      key: "description",
      header: "Description",
      render: (service: ServiceDocument) => (
        <p className="max-w-[300px] truncate" title={service.description}>
          {service.description}
        </p>
      ),
    },
    { key: "category", header: "Category", sortable: true },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (service: ServiceDocument) => `$${service.price}`,
    },
    {
      key: "createdAt",
      header: "Created At",
      sortable: true,
      render: (service: ServiceDocument) =>
        new Date(service.createdAt).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return <div className="text-center p-8">Loading services...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm w-full glass"
        />
        <div className="flex w-full md:w-auto gap-4">
          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="glass w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canManage && (
            <Button onClick={handleCreate} className="btn-primary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create
            </Button>
          )}
        </div>
      </div>
      <DataTable
        data={services}
        columns={columns}
        onEdit={canManage ? handleEdit : undefined}
        onDelete={canManage ? handleDelete : undefined}
        session={session}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      {canManage && (
        <ServiceForm
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          service={selectedService}
          onFormSubmit={handleFormSubmit}
        />
      )}
    </>
  );
}
