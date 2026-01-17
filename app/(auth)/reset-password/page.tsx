"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { authService } from "@/features/auth/auth.service";
import { toast } from "@/hooks/use-toast";

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            router.push("/forgot-password");
        } else {
            setToken(tokenParam);
        }
    }, [searchParams, router]);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: ResetPasswordFormValues) {
        if (!token) {
            const errorMessage = "Invalid or missing reset token";
            setError(errorMessage);
            toast(errorMessage, "error");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authService.resetPassword(token, values.password);
            setIsSubmitted(true);
            toast("Password reset successfully! You can now log in with your new password.", "success");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
            setError(errorMessage);
            toast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    }

    if (!token) {
        return (
            <Card className="border-primary-200 shadow-lg">
                <CardContent className="pt-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Invalid or missing reset token. Please request a new password reset link.
                        </AlertDescription>
                    </Alert>
                    <div className="mt-4 text-center">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary-700 hover:text-primary-800 hover:underline"
                        >
                            Request new reset link
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary-200 shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-primary-900">
                    Reset your password
                </CardTitle>
                <CardDescription className="text-primary-600">
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isSubmitted ? (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                            Your password has been reset successfully. You can now log in with your new password.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-800">New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="••••••••"
                                                type="password"
                                                className="focus:border-primary-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-800">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="••••••••"
                                                type="password"
                                                className="focus:border-primary-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-primary-600">
                    {isSubmitted ? (
                        <Link
                            href="/login"
                            className="font-semibold text-primary-700 hover:text-primary-800 hover:underline"
                        >
                            Back to login
                        </Link>
                    ) : (
                        <>
                            Remember your password?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-primary-700 hover:text-primary-800 hover:underline"
                            >
                                Back to login
                            </Link>
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}