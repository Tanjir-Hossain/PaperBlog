export default function EmptyState({ title, description, icon = "📭", action, className = "" }) {
    return (
        <div
            className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center ${className}`}
        >
            <div className="mb-3 text-4xl" aria-hidden="true">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
