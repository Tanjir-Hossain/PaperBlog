"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AccountMenu from "@/components/layout/AccountMenu";
import SearchInput from "@/components/ui/SearchInput";
import Spinner from "@/components/ui/Spinner";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";

/** Fixed public navbar: logo, blog search, and auth-aware actions. */
export default function SiteNavbar() {
    const { status, isAuthenticated } = useAuth();
    const [query, setQuery] = useState("");
    const router = useRouter();

    const runSearch = (value) => {
        const q = (value ?? "").trim();
        router.push(q ? `/?title=${encodeURIComponent(q)}` : "/");
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <span className="font-headline flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-lg font-black text-white">
                        P
                    </span>
                    <span className="font-headline text-xl font-extrabold tracking-tight text-slate-900">
                        {APP_NAME}
                    </span>
                </Link>

                <div className="mx-auto hidden w-full max-w-md md:block">
                    <SearchInput value={query} onChange={setQuery} onSubmit={runSearch} />
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {status === "loading" ? (
                        <Spinner className="h-5 w-5 text-brand-600" />
                    ) : isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:block"
                            >
                                Dashboard
                            </Link>
                            <AccountMenu />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Search on small screens drops below the bar. */}
            <div className="border-t border-slate-100 px-4 py-2.5 md:hidden">
                <SearchInput value={query} onChange={setQuery} onSubmit={runSearch} />
            </div>
        </header>
    );
}
