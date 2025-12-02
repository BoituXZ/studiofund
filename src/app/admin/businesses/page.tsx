"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminApi, type Business } from "@/lib/api/admin";
import { useToast } from "@/hooks/use-toast";

export default function AdminBusinessesPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all"
  );
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"verify" | "suspend" | "blacklist" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, [statusFilter]);

  const loadBusinesses = async () => {
    try {
      setIsLoading(true);
      const status = statusFilter === "all" ? undefined : statusFilter;
      const data = await adminApi.getBusinesses(status);
      setBusinesses(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load businesses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedBusiness || !actionType) return;

    try {
      setIsProcessing(true);
      if (actionType === "verify") {
        await adminApi.verifyBusiness(selectedBusiness.id);
        toast({
          title: "Success",
          description: "Business verified successfully",
        });
      } else if (actionType === "suspend") {
        await adminApi.updateBusinessStatus(selectedBusiness.id, "SUSPENDED");
        toast({
          title: "Success",
          description: "Business suspended successfully",
        });
      } else if (actionType === "blacklist") {
        await adminApi.updateBusinessStatus(selectedBusiness.id, "BLACKLISTED");
        toast({
          title: "Success",
          description: "Business blacklisted successfully",
        });
      }
      setIsActionDialogOpen(false);
      setSelectedBusiness(null);
      setActionType(null);
      loadBusinesses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to perform action",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const openActionDialog = (business: Business, action: "verify" | "suspend" | "blacklist") => {
    setSelectedBusiness(business);
    setActionType(action);
    setIsActionDialogOpen(true);
  };

  const getStatusBadge = (status: Business["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING_VERIFICATION: "outline",
      VERIFIED: "default",
      ACTIVE: "default",
      SUSPENDED: "secondary",
      BLACKLISTED: "destructive",
    };
    return variants[status] || "outline";
  };

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold font-headline">Business Management</h1>
        <p className="text-muted-foreground">Manage and verify businesses on the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
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
            <SelectItem value="PENDING_VERIFICATION">Pending</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="BLACKLISTED">Blacklisted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredBusinesses.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No businesses found</p>
            </CardContent>
          </Card>
        ) : (
          filteredBusinesses.map((business) => (
            <Card key={business.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{business.name}</CardTitle>
                    <CardDescription>{business.description}</CardDescription>
                  </div>
                  <Badge variant={getStatusBadge(business.status)}>
                    {business.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium">{business.ownerName}</p>
                    <p className="text-sm text-muted-foreground">{business.ownerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{business.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capital Needed</p>
                    <p className="font-medium">
                      ${Number(business.capitalNeeded).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className="font-medium">
                      {business.riskScore ? Number(business.riskScore).toFixed(1) : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {business.status === "PENDING_VERIFICATION" && (
                    <Button
                      size="sm"
                      onClick={() => openActionDialog(business, "verify")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  )}
                  {business.status !== "SUSPENDED" && business.status !== "BLACKLISTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openActionDialog(business, "suspend")}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  )}
                  {business.status !== "BLACKLISTED" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openActionDialog(business, "blacklist")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Blacklist
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "verify" && "Verify Business"}
              {actionType === "suspend" && "Suspend Business"}
              {actionType === "blacklist" && "Blacklist Business"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "verify" &&
                `Are you sure you want to verify "${selectedBusiness?.name}"? This will make it available for investments.`}
              {actionType === "suspend" &&
                `Are you sure you want to suspend "${selectedBusiness?.name}"? This will temporarily prevent it from receiving investments.`}
              {actionType === "blacklist" &&
                `Are you sure you want to blacklist "${selectedBusiness?.name}"? This action cannot be easily undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsActionDialogOpen(false);
                setSelectedBusiness(null);
                setActionType(null);
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "blacklist" ? "destructive" : "default"}
              onClick={handleAction}
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionType === "verify" && "Verify"}
              {actionType === "suspend" && "Suspend"}
              {actionType === "blacklist" && "Blacklist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

