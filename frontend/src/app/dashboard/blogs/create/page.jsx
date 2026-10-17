"use client";

import { useRouter } from "next/navigation";

import BlogComposer from "@/components/blog/BlogComposer";
import { createBlog } from "@/lib/api/blogs";
import { useNotify } from "@/providers/NotificationProvider";

export default function CreateBlogPage() {
    const router = useRouter();
    const notify = useNotify();

    const handleCreate = async (values) => {
        try {
            // userId is intentionally NOT sent — the backend derives the owner
            // from the authenticated token.
            await createBlog(values);
            notify.success("Blog published successfully.");
            router.push("/dashboard/blogs");
        } catch (err) {
            notify.error(err.message);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-2xl font-bold text-slate-900">Create a new blog</h1>
            <p className="mt-1 text-sm text-slate-500">Share something with the community.</p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <BlogComposer onSubmit={handleCreate} submitLabel="Publish Blog" loadingText="Publishing…" />
            </div>
        </div>
    );
}
