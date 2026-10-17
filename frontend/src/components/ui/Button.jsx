import Spinner from "./Spinner";

const VARIANTS = {
    primary:
        "bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 focus-visible:outline-brand-600",
    secondary:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400",
    ghost: "text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-300",
    danger: "bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:bg-rose-700 focus-visible:outline-rose-600",
    accent: "bg-accent-500 text-ink shadow-sm hover:bg-accent-400 focus-visible:outline-accent-500"
};

const SIZES = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base"
};

/**
 * Shared button. When `loading` is true it shows a spinner, swaps in
 * `loadingText` if provided, and disables itself so a form cannot be submitted
 * twice by accident.
 */
export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    loadingText,
    disabled = false,
    className = "",
    type = "button",
    ...rest
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            aria-busy={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
            {...rest}
        >
            {loading && <Spinner className="h-4 w-4" />}
            <span>{loading && loadingText ? loadingText : children}</span>
        </button>
    );
}
