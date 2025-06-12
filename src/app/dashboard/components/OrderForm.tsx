"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderDocument } from "@/models/Order";
import { useEffect, useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceDocument } from "@/models/Service";
import { UserDocument } from "@/models/User";
import { toast } from "sonner";
import { type UserJWTPayload as SessionPayload } from "@/lib/auth";
import { UserRole } from "@/lib/roleCheck";
import { formatDisplayName } from "@/lib/utils";

type ApiUser = UserDocument & { _id: string };
type ApiService = ServiceDocument & { _id: string };
type FormValues = z.infer<typeof orderSchema>;

const orderSchema = z.object({
  service: z.string().min(1, "Service is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be 500 characters or less"),
  budget: z.coerce.number().min(100, "Budget must be at least $100"),
  clientName: z
    .string()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  clientPhone: z
    .string()
    .regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(100, "Address must be 100 characters or less"),
  status: z.string().optional(),
  designer: z.string().optional(),
  workers: z.array(z.string()).optional(),
});

const defaultFormValues: FormValues = {
  service: "",
  description: "",
  budget: 0,
  clientName: "",
  clientPhone: "",
  address: "",
  status: "pending",
  designer: "",
  workers: [],
};

interface OrderFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  order?: (OrderDocument & { _id: any }) | null;
  onFormSubmit: () => void;
  session: SessionPayload | null;
}

export function OrderForm({
  isOpen,
  setIsOpen,
  order,
  onFormSubmit,
  session,
}: OrderFormProps) {
  const [services, setServices] = useState<ApiService[]>([]);
  const [designers, setDesigners] = useState<ApiUser[]>([]);
  const [workers, setWorkers] = useState<ApiUser[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: defaultFormValues,
  });

  const selectedWorkers = form.watch("workers") || [];

  const isAdmin = useMemo(() => session?.role === UserRole.Admin, [session]);
  const isDesigner = useMemo(
    () => session?.role === UserRole.Designer,
    [session],
  );
  const isAssignedDesigner = useMemo(
    () => order?.designer?._id === session?.id,
    [order, session],
  );

  useEffect(() => {
    async function fetchData() {
      if (!isDesigner && !isAdmin) return;
      try {
        const [designersRes, workersRes] = await Promise.all([
          fetch("/api/users/by-role?role=designer"),
          fetch("/api/users/by-role?role=worker"),
        ]);
        const designersData = await designersRes.json();
        const workersData = await workersRes.json();
        if (designersRes.ok) setDesigners(designersData);
        if (workersRes.ok) setWorkers(workersData);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Could not load designers or workers.");
      }
    }

    async function fetchServices() {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();
        if (response.ok) {
          setServices(data.services || []);
        } else {
          toast.error("Failed to fetch services");
        }
      } catch (error) {
        toast.error("An error occurred while fetching services");
      }
    }

    if (isOpen) {
      fetchServices();
      fetchData();
    }
  }, [isOpen, isAdmin, isDesigner]);

  useEffect(() => {
    if (isOpen) {
      if (order) {
        form.reset({
          service: order?.service?._id?.toString() || "",
          description: order?.description || "",
          budget: order?.budget || 0,
          clientName: order?.clientName || "",
          clientPhone: order?.clientPhone || "",
          address: order?.address || "",
          status: order?.status || "pending",
          designer: order?.designer?._id?.toString() || "",
          workers: order?.workers?.map((w: any) => w._id.toString()) || [],
        });
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [order, isOpen, session, form]);

  const handleWorkerToggle = (workerId: string) => {
    const currentWorkers = form.getValues("workers") || [];
    const updatedWorkers = currentWorkers.includes(workerId)
      ? currentWorkers.filter((id) => id !== workerId)
      : [...currentWorkers, workerId];
    form.setValue("workers", updatedWorkers, { shouldDirty: true });
  };

  const onSubmit = async (values: FormValues) => {
    const url = order ? `/api/orders/${order._id}` : "/api/orders";
    const method = order ? "PUT" : "POST";

    try {
      const orderData = {
        ...values,
        clientPhone: values.clientPhone?.trim(),
        address: values.address?.trim(),
        clientName: values.clientName?.trim(),
        description: values.description?.trim(),
      };

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success(`Order ${order ? "updated" : "created"} successfully!`);
        onFormSubmit();
        setIsOpen(false);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Create New Order"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="glass"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        className="glass"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the address for the service"
                      {...field}
                      className="glass"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Order Info */}
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="glass">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service._id} value={service._id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter budget"
                        {...field}
                        className="glass"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the order details"
                      {...field}
                      className="glass"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isAdmin || isDesigner) && (
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="glass">
                              <SelectValue placeholder="Set status">
                                {field.value
                                  ? formatDisplayName(field.value)
                                  : "Set status"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "pending",
                              "in_progress",
                              "completed",
                              "cancelled",
                            ].map((status) => (
                              <SelectItem key={status} value={status}>
                                {formatDisplayName(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Designer */}
                  <FormField
                    control={form.control}
                    name="designer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designer</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "none" ? "" : value)
                          }
                          defaultValue={field.value}
                          disabled={!isAdmin && !!order?.designer}
                        >
                          <FormControl>
                            <SelectTrigger className="glass">
                              <SelectValue placeholder="Assign a designer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {designers.map((d) => (
                              <SelectItem key={d._id} value={d._id}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Workers */}
                {(isAdmin || isAssignedDesigner) && (
                  <FormItem>
                    <FormLabel>Workers</FormLabel>
                    <div className="p-2 rounded-md border border-gray-700 glass min-h-[80px]">
                      {workers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {workers.map((worker) => (
                            <Button
                              type="button"
                              key={worker._id}
                              variant={
                                selectedWorkers.includes(worker._id)
                                  ? "default"
                                  : "secondary"
                              }
                              onClick={() => handleWorkerToggle(worker._id)}
                              className="h-auto"
                            >
                              {worker.name}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          No workers available.
                        </p>
                      )}
                    </div>
                  </FormItem>
                )}
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="btn-secondary"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="btn-primary"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
