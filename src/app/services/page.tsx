import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Bath,
  ChefHat,
  Building,
  Paintbrush,
  Car,
  LandPlot,
  Hammer,
} from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  Kitchen: ChefHat,
  Bathroom: Bath,
  Interior: Paintbrush,
  Exterior: Building,
  Renovation: Home,
  Landscaping: LandPlot,
  Conversion: Car,
  default: Hammer,
};

export default async function ServicesPage() {
  await connectDB();
  const services = await Service.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Our Services</h1>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
          We offer a comprehensive range of renovation and design services,
          delivered with precision and a personal touch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const Icon = iconMap[service.category] || iconMap["default"];
          return (
            <Card key={service._id as string} className="glass-card border-purple-500/20 flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-white text-xl">
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="text-gray-300 flex-grow">{service.description}</p>
                <div className="mt-6 pt-4 border-t border-gray-700/50 text-sm text-gray-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-semibold text-white">
                      {service.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Starting Price:</span>
                    <span className="font-semibold text-white">
                      ${service.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
