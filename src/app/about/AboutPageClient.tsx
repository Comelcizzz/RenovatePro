"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TeamMember = {
  _id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPageClient({
  teamMembers,
}: {
  teamMembers: TeamMember[];
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        className="text-center"
      >
        <motion.h1
          variants={fadeIn}
          className="text-4xl font-bold mb-4 text-white"
        >
          About RenovatePro
        </motion.h1>
        <motion.p
          variants={fadeIn}
          className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          We are a passionate team of designers, engineers, and builders
          dedicated to transforming homes and commercial spaces. Our mission is
          to deliver exceptional quality and unparalleled customer service from
          concept to completion.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <motion.div variants={fadeIn} whileHover={{ y: -5 }}>
          <Card className="bg-background/20 border-border h-full">
            <CardHeader>
              <CardTitle className="gradient-text-accent">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                To create beautiful, functional, and sustainable spaces that
                exceed our clients&apos; expectations and enhance their quality of
                life.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeIn} whileHover={{ y: -5 }}>
          <Card className="bg-background/20 border-border h-full">
            <CardHeader>
              <CardTitle className="gradient-text-accent">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                To be the leading renovation and design firm, known for our
                innovative solutions, craftsmanship, and commitment to our
                clients.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeIn} whileHover={{ y: -5 }}>
          <Card className="bg-background/20 border-border h-full">
            <CardHeader>
              <CardTitle className="gradient-text-accent">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>Integrity & Transparency</li>
                <li>Quality & Craftsmanship</li>
                <li>Client-Centric Approach</li>
                <li>Innovation & Creativity</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
        className="text-center"
      >
        <motion.h2
          variants={fadeIn}
          className="text-3xl font-bold mb-12 text-white"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {teamMembers.map((member) => (
            <motion.div
              key={member._id}
              variants={fadeIn}
              className="flex flex-col items-center"
            >
              <Avatar className="w-32 h-32 mb-4 border-4 border-blue-500/50">
                <AvatarImage
                  src={member.image || "/images/team/default.jpg"}
                  alt={member.name}
                />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="gradient-text-accent font-semibold">
                {member.role}
              </p>
              <p className="text-foreground/70 mt-2 text-sm">
                {member.bio || "A dedicated member of the RenovatePro team."}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
