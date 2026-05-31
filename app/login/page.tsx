"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/features/auth/auth.schemas";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const defaultValues = useMemo<LoginInput>(
    () => ({ email: "", password: "" }),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const handleSignIn = async (provider: "google" | "facebook") => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
    setIsLoading(null);
  };

  const onSubmit = async (values: LoginInput) => {
    setAuthError(null);
    setIsLoading("credentials");

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/dashboard",
    });

    setIsLoading(null);

    if (result?.error) {
      setAuthError("Invalid email or password.");
      return;
    }

    router.push(result?.url ?? "/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-background">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Admin access
        </p>
        <h1 className="mt-3 text-3xl font-serif tracking-tight">Sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Use email and password or social sign-in. Your account must have an
          admin or editor role before you can manage content.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={errors.password ? "true" : "false"}
                className="pr-12"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {authError ? (
            <p className="text-sm text-destructive">{authError}</p>
          ) : null}

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isSubmitting || isLoading !== null}
          >
            {isLoading === "credentials" ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="my-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => void handleSignIn("google")}
            className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={isLoading !== null}
          >
            {isLoading === "google" ? "Redirecting..." : "Continue with Google"}
          </button>
          <button
            type="button"
            onClick={() => void handleSignIn("facebook")}
            className="w-full rounded-full border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
            disabled={isLoading !== null}
          >
            {isLoading === "facebook"
              ? "Redirecting..."
              : "Continue with Facebook"}
          </button>
        </div>
      </section>
    </main>
  );
}
