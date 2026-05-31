import type { LucideIcon } from "lucide-react";
import {
  FolderKanban,
  LayoutDashboard,
  MessageSquareMore,
  Sparkles,
  SquarePen,
} from "lucide-react";

export type DashboardNavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

export const dashboardNavigation: DashboardNavigationItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "projects",
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    id: "services",
    label: "Services",
    href: "/dashboard/services",
    icon: Sparkles,
  },
  {
    id: "messages",
    label: "Messages",
    href: "/dashboard/inquiries",
    icon: MessageSquareMore,
  },
  {
    id: "site-settings",
    label: "Site settings",
    href: "/dashboard/site-settings",
    icon: SquarePen,
  },
];
