"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessApi, type Business } from "@/lib/api/business";
import { useToast } from "@/hooks/use-toast";

const updateBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerPhone: z.string().min(1, "Owner phone is required"),
  ownerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  capitalNeeded: z.coerce.number().min(100, "Capital needed must be at least $100"),
  repaymentPeriodDays: z.coerce.number().min(7).max(365),
  interestRate: z.coerce.number().min(0.01).max(0.50),
});

type UpdateBusinessFormData = z.infer<typeof updateBusinessSchema>;

export default function EditBusinessProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateBusinessFormData>({
    resolver: zodResolver(updateBusinessSchema),
  });

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      setIsLoading(true);
      const data = await businessApi.getMyBusiness();
      setBusiness(data);
      reset({
        name: data.name,
        description: data.description,
        location: data.location,
        address: data.address || "",
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone,
        ownerEmail: data.ownerEmail || "",
        capitalNeeded: Number(data.capitalNeeded),
        repaymentPeriodDays: data.repaymentPeriodDays,
        interestRate: Number(data.interestRate),
      });
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

  const onSubmit = async (data: UpdateBusinessFormData) => {
    try {
      await businessApi.updateMyBusiness(data);
      toast({
        title: "Success",
        description: "Business profile updated successfully",
      });
      router.push("/business/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update business profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/business/profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline">Edit Business Profile</h1>
          <p className="text-muted-foreground">Update your business information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register("location")}
                className={errors.location ? "border-destructive" : ""}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                {...register("ownerName")}
                className={errors.ownerName ? "border-destructive" : ""}
              />
              {errors.ownerName && (
                <p className="text-sm text-destructive">{errors.ownerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Owner Phone *</Label>
              <Input
                id="ownerPhone"
                {...register("ownerPhone")}
                className={errors.ownerPhone ? "border-destructive" : ""}
              />
              {errors.ownerPhone && (
                <p className="text-sm text-destructive">{errors.ownerPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input
                id="ownerEmail"
                type="email"
                {...register("ownerEmail")}
                className={errors.ownerEmail ? "border-destructive" : ""}
              />
              {errors.ownerEmail && (
                <p className="text-sm text-destructive">{errors.ownerEmail.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capitalNeeded">Capital Needed ($) *</Label>
              <Input
                id="capitalNeeded"
                type="number"
                step="0.01"
                {...register("capitalNeeded", { valueAsNumber: true })}
                className={errors.capitalNeeded ? "border-destructive" : ""}
              />
              {errors.capitalNeeded && (
                <p className="text-sm text-destructive">{errors.capitalNeeded.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="repaymentPeriodDays">Repayment Period (Days) *</Label>
                <Input
                  id="repaymentPeriodDays"
                  type="number"
                  min="7"
                  max="365"
                  {...register("repaymentPeriodDays", { valueAsNumber: true })}
                  className={errors.repaymentPeriodDays ? "border-destructive" : ""}
                />
                {errors.repaymentPeriodDays && (
                  <p className="text-sm text-destructive">{errors.repaymentPeriodDays.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate *</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="0.50"
                  {...register("interestRate", { valueAsNumber: true })}
                  className={errors.interestRate ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Enter as decimal (e.g., 0.15 for 15%)
                </p>
                {errors.interestRate && (
                  <p className="text-sm text-destructive">{errors.interestRate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting || !isDirty}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/business/profile">Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

