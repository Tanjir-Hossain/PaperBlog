"use client";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { fullName } from "@/lib/format";

/**
 * Admin user table with inline activate/deactivate and a "View" action.
 * `busyId` marks the row whose status request is in flight.
 */
export default function UserTable({ users, currentUserId, busyId, onView, onToggleStatus }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-5 py-3 font-semibold">User</th>
                        <th className="px-5 py-3 font-semibold">Email</th>
                        <th className="px-5 py-3 font-semibold">Role</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 text-right font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map((user) => {
                        const isSelf = user.id === currentUserId;
                        const busy = busyId === user.id;
                        return (
                            <tr key={user.id} className="transition hover:bg-slate-50/60">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <Avatar user={user} size="sm" />
                                        <span className="font-medium text-slate-800">{fullName(user)}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-slate-600">{user.email}</td>
                                <td className="px-5 py-3.5">
                                    <Badge tone={user.role === "admin" ? "amber" : "slate"}>{user.role}</Badge>
                                </td>
                                <td className="px-5 py-3.5">
                                    <Badge tone={user.isActive ? "green" : "red"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onView?.(user)}
                                            className="rounded-md px-2.5 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isSelf || busy}
                                            onClick={() => onToggleStatus?.(user)}
                                            title={isSelf ? "You cannot change your own status" : undefined}
                                            className={`inline-flex min-w-[6.5rem] items-center justify-center rounded-md px-2.5 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                user.isActive
                                                    ? "text-rose-600 hover:bg-rose-50"
                                                    : "text-emerald-600 hover:bg-emerald-50"
                                            }`}
                                        >
                                            {busy ? (
                                                <Spinner className="h-4 w-4" />
                                            ) : user.isActive ? (
                                                "Deactivate"
                                            ) : (
                                                "Activate"
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
