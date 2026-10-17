"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BlogComposer from "@/components/blog/BlogComposer";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { getBlog, updateBlog } from "@/lib/api/blogs";
import { useAuth } from "@/providers/AuthProvider";
import { useNotify } from "@/providers/NotificationProvider";

export default function EditBlogPage() {
    const { id } = useParams();
    const router = useRouter();
    const notify = useNotify();
    const { user, isAdmin } = useAuth();

    const [blog, setBlog] = useState(null);
    const [state, setState] = useState("loading"); // loading | ready | notfound | forbidden | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await getBlog(id);
                if (!active) return;

                // Ownership guard mirrored from the backend: a non-admin may only
                // edit their own blog. The server enforces this on PUT as well.
                if (!isAdmin && data.author?.id !== user?.id) {
                    setState("forbidden");
                    return;
                }
                setBlog(data);
                setState("ready");
            } catch (err) {
                if (!active) return;
                if (err.status === 404) setState("notfound");
                else {
                    setMessage(err.message);
                    setState("error");
                }
            }
        })();
        return () => {
            active = false;
        };
    }, [id, isAdmin, user?.id]);

    const handleUpdate = async (values) => {
        try {
            await updateBlog(id, values);
            notify.success("Blog updated successfully.");
            router.push("/dashboard/blogs");
        } catch (err) {
            notify.error(err.message);
        }
    };

    if (state === "loading") {
        return (
            <div className="flex h-64 items-center justify-center text-brand-600">
                <Spinner className="h-8 w-8" label="Loading blog…" />
            </div>
        );
    }

    if (state === "notfound" || state === "forbidden") {
        const forbidden = state === "forbidden";
        return (
            <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
                <div className="mb-3 text-5xl" aria-hidden="true">
                    {forbidden ? "🚫" : "📄"}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                    {forbidden ? "You can't edit this blog" : "Blog Not Found"}
                </h1>
                <p className="mt-2 text-slate-500">
                    {forbidden
                        ? "You are not the author of this blog, so it can't be edited from your account."
                        : "This blog doesn't exist or has been removed."}
                </p>
                <Link href="/dashboard/blogs" className="mt-6">
                    <Button variant="secondary">Back to my blogs</Button>
                </Link>
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {message}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-2xl font-bold text-slate-900">Edit blog</h1>
            <p className="mt-1 text-sm text-slate-500">Update the details below and save your changes.</p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <BlogComposer
                    initial={blog}
                    onSubmit={handleUpdate}
                    submitLabel="Save Changes"
                    loadingText="Saving…"
                />
            </div>
        </div>
    );
}
