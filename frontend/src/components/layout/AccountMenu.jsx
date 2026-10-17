"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Avatar from "@/components/ui/Avatar";
import { fullName } from "@/lib/format";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Reusable avatar + name dropdown shown in the navbar on authenticated pages.
 * Opens a small menu with Profile, Change Password and Logout.
 */
export default function AccountMenu() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const handleLogout = () => {
        setOpen(false);
        logout();
        router.replace("/login");
    };

    const links = [
        { href: "/dashboard/profile", label: "Profile", icon: "👤" },
        { href: "/dashboard/change-password", label: "Change Password", icon: "🔑" }
    ];

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition hover:border-brand-300 hover:shadow-sm"
            >
                <Avatar user={user} size="sm" />
                <span className="hidden max-w-[10rem] truncate text-sm font-medium text-slate-700 sm:block">
                    {fullName(user) || "Account"}
                </span>
                <span className={`text-xs text-slate-400 transition ${open ? "rotate-180" : ""}`} aria-hidden="true">
                    ▼
                </span>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                >
                    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                        <Avatar user={user} size="md" />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{fullName(user)}</p>
                            <p className="truncate text-xs text-slate-500">{user?.email}</p>
                        </div>
                    </div>
                    <div className="py-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                role="menuitem"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                                <span aria-hidden="true">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                        <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                            <span aria-hidden="true">↩</span>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
