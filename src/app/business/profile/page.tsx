"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Loader2, Building2, MapPin, Phone, Mail, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { businessApi, type Business } from "@/lib/api/business";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function BusinessProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      setIsLoading(true);
      const data = await businessApi.getMyBusiness();
      setBusiness(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load business profile",
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

  if (!business) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Failed to load business profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Business Profile</h1>
          <p className="text-muted-foreground">View and manage your business information</p>
        </div>
        <Button asChild>
          <Link href="/business/profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Business Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {business.name}
            </CardTitle>
            <Badge variant={getStatusBadge(business.status)}>
              {business.status.replace("_", " ")}
            </Badge>
          </div>
          <CardDescription>{business.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Sector</p>
              <p className="text-lg">{business.sector}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {business.location}
              </p>
            </div>
            {business.address && (
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-lg">{business.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle>Owner Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Owner Name</p>
              <p className="text-lg">{business.ownerName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-lg flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {business.ownerPhone}
              </p>
            </div>
            {business.ownerEmail && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {business.ownerEmail}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Capital Needed
              </p>
              <p className="text-2xl font-bold">
                ${Number(business.capitalNeeded).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
              <p className="text-2xl font-bold">
                {(Number(business.interestRate) * 100).toFixed(2)}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Repayment Period
              </p>
              <p className="text-2xl font-bold">{business.repaymentPeriodDays} days</p>
            </div>
          </div>
          {business.riskScore && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
              <p className="text-lg font-semibold">{Number(business.riskScore).toFixed(1)}/10</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Business Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Business Age</p>
              <p className="text-lg">
                {business.businessAge ? `${business.businessAge} years` : "N/A"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Previous Loans</p>
              <p className="text-lg">{business.previousLoans}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Successful Repayments</p>
              <p className="text-lg">{business.successfulRepayments}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Information */}
      {business.verifiedAt && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Verified At</p>
              <p className="text-lg">
                {format(new Date(business.verifiedAt), "PPP")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Created Date */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="text-lg">
              {format(new Date(business.createdAt), "PPP")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

