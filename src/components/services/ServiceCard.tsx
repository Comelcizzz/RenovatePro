import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600">
            {service.category}
          </span>
          <span className="text-sm text-gray-500">{service.duration}</span>
        </div>
        <CardTitle className="line-clamp-1">{service.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2">{service.description}</p>
        <p className="mt-4 text-2xl font-bold text-blue-600">
          ${service.price.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/services/${service._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
