"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { groupsApi } from "@/lib/api/groups";

const inviteMemberSchema = z.object({
  phone: z.string().min(1, "Phone number is required").refine(
    (val) => /^\+263\d{9}$/.test(val) || /^\d{9}$/.test(val),
    {
      message: "Phone number must be in format +263771234567 or 771234567",
    }
  ),
  role: z.enum(["MEMBER", "ADMIN"]).optional(),
});

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

interface InviteMemberDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InviteMemberDialog({
  groupId,
  open,
  onOpenChange,
  onSuccess,
}: InviteMemberDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      role: "MEMBER",
    },
  });

  const role = watch("role");

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      setIsSubmitting(true);
      // Format phone number
      let phoneNumber = data.phone;
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+263${phoneNumber}`;
      }

      await groupsApi.inviteMember(groupId, phoneNumber, data.role);
      
      toast({
        title: "Success",
        description: "Member invitation sent successfully!",
      });
      
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to invite member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a user to join this group by their phone number.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-secondary text-sm text-muted-foreground h-10">
                  +263
                </span>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="771234567"
                  className={`rounded-l-none ${errors.phone ? "border-destructive" : ""}`}
                  maxLength={9}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter 9 digits (e.g., 771234567)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setValue("role", value as "MEMBER" | "ADMIN")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

