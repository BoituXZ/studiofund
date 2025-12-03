"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Businesses",
    href: "/admin/businesses",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
  {
    title: "Groups",
    href: "/admin/groups",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
      <SidebarMenu>
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.href}>
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

