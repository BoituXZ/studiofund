"use client";

import { useState, useEffect } from "react";
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
import { contributionsApi } from "@/lib/api/contributions";

const contributeSchema = z.object({
  amount: z.number().min(0.01, "Amount must be at least $0.01"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
});

type ContributeFormData = z.infer<typeof contributeSchema>;

interface ContributeDialogProps {
  groupId: string;
  monthlyContribution: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ContributeDialog({
  groupId,
  monthlyContribution,
  open,
  onOpenChange,
  onSuccess,
}: ContributeDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContributeFormData>({
    resolver: zodResolver(contributeSchema),
    defaultValues: {
      amount: monthlyContribution,
      month: currentMonth,
      year: currentYear,
      paymentMethod: "EcoCash",
    },
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (open) {
      reset({
        amount: monthlyContribution,
        month: currentMonth,
        year: currentYear,
        paymentMethod: "EcoCash",
      });
    }
  }, [open, monthlyContribution, currentMonth, currentYear, reset]);

  const onSubmit = async (data: ContributeFormData) => {
    try {
      setIsSubmitting(true);
      await contributionsApi.create({
        groupId,
        amount: data.amount,
        month: data.month,
        year: data.year,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
      });

      toast({
        title: "Success",
        description: "Contribution submitted successfully! Waiting for admin confirmation.",
      });

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit contribution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make Contribution</DialogTitle>
          <DialogDescription>
            Submit your monthly contribution for this group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                {...register("amount", { valueAsNumber: true })}
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Expected: ${monthlyContribution.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <Select
                  value={watch("month")?.toString()}
                  onValueChange={(value) => setValue("month", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.month && (
                  <p className="text-sm text-destructive">{errors.month.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select
                  value={watch("year")?.toString()}
                  onValueChange={(value) => setValue("year", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year && (
                  <p className="text-sm text-destructive">{errors.year.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setValue("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EcoCash">EcoCash</SelectItem>
                  <SelectItem value="OneMoney">OneMoney</SelectItem>
                  <SelectItem value="Telecash">Telecash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentReference">Payment Reference</Label>
              <Input
                id="paymentReference"
                {...register("paymentReference")}
                placeholder="e.g., EC123456789"
                className={errors.paymentReference ? "border-destructive" : ""}
              />
              {errors.paymentReference && (
                <p className="text-sm text-destructive">
                  {errors.paymentReference.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Optional: Transaction reference number
              </p>
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
              Submit Contribution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

