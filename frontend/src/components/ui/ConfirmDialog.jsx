"use client";

import { useEffect } from "react";

import Button from "./Button";

/**
 * Accessible confirmation modal. Rendered only when `open` is true. Used for
 * destructive actions such as deleting a blog or deactivating a user.
 */
export default function ConfirmDialog({
    open,
    title = "Are you sure?",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "danger",
    loading = false,
    onConfirm,
    onCancel
}) {
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === "Escape" && !loading && onCancel?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={() => !loading && onCancel?.()}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-2xl"
            >
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button variant={tone} onClick={onConfirm} loading={loading} loadingText="Working…">
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
