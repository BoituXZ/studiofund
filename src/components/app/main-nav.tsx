"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  House,
  Users,
  Store,
  Tag,
  User as UserIcon,
  Shield,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import type { LucideIcon } from "lucide-react";

export const navItems = [
  { href: "/home", label: "Home", icon: House },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/businesses", label: "Businesses", icon: Store },
  { href: "/discounts", label: "Discounts", icon: Tag },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

export function MainNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const allNavItems = [
    ...navItems,
    ...(user?.role === 'PLATFORM_ADMIN' ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  if (isMobile) {
    return (
      <nav className={`grid gap-1 ${allNavItems.length === 6 ? 'grid-cols-6' : 'grid-cols-5'}`}>
        {allNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground",
              pathname === item.href && "text-primary bg-primary/10"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <SidebarMenu>
      {allNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} className="w-full">
            <SidebarMenuButton
              isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
              tooltip={{ children: item.label }}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
