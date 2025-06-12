"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
  };
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layoutId={`card-container-${project.id}`}
      onClick={onClick}
      className="cursor-pointer rounded-lg overflow-hidden glass-card shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-56 w-full">
        <Image
          src={project.imageUrl}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <motion.div layoutId={`title-${project.id}`}>
          <Badge variant="secondary" className="mb-2">
            {project.category}
          </Badge>
          <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        </motion.div>
        <motion.p
          layoutId={`description-${project.id}`}
          className="text-gray-300 text-sm"
        >
          {project.description}
        </motion.p>
      </div>
    </motion.div>
  );
}
