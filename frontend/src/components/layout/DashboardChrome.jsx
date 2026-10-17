"use client";

import Link from "next/link";
import { useState } from "react";

import AccountMenu from "@/components/layout/AccountMenu";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import SearchInput from "@/components/ui/SearchInput";
import { useRouter } from "next/navigation";

/**
 * Dashboard layout shell: a fixed top navbar, a sidebar that is permanent on
 * desktop and a slide-in drawer on mobile, and the page content area.
 */
export default function DashboardChrome({ children }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    const runSearch = (value) => {
        const q = (value ?? "").trim();
        router.push(q ? `/?title=${encodeURIComponent(q)}` : "/");
    };

    return (
        <div className="min-h-screen bg-canvas">
            {/* Fixed top navbar */}
            <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="flex h-full items-center gap-3 px-4 sm:px-6">
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                    <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                        <span className="font-headline flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-base font-black text-white">
                            P
                        </span>
                    </Link>

                    <div className="mx-auto hidden w-full max-w-md sm:block">
                        <SearchInput value={query} onChange={setQuery} onSubmit={runSearch} placeholder="Search blogs…" />
                    </div>

                    <div className="ml-auto">
                        <AccountMenu />
                    </div>
                </div>
            </header>

            {/* Permanent sidebar on large screens */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
                <DashboardSidebar />
            </aside>

            {/* Mobile drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-slate-900/50"
                        onClick={() => setDrawerOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute inset-y-0 left-0 w-64 animate-fade-in bg-white shadow-xl">
                        <DashboardSidebar onNavigate={() => setDrawerOpen(false)} />
                    </div>
                </div>
            )}

            {/* Content */}
            <main className="px-4 pb-16 pt-20 sm:px-6 lg:pl-72 lg:pr-8">
                <div className="mx-auto max-w-5xl">{children}</div>
            </main>
        </div>
    );
}
