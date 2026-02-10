import { MainNav } from "./main-nav";

export function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/[0.06] bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 py-2 shadow-[0_-2px_16px_rgba(0,0,0,0.04)]">
        <MainNav isMobile={true} />
    </div>
  );
}
