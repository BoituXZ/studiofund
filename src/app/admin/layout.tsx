"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AppHeader } from "@/components/app/app-header";
import { Logo } from "@/components/logo";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminNav } from "@/components/admin/admin-nav";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== 'PLATFORM_ADMIN') {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && user.role !== 'PLATFORM_ADMIN') {
    return null;
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="h-screen overflow-hidden">
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <AdminNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto h-full">
              <div className="container mx-auto">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

