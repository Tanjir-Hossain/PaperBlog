import Link from "next/link";

import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function SiteFooter() {
    return (
        <footer className="mt-16 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                    <p className="text-base font-extrabold text-slate-900">{APP_NAME}</p>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">{APP_TAGLINE}</p>
                </div>
                <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                    <Link href="/" className="transition hover:text-brand-700">
                        Home
                    </Link>
                    <Link href="/login" className="transition hover:text-brand-700">
                        Login
                    </Link>
                    <Link href="/register" className="transition hover:text-brand-700">
                        Register
                    </Link>
                </nav>
            </div>
            <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
                {new Date().getFullYear()} {APP_NAME} | © Tanjir Hosain
            </div>
        </footer>
    );
}
