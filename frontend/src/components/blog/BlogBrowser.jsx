"use client";

import { useCallback, useEffect, useState } from "react";

import BlogCard from "@/components/blog/BlogCard";
import CategoryTabs from "@/components/ui/CategoryTabs";
import EmptyState from "@/components/ui/EmptyState";
import SearchInput from "@/components/ui/SearchInput";
import { listBlogs } from "@/lib/api/blogs";

function CardSkeleton() {
    return (
        <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 h-5 w-20 rounded-full bg-slate-100" />
            <div className="mb-2 h-6 w-3/4 rounded bg-slate-100" />
            <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-5/6 rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
        </div>
    );
}

/**
 * The guest-facing blog explorer: search box + category tabs wired to
 * GET /api/blogs?title=&category=. Search is debounced so each keystroke does
 * not fire a request.
 */
export default function BlogBrowser({ initialTitle = "" }) {
    const [title, setTitle] = useState(initialTitle);
    const [category, setCategory] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async (titleArg, categoryArg) => {
        setLoading(true);
        setError("");
        try {
            const data = await listBlogs({ title: titleArg, category: categoryArg });
            setBlogs(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Keep in sync if the navbar pushes a new ?title=.
    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    // Debounced fetch whenever title or category changes.
    useEffect(() => {
        const timer = setTimeout(() => load(title, category), 300);
        return () => clearTimeout(timer);
    }, [title, category, load]);

    return (
        <section>
            <div className="mb-6 space-y-4">
                <div className="md:hidden">
                    <SearchInput value={title} onChange={setTitle} onSubmit={setTitle} />
                </div>
                <div className="hidden md:block">
                    <SearchInput
                        value={title}
                        onChange={setTitle}
                        onSubmit={setTitle}
                        className="max-w-xl"
                    />
                </div>
                <CategoryTabs value={category} onChange={setCategory} />
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : blogs.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No blogs found"
                    description={
                        title || category
                            ? "Try a different search term or category."
                            : "There are no published blogs yet. Check back soon."
                    }
                />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            )}
        </section>
    );
}
