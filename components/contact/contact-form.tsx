"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

type ContactFormProps = {
  contactEmail?: string | null;
};

export function ContactForm({ contactEmail }: ContactFormProps) {
  const resolvedContactEmail =
    contactEmail?.trim() || "hello@prajeshshakya.com";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error?.message ?? "Something went wrong. Please try again.",
        );
      }

      setIsSubmitted(true);
      e.currentTarget.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-6">
              Contact
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
              Let&apos;s start a <span className="italic">conversation</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-md">
              Have a project in mind? I&apos;d love to hear about it. Fill out
              the form and I&apos;ll get back to you within 48 hours.
            </p>

            <div className="mt-12 space-y-6">
              <div>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Email
                </span>
                <a
                  href={`mailto:${resolvedContactEmail}`}
                  className="text-lg hover:opacity-70 transition-opacity"
                >
                  {resolvedContactEmail}
                </a>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Based in
                </span>
                <p className="text-lg">Los Angeles, CA</p>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Availability
                </span>
                <p className="text-lg">Currently accepting new projects</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isSubmitted ? (
              <div className="h-full flex items-center">
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl">Thank you!</h2>
                  <p className="text-muted-foreground">
                    Your message has been sent. I&apos;ll be in touch soon.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                {errorMessage ? (
                  <p className="text-sm text-red-500" role="alert">
                    {errorMessage}
                  </p>
                ) : null}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
