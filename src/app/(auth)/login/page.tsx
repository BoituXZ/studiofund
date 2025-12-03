"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.identifier, data.password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
        variant: "default",
      });
      router.push("/home");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 font-sans">
      {/* Left Panel: Brand & Welcome Message */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 bg-brand-blue text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/placeholder-african-pattern.svg')" }}
        />
        <div className="z-10 text-center space-y-6">
          <Logo variant="light" />
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome Back to HiveFund
          </h1>
          <p className="text-lg text-blue-100 max-w-sm">
            The trusted platform for community savings and investments. Let's continue building a stronger future, together.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden mb-8 text-center">
            <Logo variant="dark" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Sign In
          </h2>
          <p className="text-gray-600 mb-8">
            Enter your details to access your account.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-700 font-medium">Phone or Email</Label>
              <Input
                id="identifier"
                {...register("identifier")}
                placeholder="e.g., +263771234567"
                className={`h-12 px-4 rounded-md bg-gray-50 border-gray-200 focus:ring-brand-blue focus:border-brand-blue ${errors.identifier ? "border-destructive" : ""}`}
              />
              {errors.identifier && (
                <p className="text-sm text-destructive">{errors.identifier.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-brand-blue hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={`h-12 px-4 rounded-md bg-gray-50 border-gray-200 focus:ring-brand-blue focus:border-brand-blue ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full shadow-sm transition-all transform hover:scale-105" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
            
            <p className="text-sm text-center text-gray-600 pt-4">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-blue hover:underline font-semibold">
                Create one now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
