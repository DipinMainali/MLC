"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/components/project-card";

interface ProjectNavigationProps {
  prev: Project | null;
  next: Project | null;
}

export function ProjectNavigation({ prev, next }: ProjectNavigationProps) {
  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {/* Previous Project */}
          <div className="rounded-[1.75rem] border border-border/60 bg-background/70 p-6 shadow-[0_12px_40px_-34px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex items-start gap-4"
              >
                <span className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-secondary/40 transition-transform duration-300 group-hover:-translate-x-1">
                  <ArrowLeft className="size-4" />
                </span>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Previous project
                  </span>
                  <span className="block font-serif text-lg transition-opacity group-hover:opacity-80">
                    {prev.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {prev.category}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="text-muted-foreground/50">
                <span className="block text-[10px] uppercase tracking-[0.28em] mb-2">
                  Previous
                </span>
                <span className="text-lg">No previous project</span>
              </div>
            )}
          </div>

          {/* Next Project */}
          <div className="rounded-[1.75rem] border border-border/60 bg-background/70 p-6 text-right shadow-[0_12px_40px_-34px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group inline-flex items-start gap-4 justify-end"
              >
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
                    Next project
                  </span>
                  <span className="block font-serif text-lg transition-opacity group-hover:opacity-80">
                    {next.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {next.category}
                  </span>
                </div>
                <span className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-secondary/40 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ) : (
              <div className="text-muted-foreground/50">
                <span className="block text-[10px] uppercase tracking-[0.28em] mb-2">
                  Next
                </span>
                <span className="text-lg">No next project</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
