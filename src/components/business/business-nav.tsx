"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  DollarSign,
  FileText,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Custom style to prevent text truncation
const navItemStyle = {
  '--tw-truncate': 'none',
} as React.CSSProperties;

const businessNavItems = [
  {
    title: "Dashboard",
    href: "/business/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/business/profile",
    icon: Building2,
  },
  {
    title: "Investments",
    href: "/business/investments",
    icon: TrendingUp,
  },
  {
    title: "Finances",
    href: "/business/finances",
    icon: DollarSign,
  },
  {
    title: "Documents",
    href: "/business/documents",
    icon: FileText,
  },
  {
    title: "Verification",
    href: "/business/verification",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/business/settings",
    icon: Settings,
  },
];

export function BusinessNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Business Portal</SidebarGroupLabel>
      <SidebarMenu>
        {businessNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive} style={navItemStyle}>
                <Link href={item.href} className="flex items-center gap-2 w-full [&>span:last-child]:!truncate-none [&>span:last-child]:!overflow-visible [&>span:last-child]:!whitespace-normal">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

