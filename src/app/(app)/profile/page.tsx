"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Mock Stats
  const stats = [
    { label: "Groups", value: "3" },
    { label: "Total Saved", value: "$1,240" },
    { label: "Earned", value: "$145" },
  ];

  const menuItems = [
    { label: "Personal Information", href: "/profile/personal" },
    { label: "Notifications", href: "/profile/notifications" },
    { label: "Payment Methods", href: "/profile/payment" },
    { label: "Security", href: "/profile/security" },
    { label: "Help & Support", href: "/profile/support" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <div className="space-y-6 pb-20 min-h-screen bg-background">
      {/* Header Card */}
      <Card className="bg-primary text-primary-foreground border-none rounded-b-2xl rounded-t-none -mx-4 sm:mx-0 sm:rounded-xl shadow-lg">
        <CardContent className="p-6 pt-10 sm:pt-6 flex flex-col items-center text-center space-y-3">
          <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 text-2xl font-bold text-white">
            {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || "N"}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-primary-foreground/80 font-medium text-sm">+263 77 123 4567</p>
            <p className="text-xs text-primary-foreground/60 mt-1">Member since Mar 2024</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-2">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm border-border/60">
            <CardContent className="p-3 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">{stat.label}</span>
              <span className="text-lg font-bold text-primary mt-0.5">{stat.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Menu */}
      <Card className="shadow-sm border-border/60 overflow-hidden">
        <div className="divide-y divide-border/50">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors active:bg-secondary/50"
            >
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-between p-4 hover:bg-destructive/5 transition-colors active:bg-destructive/10 text-destructive"
          >
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </Card>

      <div className="text-center text-xs text-muted-foreground pt-4 pb-8">
        <p>HiveFund v1.0.0</p>
        <p className="opacity-60">Built for Zimbabwe 🇿🇼</p>
      </div>
    </div>
  );
}