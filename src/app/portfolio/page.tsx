import dbConnect from "@/lib/mongodb";
import PortfolioItem from "@/models/PortfolioItem";
import Image from "next/image";

const PortfolioPage = async () => {
  await dbConnect();
  const portfolioItems = await PortfolioItem.find({}).sort({ createdAt: -1 });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-white">
        Our Work
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioItems.map((item) => (
          <div
            key={item._id as string}
            className="bg-background/20 p-4 rounded-lg"
          >
            <div className="relative h-60 w-full mb-4">
              <Image
                src={item.imageUrl}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h2 className="text-xl font-bold text-white">{item.title}</h2>
            <p className="text-foreground/80 mb-2">{item.category}</p>
            <p className="text-foreground/70">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
