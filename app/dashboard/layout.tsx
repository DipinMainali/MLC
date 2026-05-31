import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canManageContent } from "@/lib/authorization";
import { DashboardFooter } from "@/components/dashboard/Footer/dashboard-footer";
import { DashboardHeader } from "@/components/dashboard/Header/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/Sidebar/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  if (!session?.user?.id || !canManageContent(session.user.role)) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-400 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar
          role={session.user.role}
          name={session.user.name}
          email={session.user.email}
        />

        <div className="flex min-w-0 flex-col">
          <DashboardHeader
            role={session.user.role}
            name={session.user.name}
            email={session.user.email}
          />

          <div className="flex-1 px-6 py-8 xl:px-10">
            <div className="space-y-8">
              {children}
              <DashboardFooter
                role={session.user.role}
                email={session.user.email}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
