"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

const titles: { [key: string]: string } = {
  "/home": "Home",
  "/groups": "Groups",
  "/businesses": "Businesses",
  "/discounts": "Discounts",
  "/profile": "Profile",
};

function getTitle(pathname: string): string {
    if (pathname.startsWith('/groups/create')) return 'Create Group';
    if (pathname.startsWith('/groups/')) return 'Group Details';
    return titles[pathname] || "HiveFund";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-primary">
      <div className="container flex h-16 items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
        {!isMobile && (
            <div className="mr-6">
                 <Link href="/home">
                    <Logo />
                </Link>
            </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl font-bold font-headline text-white">{title}</h1>
        </div>
        <div className="flex items-center justify-end">
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-primary/80">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1.5 block h-2 w-2 rounded-full bg-accent" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
