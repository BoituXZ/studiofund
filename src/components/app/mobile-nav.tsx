import { MainNav } from "./main-nav";

export function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <MainNav isMobile={true} />
    </div>
  );
}
