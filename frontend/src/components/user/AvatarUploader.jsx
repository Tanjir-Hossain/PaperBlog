"use client";

import { useRef, useState } from "react";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { uploadMyAvatar } from "@/lib/api/users";
import { avatarUrl } from "@/lib/format";
import { validateAvatar } from "@/lib/validators";
import { useAuth } from "@/providers/AuthProvider";
import { useNotify } from "@/providers/NotificationProvider";

/**
 * Avatar picker + uploader. Shows the current avatar (or a live preview of a
 * newly chosen file), validates type/size client-side, then PATCHes the image.
 * On success it updates the cached user so the navbar avatar changes instantly.
 */
export default function AvatarUploader() {
    const { user, patchUser } = useAuth();
    const notify = useNotify();
    const inputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);

    const onPick = (e) => {
        const chosen = e.target.files?.[0];
        setError("");
        if (!chosen) return;

        const problem = validateAvatar(chosen);
        if (problem) {
            setError(problem);
            setFile(null);
            setPreview(null);
            return;
        }
        setFile(chosen);
        setPreview(URL.createObjectURL(chosen));
    };

    const onUpload = async () => {
        if (!file) {
            setError("Please choose an image first.");
            return;
        }
        setUploading(true);
        try {
            const data = await uploadMyAvatar(file); // { id, profileImage }
            patchUser({ profileImage: data.profileImage });
            notify.success("Profile image updated.");
            setFile(null);
            setPreview(null);
            if (inputRef.current) inputRef.current.value = "";
        } catch (err) {
            notify.error(err.message);
        } finally {
            setUploading(false);
        }
    };

    const shownSrc = preview || avatarUrl(user?.profileImage);

    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            {shownSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={shownSrc}
                    alt="Current avatar"
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-50"
                />
            ) : (
                <Avatar user={user} size="xl" className="ring-4 ring-brand-50" />
            )}

            <div className="flex-1 text-center sm:text-left">
                <input
                    ref={inputRef}
                    id="avatar"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={onPick}
                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                />
                <p className="mt-1.5 text-xs text-slate-500">JPG, PNG or WEBP · up to 2 MB.</p>
                {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}

                <div className="mt-3">
                    <Button size="sm" onClick={onUpload} loading={uploading} loadingText="Uploading…" disabled={!file}>
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    );
}
