import { apiRequest } from "../apiClient";

/**
 * GET /api/blogs with optional title / category filters.
 * The blog list is public, so no token is attached.
 */
export const listBlogs = ({ title, category } = {}) => {
    const params = new URLSearchParams();
    if (title && title.trim()) params.set("title", title.trim());
    if (category && category.trim()) params.set("category", category.trim());
    const qs = params.toString();
    return apiRequest(`/blogs${qs ? `?${qs}` : ""}`, { auth: false });
};

// GET /api/blogs/:id (public)
export const getBlog = (id) => apiRequest(`/blogs/${id}`, { auth: false });

// POST /api/blogs/create — userId is derived from the token server-side.
export const createBlog = ({ blogTitle, blog, category }) =>
    apiRequest("/blogs/create", { method: "POST", body: { blogTitle, blog, category } });

// PUT /api/blogs/update/:id
export const updateBlog = (id, { blogTitle, blog, category }) =>
    apiRequest(`/blogs/update/${id}`, { method: "PUT", body: { blogTitle, blog, category } });

// DELETE /api/blogs/delete/:id
export const deleteBlog = (id) => apiRequest(`/blogs/delete/${id}`, { method: "DELETE" });
