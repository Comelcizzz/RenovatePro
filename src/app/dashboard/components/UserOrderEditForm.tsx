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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrderDocument } from "@/models/Order";
import { ServiceDocument } from "@/models/Service";

const userOrderSchema = z.object({
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
});

type FormValues = z.infer<typeof userOrderSchema>;

const defaultFormValues: FormValues = {
  service: "",
  description: "",
  budget: 0,
  clientName: "",
  clientPhone: "",
  address: "",
};

interface UserOrderEditFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  order?: (OrderDocument & { _id: any }) | null;
  onFormSubmit: () => void;
}

export function UserOrderEditForm({
  isOpen,
  setIsOpen,
  order,
  onFormSubmit,
}: UserOrderEditFormProps) {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(userOrderSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
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
    if (isOpen) fetchServices();
  }, [isOpen]);

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
        });
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [order, isOpen, form]);

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
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <select {...field} className="glass w-full">
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option
                          key={service._id as string}
                          value={service._id as string}
                        >
                          {service.name}
                        </option>
                      ))}
                    </select>
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
