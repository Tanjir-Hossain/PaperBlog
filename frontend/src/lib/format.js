const UPLOADS_ORIGIN = (
    process.env.NEXT_PUBLIC_UPLOADS_URL ||
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")
).replace(/\/+$/, "");

/** "John" + "Doe" -> "John Doe"; tolerates missing parts. */
export function fullName(user) {
    if (!user) return "";
    return [user.firstname, user.lastname].filter(Boolean).join(" ").trim();
}

/** First letters of first/last name, for the fallback avatar. */
export function initials(user) {
    if (!user) return "?";
    const a = user.firstname?.[0] || "";
    const b = user.lastname?.[0] || "";
    return (a + b).toUpperCase() || user.email?.[0]?.toUpperCase() || "?";
}

/**
 * Turns the API's stored avatar path ("/uploads/profile/x.png") into an
 * absolute URL the browser can load. Absolute URLs are returned untouched.
 */
export function avatarUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `${UPLOADS_ORIGIN}/${String(path).replace(/^\/+/, "")}`;
}

/** Human date, e.g. "Sep 2, 2025". Falls back gracefully on bad input. */
export function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

/** Cuts long blog bodies down to a card-sized preview. */
export function excerpt(text, max = 160) {
    if (!text) return "";
    const clean = String(text).replace(/\s+/g, " ").trim();
    return clean.length <= max ? clean : `${clean.slice(0, max).trimEnd()}…`;
}
