"use client";

import { useState } from "react";

import AvatarUploader from "@/components/user/AvatarUploader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { updateMyProfile } from "@/lib/api/users";
import { validateProfile } from "@/lib/validators";
import { useAuth } from "@/providers/AuthProvider";
import { useNotify } from "@/providers/NotificationProvider";

function Card({ title, description, children }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            <div className="mt-5">{children}</div>
        </section>
    );
}

export default function ProfilePage() {
    const { user, patchUser } = useAuth();
    const notify = useNotify();

    const [values, setValues] = useState({
        firstname: user?.firstname || "",
        lastname: user?.lastname || ""
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const update = (field) => (e) => {
        setValues((v) => ({ ...v, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const onSave = async (e) => {
        e.preventDefault();
        const found = validateProfile(values);
        setErrors(found);
        if (Object.keys(found).length) return;

        setSaving(true);
        try {
            const updated = await updateMyProfile(values);
            // Backend returns the updated user; fall back to local values.
            patchUser(updated || values);
            notify.success("Profile updated.");
        } catch (err) {
            notify.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
                <p className="mt-1 text-sm text-slate-500">Manage your personal information and avatar.</p>
            </div>

            <Card title="Profile image" description="Upload a JPG, PNG or WEBP image (max 2 MB).">
                <AvatarUploader />
            </Card>

            <Card title="Personal information" description="Your name is shown on your blogs and profile.">
                <form onSubmit={onSave} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            id="firstname"
                            label="First Name"
                            required
                            value={values.firstname}
                            onChange={update("firstname")}
                            error={errors.firstname}
                        />
                        <TextField
                            id="lastname"
                            label="Last Name"
                            required
                            value={values.lastname}
                            onChange={update("lastname")}
                            error={errors.lastname}
                        />
                    </div>

                    <TextField
                        id="email"
                        label="Email"
                        value={user?.email || ""}
                        readOnly
                        disabled
                        hint="Email cannot be changed."
                    />

                    <div>
                        <span className="mb-1.5 block text-sm font-medium text-slate-700">Role</span>
                        <Badge tone={user?.role === "admin" ? "amber" : "slate"}>{user?.role}</Badge>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" loading={saving} loadingText="Saving…">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
