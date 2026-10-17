"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { changeMyPassword } from "@/lib/api/users";
import { validateNewPassword } from "@/lib/validators";
import { useNotify } from "@/providers/NotificationProvider";

export default function ChangePasswordPage() {
    const notify = useNotify();

    const [values, setValues] = useState({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const update = (field) => (e) => {
        setValues((v) => ({ ...v, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const found = validateNewPassword(values);
        setErrors(found);
        if (Object.keys(found).length) return;

        setSaving(true);
        try {
            await changeMyPassword(values.password);
            notify.success("Password updated successfully.");
            setValues({ password: "", confirmPassword: "" });
        } catch (err) {
            notify.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-xl">
            <h1 className="text-2xl font-bold text-slate-900">Change password</h1>
            <p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
                        label="Confirm New Password"
                        required
                        autoComplete="new-password"
                        placeholder="Re-enter your new password"
                        value={values.confirmPassword}
                        onChange={update("confirmPassword")}
                        error={errors.confirmPassword}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" loading={saving} loadingText="Updating…">
                            Change Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
