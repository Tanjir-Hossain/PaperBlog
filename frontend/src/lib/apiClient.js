import { readToken } from "./session";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

/**
 * Error thrown by the API layer. It carries the HTTP status so callers can
 * branch on things like 401 (session expired) or 403 (not authorised) while
 * still having a human-readable `message` to show the user.
 */
export class ApiError extends Error {
    constructor(message, status) {
        super(message || "Something went wrong. Please try again.");
        this.name = "ApiError";
        this.status = status;
    }
}

/**
 * Single entry point for every request to the backend.
 *
 * - Prefixes the configured base URL.
 * - Attaches the bearer token unless `auth: false`.
 * - Serialises JSON bodies (and leaves FormData untouched so the browser can
 *   set the multipart boundary itself).
 * - Unwraps the `{ success, message, data }` envelope, returning `data`.
 * - Converts any failure into an ApiError with the backend's message.
 */
export async function apiRequest(path, { method = "GET", body, auth = true, token } = {}) {
    const headers = {};
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    if (body !== undefined && !isFormData) {
        headers["Content-Type"] = "application/json";
    }

    if (auth) {
        const bearer = token ?? readToken();
        if (bearer) headers.Authorization = `Bearer ${bearer}`;
    }

    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            method,
            headers,
            body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
            cache: "no-store"
        });
    } catch {
        // Network-level failure (server down, CORS, offline, ...).
        throw new ApiError("Unable to reach the server. Is the API running?", 0);
    }

    let payload = null;
    try {
        payload = await response.json();
    } catch {
        payload = null;
    }

    if (!response.ok || (payload && payload.success === false)) {
        const message = payload?.message || `Request failed (${response.status}).`;
        throw new ApiError(message, response.status);
    }

    // Successful envelope → hand back the meaningful part.
    return payload ? payload.data : null;
}
