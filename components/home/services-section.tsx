"use client";

import { Section, SectionHeader } from "@/components/section";
import { motion } from "framer-motion";

import type { ServiceDTO } from "@/features/content/services/service.interfaces";

const fallbackServices = [
  {
    title: "Brand Identity",
    description:
      "Complete visual identity systems including logo design, typography, color palettes, and comprehensive brand guidelines.",
    deliverables: ["Logo System", "Color Palette", "Typography", "Guidelines"],
  },
  {
    title: "Brand Strategy",
    description:
      "Deep strategic work including market positioning, audience research, brand messaging, and competitive analysis.",
    deliverables: ["Positioning", "Voice & Tone", "Messaging", "Research"],
  },
  {
    title: "Visual Systems",
    description:
      "Scalable design systems for growing brands, including templates, social media assets, and environmental graphics.",
    deliverables: ["Templates", "Social Assets", "Collateral", "Graphics"],
  },
];

type ServicesSectionProps = {
  services: ServiceDTO[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  const displayedServices = services.length ? services : fallbackServices;

  return (
    <Section className="bg-secondary/50">
      <SectionHeader
        label="Services"
        title="What I do"
        description="Every project is unique, but my process always starts with strategy and ends with systems that scale."
      />

      <div className="grid md:grid-cols-3 gap-12 md:gap-8">
        {displayedServices.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="space-y-4 rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl tracking-tight">
                {service.title}
              </h3>
              {"icon" in service && service.icon ? (
                <span className="rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {service.icon}
                </span>
              ) : null}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {"description" in service && service.description
                ? service.description
                : service.shortDescription || service.fullDescription || ""}
            </p>
            <ul className="pt-2 space-y-2">
              {"deliverables" in service
                ? service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {item}
                    </li>
                  ))
                : service.features.slice(0, 4).map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {item}
                    </li>
                  ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
