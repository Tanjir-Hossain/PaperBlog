"use client";

import Link from "next/link";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useBlogs } from "@/hooks/useBlogs";
import { categoryTone } from "@/lib/constants";
import { formatDate, fullName } from "@/lib/format";
import { useAuth } from "@/providers/AuthProvider";

function StatCard({ label, value, icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className="text-xl" aria-hidden="true">
                    {icon}
                </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
        </div>
    );
}

export default function DashboardHome() {
    const { user, isAdmin } = useAuth();
    const { blogs, loading } = useBlogs({ ownerId: isAdmin ? null : user?.id });

    const recent = blogs.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome, {user?.firstname || "there"} 👋
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Here&apos;s a quick look at your {isAdmin ? "platform" : "blogging"} activity.
                    </p>
                </div>
                <Link href="/dashboard/blogs/create">
                    <Button>+ Quick Create Blog</Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    label={isAdmin ? "Total Blogs" : "My Blogs"}
                    value={loading ? "—" : blogs.length}
                    icon="📝"
                />
                <StatCard label="Role" value={isAdmin ? "Admin" : "User"} icon="🛡️" />
                <StatCard label="Status" value={user?.isActive ? "Active" : "Inactive"} icon="✅" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-1">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Profile</h2>
                    <div className="mt-4 flex flex-col items-center text-center">
                        <Avatar user={user} size="xl" />
                        <p className="mt-3 text-lg font-bold text-slate-900">{fullName(user)}</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                        <Badge tone={isAdmin ? "amber" : "slate"} className="mt-2">
                            {user?.role}
                        </Badge>
                    </div>
                    <Link href="/dashboard/profile" className="mt-5 block">
                        <Button variant="secondary" className="w-full">
                            Manage profile
                        </Button>
                    </Link>
                </div>

                {/* Recent blogs */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Recent blogs
                        </h2>
                        <Link href="/dashboard/blogs" className="text-sm font-semibold text-brand-700">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex h-40 items-center justify-center text-brand-600">
                            <Spinner className="h-7 w-7" />
                        </div>
                    ) : recent.length === 0 ? (
                        <EmptyState
                            className="mt-4"
                            icon="📝"
                            title={isAdmin ? "No blogs yet" : "You haven't created any blogs yet"}
                            description="Create your first blog to see it here."
                            action={
                                <Link href="/dashboard/blogs/create">
                                    <Button size="sm">Create Blog</Button>
                                </Link>
                            }
                        />
                    ) : (
                        <ul className="mt-4 divide-y divide-slate-100">
                            {recent.map((blog) => (
                                <li key={blog.id} className="flex items-center justify-between gap-4 py-3">
                                    <div className="min-w-0">
                                        <Link
                                            href={`/blogs/${blog.id}`}
                                            className="truncate font-medium text-slate-800 transition hover:text-brand-700"
                                        >
                                            {blog.blogTitle}
                                        </Link>
                                        <p className="text-xs text-slate-400">{formatDate(blog.createAt)}</p>
                                    </div>
                                    <Badge tone={categoryTone(blog.category)}>{blog.category}</Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
