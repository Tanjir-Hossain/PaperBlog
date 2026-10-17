"use client";

export default function SearchInput({
    value,
    onChange,
    onSubmit,
    placeholder = "Search blogs…",
    className = ""
}) {
    return (
        <form
            role="search"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.(value);
            }}
            className={`relative ${className}`}
        >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                🔍
            </span>
            <input
                type="search"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                aria-label="Search blogs"
                className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-400 focus:outline-2 focus:outline-offset-0 focus:outline-brand-500"
            />
        </form>
    );
}
