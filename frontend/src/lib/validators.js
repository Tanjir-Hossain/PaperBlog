import { AVATAR_ACCEPTED_TYPES, AVATAR_MAX_BYTES } from "./constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (value) => EMAIL_RE.test(String(value || "").trim());
export const isFilled = (value) => String(value ?? "").trim().length > 0;

/**
 * Validates the registration form. Returns an object of field -> message;
 * an empty object means the form is valid.
 */
export function validateRegister({ firstname, lastname, email, password, confirmPassword }) {
    const errors = {};
    if (!isFilled(firstname)) errors.firstname = "First name is required.";
    if (!isFilled(lastname)) errors.lastname = "Last name is required.";
    if (!isFilled(email)) errors.email = "Email is required.";
    else if (!isEmail(email)) errors.email = "Enter a valid email address.";
    if (!isFilled(password)) errors.password = "Password is required.";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
    if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";
    return errors;
}

export function validateLogin({ email, password }) {
    const errors = {};
    if (!isFilled(email)) errors.email = "Email is required.";
    else if (!isEmail(email)) errors.email = "Enter a valid email address.";
    if (!isFilled(password)) errors.password = "Password is required.";
    return errors;
}

export function validateNewPassword({ password, confirmPassword }) {
    const errors = {};
    if (!isFilled(password)) errors.password = "Password is required.";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
    if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";
    return errors;
}

export function validateBlog({ blogTitle, blog, category }) {
    const errors = {};
    if (!isFilled(blogTitle)) errors.blogTitle = "A blog title is required.";
    else if (blogTitle.trim().length < 3) errors.blogTitle = "Title must be at least 3 characters.";
    if (!isFilled(category)) errors.category = "Please choose a category.";
    if (!isFilled(blog)) errors.blog = "Blog content is required.";
    else if (blog.trim().length < 20) errors.blog = "Content must be at least 20 characters.";
    return errors;
}

export function validateProfile({ firstname, lastname }) {
    const errors = {};
    if (!isFilled(firstname)) errors.firstname = "First name is required.";
    if (!isFilled(lastname)) errors.lastname = "Last name is required.";
    return errors;
}

/** Validates a chosen avatar file against the backend's type/size rules. */
export function validateAvatar(file) {
    if (!file) return "Please choose an image first.";
    if (!AVATAR_ACCEPTED_TYPES.includes(file.type)) {
        return "Only JPG, PNG and WEBP images are allowed.";
    }
    if (file.size > AVATAR_MAX_BYTES) {
        return "Image must be 2 MB or smaller.";
    }
    return null;
}
