"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { PlusCircle, Edit, Trash2, Hand, ArrowUpDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserRole } from "@/lib/roleCheck";
import { UserJWTPayload } from "@/lib/auth";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  onEdit?: (item: T) => void;
  isEditable?: (item: T) => boolean;
  onDelete?: (item: T) => void;
  onTakeProject?: (item: T) => void;
  session: UserJWTPayload | null;
  sortConfig?: { key: string; direction: "asc" | "desc" };
  setSortConfig?: (config: { key: string; direction: "asc" | "desc" }) => void;
  currentPage?: number;
  totalPages?: number;
  setCurrentPage?: (page: number) => void;
}

export function DataTable<T extends { _id: any }>({
  data,
  columns,
  onEdit,
  isEditable,
  onDelete,
  onTakeProject,
  session,
  sortConfig,
  setSortConfig,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  setCurrentPage: setExternalCurrentPage,
}: DataTableProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  const isServerPaginated =
    externalCurrentPage !== undefined &&
    externalTotalPages !== undefined &&
    setExternalCurrentPage !== undefined;

  const currentPage = isServerPaginated
    ? externalCurrentPage
    : internalCurrentPage;
  const setCurrentPage = isServerPaginated
    ? setExternalCurrentPage
    : setInternalCurrentPage;

  const totalPages = isServerPaginated
    ? externalTotalPages
    : Math.ceil(data.length / 10);

  const currentItems = isServerPaginated
    ? data
    : data.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10);

  const hasActions = onEdit || onDelete || onTakeProject;

  const handleSort = (key: string) => {
    if (!setSortConfig || !sortConfig) return;
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="glass-card p-4 md:p-6 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-primary/20">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="p-4 font-semibold uppercase text-sm"
                >
                  <div
                    className={`flex items-center gap-2 ${column.sortable ? "cursor-pointer hover:text-primary" : ""}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.header}
                    {column.sortable && (
                      <ArrowUpDown
                        className={`h-4 w-4 transition-transform ${sortConfig?.key === column.key ? "text-primary" : ""}`}
                      />
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="p-4 font-semibold uppercase text-sm text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => {
              const itemAsAny = item as any;
              const isAdmin = session?.role === UserRole.Admin;
              const isDesigner = session?.role === UserRole.Designer;
              const isOwner =
                itemAsAny.user?._id === session?.id ||
                itemAsAny.user === session?.id;
              const isAssignedDesigner =
                itemAsAny.designer?._id === session?.id;

              const canEdit = onEdit && (isEditable ? isEditable(item) : true);
              const canDelete =
                onDelete && (isAdmin || isOwner || !itemAsAny.user);
              const canTake =
                onTakeProject && isDesigner && !itemAsAny.designer;

              return (
                <tr
                  key={item._id.toString()}
                  className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={`${item._id.toString()}-${column.key}`}
                      className="p-4 align-middle"
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T])}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end items-center gap-2">
                        {canTake && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onTakeProject(item)}
                            className="hover:text-green-400"
                            title="Take Project"
                          >
                            <Hand className="h-4 w-4" />
                            <span className="sr-only">Take Project</span>
                          </Button>
                        )}
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                            className="hover:text-blue-400"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {canDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-red-500"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the item.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(item)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {currentItems.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center p-8 text-foreground/50"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-foreground/80">
            Page {currentPage} of {totalPages}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="btn-secondary"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
