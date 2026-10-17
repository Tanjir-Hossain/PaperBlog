"use client";

import { useCallback, useEffect, useState } from "react";

import UserDetailDialog from "@/components/user/UserDetailDialog";
import UserTable from "@/components/user/UserTable";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { getUser, listUsers, setUserStatus } from "@/lib/api/users";
import { useAuth } from "@/providers/AuthProvider";
import { useNotify } from "@/providers/NotificationProvider";

export default function AdminUsersPage() {
    const { user: me } = useAuth();
    const notify = useNotify();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailUser, setDetailUser] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await listUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const onToggleStatus = async (target) => {
        const nextActive = !target.isActive;
        setBusyId(target.id);
        try {
            await setUserStatus(target.id, nextActive);
            // Reflect the change in the table immediately.
            setUsers((list) =>
                list.map((u) => (u.id === target.id ? { ...u, isActive: nextActive } : u))
            );
            notify.success(nextActive ? "User activated." : "User deactivated.");
        } catch (err) {
            notify.error(err.message);
        } finally {
            setBusyId(null);
        }
    };

    const onView = async (target) => {
        setDetailOpen(true);
        setDetailLoading(true);
        setDetailUser(null);
        try {
            const data = await getUser(target.id);
            setDetailUser(data);
        } catch (err) {
            notify.error(err.message);
            setDetailOpen(false);
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                <p className="mt-1 text-sm text-slate-500">
                    View every registered account and manage its active status.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex h-48 items-center justify-center text-brand-600">
                    <Spinner className="h-8 w-8" label="Loading users…" />
                </div>
            ) : users.length === 0 ? (
                <EmptyState icon="👥" title="No users found" description="No accounts have registered yet." />
            ) : (
                <UserTable
                    users={users}
                    currentUserId={me?.id}
                    busyId={busyId}
                    onView={onView}
                    onToggleStatus={onToggleStatus}
                />
            )}

            <UserDetailDialog
                open={detailOpen}
                user={detailUser}
                loading={detailLoading}
                onClose={() => setDetailOpen(false)}
            />
        </div>
    );
}
