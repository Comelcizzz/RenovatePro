import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import AboutPageClient from "./AboutPageClient";

export default async function AboutPage() {
  await dbConnect();
  const teamMembers = await User.aggregate([
    { $match: { role: { $in: ["admin", "designer", "worker"] } } },
    { $group: { _id: "$role", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } },
  ]);

  return (
    <AboutPageClient teamMembers={JSON.parse(JSON.stringify(teamMembers))} />
  );
}
