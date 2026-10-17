"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { loginAccount } from "@/lib/api/auth";
import { getMyProfile } from "@/lib/api/users";
import { clearToken, readToken, storeToken } from "@/lib/session";

const AuthContext = createContext(null);

/**
 * Holds the authenticated session for the whole app.
 *
 * `status` is one of:
 *   "loading"        still checking the stored token on first paint
 *   "authenticated"  a valid session is active
 *   "guest"          no session
 *
 * On mount, any stored token is validated by fetching the live profile, so a
 * page refresh keeps the user logged in as long as the token is still good.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("loading");

    const bootstrap = useCallback(async () => {
        const token = readToken();
        if (!token) {
            setStatus("guest");
            return;
        }
        try {
            const profile = await getMyProfile(token);
            setUser(profile);
            setStatus("authenticated");
        } catch {
            // Token missing / expired / account deactivated.
            clearToken();
            setUser(null);
            setStatus("guest");
        }
    }, []);

    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    const login = useCallback(async (credentials) => {
        const data = await loginAccount(credentials); // { token, user }
        storeToken(data.token);
        setUser(data.user);
        setStatus("authenticated");
        return data.user;
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
        setStatus("guest");
    }, []);

    const refreshProfile = useCallback(async () => {
        const profile = await getMyProfile();
        setUser(profile);
        return profile;
    }, []);

    // Merge partial fields into the cached user (e.g. after an avatar upload),
    // so the navbar updates instantly without a round-trip.
    const patchUser = useCallback((partial) => {
        setUser((current) => (current ? { ...current, ...partial } : current));
    }, []);

    const value = useMemo(
        () => ({
            user,
            status,
            isAuthenticated: status === "authenticated",
            isAdmin: user?.role === "admin",
            login,
            logout,
            refreshProfile,
            patchUser
        }),
        [user, status, login, logout, refreshProfile, patchUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an <AuthProvider>.");
    }
    return context;
}
