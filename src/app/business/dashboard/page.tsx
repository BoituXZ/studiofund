"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { businessApi, type Business, type BusinessStats } from "@/lib/api/business";
import { useToast } from "@/hooks/use-toast";

export default function BusinessDashboard() {
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [businessData, statsData] = await Promise.all([
        businessApi.getMyBusiness(),
        businessApi.getMyBusinessStats(),
      ]);
      setBusiness(businessData);
      setStats(statsData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Business["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING_VERIFICATION: "outline",
      VERIFIED: "default",
      ACTIVE: "default",
      SUSPENDED: "destructive",
      BLACKLISTED: "destructive",
    };
    return variants[status] || "outline";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business || !stats) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  const fundingProgress = stats.fundingProgress || 0;
  const capitalRaised = Number(stats.totalCapitalRaised);
  const capitalNeeded = Number(stats.capitalNeeded);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">{business.name}</h1>
          <p className="text-muted-foreground">Business Dashboard</p>
        </div>
        <Badge variant={getStatusBadge(business.status)} className="text-sm">
          {business.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Capital Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${capitalRaised.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              of ${capitalNeeded.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInvestments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedInvestments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Returns Paid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(stats.totalReturnsPaid).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              ${Number(stats.outstandingReturns).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Funding Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fundingProgress.toFixed(1)}%</div>
            <Progress value={fundingProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Funding Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Funding Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Capital Raised</span>
              <span className="font-medium">
                ${capitalRaised.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${capitalNeeded.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <Progress value={fundingProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{fundingProgress.toFixed(1)}% funded</span>
              <span>
                ${(capitalNeeded - capitalRaised).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:bg-secondary transition-colors">
          <Link href="/business/profile" className="block">
            <CardHeader>
              <CardTitle className="text-lg">Update Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Update your business information and details
              </p>
              <Button variant="outline" className="w-full">
                Edit Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-secondary transition-colors">
          <Link href="/business/investments" className="block">
            <CardHeader>
              <CardTitle className="text-lg">View Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage and track all investments received
              </p>
              <Button variant="outline" className="w-full">
                View Investments <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-secondary transition-colors">
          <Link href="/business/verification" className="block">
            <CardHeader>
              <CardTitle className="text-lg">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check your business verification status
              </p>
              <Button variant="outline" className="w-full">
                View Status <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Verification Alert */}
      {business.status === 'PENDING_VERIFICATION' && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-900 dark:text-yellow-100">
                Verification Pending
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
              Your business is pending verification. Please ensure all required documents are uploaded.
            </p>
            <Button asChild variant="outline" className="border-yellow-600 text-yellow-900">
              <Link href="/business/verification">
                View Verification Status
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

