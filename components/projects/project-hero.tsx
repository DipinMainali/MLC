"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/components/project-card";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_30%),radial-gradient(circle_at_left,_rgba(120,119,198,0.12),_transparent_34%)]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground backdrop-blur-xl">
            Case study
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 backdrop-blur-xl">
              {project.category}
            </span>
            <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 backdrop-blur-xl">
              {project.year}
            </span>
            {project.client ? (
              <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 backdrop-blur-xl">
                {project.client}
              </span>
            ) : null}
          </div>

          <h1 className="mt-6 max-w-4xl font-serif text-4xl tracking-tight md:text-5xl lg:text-7xl">
            {project.title}
          </h1>

          {project.overview ? (
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {project.overview}
            </p>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 24 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-secondary/20 shadow-[0_20px_80px_-44px_rgba(0,0,0,0.65)]"
        >
          <div className="relative aspect-[16/9] overflow-hidden md:aspect-[21/10]">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 text-white backdrop-blur-xl md:bottom-6 md:left-6 md:right-6 md:px-5 md:py-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">
                Featured project
              </p>
              <p className="mt-1 text-sm text-white/90">
                Premium presentation with subtle motion and layered depth.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-white/90">
              View details
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
