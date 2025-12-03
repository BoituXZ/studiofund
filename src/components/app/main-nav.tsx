"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

export const navItems = [
  { href: "/home", label: "Home" },
  { href: "/groups", label: "Groups" },
  { href: "/businesses", label: "Businesses" },
  { href: "/discounts", label: "Discounts" },
  { href: "/profile", label: "Profile" },
];

export function MainNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const allNavItems = [
    ...navItems,
    ...(user?.role === 'PLATFORM_ADMIN' ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  if (isMobile) {
    return (
      <nav className={`grid gap-0.5 ${allNavItems.length === 6 ? 'grid-cols-6' : 'grid-cols-5'}`}>
        {allNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center rounded-lg py-2 px-1 transition-premium tap-feedback text-[11px]",
                isActive
                  ? "bg-primary text-white font-semibold"
                  : "text-foreground font-normal"
              )}
            >
              {item.label}
            </Link>
          );
        })}
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
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
