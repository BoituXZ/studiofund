"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Upload,
  AlertCircle,
  Loader2,
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
import { businessApi, type Business } from "@/lib/api/business";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function BusinessVerificationPage() {
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
        description: error.message || "Failed to load verification status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Business["status"]) => {
    switch (status) {
      case "VERIFIED":
      case "ACTIVE":
        return <CheckCircle2 className="h-8 w-8 text-green-600" />;
      case "PENDING_VERIFICATION":
        return <Clock className="h-8 w-8 text-yellow-600" />;
      case "SUSPENDED":
      case "BLACKLISTED":
        return <XCircle className="h-8 w-8 text-red-600" />;
      default:
        return <AlertCircle className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusMessage = (status: Business["status"]) => {
    switch (status) {
      case "VERIFIED":
        return "Your business has been verified and is available for investments.";
      case "ACTIVE":
        return "Your business is active and receiving investments.";
      case "PENDING_VERIFICATION":
        return "Your business is pending verification. Please ensure all required documents are uploaded.";
      case "SUSPENDED":
        return "Your business has been suspended. Please contact support for more information.";
      case "BLACKLISTED":
        return "Your business has been blacklisted. Please contact support for more information.";
      default:
        return "Unknown status.";
    }
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
        <p className="text-muted-foreground">Failed to load verification status</p>
      </div>
    );
  }

  const documents = [
    {
      name: "Registration Document",
      field: "registrationDoc",
      value: business.registrationDoc,
      required: true,
    },
    {
      name: "ID Document",
      field: "idDocument",
      value: business.idDocument,
      required: true,
    },
    {
      name: "Proof of Address",
      field: "proofOfAddress",
      value: business.proofOfAddress,
      required: true,
    },
  ];

  const uploadedCount = documents.filter((doc) => doc.value).length;
  const requiredCount = documents.filter((doc) => doc.required).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Verification Status</h1>
        <p className="text-muted-foreground">Track your business verification progress</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {getStatusIcon(business.status)}
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {business.name}
                <Badge variant={business.status === "VERIFIED" || business.status === "ACTIVE" ? "default" : "outline"}>
                  {business.status.replace("_", " ")}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-2">
                {getStatusMessage(business.status)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {business.verifiedAt && (
          <CardContent>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Verified on</p>
              <p className="font-medium">
                {format(new Date(business.verifiedAt), "PPP")}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Documents Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            {uploadedCount} of {requiredCount} documents uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.field}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {doc.value ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    {doc.required && (
                      <p className="text-xs text-muted-foreground">Required</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.value ? (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.value} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Requirements */}
      {business.status === "PENDING_VERIFICATION" && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-900 dark:text-yellow-100">
                Verification Requirements
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
              <li>✓ All required documents must be uploaded</li>
              <li>✓ Business information must be complete and accurate</li>
              <li>✓ Documents must be clear and legible</li>
              <li>✓ Verification typically takes 2-5 business days</li>
            </ul>
            <Button variant="outline" className="mt-4 border-yellow-600 text-yellow-900" disabled>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {business.status === "VERIFIED" && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-900 dark:text-green-100">
                Verification Complete
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">
              Your business has been verified and is now available for investments. Groups can now invest in your business.
            </p>
            <Button variant="outline" className="border-green-600 text-green-900" asChild>
              <Link href="/business/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

