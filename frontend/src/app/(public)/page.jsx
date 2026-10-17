import BlogBrowser from "@/components/blog/BlogBrowser";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const metadata = {
    title: "Home",
    description: "Browse, search and filter blogs on PaperBlog."
};

/**
 * Public homepage. `searchParams` is awaited (Next.js App Router) so a
 * navbar-driven `?title=` query seeds the explorer's initial search term.
 */
export default async function HomePage({ searchParams }) {
    const resolved = (await searchParams) || {};
    const initialTitle = typeof resolved.title === "string" ? resolved.title : "";

    const dateline = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div>
            {/* Masthead */}
            <section className="border-b border-slate-200 bg-white/40">
                <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-16">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">
                        {dateline}
                    </p>
                    <div className="mt-4 border-y-4 border-double border-slate-900/80 py-4">
                        <h1 className="font-headline text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
                            {APP_NAME}
                        </h1>
                    </div>
                    <p className="mt-4 text-base italic text-slate-600 sm:text-lg">{APP_TAGLINE}</p>
                </div>
            </section>

            {/* Explorer */}
            <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <h2 className="font-headline mb-5 border-b-2 border-slate-900/70 pb-2 text-2xl font-bold text-slate-900">
                    Latest Stories
                </h2>
                <BlogBrowser initialTitle={initialTitle} />
            </section>
        </div>
    );
}
