"use client";

import { motion } from "framer-motion";
import type { Project } from "@/components/project-card";

interface ProjectContentProps {
  project: Project;
}

interface ContentBlockProps {
  label: string;
  content: string;
  delay?: number;
}

function ContentBlock({ label, content, delay = 0 }: ContentBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="grid gap-6 rounded-[1.75rem] border border-border/60 bg-background/70 p-6 shadow-[0_12px_40px_-32px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:grid-cols-5 lg:gap-8 lg:p-8"
    >
      <div className="lg:col-span-2">
        <span className="inline-flex rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="lg:col-span-3">
        <p className="text-base leading-8 text-foreground/90 md:text-lg">
          {content}
        </p>
      </div>
    </motion.div>
  );
}

export function ProjectContent({ project }: ProjectContentProps) {
  return (
    <section className="relative py-8 md:py-14">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,_transparent,_rgba(255,255,255,0.02)_10%,_transparent_90%)]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {project.overview && (
          <ContentBlock label="Overview" content={project.overview} />
        )}
        {project.problem && (
          <ContentBlock
            label="Challenge"
            content={project.problem}
            delay={0.1}
          />
        )}
        {project.approach && (
          <ContentBlock
            label="Approach"
            content={project.approach}
            delay={0.2}
          />
        )}
        {project.solution && (
          <ContentBlock
            label="Solution"
            content={project.solution}
            delay={0.3}
          />
        )}
        {project.outcome && (
          <ContentBlock label="Outcome" content={project.outcome} delay={0.4} />
        )}
      </div>
    </section>
  );
}
