"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Client-side guard for protected pages.
 *
 * - While the session is still being restored, shows a centered spinner.
 * - Guests are redirected to /login.
 * - When `requireAdmin` is set, a logged-in non-admin sees an "Access Denied"
 *   screen instead of the content (menus are hidden too, but this enforces it
 *   regardless of how the route was reached).
 *
 * The backend remains the real authority: every admin request is still checked
 * server-side and a 403 is surfaced to the user.
 */
export default function Protected({ children, requireAdmin = false }) {
    const { status, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === "guest") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading" || status === "guest") {
        return (
            <div className="flex min-h-screen items-center justify-center text-brand-600">
                <Spinner className="h-8 w-8" label="Loading your workspace…" />
            </div>
        );
    }

    if (requireAdmin && !isAdmin) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 text-5xl" aria-hidden="true">
                    🚫
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
                <p className="mt-2 max-w-md text-slate-500">
                    This area is reserved for administrators. Your account doesn&apos;t have the required
                    permissions.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                    Back to dashboard
                </Link>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return children;
}
