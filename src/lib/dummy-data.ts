import {
  Home,
  Bath,
  ChefHat,
  Building,
  Paintbrush,
  Car,
  LandPlot,
} from "lucide-react";
import PortfolioItem from "../models/PortfolioItem";
import User from "@/models/User";

export const portfolioProjects = [
  {
    id: "1",
    title: "Modern Kitchen Renovation",
    description:
      "A complete overhaul of a kitchen, featuring custom cabinetry, quartz countertops, and a subway tile backsplash.",
    category: "Kitchen",
    imageUrl:
      "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    details:
      "The project focused on creating an open-concept space by removing a non-load-bearing wall. We installed state-of-the-art appliances, under-cabinet LED lighting, and a large central island perfect for entertaining. The client chose a sleek, minimalist design with a monochrome color palette.",
    moreImages: [
      "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
  },
  {
    id: "2",
    title: "Luxury Bathroom Oasis",
    description:
      "Transforming a dated bathroom into a spa-like retreat with a freestanding tub and walk-in shower.",
    category: "Bathroom",
    imageUrl:
      "https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    details:
      "This project involved a full gut renovation. We installed a large-format porcelain tile, a custom double vanity with marble top, and a frameless glass shower enclosure. Heated floors and a smart mirror with integrated lighting completed the luxurious feel.",
    moreImages: [],
  },
  {
    id: "3",
    title: "Exterior Facelift",
    description:
      "Updating the home's exterior with new siding, paint, and a custom-built portico.",
    category: "Exterior",
    imageUrl:
      "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    details:
      "We replaced the old vinyl siding with modern James Hardie fiber cement panels. The color scheme was updated to a contemporary dark grey with crisp white trim. A new mahogany front door and a custom-designed portico created a grand, welcoming entrance.",
    moreImages: [],
  },
  {
    id: "4",
    title: "Open-Concept Living Area",
    description:
      "Combining living, dining, and kitchen areas into one cohesive and functional space.",
    category: "Interior",
    imageUrl:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    details:
      "Structural changes were made to remove walls and install support beams, opening up the entire first floor. Consistent hardwood flooring was installed throughout to unify the space. We also created custom built-in shelving and a media center.",
    moreImages: [],
  },
];

export const servicesList = [
  {
    title: "Complete Home Renovation",
    description:
      "Full-scale renovation projects to transform your entire home, from planning and design to final construction.",
    icon: Home,
    price_estimate: "$50,000+",
    duration: "3-6 months",
  },
  {
    title: "Kitchen Remodeling",
    description:
      "Custom kitchen designs, cabinet installation, countertop replacement, and appliance integration.",
    icon: ChefHat,
    price_estimate: "$15,000 - $40,000",
    duration: "4-8 weeks",
  },
  {
    title: "Bathroom Remodeling",
    description:
      "Turn your bathroom into a personal spa with our full remodeling services, including tiling, plumbing, and fixture installation.",
    icon: Bath,
    price_estimate: "$10,000 - $25,000",
    duration: "3-5 weeks",
  },
  {
    title: "3D Interior Design",
    description:
      "Visualize your new space before construction begins with our realistic 3D modeling and rendering services.",
    icon: Paintbrush,
    price_estimate: "$1,500 - $5,000",
    duration: "1-2 weeks",
  },
  {
    title: "Exterior and Facade Upgrades",
    description:
      "Enhance your home's curb appeal with new siding, painting, window replacement, and architectural enhancements.",
    icon: Building,
    price_estimate: "$8,000+",
    duration: "2-4 weeks",
  },
  {
    title: "Garage and Basement Conversion",
    description:
      "Convert unused space into a functional home office, gym, or entertainment area.",
    icon: Car,
    price_estimate: "$20,000+",
    duration: "4-8 weeks",
  },
  {
    title: "Custom Landscaping and Hardscaping",
    description:
      "Design and build beautiful outdoor living areas, including patios, walkways, and garden installations.",
    icon: LandPlot,
    price_estimate: "$5,000+",
    duration: "1-3 weeks",
  },
];

export const contactInfo = {
  phone: "+1 (555) 123-4567",
  email: "contact@customremont.com",
  address: "123 Innovation Drive, Suite 100, Tech Park, CA 94105",
  mapsUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.297449941987!2d-122.40340238468164!3d37.78423297975817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858088b20095ab%3A0x8044019488a09a56!2sSalesforce%20Tower!5e0!3m2!1sen!2sus!4v1620078832819!5m2!1sen!2sus",
};

const portfolioItems = portfolioProjects.map(p => ({
  title: p.title,
  description: p.description,
  imageUrl: p.imageUrl,
  category: p.category,
}));

export const seedPortfolio = async () => {
  await PortfolioItem.deleteMany({});
  
  const user = await User.findOne();
  if (!user) {
    console.log("No users found, skipping portfolio seeding");
    return;
  }

  const itemsWithUser = portfolioItems.map((item) => ({
    ...item,
    user: user._id,
  }));

  await PortfolioItem.insertMany(itemsWithUser);
  console.log("Portfolio seeded");
};
