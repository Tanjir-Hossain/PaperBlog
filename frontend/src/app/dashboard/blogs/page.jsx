"use client";

import Link from "next/link";
import { useState } from "react";

import BlogTable from "@/components/blog/BlogTable";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useBlogs } from "@/hooks/useBlogs";
import { deleteBlog } from "@/lib/api/blogs";
import { useAuth } from "@/providers/AuthProvider";
import { useNotify } from "@/providers/NotificationProvider";

export default function BlogManagementPage() {
    const { user, isAdmin } = useAuth();
    const notify = useNotify();
    const { blogs, loading, error, reload } = useBlogs({ ownerId: isAdmin ? null : user?.id });

    const [target, setTarget] = useState(null); // blog pending deletion
    const [deleting, setDeleting] = useState(false);

    const confirmDelete = async () => {
        if (!target) return;
        setDeleting(true);
        try {
            await deleteBlog(target.id);
            notify.success("Blog deleted successfully.");
            setTarget(null);
            await reload();
        } catch (err) {
            notify.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{isAdmin ? "All Blogs" : "My Blogs"}</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {isAdmin
                            ? "Manage and moderate every blog on the platform."
                            : "Manage the blogs you have written."}
                    </p>
                </div>
                <Link href="/dashboard/blogs/create">
                    <Button>+ Create Blog</Button>
                </Link>
            </div>

            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex h-48 items-center justify-center text-brand-600">
                    <Spinner className="h-8 w-8" label="Loading blogs…" />
                </div>
            ) : blogs.length === 0 ? (
                <EmptyState
                    icon="📝"
                    title={isAdmin ? "No blogs found" : "You haven't created any blogs yet"}
                    description="Start writing and your blogs will appear here."
                    action={
                        <Link href="/dashboard/blogs/create">
                            <Button>Create your first blog</Button>
                        </Link>
                    }
                />
            ) : (
                <BlogTable blogs={blogs} showAuthor={isAdmin} onDelete={setTarget} />
            )}

            <ConfirmDialog
                open={Boolean(target)}
                title="Delete this blog?"
                message={
                    target
                        ? `"${target.blogTitle}" will be permanently removed. This action cannot be undone.`
                        : ""
                }
                confirmLabel="Delete"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => !deleting && setTarget(null)}
            />
        </div>
    );
}
