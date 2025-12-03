"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi, type PlatformStats } from "@/lib/api/admin";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Failed to load dashboard statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Platform Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform activity and statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active, {stats.suspendedUsers} suspended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeGroups} active groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingBusinesses} pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pool Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalPoolBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all groups
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvestments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeInvestments} active investments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verifiedBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              Available for investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/admin/businesses?status=PENDING_VERIFICATION"
              className="p-4 border rounded-lg hover:bg-secondary transition-colors"
            >
              <div>
                <p className="font-medium">Review Pending Businesses</p>
                <p className="text-sm text-muted-foreground">
                  {stats.pendingBusinesses} businesses waiting
                </p>
              </div>
            </Link>
            <Link
              href="/admin/users?status=SUSPENDED"
              className="p-4 border rounded-lg hover:bg-secondary transition-colors"
            >
              <div>
                <p className="font-medium">Manage Suspended Users</p>
                <p className="text-sm text-muted-foreground">
                  {stats.suspendedUsers} suspended users
                </p>
              </div>
            </Link>
            <Link
              href="/admin/groups"
              className="p-4 border rounded-lg hover:bg-secondary transition-colors"
            >
              <div>
                <p className="font-medium">View All Groups</p>
                <p className="text-sm text-muted-foreground">
                  {stats.totalGroups} total groups
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

