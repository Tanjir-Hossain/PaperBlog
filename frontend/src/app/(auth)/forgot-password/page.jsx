"use client";

import Link from "next/link";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { requestPasswordReset } from "@/lib/api/auth";
import { isEmail } from "@/lib/validators";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [devReset, setDevReset] = useState(null); // { resetUrl } in development

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isEmail(email)) {
            setError("Enter a valid email address.");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            const data = await requestPasswordReset(email);
            setDone(true);
            // Dev-only: backend returns the reset link when not in production.
            if (data?.resetUrl || data?.resetToken) setDevReset(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Forgot your password?</h1>
            <p className="mt-1 text-sm text-slate-500">
                Enter your email and we&apos;ll send a link to reset your password.
            </p>

            {done ? (
                <div className="mt-6 space-y-4">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        If an account exists for that email, a password reset link has been sent.
                    </div>

                    {devReset?.resetUrl && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            <p className="font-semibold">Development mode</p>
                            <p className="mt-1">Email delivery is disabled locally. Use this link to continue:</p>
                            <Link
                                href={new URL(devReset.resetUrl).pathname}
                                className="mt-2 inline-block break-all font-medium text-brand-700 underline"
                            >
                                Open reset link →
                            </Link>
                        </div>
                    )}

                    <Link href="/login" className="block text-center text-sm font-semibold text-brand-700">
                        Back to login
                    </Link>
                </div>
            ) : (
                <>
                    {error && (
                        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                            {error}
                        </div>
                    )}
                    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                        <TextField
                            id="email"
                            type="email"
                            label="Email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                        />
                        <Button type="submit" className="w-full" loading={submitting} loadingText="Sending…">
                            Send Reset Link
                        </Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-slate-500">
                        Remembered it?{" "}
                        <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                            Login
                        </Link>
                    </p>
                </>
            )}
        </div>
    );
}
