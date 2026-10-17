"use client";

import { useCallback, useEffect, useState } from "react";

import { listBlogs } from "@/lib/api/blogs";

/**
 * Loads blogs from GET /api/blogs. There is no "my blogs" endpoint, so when an
 * `ownerId` is given the list is narrowed client-side to that author — which is
 * how a normal user sees only their own posts while an admin sees everything.
 */
export function useBlogs({ ownerId = null, title, category } = {}) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await listBlogs({ title, category });
            const list = Array.isArray(data) ? data : [];
            setBlogs(ownerId ? list.filter((b) => b.author?.id === ownerId) : list);
        } catch (err) {
            setError(err.message);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, [ownerId, title, category]);

    useEffect(() => {
        reload();
    }, [reload]);

    return { blogs, loading, error, reload };
}
