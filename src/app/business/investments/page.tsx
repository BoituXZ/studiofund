"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Loader2,
  Eye,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessApi, type Investment } from "@/lib/api/business";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function BusinessInvestmentsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all"
  );

  useEffect(() => {
    loadInvestments();
  }, [statusFilter]);

  const loadInvestments = async () => {
    try {
      setIsLoading(true);
      const status = statusFilter === "all" ? undefined : statusFilter;
      const data = await businessApi.getMyBusinessInvestments(status);
      setInvestments(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load investments",
        variant: "destructive",
      });
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

  const getStatusIcon = (status: Investment["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4" />;
      case "ACTIVE":
        return <Clock className="h-4 w-4" />;
      case "DEFAULTED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredInvestments = investments.filter((investment) =>
    investment.group?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    investment.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalInvested = investments.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );
  const totalExpected = investments.reduce(
    (sum, inv) => sum + Number(inv.expectedReturn),
    0
  );
  const totalActual = investments
    .filter((inv) => inv.actualReturn)
    .reduce((sum, inv) => sum + Number(inv.actualReturn || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Investments</h1>
        <p className="text-muted-foreground">Manage and track all investments received</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {investments.length} investment{investments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpected.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              ${totalActual.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {investments.filter((inv) => inv.status === "ACTIVE").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {investments.filter((inv) => inv.status === "COMPLETED").length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by group name or investment ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="DEFAULTED">Defaulted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Investments List */}
      <div className="grid gap-4">
        {filteredInvestments.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No investments found</p>
            </CardContent>
          </Card>
        ) : (
          filteredInvestments.map((investment) => (
            <Card key={investment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {investment.group?.name || "Unknown Group"}
                    </CardTitle>
                    <CardDescription>
                      Investment ID: {investment.id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadge(investment.status)} className="flex items-center gap-1">
                    {getStatusIcon(investment.status)}
                    {investment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Investment Amount</p>
                    <p className="text-xl font-bold">
                      ${Number(investment.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Return</p>
                    <p className="text-xl font-bold">
                      ${Number(investment.expectedReturn).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(investment.startDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Return Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(investment.expectedReturnDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                {investment.actualReturn && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Actual Return</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${Number(investment.actualReturn).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/business/investments/${investment.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  {investment.status === "ACTIVE" && (
                    <Button size="sm" asChild>
                      <Link href={`/business/investments/${investment.id}/record-return`}>
                        Record Return
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

