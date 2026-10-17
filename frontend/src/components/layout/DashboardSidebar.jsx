"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";

/** Builds the menu for the current role. */
function buildNav(isAdmin) {
    return [
        { href: "/dashboard", label: "Dashboard", icon: "🏠", exact: true },
        { href: "/dashboard/blogs", label: isAdmin ? "All Blogs" : "My Blogs", icon: "📝" },
        { href: "/dashboard/blogs/create", label: "Create Blog", icon: "✏️" },
        ...(isAdmin ? [{ href: "/admin/users", label: "Users", icon: "👥" }] : []),
        { href: "/dashboard/profile", label: "Profile", icon: "👤" },
        { href: "/dashboard/change-password", label: "Change Password", icon: "🔑" }
    ];
}

export default function DashboardSidebar({ onNavigate }) {
    const { isAdmin, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const items = buildNav(isAdmin);

    const isActive = (item) =>
        item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

    const handleLogout = () => {
        onNavigate?.();
        logout();
        router.replace("/login");
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-2 px-5">
                <span className="font-headline flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-lg font-black text-white">
                    P
                </span>
                <span className="font-headline text-xl font-extrabold tracking-tight text-slate-900">{APP_NAME}</span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {items.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onNavigate?.()}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                active
                                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <span className="text-base" aria-hidden="true">
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-100 p-3">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                >
                    <span aria-hidden="true">↩</span>
                    Logout
                </button>
            </div>
        </div>
    );
}
