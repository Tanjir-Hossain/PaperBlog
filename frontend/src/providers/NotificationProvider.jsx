"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NotificationContext = createContext(null);

let counter = 0;

/**
 * Lightweight toast system. `notify.success(msg)` / `notify.error(msg)` push a
 * dismissible toast that auto-expires. Toasts render in a fixed stack via the
 * component below.
 */
export function NotificationProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (type, message) => {
            const id = ++counter;
            setToasts((list) => [...list, { id, type, message }]);
            setTimeout(() => dismiss(id), 4000);
        },
        [dismiss]
    );

    const notify = useMemo(
        () => ({
            success: (message) => push("success", message),
            error: (message) => push("error", message),
            info: (message) => push("info", message)
        }),
        [push]
    );

    return (
        <NotificationContext.Provider value={notify}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss} />
        </NotificationContext.Provider>
    );
}

function ToastViewport({ toasts, onDismiss }) {
    const tone = {
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        error: "border-rose-200 bg-rose-50 text-rose-800",
        info: "border-violet-200 bg-violet-50 text-violet-800"
    };

    return (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    role="status"
                    className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg shadow-slate-900/5 ${tone[toast.type] || tone.info}`}
                >
                    <span className="flex-1">{toast.message}</span>
                    <button
                        type="button"
                        onClick={() => onDismiss(toast.id)}
                        className="opacity-60 transition hover:opacity-100"
                        aria-label="Dismiss notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}

export function useNotify() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotify must be used inside a <NotificationProvider>.");
    }
    return context;
}
