
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    randomBytes,
    randomUUID,
    createHash
} from "crypto";

import authRepository from "../repositories/auth.repository.js";

// Convert duration strings such as 15m, 7d, 2h into milliseconds
const durationToMilliseconds = (duration) => {
    const match = /^(\d+)(s|m|h|d)$/.exec(duration);

    if (!match) {
        throw new Error(`Invalid token duration: ${duration}`);
    }

    const value = Number(match[1]);

    const units = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    return value * units[match[2]];
};

// Register user
const registerUser = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await authRepository.findUserByEmail(
        normalizedEmail
    );

    if (existingUser) {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await authRepository.createUser({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
    });

    return newUser;
};

// Login user
const loginUser = async ({ email, password }) => {
    // 1. Find user
    const normalizedEmail = email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(
        normalizedEmail
    );

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 2. Check account status
    if (!user.is_active) {
        const error = new Error("Account is inactive");
        error.statusCode = 403;
        throw error;
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 4. Read token configuration
    const accessSecret = process.env.JWT_ACCESS_SECRET;

    if (!accessSecret) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    const accessExpiresIn =
        process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

    const refreshExpiresIn =
        process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

    // 5. Generate JWT access token
    const accessToken = jwt.sign(
        {
            role: user.role
        },
        accessSecret,
        {
            subject: user.id,
            expiresIn: accessExpiresIn
        }
    );

    // 6. Generate secure random refresh token
    const refreshToken = randomBytes(64).toString("hex");

    // 7. Hash refresh token before database storage
    const tokenHash = createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    // 8. Generate token family ID
    const familyId = randomUUID();

    // 9. Calculate refresh token expiration
    const refreshExpiresAt = new Date(
        Date.now() + durationToMilliseconds(refreshExpiresIn)
    );

    // 10. Store hashed refresh token
    await authRepository.createRefreshToken({
        userId: user.id,
        tokenHash,
        familyId,
        expiresAt: refreshExpiresAt
    });

    // 11. Return tokens and safe user information
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};

const logoutUser = async ({ refreshToken }) => {
    const tokenHash = createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    await authRepository.revokeRefreshToken(tokenHash);

    return {
        message: "Logout successful"
    };
};

// refreshToken
const refreshAccessToken = async ({ refreshToken }) => {
    // 1. Hash the incoming refresh token
    const tokenHash = createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    // 2. Generate a replacement refresh token
    const newRefreshToken = randomBytes(64).toString("hex");

    // 3. Hash the replacement token
    const newTokenHash = createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

    // 4. Calculate expiration
    const refreshExpiresIn =
        process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

    const newExpiresAt = new Date(
        Date.now() + durationToMilliseconds(refreshExpiresIn)
    );

    // 5. Rotate the old token in the database
    const rotation = await authRepository.rotateRefreshToken({
        tokenHash,
        newTokenHash,
        newExpiresAt
    });

    // 6. Handle rotation results
    if (rotation.status === "invalid") {
        const error = new Error("Invalid refresh token");
        error.statusCode = 401;
        throw error;
    }

    if (rotation.status === "expired") {
        const error = new Error("Refresh token has expired");
        error.statusCode = 401;
        throw error;
    }

    if (rotation.status === "reuse_detected") {
        const error = new Error(
            "Refresh token reuse detected. Please log in again."
        );
        error.statusCode = 401;
        throw error;
    }

    if (rotation.status === "inactive") {
        const error = new Error("Account is inactive");
        error.statusCode = 403;
        throw error;
    }

    // 7. Generate a new access token
    const accessSecret = process.env.JWT_ACCESS_SECRET;

    if (!accessSecret) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    const accessExpiresIn =
        process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

    const accessToken = jwt.sign(
        {
            role: rotation.user.role
        },
        accessSecret,
        {
            subject: rotation.user.id,
            expiresIn: accessExpiresIn
        }
    );

    // 8. Return the new token pair
    return {
        user: rotation.user,
        accessToken,
        refreshToken: newRefreshToken
    };
};

// Forgot Password
const forgotPasswordUser = async ({ email }) => {
    const user = await authRepository.findUserByEmail(
        email.toLowerCase()
    );

    // Use the same response whether the account exists or not.
    // This prevents email address enumeration.
    if (!user || !user.is_active) {
        return {
            message: "If the account exists, a password reset link will be sent."
        };
    }

    // Generate a secure 32-byte token (64 hexadecimal characters).
    const resetToken = randomBytes(32).toString("hex");

    // Store only the SHA-256 hash in the database.
    const tokenHash = createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await authRepository.createPasswordResetToken({
        userId: user.id,
        tokenHash,
        expiresAt
    });

    const response = {
        message: "If the account exists, a password reset link will be sent."
    };

    // Development only: expose the token so you can test with Postman.
    if (process.env.NODE_ENV === "development") {
        response.resetToken = resetToken;
    }

    return response;
};

const resetPasswordUser = async ({ token, newPassword }) => {
    // Hash the raw token to match the hash stored in PostgreSQL.
    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");

    // Find an unused, unexpired reset token.
    const resetToken =
        await authRepository.findValidPasswordResetToken(tokenHash);

    if (!resetToken) {
        const error = new Error("Invalid or expired password reset token");
        error.statusCode = 400;
        throw error;
    }

    // Hash the new password.
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password and consume the token transactionally.
    const updated = await authRepository.resetPassword({
        resetTokenId: resetToken.reset_token_id,
        userId: resetToken.user_id,
        passwordHash
    });

    if (!updated) {
        const error = new Error("Invalid or expired password reset token");
        error.statusCode = 400;
        throw error;
    }

    return {
        message: "Password reset successful. Please log in again."
    };
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgotPasswordUser,
    resetPasswordUser
};
