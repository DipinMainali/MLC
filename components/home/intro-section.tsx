"use client"

import { Section } from "@/components/section"
import { motion } from "framer-motion"

export function IntroSection() {
  return (
    <Section className="border-t border-border">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Approach
        </motion.span>
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl leading-relaxed text-pretty"
          >
            I believe that great brands are built on truth. Every identity I
            create begins with deep understanding — of your business, your
            audience, and the space you occupy in their lives.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            The result is not just a beautiful logo, but a complete system that
            communicates who you are and why you matter — consistently, across
            every touchpoint.
          </motion.p>
        </div>
      </div>
    </Section>
  )
}
