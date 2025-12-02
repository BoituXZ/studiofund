"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Loader2,
  X,
} from "lucide-react";
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

export default function BusinessDocumentsPage() {
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
        description: error.message || "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const documents = [
    {
      name: "Registration Document",
      field: "registrationDoc",
      value: business?.registrationDoc,
      required: true,
      description: "Business registration certificate or license",
    },
    {
      name: "ID Document",
      field: "idDocument",
      value: business?.idDocument,
      required: true,
      description: "Owner's national ID or passport",
    },
    {
      name: "Proof of Address",
      field: "proofOfAddress",
      value: business?.proofOfAddress,
      required: true,
      description: "Utility bill or bank statement showing business address",
    },
  ];

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
        <p className="text-muted-foreground">Failed to load documents</p>
      </div>
    );
  }

  const uploadedCount = documents.filter((doc) => doc.value).length;
  const requiredCount = documents.filter((doc) => doc.required).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Business Documents</h1>
        <p className="text-muted-foreground">Manage your business verification documents</p>
      </div>

      {/* Upload Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Progress</CardTitle>
          <CardDescription>
            {uploadedCount} of {requiredCount} required documents uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${(uploadedCount / requiredCount) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.field}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {doc.value ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </div>
                </div>
                {doc.required && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Required
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {doc.value ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={doc.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Replace
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    No document uploaded
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Documents must be in PDF, JPG, or PNG format</li>
            <li>• Maximum file size: 5MB per document</li>
            <li>• Documents must be clear and legible</li>
            <li>• All required documents must be uploaded for verification</li>
            <li>• Documents are securely stored and encrypted</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

