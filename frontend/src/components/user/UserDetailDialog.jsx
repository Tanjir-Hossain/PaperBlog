"use client";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { formatDate, fullName } from "@/lib/format";

/** Read-only modal showing the full detail of a single user (GET /users/:id). */
export default function UserDetailDialog({ open, user, loading, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <div
                role="dialog"
                aria-modal="true"
                aria-label="User details"
                className="relative w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-2xl"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-md p-1 text-slate-400 transition hover:bg-slate-100"
                    aria-label="Close"
                >
                    ✕
                </button>

                {loading || !user ? (
                    <div className="flex h-40 items-center justify-center text-brand-600">
                        <Spinner className="h-7 w-7" label="Loading user…" />
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col items-center text-center">
                            <Avatar user={user} size="xl" />
                            <h2 className="mt-3 text-xl font-bold text-slate-900">{fullName(user)}</h2>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            <div className="mt-3 flex gap-2">
                                <Badge tone={user.role === "admin" ? "amber" : "slate"}>{user.role}</Badge>
                                <Badge tone={user.isActive ? "green" : "red"}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>

                        <dl className="mt-6 divide-y divide-slate-100 text-sm">
                            <div className="flex justify-between py-2.5">
                                <dt className="text-slate-500">User ID</dt>
                                <dd className="font-medium text-slate-800">#{user.id}</dd>
                            </div>
                            <div className="flex justify-between py-2.5">
                                <dt className="text-slate-500">Joined</dt>
                                <dd className="font-medium text-slate-800">{formatDate(user.createAt) || "—"}</dd>
                            </div>
                            <div className="flex justify-between py-2.5">
                                <dt className="text-slate-500">Last updated</dt>
                                <dd className="font-medium text-slate-800">{formatDate(user.updateAt) || "—"}</dd>
                            </div>
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
}
