const TONES = {
    brand: "bg-brand-100 text-brand-700",
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-sky-100 text-sky-700",
    indigo: "bg-indigo-100 text-indigo-700"
};

export default function Badge({ children, tone = "slate", className = "" }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone] || TONES.slate} ${className}`}
        >
            {children}
        </span>
    );
}
