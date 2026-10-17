"use client";

import Link from "next/link";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { categoryTone } from "@/lib/constants";
import { formatDate, fullName } from "@/lib/format";

/**
 * Table of blogs for the dashboard. On phones it collapses into stacked cards.
 * `showAuthor` adds an author column (used by the admin "All Blogs" view).
 */
export default function BlogTable({ blogs, showAuthor = false, onDelete }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* Desktop / tablet table */}
            <table className="hidden w-full text-left text-sm sm:table">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-5 py-3 font-semibold">Title</th>
                        <th className="px-5 py-3 font-semibold">Category</th>
                        {showAuthor && <th className="px-5 py-3 font-semibold">Author</th>}
                        <th className="px-5 py-3 font-semibold">Created</th>
                        <th className="px-5 py-3 text-right font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {blogs.map((blog) => (
                        <tr key={blog.id} className="transition hover:bg-slate-50/60">
                            <td className="max-w-xs px-5 py-3.5">
                                <Link
                                    href={`/blogs/${blog.id}`}
                                    className="font-medium text-slate-800 transition hover:text-brand-700"
                                >
                                    {blog.blogTitle}
                                </Link>
                            </td>
                            <td className="px-5 py-3.5">
                                <Badge tone={categoryTone(blog.category)}>{blog.category}</Badge>
                            </td>
                            {showAuthor && (
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <Avatar user={blog.author} size="xs" />
                                        <span className="text-slate-600">{fullName(blog.author) || "—"}</span>
                                    </div>
                                </td>
                            )}
                            <td className="px-5 py-3.5 text-slate-500">{formatDate(blog.createAt)}</td>
                            <td className="px-5 py-3.5">
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href={`/dashboard/blogs/${blog.id}/edit`}
                                        className="rounded-md px-2.5 py-1 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => onDelete?.(blog)}
                                        className="rounded-md px-2.5 py-1 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile stacked cards */}
            <ul className="divide-y divide-slate-100 sm:hidden">
                {blogs.map((blog) => (
                    <li key={blog.id} className="p-4">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <Badge tone={categoryTone(blog.category)}>{blog.category}</Badge>
                            <span className="text-xs text-slate-400">{formatDate(blog.createAt)}</span>
                        </div>
                        <Link href={`/blogs/${blog.id}`} className="font-semibold text-slate-800">
                            {blog.blogTitle}
                        </Link>
                        {showAuthor && (
                            <p className="mt-1 text-xs text-slate-500">by {fullName(blog.author) || "—"}</p>
                        )}
                        <div className="mt-3 flex gap-2">
                            <Link
                                href={`/dashboard/blogs/${blog.id}/edit`}
                                className="flex-1 rounded-md border border-slate-200 py-1.5 text-center text-sm font-medium text-brand-700"
                            >
                                Edit
                            </Link>
                            <button
                                type="button"
                                onClick={() => onDelete?.(blog)}
                                className="flex-1 rounded-md border border-rose-200 py-1.5 text-center text-sm font-medium text-rose-600"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
