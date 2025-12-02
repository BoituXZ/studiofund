"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { businessApi, type Investment, type InvestmentReturn } from "@/lib/api/business";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface InvestmentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function InvestmentDetailsPage({ params }: InvestmentDetailsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params);
  const investmentId = resolvedParams.id;
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvestment();
  }, [investmentId]);

  const loadInvestment = async () => {
    try {
      setIsLoading(true);
      const data = await businessApi.getInvestmentDetails(investmentId);
      setInvestment(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load investment details",
        variant: "destructive",
      });
      if (error.statusCode === 404) {
        router.push("/business/investments");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Investment["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING: "outline",
      ACTIVE: "default",
      COMPLETED: "secondary",
      DEFAULTED: "destructive",
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

  if (!investment) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Investment not found</p>
        <Button asChild className="mt-4">
          <Link href="/business/investments">Back to Investments</Link>
        </Button>
      </div>
    );
  }

  const investmentAmount = Number(investment.amount);
  const expectedReturn = Number(investment.expectedReturn);
  const actualReturn = investment.actualReturn ? Number(investment.actualReturn) : 0;
  const returnsPaid = investment.returns?.reduce(
    (sum, ret) => sum + Number(ret.amount),
    0
  ) || 0;
  const outstandingReturn = expectedReturn - returnsPaid;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/business/investments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-headline">Investment Details</h1>
          <p className="text-muted-foreground">
            {investment.group?.name || "Investment"} - {investment.id.slice(0, 8)}...
          </p>
        </div>
        <Badge variant={getStatusBadge(investment.status)}>
          {investment.status}
        </Badge>
      </div>

      {/* Investment Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investment Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${investmentAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expected Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expectedReturn.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {investment.roi && (
              <p className="text-xs text-muted-foreground mt-1">
                ROI: {(investment.roi * 100).toFixed(2)}%
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Returns Paid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${returnsPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {outstandingReturn > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                ${outstandingReturn.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} outstanding
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="returns">Return History</TabsTrigger>
          <TabsTrigger value="group">Investor Group</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Investment ID</p>
                  <p className="font-mono text-sm">{investment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadge(investment.status)}>
                    {investment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </p>
                  <p className="font-medium">
                    {format(new Date(investment.startDate), "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expected Return Date
                  </p>
                  <p className="font-medium">
                    {format(new Date(investment.expectedReturnDate), "PPP")}
                  </p>
                </div>
                {investment.actualReturnDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Actual Return Date
                    </p>
                    <p className="font-medium">
                      {format(new Date(investment.actualReturnDate), "PPP")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profit Distributed</p>
                  <Badge variant={investment.profitDistributed ? "default" : "outline"}>
                    {investment.profitDistributed ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {investment.status === "ACTIVE" && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/business/investments/${investment.id}/record-return`}>
                    Record Return
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Return History</CardTitle>
              <CardDescription>
                All returns recorded for this investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {investment.returns && investment.returns.length > 0 ? (
                <div className="space-y-4">
                  {investment.returns.map((returnRecord) => (
                    <div
                      key={returnRecord.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          ${Number(returnRecord.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(returnRecord.returnDate), "PPP")}
                        </p>
                        {returnRecord.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {returnRecord.notes}
                          </p>
                        )}
                      </div>
                      {returnRecord.receiptUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={returnRecord.receiptUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Receipt
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No returns recorded yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="group" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Investor Group
              </CardTitle>
            </CardHeader>
            <CardContent>
              {investment.group ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Group Name</p>
                  <p className="text-lg font-semibold">{investment.group.name}</p>
                  <Button variant="outline" size="sm" asChild className="mt-4">
                    <Link href={`/groups/${investment.groupId}`}>
                      View Group Details
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Group information not available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

