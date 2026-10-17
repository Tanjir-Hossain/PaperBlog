"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { registerAccount } from "@/lib/api/auth";
import { validateRegister } from "@/lib/validators";
import { useNotify } from "@/providers/NotificationProvider";

export default function RegisterPage() {
    const notify = useNotify();
    const router = useRouter();

    const [values, setValues] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
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
        const found = validateRegister(values);
        setErrors(found);
        if (Object.keys(found).length) return;

        setSubmitting(true);
        try {
            await registerAccount({
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
                password: values.password
            });
            notify.success("Account created. Please log in.");
            router.replace("/login");
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Join PaperBlog to start writing and sharing blogs.</p>

            {formError && (
                <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                    {formError}
                </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                        id="firstname"
                        label="First Name"
                        required
                        placeholder="John"
                        value={values.firstname}
                        onChange={update("firstname")}
                        error={errors.firstname}
                    />
                    <TextField
                        id="lastname"
                        label="Last Name"
                        required
                        placeholder="Doe"
                        value={values.lastname}
                        onChange={update("lastname")}
                        error={errors.lastname}
                    />
                </div>
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
                <TextField
                    id="password"
                    type="password"
                    label="Password"
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
                    placeholder="Re-enter your password"
                    value={values.confirmPassword}
                    onChange={update("confirmPassword")}
                    error={errors.confirmPassword}
                />

                <Button type="submit" className="w-full" loading={submitting} loadingText="Creating account…">
                    Register
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                    Login
                </Link>
            </p>
        </div>
    );
}
