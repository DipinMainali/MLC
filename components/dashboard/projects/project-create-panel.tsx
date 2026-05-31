"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/dashboard/projects/ProjectForm";

export function ProjectCreatePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const openPanel = () => {
    setIsOpen(true);
    window.requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div ref={panelRef} id="project-create-panel" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Project actions
          </p>
          <p className="text-sm text-muted-foreground">
            Click Add project to reveal the creation form.
          </p>
        </div>

        <Button
          type="button"
          className="rounded-full px-5"
          onClick={() => (isOpen ? setIsOpen(false) : openPanel())}
        >
          <Plus className="size-4" />
          {isOpen ? "Hide project form" : "Add project"}
          {isOpen ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>
      </div>

      {isOpen ? <ProjectForm /> : null}
    </div>
  );
}
