import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://dribbble.com", label: "Dribbble" },
];

type FooterProps = {
  siteName?: string | null;
  tagline?: string | null;
  socialLinks?: Array<{ label: string; url: string }> | null;
};

export function Footer({
  siteName,
  tagline,
  socialLinks: settingsSocialLinks,
}: FooterProps) {
  const resolvedSiteName = siteName?.trim() || "Prajesh Shakya";
  const resolvedTagline =
    tagline?.trim() ||
    "Strategic brand identities combining psychology, design, and marketing.";
  const resolvedSocialLinks = settingsSocialLinks?.length
    ? settingsSocialLinks.map((link) => ({ href: link.url, label: link.label }))
    : socialLinks;

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-serif text-xl tracking-tight hover:opacity-70 transition-opacity"
            >
              {resolvedSiteName}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {resolvedTagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">
              Connect
            </h4>
            <ul className="space-y-3">
              {resolvedSocialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {resolvedSiteName}. All rights
            reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Designed with intention
          </p>
        </div>
      </div>
    </footer>
  );
}
