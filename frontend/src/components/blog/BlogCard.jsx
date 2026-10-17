import Link from "next/link";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { categoryTone } from "@/lib/constants";
import { excerpt, formatDate, fullName } from "@/lib/format";

/** Card used across the public home grid. */
export default function BlogCard({ blog }) {
    return (
        <article className="flex animate-fade-in flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge tone={categoryTone(blog.category)}>{blog.category}</Badge>
                    <time className="text-xs text-slate-400">{formatDate(blog.createAt)}</time>
                </div>

                <h3 className="font-headline text-xl font-bold leading-snug text-slate-900">
                    <Link href={`/blogs/${blog.id}`} className="transition hover:text-brand-700">
                        {blog.blogTitle}
                    </Link>
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{excerpt(blog.blog)}</p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                        <Avatar user={blog.author} size="xs" />
                        <span className="text-sm font-medium text-slate-700">
                            {fullName(blog.author) || "Unknown author"}
                        </span>
                    </div>
                    <Link
                        href={`/blogs/${blog.id}`}
                        className="text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                    >
                        Read More →
                    </Link>
                </div>
            </div>
        </article>
    );
}
