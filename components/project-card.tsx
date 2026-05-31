"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  client?: string;
  overview?: string;
  problem?: string;
  approach?: string;
  solution?: string;
  outcome?: string;
  images?: string[];
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative mb-5 overflow-hidden rounded-3xl border border-border/60 bg-secondary/20 shadow-[0_10px_40px_-28px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_70px_-28px_rgba(0,0,0,0.55)]">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.12) 100%)",
            }}
          />
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "4 / 3" }}
          >
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          </div>

          <div
            className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 48%, rgba(0,0,0,0) 100%)",
            }}
          />

          <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-white/90 backdrop-blur-md">
              {project.category}
            </span>

            <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4 px-1">
          <div className="space-y-1">
            <h3 className="font-serif text-xl tracking-tight transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-80 md:text-[1.45rem]">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground/90">
              {project.category}
            </p>
          </div>
          <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-sm">
            {project.year}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectCardLarge({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-border/60 bg-secondary/20 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:-translate-y-px">
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "16 / 9" }}
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        </div>

        <div
          className="absolute inset-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 52%, rgba(0,0,0,0) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
          <div className="max-w-xl space-y-3 text-white">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] backdrop-blur-md">
              Featured case study
            </span>
            <h3 className="font-serif text-2xl tracking-tight transition-transform duration-300 group-hover:-translate-y-px md:text-4xl">
              {project.title}
            </h3>
            <p className="max-w-lg text-sm text-white/75 md:text-base">
              {project.overview ?? project.category}
            </p>
          </div>

          <span className="hidden size-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5 md:inline-flex">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
