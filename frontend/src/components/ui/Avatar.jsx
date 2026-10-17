import { avatarUrl, initials } from "@/lib/format";

const SIZES = {
    xs: "h-7 w-7 text-xs",
    sm: "h-9 w-9 text-sm",
    md: "h-11 w-11 text-base",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl"
};

/**
 * Round avatar. Shows the uploaded profile image when present, otherwise a
 * colour-filled circle with the user's initials.
 */
export default function Avatar({ user, size = "md", className = "" }) {
    const src = avatarUrl(user?.profileImage);
    const dimension = SIZES[size] || SIZES.md;

    if (src) {
        // Plain <img>: the avatar origin is the API server, kept config-free.
        // eslint-disable-next-line @next/next/no-img-element
        return (
            <img
                src={src}
                alt={`${user?.firstname || "User"} avatar`}
                className={`${dimension} shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
            />
        );
    }

    return (
        <span
            aria-hidden="true"
            className={`${dimension} inline-flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white ring-2 ring-white ${className}`}
        >
            {initials(user)}
        </span>
    );
}
