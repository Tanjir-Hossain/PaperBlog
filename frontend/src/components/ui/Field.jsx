const baseControl =
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 focus:outline-brand-500 disabled:cursor-not-allowed disabled:bg-slate-50";

const borderFor = (error) => (error ? "border-rose-400" : "border-slate-300");

function Label({ htmlFor, label, required }) {
    if (!label) return null;
    return (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
            {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
    );
}

function ErrorText({ error }) {
    if (!error) return null;
    return <p className="mt-1.5 text-sm text-rose-600">{error}</p>;
}

/** Labelled text input. */
export function TextField({ id, label, required, error, hint, className = "", ...rest }) {
    return (
        <div className={className}>
            <Label htmlFor={id} label={label} required={required} />
            <input id={id} className={`${baseControl} ${borderFor(error)}`} {...rest} />
            {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
            <ErrorText error={error} />
        </div>
    );
}

/** Labelled textarea. */
export function TextareaField({ id, label, required, error, rows = 6, className = "", ...rest }) {
    return (
        <div className={className}>
            <Label htmlFor={id} label={label} required={required} />
            <textarea
                id={id}
                rows={rows}
                className={`${baseControl} ${borderFor(error)} resize-y`}
                {...rest}
            />
            <ErrorText error={error} />
        </div>
    );
}

/** Labelled select. `options` is an array of strings or { value, label }. */
export function SelectField({ id, label, required, error, options = [], placeholder, className = "", ...rest }) {
    return (
        <div className={className}>
            <Label htmlFor={id} label={label} required={required} />
            <select id={id} className={`${baseControl} ${borderFor(error)}`} {...rest}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => {
                    const value = typeof opt === "string" ? opt : opt.value;
                    const text = typeof opt === "string" ? opt : opt.label;
                    return (
                        <option key={value} value={value}>
                            {text}
                        </option>
                    );
                })}
            </select>
            <ErrorText error={error} />
        </div>
    );
}
