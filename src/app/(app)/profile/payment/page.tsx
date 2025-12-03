"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface PaymentMethod {
  id: string;
  type: "mobile_money" | "bank_account" | "card";
  name: string;
  details: string;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "mobile_money",
      name: "EcoCash",
      details: "0771 234 567",
      isDefault: true,
    },
    {
      id: "2",
      type: "mobile_money",
      name: "OneMoney",
      details: "0772 345 678",
      isDefault: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    accountNumber: "",
    accountName: "",
  });

  const handleAddMethod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Integrate with API
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: formData.type as PaymentMethod["type"],
      name: formData.name,
      details: formData.accountNumber,
      isDefault: paymentMethods.length === 0,
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPaymentMethods([...paymentMethods, newMethod]);
    setFormData({ type: "", name: "", accountNumber: "", accountName: "" });
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    // TODO: Integrate with API
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  const handleSetDefault = async (id: string) => {
    // TODO: Integrate with API
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "mobile_money":
        return "Mobile Money";
      case "bank_account":
        return "Bank Account";
      case "card":
        return "Card";
      default:
        return "Payment";
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/profile" className="text-primary hover:text-primary/80 font-medium">
          Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-headline">Payment Methods</h1>
          <p className="text-muted-foreground">Manage your payment methods</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Payment Methods</CardTitle>
              <CardDescription>
                Add or remove payment methods for contributions and withdrawals
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  Add Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new payment method to your account
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMethod}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Payment Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                          <SelectItem value="bank_account">Bank Account</SelectItem>
                          <SelectItem value="card">Debit/Credit Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.type === "mobile_money" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Provider *</Label>
                          <Select
                            value={formData.name}
                            onValueChange={(value) =>
                              setFormData({ ...formData, name: value })
                            }
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EcoCash">EcoCash</SelectItem>
                              <SelectItem value="OneMoney">OneMoney</SelectItem>
                              <SelectItem value="Telecash">Telecash</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Phone Number *</Label>
                          <Input
                            id="accountNumber"
                            value={formData.accountNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountNumber: e.target.value,
                              })
                            }
                            placeholder="0771 234 567"
                            required
                          />
                        </div>
                      </>
                    )}

                    {formData.type === "bank_account" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Bank Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="e.g., CBZ Bank"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number *</Label>
                          <Input
                            id="accountNumber"
                            value={formData.accountNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountNumber: e.target.value,
                              })
                            }
                            placeholder="1234567890"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountName">Account Name *</Label>
                          <Input
                            id="accountName"
                            value={formData.accountName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountName: e.target.value,
                              })
                            }
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </>
                    )}

                    {formData.type === "card" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Card Number *</Label>
                          <Input
                            id="accountNumber"
                            value={formData.accountNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountNumber: e.target.value,
                              })
                            }
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              maxLength={3}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Method"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No payment methods added yet.</p>
              <p className="text-sm mt-2">Add your first payment method to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.name}</p>
                        {method.isDefault && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{getMethodIcon(method.type)} - {method.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

