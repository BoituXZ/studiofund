import { AppHeader } from "@/components/app/app-header";
import { MainNav } from "@/components/app/main-nav";
import { MobileNav } from "@/components/app/mobile-nav";
import { Logo } from "@/components/logo";
import { ProtectedRoute } from "@/components/auth/protected-route";
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarInset,
} from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        // <ProtectedRoute>
        <SidebarProvider>
            <div
                className="flex h-screen w-full overflow-hidden"
                style={{ overflow: "hidden" }}
            >
                <Sidebar>
                    <SidebarHeader>
                        <Logo />
                    </SidebarHeader>
                    <SidebarContent>
                        <MainNav />
                    </SidebarContent>
                </Sidebar>
                <SidebarInset className="flex flex-col overflow-hidden">
                    <AppHeader />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="container mx-auto">{children}</div>
                    </main>
                    <div className="h-20 md:hidden" />
                </SidebarInset>
                <MobileNav />
            </div>
        </SidebarProvider>
        // </ProtectedRoute>
    );
}
