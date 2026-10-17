import { apiRequest } from "../apiClient";

// POST /api/auth/register  — returns the created user (no token).
export const registerAccount = (payload) =>
    apiRequest("/auth/register", { method: "POST", body: payload, auth: false });

// POST /api/auth/login  — returns { token, user }.
export const loginAccount = (credentials) =>
    apiRequest("/auth/login", { method: "POST", body: credentials, auth: false });

// POST /api/auth/forgot-password  — returns { resetToken, resetUrl } in dev.
export const requestPasswordReset = (email) =>
    apiRequest("/auth/forgot-password", { method: "POST", body: { email }, auth: false });

// PATCH /api/auth/reset-password/:token
export const resetPassword = (token, password) =>
    apiRequest(`/auth/reset-password/${encodeURIComponent(token)}`, {
        method: "PATCH",
        body: { password },
        auth: false
    });
