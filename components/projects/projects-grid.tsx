"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/components/project-card";
import { cn } from "@/lib/utils";
import { Layers3 } from "lucide-react";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((project) => project.category))],
    [projects],
  );

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) =>
          project.category.toLowerCase().includes(activeCategory.toLowerCase()),
        );

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(to_bottom,transparent,transparent_60%,rgba(255,255,255,0.02))]" />
      <div className="absolute -left-32 top-24 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-24 top-80 -z-10 h-80 w-80 rounded-full bg-foreground/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground backdrop-blur-xl">
            <Layers3 className="size-3.5" />
            Projects
          </div>

          <div className="mt-6 max-w-3xl space-y-5">
            <h1 className="font-serif text-4xl tracking-tight md:text-5xl lg:text-7xl">
              Selected work with clarity, craft, and quiet confidence.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              A curated collection of brand identity and digital experience case
              studies, presented with clean structure and subtle motion.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12 flex flex-wrap items-center gap-3 rounded-3xl border border-border/60 bg-background/55 p-3 backdrop-blur-xl md:mb-14"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "rounded-full px-4 py-2 text-sm tracking-wide transition-all duration-300",
                activeCategory === category
                  ? "bg-foreground text-background shadow-lg shadow-foreground/10"
                  : "border border-border/60 bg-secondary/40 text-foreground hover:border-border hover:bg-secondary/70",
              )}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <div className="mb-5 flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Showing{" "}
            <span className="text-foreground">{filteredProjects.length}</span>{" "}
            project{filteredProjects.length === 1 ? "" : "s"}
          </p>
          <p className="hidden md:block">
            Hover cards for a subtle lift and reveal.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-7">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-border/70 bg-background/60 px-6 py-14 text-center backdrop-blur-xl">
            <p className="text-lg text-foreground">
              No projects found in this category.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different category filter or return to All.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
