"use client";

import { CATEGORIES } from "@/lib/constants";

/**
 * Horizontal, scrollable category selector. An empty `value` means "All".
 */
export default function CategoryTabs({ value = "", onChange }) {
    const options = ["", ...CATEGORIES];

    return (
        <div className="scroll-slim flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by category">
            {options.map((category) => {
                const active = value === category;
                return (
                    <button
                        key={category || "all"}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange?.(category)}
                        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                            active
                                ? "bg-brand-600 text-white shadow-sm"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
                        }`}
                    >
                        {category || "All"}
                    </button>
                );
            })}
        </div>
    );
}
