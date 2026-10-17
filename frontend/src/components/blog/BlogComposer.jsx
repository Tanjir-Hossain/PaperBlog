"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import { SelectField, TextareaField, TextField } from "@/components/ui/Field";
import { CATEGORIES } from "@/lib/constants";
import { validateBlog } from "@/lib/validators";

/**
 * Create/edit blog form. `initial` seeds the fields; `onSubmit(values)` is the
 * async handler supplied by the page. Validation runs before submit.
 */
export default function BlogComposer({ initial, onSubmit, submitLabel = "Publish Blog", loadingText = "Publishing…" }) {
    const [values, setValues] = useState({
        blogTitle: initial?.blogTitle || "",
        category: initial?.category || "",
        blog: initial?.blog || ""
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const update = (field) => (e) => {
        setValues((v) => ({ ...v, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // The category list always includes any pre-existing value, so editing a
    // blog whose category is outside the standard set still shows correctly.
    const categoryOptions = Array.from(new Set([...CATEGORIES, values.category].filter(Boolean)));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const found = validateBlog(values);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <TextField
                id="blogTitle"
                label="Blog Title"
                required
                placeholder="e.g. Getting Started with Playwright"
                value={values.blogTitle}
                onChange={update("blogTitle")}
                error={errors.blogTitle}
            />

            <SelectField
                id="category"
                label="Category"
                required
                placeholder="Select a category"
                options={categoryOptions}
                value={values.category}
                onChange={update("category")}
                error={errors.category}
            />

            <TextareaField
                id="blog"
                label="Blog Content"
                required
                rows={12}
                placeholder="Write your blog content here…"
                value={values.blog}
                onChange={update("blog")}
                error={errors.blog}
            />

            <div className="flex justify-end gap-3">
                <Button type="submit" loading={submitting} loadingText={loadingText}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
