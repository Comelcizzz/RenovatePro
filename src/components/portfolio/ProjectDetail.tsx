"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ProjectDetailProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    details: string;
    moreImages?: string[];
  } | null;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  return (
    <AnimatePresence>
      {project && (
        <Dialog
          open={!!project}
          onOpenChange={(isOpen) => !isOpen && onClose()}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass p-0 border-0">
            <motion.div layoutId={`card-container-${project.id}`}>
              <div className="relative h-96 w-full">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-8">
                <motion.div layoutId={`title-${project.id}`}>
                  <Badge variant="secondary" className="mb-2">
                    {project.category}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    {project.title}
                  </h2>
                </motion.div>
                <motion.p
                  layoutId={`description-${project.id}`}
                  className="text-gray-300 mb-6"
                >
                  {project.description}
                </motion.p>

                <div className="prose prose-invert max-w-none text-gray-300">
                  <p>{project.details}</p>
                </div>

                {project.moreImages && project.moreImages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Gallery
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.moreImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative h-64 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt={`${project.title} gallery image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
