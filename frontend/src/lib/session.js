import { TOKEN_STORAGE_KEY } from "./constants";

/*
 * Thin wrapper around localStorage for the JWT. Everything is guarded so the
 * module is safe to import during server rendering, where `window` is absent.
 */
const hasWindow = () => typeof window !== "undefined";

export function readToken() {
    if (!hasWindow()) return null;
    try {
        return window.localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
        return null;
    }
}

export function storeToken(token) {
    if (!hasWindow()) return;
    try {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
        /* ignore private-mode / quota errors */
    }
}

export function clearToken() {
    if (!hasWindow()) return;
    try {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
        /* ignore */
    }
}
