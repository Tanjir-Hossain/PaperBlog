"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { validateLogin } from "@/lib/validators";
import { useAuth } from "@/providers/AuthProvider";
import { useNotify } from "@/providers/NotificationProvider";

export default function LoginPage() {
    const { login } = useAuth();
    const notify = useNotify();
    const router = useRouter();

    const [values, setValues] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const update = (field) => (e) => {
        setValues((v) => ({ ...v, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setFormError("");
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const found = validateLogin(values);
        setErrors(found);
        if (Object.keys(found).length) return;

        setSubmitting(true);
        try {
            await login(values);
            notify.success("Welcome back!");
            router.replace("/dashboard");
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Log in to manage your blogs and profile.</p>

            {formError && (
                <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                    {formError}
                </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <TextField
                    id="email"
                    type="email"
                    label="Email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={update("email")}
                    error={errors.email}
                />
                <div>
                    <TextField
                        id="password"
                        type="password"
                        label="Password"
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={values.password}
                        onChange={update("password")}
                        error={errors.password}
                    />
                    <div className="mt-1.5 text-right">
                        <Link href="/forgot-password" className="text-sm font-medium text-brand-700 hover:text-brand-800">
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <Button type="submit" className="w-full" loading={submitting} loadingText="Logging in…">
                    Login
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-brand-700 hover:text-brand-800">
                    Register
                </Link>
            </p>
        </div>
    );
}
