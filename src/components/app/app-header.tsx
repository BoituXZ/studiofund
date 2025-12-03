"use client";

import { usePathname } from "next/navigation";
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={toggleSidebar}
          >
            Menu
          </Button>
        )}
        {!isMobile && (
            <div className="mr-6 md:hidden">
                 <Link href="/home">
                    <Logo />
                </Link>
            </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl font-bold font-headline text-foreground">{title}</h1>
        </div>
      </div>
    </header>
  );
}
