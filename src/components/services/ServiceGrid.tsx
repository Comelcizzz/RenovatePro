import { ServiceCard } from "./ServiceCard";
import { Pagination } from "./Pagination";
import type { Service } from "@/types";

interface ServiceGridProps {
  services: Service[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ServiceGrid({
  services,
  currentPage,
  totalPages,
  onPageChange,
}: ServiceGridProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
