"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  Tag,
  Loader2,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { groupsApi, type Group } from "@/lib/api/groups";
import { useAuth } from "@/contexts/auth-context";

export default function HomePage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch (error) {
      console.error("Failed to load groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalBalance = groups.reduce((acc, group) => acc + (group.poolBalance || 0), 0);
  const totalInvested = groups.reduce((acc, g) => acc + (g.pool?.investedAmount ? Number(g.pool.investedAmount) : 0), 0);
  const monthlyGrowth = 234.50; // This would come from API in real app

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Balance Card with Gradient */}
      <Card className="bg-gradient-to-b from-primary to-primary-hover text-primary-foreground shadow-premium-lg border-0 hover:shadow-premium-lg hover:translate-y-0">
        <CardContent className="p-8">
          <p className="text-body-sm text-primary-foreground/70 uppercase tracking-wide font-medium mb-2">
            Your Total Balance
          </p>
          <p className="text-display-lg text-primary-foreground font-bold font-mono mb-3">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <p className="text-body-sm text-primary-foreground/80">
              +${monthlyGrowth.toFixed(2)} this month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-surface border-0">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-body-sm text-muted-foreground font-medium">Active Groups</p>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-number-md text-foreground font-mono">{groups.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-0">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-body-sm text-muted-foreground font-medium">Total Invested</p>
              <ArrowUpRight className="h-5 w-5 text-primary" />
            </div>
            <p className="text-number-md text-foreground font-mono">
              ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-0">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-body-sm text-muted-foreground font-medium">Monthly Growth</p>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-number-md text-success font-mono">+{((monthlyGrowth / totalBalance) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-0">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-body-sm text-muted-foreground font-medium">Discounts</p>
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <p className="text-number-md text-foreground font-mono">0</p>
            <p className="text-xs text-muted-foreground mt-0.5">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Updates - Horizontal Scroll */}
      <div>
        <h2 className="text-heading-2 font-semibold mb-4">Latest Updates</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
          <Card className="min-w-[280px] flex-shrink-0 border-l-[3px] border-l-success border-t-0 border-r-0 border-b-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-body font-semibold">Contribution Received</p>
                <p className="text-caption text-muted-foreground">2h ago</p>
              </div>
              <p className="text-body-sm text-muted-foreground">
                Your monthly contribution has been processed successfully
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-[280px] flex-shrink-0 border-l-[3px] border-l-info border-t-0 border-r-0 border-b-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-body font-semibold">New Business Available</p>
                <p className="text-caption text-muted-foreground">1d ago</p>
              </div>
              <p className="text-body-sm text-muted-foreground">
                Check out the new investment opportunities in your area
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-[280px] flex-shrink-0 border-l-[3px] border-l-warning border-t-0 border-r-0 border-b-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-body font-semibold">Vote Required</p>
                <p className="text-caption text-muted-foreground">2d ago</p>
              </div>
              <p className="text-body-sm text-muted-foreground">
                New investment proposal waiting for your vote
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Your Groups */}
      <div>
        <h2 className="text-heading-2 font-semibold mb-4">Your Groups</h2>
        {groups.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <Users className="h-16 w-16 text-muted-foreground" />
                <div>
                  <p className="text-heading-3 font-semibold text-foreground mb-2">No groups yet</p>
                  <p className="text-body text-muted-foreground max-w-xs mx-auto mb-6">
                    Create your first group to start saving and investing with your community
                  </p>
                </div>
                <Button asChild size="lg">
                  <Link href="/groups/create">Create Your First Group</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 scrollbar-hide">
              {groups.map((group) => (
                <Card key={group.id} className="min-w-[300px] flex-shrink-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-body-lg font-semibold">{group.name}</CardTitle>
                      <Badge variant={group.role === 'Admin' ? 'default' : 'secondary'}>
                        {group.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-body-sm text-muted-foreground mb-1">Pool Balance</p>
                      <p className="text-number-md text-foreground font-mono">
                        ${(group.poolBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{typeof group.members === 'number' ? group.members : group.memberCount || 0} members</span>
                    </div>
                    <Button asChild variant="secondary" className="w-full" size="sm">
                      <Link href={`/groups/${group.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/groups/create"
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full shadow-[0_8px_16px_rgba(0,61,165,0.24)] hover:shadow-[0_12px_24px_rgba(0,61,165,0.32)] flex items-center justify-center transition-premium tap-feedback"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
