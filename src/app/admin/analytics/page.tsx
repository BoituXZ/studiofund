"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi, type PlatformStats } from "@/lib/api/admin";

export default function AdminAnalyticsPage() {
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
      console.error("Failed to load analytics:", error);
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
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Platform Analytics</h1>
        <p className="text-muted-foreground">Detailed insights and metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active ({stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Group Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeGroups} active ({stats.totalGroups > 0 ? ((stats.activeGroups / stats.totalGroups) * 100).toFixed(1) : 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Business Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingBusinesses} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Investments</span>
                <span className="text-2xl font-bold">{stats.totalInvestments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Investments</span>
                <span className="text-xl font-semibold">{stats.activeInvestments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="text-xl font-semibold">
                  {stats.totalInvestments > 0
                    ? ((stats.activeInvestments / stats.totalInvestments) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-2xl font-bold text-green-600">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Suspended Users</span>
                <span className="text-xl font-semibold text-red-600">{stats.suspendedUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <span className="text-xl font-semibold">{stats.totalUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Verified Businesses</span>
              <span className="text-xl font-semibold">{stats.verifiedBusinesses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending Verification</span>
              <span className="text-xl font-semibold text-yellow-600">{stats.pendingBusinesses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Businesses</span>
              <span className="text-xl font-semibold">{stats.totalBusinesses}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

