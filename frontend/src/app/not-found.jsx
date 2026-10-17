import Link from "next/link";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <p className="text-6xl font-black text-brand-200">404</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h1>
            <p className="mt-2 max-w-md text-slate-500">
                The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
            <Link
                href="/"
                className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
                Back to home
            </Link>
        </div>
    );
}
