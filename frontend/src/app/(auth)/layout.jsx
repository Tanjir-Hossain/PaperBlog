"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";

/** Centered layout for all auth screens. Signed-in users are sent onward. */
export default function AuthLayout({ children }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) router.replace("/dashboard");
    }, [isAuthenticated, router]);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-brand-50 via-white to-amber-50">
            <header className="px-6 py-5">
                <Link href="/" className="inline-flex items-center gap-2">
                    <span className="font-headline flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-lg font-black text-white">
                        P
                    </span>
                    <span className="font-headline text-xl font-extrabold tracking-tight text-slate-900">{APP_NAME}</span>
                </Link>
            </header>
            <main className="flex flex-1 items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">{children}</div>
            </main>
        </div>
    );
}
