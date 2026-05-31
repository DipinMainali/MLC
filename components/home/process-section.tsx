"use client"

import { Section, SectionHeader } from "@/components/section"
import { motion } from "framer-motion"

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Deep dive into your business, audience, and competitive landscape. We uncover the truths that will shape your brand.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Define positioning, messaging, and the strategic direction that will guide every design decision.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Create a complete visual identity system, from logo to guidelines, that brings your strategy to life.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Launch your brand with confidence, equipped with all assets and documentation for consistent implementation.",
  },
]

export function ProcessSection() {
  return (
    <Section>
      <SectionHeader
        label="Process"
        title="How we work together"
        description="A proven methodology that transforms insight into identity."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
        {processSteps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="space-y-4"
          >
            <span className="block font-serif text-4xl text-muted-foreground/30">
              {step.number}
            </span>
            <h3 className="font-serif text-xl tracking-tight">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
