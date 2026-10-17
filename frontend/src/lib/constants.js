// Brand -----------------------------------------------------------------------
export const APP_NAME = "PaperBlog";
export const APP_TAGLINE = "The daily read for testing, automation and code.";

// Blog categories the UI offers. The API treats category as free text, but the
// product standardises on this set for the composer and the category filter.
export const CATEGORIES = [
    "Testing",
    "Automation",
    "Programming",
    "DevOps",
    "AI"
];

/**
 * Newspaper-style "section" colours. Each category gets its own tone so the
 * tags read like coloured section labels in a paper. Falls back to slate.
 */
const CATEGORY_TONES = {
    Testing: "blue",
    Automation: "green",
    Programming: "indigo",
    DevOps: "amber",
    AI: "red"
};

export const categoryTone = (category) => CATEGORY_TONES[category] || "slate";

// Token storage key used by the session helpers.
export const TOKEN_STORAGE_KEY = "paperblog.auth.token";

// Image upload limits mirrored from the backend so the client can validate
// before sending a request.
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
export const AVATAR_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
