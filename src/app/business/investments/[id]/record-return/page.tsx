"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, DollarSign } from "lucide-react";
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
import { businessApi, type Investment } from "@/lib/api/business";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface RecordReturnPageProps {
  params: Promise<{ id: string }>;
}

const recordReturnSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  notes: z.string().optional(),
  receiptUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type RecordReturnFormData = z.infer<typeof recordReturnSchema>;

export default function RecordReturnPage({ params }: RecordReturnPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params);
  const investmentId = resolvedParams.id;
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecordReturnFormData>({
    resolver: zodResolver(recordReturnSchema),
  });

  const amount = watch("amount");

  useEffect(() => {
    loadInvestment();
  }, [investmentId]);

  const loadInvestment = async () => {
    try {
      setIsLoading(true);
      const data = await businessApi.getInvestmentDetails(investmentId);
      setInvestment(data);
      
      // Calculate remaining return amount
      const returnsPaid = data.returns?.reduce(
        (sum, ret) => sum + Number(ret.amount),
        0
      ) || 0;
      const remaining = Number(data.expectedReturn) - returnsPaid;
      if (remaining > 0) {
        setValue("amount", remaining);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load investment details",
        variant: "destructive",
      });
      router.push("/business/investments");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RecordReturnFormData) => {
    if (!investment) return;

    try {
      // Validate amount doesn't exceed expected return
      const returnsPaid = investment.returns?.reduce(
        (sum, ret) => sum + Number(ret.amount),
        0
      ) || 0;
      const totalAfterReturn = returnsPaid + data.amount;
      const expectedReturn = Number(investment.expectedReturn);

      if (totalAfterReturn > expectedReturn) {
        toast({
          title: "Error",
          description: `Total returns cannot exceed expected return of $${expectedReturn.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          variant: "destructive",
        });
        return;
      }

      await businessApi.recordReturn(investmentId, {
        amount: data.amount,
        notes: data.notes || undefined,
        receiptUrl: data.receiptUrl || undefined,
      });

      toast({
        title: "Success",
        description: "Return recorded successfully",
      });
      router.push(`/business/investments/${investmentId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record return",
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

  if (!investment) {
    return null;
  }

  const returnsPaid = investment.returns?.reduce(
    (sum, ret) => sum + Number(ret.amount),
    0
  ) || 0;
  const expectedReturn = Number(investment.expectedReturn);
  const remaining = expectedReturn - returnsPaid;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/business/investments/${investmentId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline">Record Return</h1>
          <p className="text-muted-foreground">Record a return payment for this investment</p>
        </div>
      </div>

      {/* Investment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Investment Amount:</span>
            <span className="font-medium">
              ${Number(investment.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expected Return:</span>
            <span className="font-medium">
              ${expectedReturn.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Returns Paid:</span>
            <span className="font-medium">
              ${returnsPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Remaining:</span>
            <span className="font-bold">
              ${remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Return Details</CardTitle>
            <CardDescription>Enter the return payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Return Amount ($) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  className={`pl-10 ${errors.amount ? "border-destructive" : ""}`}
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum: ${remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Add any notes about this return payment..."
                {...register("notes")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptUrl">Receipt URL (Optional)</Label>
              <Input
                id="receiptUrl"
                type="url"
                placeholder="https://example.com/receipt.pdf"
                {...register("receiptUrl")}
                className={errors.receiptUrl ? "border-destructive" : ""}
              />
              {errors.receiptUrl && (
                <p className="text-sm text-destructive">{errors.receiptUrl.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Link to payment receipt or proof of payment
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Return
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/business/investments/${investmentId}`}>Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

