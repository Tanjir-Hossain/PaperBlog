"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { getBlog } from "@/lib/api/blogs";
import { categoryTone } from "@/lib/constants";
import { formatDate, fullName } from "@/lib/format";

export default function BlogDetailsPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [state, setState] = useState("loading"); // loading | ready | notfound | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await getBlog(id);
                if (active) {
                    setBlog(data);
                    setState("ready");
                }
            } catch (err) {
                if (!active) return;
                if (err.status === 404) {
                    setState("notfound");
                } else {
                    setMessage(err.message);
                    setState("error");
                }
            }
        })();
        return () => {
            active = false;
        };
    }, [id]);

    if (state === "loading") {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-brand-600">
                <Spinner className="h-8 w-8" label="Loading blog…" />
            </div>
        );
    }

    if (state === "notfound") {
        return (
            <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 text-center">
                <div className="mb-3 text-5xl" aria-hidden="true">
                    📄
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Blog Not Found</h1>
                <p className="mt-2 text-slate-500">
                    The blog you&apos;re looking for doesn&apos;t exist or may have been removed.
                </p>
                <Link
                    href="/"
                    className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                    Browse all blogs
                </Link>
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16">
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {message}
                </div>
            </div>
        );
    }

    return (
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <Link href="/" className="text-sm font-medium text-brand-700 transition hover:text-brand-800">
                ← Back to blogs
            </Link>

            <header className="mt-4">
                <Badge tone={categoryTone(blog.category)}>{blog.category}</Badge>
                <h1 className="font-headline mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                    {blog.blogTitle}
                </h1>

                <div className="mt-5 flex items-center gap-3 border-y border-slate-100 py-4">
                    <Avatar user={blog.author} size="md" />
                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            {fullName(blog.author) || "Unknown author"}
                        </p>
                        <p className="text-xs text-slate-500">Published {formatDate(blog.createAt)}</p>
                    </div>
                </div>
            </header>

            <div className="prose-article mt-8 text-[1.05rem] text-slate-800">{blog.blog}</div>
        </article>
    );
}
