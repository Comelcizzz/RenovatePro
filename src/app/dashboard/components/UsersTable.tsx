"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { UserDocument } from "@/models/User";
import { toast } from "sonner";
import { UserForm } from "./UserForm";
import { UserJWTPayload as SessionPayload } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { UserRole } from "@/lib/roleCheck";
import { formatDisplayName } from "@/lib/utils";

interface UsersTableProps {
  session: SessionPayload | null;
}

export function UsersTable({ session }: UsersTableProps) {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDocument | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      });
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      if (roleFilter) params.set("role", roleFilter);

      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, roleFilter, sortConfig]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFormSubmit = () => {
    fetchUsers();
    setSelectedUser(null);
  };

  const handleEdit = (user: UserDocument) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (user: UserDocument) => {
    if (user._id === session?.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the user");
    }
  };

  const columns = [
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (user: UserDocument) => (
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {formatDisplayName(user.role)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Registered At",
      sortable: true,
      render: (user: UserDocument) =>
        new Date(user.createdAt).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return <div className="text-center p-8">Loading users...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm w-full glass"
        />
        <Select
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}
        >
          <SelectTrigger className="glass w-full md:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {Object.values(UserRole).map((role) => (
              <SelectItem key={role} value={role}>
                {formatDisplayName(role)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        session={session}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      <UserForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        user={selectedUser}
        onFormSubmit={handleFormSubmit}
      />
    </>
  );
}
