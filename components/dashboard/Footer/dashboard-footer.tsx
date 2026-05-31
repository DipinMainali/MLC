type DashboardFooterProps = {
  role: string;
  email: string | null | undefined;
};

export function DashboardFooter({ role, email }: DashboardFooterProps) {
  return (
    <footer className="flex flex-col gap-3 border-t border-border/70 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <p>
        Dashboard shell powered by server components so shared navigation stays
        steady across route changes.
      </p>
      <p>
        Secure access · {role} · {email}
      </p>
    </footer>
  );
}
