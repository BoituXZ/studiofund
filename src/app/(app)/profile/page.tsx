"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { label: "Personal Information", href: "/profile/personal" },
  { label: "Notifications", href: "/profile/notifications" },
  { label: "Payment Methods", href: "/profile/payment" },
  { label: "Security", href: "/profile/security" },
  { label: "Help & Support", href: "/profile/help" },
  { label: "Terms & Conditions", href: "/profile/terms" },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  if (!user) {
    return null;
  }

  const userInitials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Clean Profile Header */}
      <Card className="bg-background border-0 shadow-none">
        <CardContent className="p-6 text-center">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20 border-4 border-surface shadow-premium-lg">
              {user.profileImage && <AvatarImage src={user.profileImage} alt={user.firstName} />}
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary-hover text-primary-foreground font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <h1 className="text-heading-2 font-semibold text-foreground mb-1">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-body text-muted-foreground">{user.phone}</p>
          {user.email && (
            <p className="text-body-sm text-muted-foreground">{user.email}</p>
          )}
          <p className="text-body-sm text-text-tertiary mt-2">
            Member since {memberSince}
          </p>
        </CardContent>
      </Card>

      {/* Stats Row - Clean horizontal layout with dividers */}
      <Card className="bg-surface border-0">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="py-5 text-center">
              <p className="text-number-md text-foreground font-mono mb-1">3</p>
              <p className="text-caption text-muted-foreground">GROUPS</p>
            </div>
            <div className="py-5 text-center">
              <p className="text-number-md text-foreground font-mono mb-1">$1.5k</p>
              <p className="text-caption text-muted-foreground">SAVED</p>
            </div>
            <div className="py-5 text-center">
              <p className="text-number-md text-success font-mono mb-1">$216</p>
              <p className="text-caption text-muted-foreground">EARNED</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items - Clean list */}
      <Card className="overflow-hidden border-0">
        <CardContent className="p-0">
          <ul>
            {menuItems.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-premium tap-feedback border-b border-border/50 last:border-b-0"
                >
                  <span className="text-body font-medium text-foreground">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Logout Button - Destructive, separated */}
      <div className="pt-4">
        <Button
          variant="ghost"
          className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/[0.08] h-12"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
