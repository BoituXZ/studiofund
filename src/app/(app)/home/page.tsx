"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { 
  Plus, 
  Store, 
  Users, 
  TrendingUp, 
  Tag, 
  ArrowRight,
  Activity,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Mock data
  const totalBalance = 1234.56;
  const activeGroups = 3;
  const totalInvested = 450.00;
  const availableDiscounts = 12;

  const recentActivity = [
    { id: 1, text: "Grace contributed $20 to Mbare Vendors", time: "2 hours ago", type: "contribution" },
    { id: 2, text: "Investment in Chivhu Hardware completed", time: "1 day ago", type: "investment" },
    { id: 3, text: "Your claim was approved", time: "2 days ago", type: "claim" },
    { id: 4, text: "New discount available at OK Mart", time: "3 days ago", type: "discount" },
    { id: 5, text: "Joined 'Harare Savings Group'", time: "5 days ago", type: "group" },
  ];

  const myGroups = [
    { id: 1, name: "Mbare Vendors", balance: 540.00, members: 15 },
    { id: 2, name: "Family Savings", balance: 1200.00, members: 6 },
    { id: 3, name: "Church Building Fund", balance: 890.50, members: 24 },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Section - Welcome & Balance */}
      <Card className="bg-primary text-primary-foreground border-none shadow-premium-lg">
        <CardContent className="p-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium opacity-90">Welcome back, {user?.firstName || "Member"}!</h2>
            <div className="flex flex-col">
              <span className="text-sm opacity-80">Total Balance across all pools</span>
              <span className="text-number-lg font-bold">${totalBalance.toLocaleString()}</span>
            </div>
            <p className="text-sm opacity-80 mt-2">Across {activeGroups} groups</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border shadow-sm">
          <CardContent className="p-3 flex flex-col items-center text-center justify-center h-full gap-1">
            <Users className="h-5 w-5 text-primary mb-1" />
            <span className="text-number font-bold text-lg leading-none">{activeGroups}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Active Groups</span>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-3 flex flex-col items-center text-center justify-center h-full gap-1">
            <TrendingUp className="h-5 w-5 text-success mb-1" />
            <span className="text-number font-bold text-lg leading-none">${totalInvested}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Total Invested</span>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-3 flex flex-col items-center text-center justify-center h-full gap-1">
            <Tag className="h-5 w-5 text-warning mb-1" />
            <span className="text-number font-bold text-lg leading-none">{availableDiscounts}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Discounts</span>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          className="h-auto py-4 px-6 flex items-center justify-between bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border shadow-sm group"
          onClick={() => router.push('/groups/create')}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg">Create a Group</span>
              <span className="text-xs text-muted-foreground font-normal">Start saving with your community</span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>

        <Button 
          className="h-auto py-4 px-6 flex items-center justify-between bg-white hover:bg-gray-50 text-foreground border border-border shadow-sm group"
          variant="outline"
          onClick={() => router.push('/businesses')}
        >
          <div className="flex items-center gap-4 text-left">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shadow-sm">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg">Browse Businesses</span>
              <span className="text-xs text-muted-foreground font-normal">Discover investment opportunities</span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>

      {/* Your Groups - Horizontal Scroll */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-heading-3">Your Groups</h3>
          <Link href="/groups" className="text-sm text-primary font-medium hover:underline">View All</Link>
        </div>
        
        {/* Horizontal container */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
          {myGroups.map((group) => (
            <Card key={group.id} className="min-w-[260px] w-[260px] snap-center shadow-premium hover:shadow-premium-hover transition-premium border border-border/50 cursor-pointer" onClick={() => router.push(`/groups/${group.id}`)}>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-lg truncate">{group.name}</h4>
                  <p className="text-sm text-muted-foreground">{group.members} members</p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium uppercase">Pool Balance</span>
                      <span className="text-number font-bold text-primary">${group.balance.toLocaleString()}</span>
                    </div>
                    <div className="bg-secondary p-1.5 rounded-full">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border border-border/60">
        <CardHeader className="pb-2 border-b border-border/40 bg-secondary/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
            <Link href="/profile/notifications" className="text-xs text-primary font-medium hover:underline">View All</Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 flex items-start gap-3 hover:bg-secondary/20 transition-colors">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground leading-snug">{activity.text}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}