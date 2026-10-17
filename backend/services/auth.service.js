import crypto from "crypto";

import bcrypt from "bcryptjs";

import { User } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import { issueToken } from "../utils/token.js";

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

const hashResetToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

/** True when Gmail credentials are configured in the environment. */
const mailConfigured = () =>
    Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

/**
 * Sends the password-reset link over email using Gmail + Nodemailer.
 * `nodemailer` is imported lazily so the dependency is only touched when an
 * email actually needs to go out.
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
    const nodemailer = (await import("nodemailer")).default;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    await transporter.sendMail({
        from: `"Blog Management" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Reset your password",
        text: `You requested a password reset.\n\nOpen this link to choose a new password:\n${resetUrl}\n\nThis link expires in 15 minutes. If you did not request this, you can ignore this email.`,
        html: `<p>You requested a password reset.</p>
               <p><a href="${resetUrl}">Click here to choose a new password</a></p>
               <p>This link expires in 15 minutes. If you did not request this, you can safely ignore this email.</p>`
    });
};

/**
 * Creates a new account. The role is hard-coded to "user" here on purpose —
 * a client can never promote itself to admin through registration.
 */
export const createAccount = async ({ firstname, lastname, email, password }) => {
    const normalisedEmail = email.trim().toLowerCase();

    const alreadyExists = await User.findOne({ where: { email: normalisedEmail } });
    if (alreadyExists) {
        throw ApiError.conflict("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: normalisedEmail,
        password: hashedPassword,
        role: "user",
        isActive: true
    });

    // Return a plain object without the password hash.
    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        profileImage: user.profileImage
    };
};

/**
 * Verifies credentials and returns a signed token plus the safe user object.
 * Deactivated accounts are refused even with a correct password.
 */
export const authenticateUser = async ({ email, password }) => {
    const normalisedEmail = email.trim().toLowerCase();

    // withPassword scope is required so bcrypt has a hash to compare against.
    const user = await User.scope("withPassword").findOne({
        where: { email: normalisedEmail }
    });

    if (!user) {
        throw ApiError.unauthorized("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw ApiError.unauthorized("Invalid email or password.");
    }

    if (!user.isActive) {
        throw ApiError.forbidden("This account has been deactivated.");
    }

    return {
        token: issueToken(user),
        user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            profileImage: user.profileImage
        }
    };
};

/**
 * Starts the "forgot password" flow. A random token is generated; only its
 * SHA-256 hash is stored, together with a short expiry. To keep the endpoint
 * from revealing which emails are registered, the same generic message is
 * returned whether or not the account exists.
 *
 * In production the reset link is emailed to the user via Gmail. In
 * development (or whenever Gmail is not configured) the raw token is returned
 * in the response instead, so the reset page can be tested without a mail
 * server. Either way the same generic message is returned.
 */
export const beginPasswordReset = async ({ email }) => {
    const normalisedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: normalisedEmail } });

    const genericMessage =
        "If an account exists for that email, a password reset link has been sent.";

    if (!user) {
        return { message: genericMessage };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    user.resetTokenHash = hashResetToken(rawToken);
    user.resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${rawToken}`;
    const payload = { message: genericMessage };

    // Email the link when mail is configured (always attempted in production).
    // A send failure is logged but never leaks whether the account exists.
    let emailed = false;
    if (process.env.NODE_ENV === "production" || mailConfigured()) {
        try {
            await sendPasswordResetEmail(user.email, resetUrl);
            emailed = true;
        } catch (error) {
            console.error("Password reset email failed:", error.message);
        }
    }

    // Outside production, if no email went out, hand the link back so the flow
    // stays testable locally.
    if (!emailed && process.env.NODE_ENV !== "production") {
        payload.resetToken = rawToken;
        payload.resetUrl = resetUrl;
    }

    return payload;
};

/**
 * Completes the flow: validates the token against the stored hash and expiry,
 * sets the new password and clears the one-time token.
 */
export const completePasswordReset = async ({ token, password }) => {
    if (!token) {
        throw ApiError.badRequest("A reset token is required.");
    }

    const user = await User.scope("withResetToken").findOne({
        where: { resetTokenHash: hashResetToken(token) }
    });

    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt.getTime() < Date.now()) {
        throw ApiError.badRequest("This reset link is invalid or has expired.");
    }

    user.password = await bcrypt.hash(password, SALT_ROUNDS);
    user.resetTokenHash = null;
    user.resetTokenExpiresAt = null;
    await user.save();
};
