"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";

function ToastIcon({ variant }: { variant?: "default" | "destructive" }) {
  const Icon = variant === "destructive" ? AlertTriangle : CheckCircle2;

  return (
    <div
      className={cn(
        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border text-foreground",
        variant === "destructive"
          ? "border-destructive/20 bg-destructive/10 text-destructive"
          : "border-primary/15 bg-primary/10 text-primary",
      )}
    >
      <Icon className="size-4" />
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        return (
          <Toast key={id} variant={variant} {...props}>
            <ToastIcon variant={variant} />

            <div className="grid flex-1 gap-1.5 pt-0.5">
              {title ? <ToastTitle>{title}</ToastTitle> : null}
              {description ? (
                <ToastDescription>{description}</ToastDescription>
              ) : null}
            </div>

            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
