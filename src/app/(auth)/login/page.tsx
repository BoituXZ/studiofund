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
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 font-sans bg-cover bg-center relative"
      style={{ backgroundImage: "url('/afrimage.jpg')" }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Form Card */}
        <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="mb-0 flex justify-center">
            <div className="scale-200">
              <Logo variant="dark" hideText={true} />
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
            Sign In
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-900 font-semibold text-sm">Phone or Email</Label>
              <Input
                id="identifier"
                {...register("identifier")}
                placeholder="e.g., +263771234567"
                className={`h-12 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all ${errors.identifier ? "border-destructive focus:ring-destructive" : ""}`}
              />
              {errors.identifier && (
                <p className="text-sm text-destructive font-medium">{errors.identifier.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-900 font-semibold text-sm">Password</Label>
                <Link href="#" className="text-sm text-brand-blue hover:text-brand-blue/80 hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={`h-12 px-4 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all ${errors.password ? "border-destructive focus:ring-destructive" : ""}`}
              />
              {errors.password && (
                <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <p className="text-sm text-center text-gray-600 pt-4">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-blue font-semibold hover:text-brand-blue/80 hover:underline transition-colors">
                Create one now
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
