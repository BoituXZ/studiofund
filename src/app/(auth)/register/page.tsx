"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false,
    },
  });

  const phonePrefix = "+263";

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const fullPhone = phonePrefix + data.phone.replace(/\D/g, "");
      
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: fullPhone,
        email: data.email || undefined,
        password: data.password,
        nationalId: undefined,
      });

      toast({
        title: "Account Created!",
        description: "Welcome to HiveFund. You can now log in.",
        variant: "default",
      });
      router.push("/login");

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 font-sans">
      {/* Left Panel: Brand & Welcome Message */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 bg-brand-red text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/placeholder-african-pattern.svg')" }}
        />
        <div className="z-10 text-center space-y-6">
          <Logo variant="light" />
          <h1 className="text-4xl font-bold tracking-tight">
            Join HiveFund Today
          </h1>
          <p className="text-lg text-red-100 max-w-sm">
            Start your journey towards financial empowerment with community-driven savings and investments.
          </p>
        </div>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="w-full flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden mb-8 text-center">
            <Logo variant="dark" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 mb-8">
            Let's get you set up in just a few steps.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" {...register("firstName")} placeholder="e.g., Tafadzwa" className={errors.firstName ? "border-destructive" : ""} />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" {...register("lastName")} placeholder="e.g., Moyo" className={errors.lastName ? "border-destructive" : ""} />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-sm text-gray-500">{phonePrefix}</span>
                <Input id="phone" type="tel" {...register("phone")} placeholder="771234567" className={`rounded-l-none ${errors.phone ? "border-destructive" : ""}`} maxLength={9} />
              </div>
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input id="email" type="email" {...register("email")} placeholder="you@example.com" className={errors.email ? "border-destructive" : ""} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" {...register("password")} className={errors.password ? "border-destructive" : ""} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} className={errors.confirmPassword ? "border-destructive" : ""} />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox id="terms" checked={watch("terms")} onCheckedChange={(checked) => setValue("terms", checked === true)} className={`mt-0.5 ${errors.terms ? "border-destructive" : ""}`} />
              <Label htmlFor="terms" className="text-sm font-normal text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="underline text-brand-blue">
                  Terms & Conditions
                </Link>
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-destructive -mt-2">{errors.terms.message}</p>}

            <Button type="submit" className="w-full h-12 text-base font-semibold bg-brand-red hover:bg-brand-red-hover text-white rounded-full shadow-sm transition-all" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            
            <p className="text-sm text-center text-gray-600 pt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-blue hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
