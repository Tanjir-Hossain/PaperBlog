"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { resetPassword } from "@/lib/api/auth";
import { validateNewPassword } from "@/lib/validators";
import { useNotify } from "@/providers/NotificationProvider";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const router = useRouter();
    const notify = useNotify();

    const [values, setValues] = useState({ password: "", confirmPassword: "" });
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
        const found = validateNewPassword(values);
        setErrors(found);
        if (Object.keys(found).length) return;

        setSubmitting(true);
        try {
            await resetPassword(token, values.password);
            notify.success("Password successfully changed.");
            router.replace("/login");
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Set a new password</h1>
            <p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>

            {formError && (
                <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                    {formError}
                </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <TextField
                    id="password"
                    type="password"
                    label="New Password"
                    required
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={values.password}
                    onChange={update("password")}
                    error={errors.password}
                />
                <TextField
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    required
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    value={values.confirmPassword}
                    onChange={update("confirmPassword")}
                    error={errors.confirmPassword}
                />
                <Button type="submit" className="w-full" loading={submitting} loadingText="Resetting…">
                    Reset Password
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                    Back to login
                </Link>
            </p>
        </div>
    );
}
