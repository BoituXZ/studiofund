"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

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
import { createGroupSchema, type CreateGroupFormData } from "@/lib/validations/groups";
import { groupsApi } from "@/lib/api/groups";
import { useToast } from "@/hooks/use-toast";

export default function CreateGroupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      minimumMembers: 5,
      maximumMembers: 50,
      contributionDay: 1,
    },
  });

  const contributionFrequency = watch("contributionFrequency");

  const onSubmit = async (data: CreateGroupFormData) => {
    try {
      // Map contribution frequency to monthly contribution
      // For now, we'll use monthlyContribution directly
      // If frequency is weekly, multiply by 4; bi-weekly by 2; quarterly divide by 3
      let monthlyContribution = data.monthlyContribution;
      
      // Note: The backend expects monthlyContribution, so we'll use the amount as monthly
      // If you want to support different frequencies, you'd need to adjust the calculation
      
      const groupData = {
        name: data.name,
        description: data.description || undefined,
        monthlyContribution: monthlyContribution,
        minimumMembers: data.minimumMembers,
        maximumMembers: data.maximumMembers,
        contributionDay: data.contributionDay,
      };

      const newGroup = await groupsApi.create(groupData);
      
      toast({
        title: "Success",
        description: "Group created successfully!",
      });
      
      // Redirect to the new group's detail page
      router.push(`/groups/${newGroup.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/groups" className="text-primary hover:text-primary/80 font-medium">
          Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-headline">Create a Group</h1>
          <p className="text-muted-foreground">Start a new savings group with your community</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Group Details</CardTitle>
          <CardDescription>
            Fill in the information about your new savings group.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Mbare Vendors United"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Tell us about your group's purpose..."
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution Amount ($) *</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="20.00"
                  {...register("monthlyContribution", { valueAsNumber: true })}
                  className={errors.monthlyContribution ? "border-destructive" : ""}
                />
                {errors.monthlyContribution && (
                  <p className="text-sm text-destructive">{errors.monthlyContribution.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contributionDay">Contribution Day (1-28) *</Label>
                <Input
                  id="contributionDay"
                  type="number"
                  min="1"
                  max="28"
                  placeholder="1"
                  {...register("contributionDay", { valueAsNumber: true })}
                  className={errors.contributionDay ? "border-destructive" : ""}
                />
                {errors.contributionDay && (
                  <p className="text-sm text-destructive">{errors.contributionDay.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimumMembers">Minimum Members</Label>
                <Input
                  id="minimumMembers"
                  type="number"
                  min="2"
                  placeholder="5"
                  {...register("minimumMembers", { valueAsNumber: true })}
                  className={errors.minimumMembers ? "border-destructive" : ""}
                />
                {errors.minimumMembers && (
                  <p className="text-sm text-destructive">{errors.minimumMembers.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maximumMembers">Maximum Members</Label>
                <Input
                  id="maximumMembers"
                  type="number"
                  min="2"
                  placeholder="50"
                  {...register("maximumMembers", { valueAsNumber: true })}
                  className={errors.maximumMembers ? "border-destructive" : ""}
                />
                {errors.maximumMembers && (
                  <p className="text-sm text-destructive">{errors.maximumMembers.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/groups">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

