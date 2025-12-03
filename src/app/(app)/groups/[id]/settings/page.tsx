"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
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
import { groupsApi, type Group } from "@/lib/api/groups";
import { useToast } from "@/hooks/use-toast";

const updateGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100).optional(),
  description: z.string().max(500).optional(),
  monthlyContribution: z.number().min(1).max(10000).optional(),
  contributionDay: z.number().int().min(1).max(28).optional(),
});

type UpdateGroupFormData = z.infer<typeof updateGroupSchema>;

interface GroupSettingsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function GroupSettingsPage({ params }: GroupSettingsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateGroupFormData>({
    resolver: zodResolver(updateGroupSchema),
  });

  useEffect(() => {
    loadGroup();
  }, [resolvedParams.id]);

  const loadGroup = async () => {
    try {
      setIsLoading(true);
      const groupData = await groupsApi.getById(resolvedParams.id);
      setGroup(groupData);
      
      // Reset form with group data
      reset({
        name: groupData.name,
        description: groupData.description || "",
        monthlyContribution: Number(groupData.monthlyContribution),
        contributionDay: groupData.contributionDay,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load group settings",
        variant: "destructive",
      });
      if (error.statusCode === 404 || error.statusCode === 403) {
        router.push("/groups");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UpdateGroupFormData) => {
    if (!group) return;

    try {
      setIsSaving(true);
      const updateData: any = {};
      
      if (data.name && data.name !== group.name) {
        updateData.name = data.name;
      }
      if (data.description !== undefined && data.description !== group.description) {
        updateData.description = data.description;
      }
      if (data.monthlyContribution && data.monthlyContribution !== Number(group.monthlyContribution)) {
        updateData.monthlyContribution = data.monthlyContribution;
      }
      if (data.contributionDay && data.contributionDay !== group.contributionDay) {
        updateData.contributionDay = data.contributionDay;
      }

      if (Object.keys(updateData).length === 0) {
        toast({
          title: "No changes",
          description: "No changes to save",
        });
        return;
      }

      await groupsApi.update(resolvedParams.id, updateData);
      
      toast({
        title: "Success",
        description: "Group settings updated successfully!",
      });
      
      // Reload group data
      await loadGroup();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update group settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Group not found</p>
        <Button asChild className="mt-4">
          <Link href="/groups">Back to Groups</Link>
        </Button>
      </div>
    );
  }

  if (group.role !== 'Admin') {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Only group admins can access settings</p>
        <Button asChild className="mt-4">
          <Link href={`/groups/${params.id}`}>Back to Group</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href={`/groups/${resolvedParams.id}`} className="text-primary hover:text-primary/80 font-medium">
          Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-headline">Group Settings</h1>
          <p className="text-muted-foreground">Manage your group's details and preferences</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Group Information</CardTitle>
          <CardDescription>
            Update your group's basic information
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
                <Label htmlFor="monthlyContribution">Monthly Contribution ($) *</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  step="0.01"
                  min="1"
                  {...register("monthlyContribution", { valueAsNumber: true })}
                  className={errors.monthlyContribution ? "border-destructive" : ""}
                />
                {errors.monthlyContribution && (
                  <p className="text-sm text-destructive">
                    {errors.monthlyContribution.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contributionDay">Contribution Day (1-28) *</Label>
                <Input
                  id="contributionDay"
                  type="number"
                  min="1"
                  max="28"
                  {...register("contributionDay", { valueAsNumber: true })}
                  className={errors.contributionDay ? "border-destructive" : ""}
                />
                {errors.contributionDay && (
                  <p className="text-sm text-destructive">
                    {errors.contributionDay.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Day of the month when contributions are due
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSaving || !isDirty}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/groups/${resolvedParams.id}`}>Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">
                {typeof group.members === 'number' ? group.members : group.memberCount || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pool Balance</p>
              <p className="text-2xl font-bold">
                ${(group.poolBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

