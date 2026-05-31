"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/components/project-card";

interface ProjectGalleryProps {
  project: Project;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  if (!project.images || project.images.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between"
        >
          <span className="inline-flex rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground backdrop-blur-xl">
            Gallery
          </span>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {project.images.map((image, index) => (
            <motion.div
              key={image}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              className={index === 0 ? "md:col-span-2" : ""}
            >
              <div className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-secondary/20 shadow-[0_12px_45px_-32px_rgba(0,0,0,0.55)]">
                <div
                  className={
                    index === 0
                      ? "relative aspect-[16/9]"
                      : "relative aspect-[4/5] md:aspect-[5/4]"
                  }
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
