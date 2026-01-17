"use client";

import { useState } from "react";
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
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";
import { authService } from "@/features/auth/auth.service";
import { toast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: ForgotPasswordFormValues) {
        setIsLoading(true);
        setError(null);

        try {
            await authService.forgotPassword(values.email);
            setIsSubmitted(true);
            toast("Password reset link sent to your email!", "success");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to send reset email. Please try again.";
            setError(errorMessage);
            toast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-primary-200 shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-primary-900">
                    Forgot your password?
                </CardTitle>
                <CardDescription className="text-primary-600">
                    Enter your email and we&apos;ll send you a reset link
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
                            Check your email for a password reset link. If you don&apos;t see it, check your spam folder.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-800">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-primary-500" />
                                                <Input
                                                    placeholder="you@example.com"
                                                    type="email"
                                                    className="pl-10 focus:border-primary-500"
                                                    {...field}
                                                />
                                            </div>
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
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-primary-600">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary-700 hover:text-primary-800 hover:underline"
                    >
                        Back to login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}