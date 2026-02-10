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
                description:
                    error.message ||
                    "An unexpected error occurred. Please try again.",
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
                <div className="bg-white backdrop-blur-sm rounded-2xl shadow-2xl p- sm:p-10 max-h-[90vh] overflow-y-auto">
                    {/* Logo */}
                    <div className="mb-0 flex justify-center">
                        <div className="scale-200">
                            <Logo variant="dark" hideText={true} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
                        Create Your Account
                    </h2>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="firstName"
                                    className="text-gray-900 font-semibold text-sm"
                                >
                                    First Name *
                                </Label>
                                <Input
                                    id="firstName"
                                    {...register("firstName")}
                                    placeholder="e.g., Tafadzwa"
                                    className={`h-11 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all ${
                                        errors.firstName
                                            ? "border-destructive focus:ring-destructive"
                                            : ""
                                    }`}
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-destructive font-medium">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="lastName"
                                    className="text-gray-900 font-semibold text-sm"
                                >
                                    Last Name *
                                </Label>
                                <Input
                                    id="lastName"
                                    {...register("lastName")}
                                    placeholder="e.g., Moyo"
                                    className={`h-11 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all ${
                                        errors.lastName
                                            ? "border-destructive focus:ring-destructive"
                                            : ""
                                    }`}
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-destructive font-medium">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="text-gray-900 font-semibold text-sm"
                            >
                                Phone Number *
                            </Label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-lg border-2 border-r-0 border-gray-300 bg-white text-sm text-gray-900 font-medium">
                                    {phonePrefix}
                                </span>
                                <Input
                                    id="phone"
                                    type="tel"
                                    {...register("phone")}
                                    placeholder="771234567"
                                    className={`rounded-l-none h-11 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all ${
                                        errors.phone
                                            ? "border-destructive focus:ring-destructive"
                                            : ""
                                    }`}
                                    maxLength={9}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-xs text-destructive font-medium">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-gray-900 font-semibold text-sm"
                            >
                                Email Address (Optional)
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="you@example.com"
                                className={`h-11 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all ${
                                    errors.email
                                        ? "border-destructive focus:ring-destructive"
                                        : ""
                                }`}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive font-medium">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-gray-900 font-semibold text-sm"
                            >
                                Password *
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                className={`h-11 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all ${
                                    errors.password
                                        ? "border-destructive focus:ring-destructive"
                                        : ""
                                }`}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive font-medium">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-gray-900 font-semibold text-sm"
                            >
                                Confirm Password *
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword")}
                                className={`h-11 rounded-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all ${
                                    errors.confirmPassword
                                        ? "border-destructive focus:ring-destructive"
                                        : ""
                                }`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive font-medium">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="flex items-start space-x-3 pt-2">
                            <Checkbox
                                id="terms"
                                checked={watch("terms")}
                                onCheckedChange={(checked) =>
                                    setValue("terms", checked === true)
                                }
                                className={`mt-1 ${
                                    errors.terms ? "border-destructive" : ""
                                }`}
                            />
                            <Label
                                htmlFor="terms"
                                className="text-sm font-normal text-gray-700 leading-relaxed"
                            >
                                I agree to the{" "}
                                <Link
                                    href="/terms"
                                    className="text-brand-blue font-semibold hover:underline transition-colors"
                                >
                                    Terms & Conditions
                                </Link>
                            </Label>
                        </div>
                        {errors.terms && (
                            <p className="text-xs text-destructive font-medium -mt-1">
                                {errors.terms.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating Account..."
                                : "Create Account"}
                        </Button>

                        <p className="text-sm text-center text-gray-600 pt-4">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-brand-blue font-semibold hover:text-brand-blue/80 hover:underline transition-colors"
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
