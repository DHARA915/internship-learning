
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import userRepository from "../repositories/user.repository.js";

// Configuration
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || "15m";

const REFRESH_TOKEN_DAYS = Number(
    process.env.REFRESH_TOKEN_DAYS || 7
);

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

// Custom error helper
const createError = (message, statusCode) => {

    const error = new Error(message);
    error.statusCode = statusCode;

    return error;
};

// Generate access token
const generateAccessToken = (userId, role) => {

    return jwt.sign(
        { role },
        JWT_SECRET,
        {
            subject: String(userId),
            expiresIn: ACCESS_TOKEN_EXPIRY,
            algorithm: "HS256"
        }
    );

};

// Generate random refresh token
const generateRefreshToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// Hash refresh token
const hashRefreshToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

// Calculate refresh token expiry
const getRefreshTokenExpiry = () => {
    return new Date(
        Date.now() +
        REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000
    );
};

class AuthService {

    // USER REGISTRATION
    async registerUser(userData) {

        const { name, email, password } = userData;

        // Check if user already exists
        const existingUser = await userRepository.findByEmail(email);

        if (existingUser) {
            throw createError("Email already registered", 409);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(
            password,
            SALT_ROUNDS
        );

        try {

            // Create user in database
            const user = await userRepository.createUser({
                name,
                email,
                passwordHash
            });

            return user;

        } catch (error) {

            if (error.code === "23505") {
                throw createError("Email already registered", 409);
            }

            throw error;

        }

    }

    // USER LOGIN
    async loginUser(loginData) {

        const { email, password } = loginData;

        // Find user
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw createError("Invalid email or password", 401);
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            throw createError("Invalid email or password", 401);
        }

        // Generate access token
        const accessToken = generateAccessToken(
            user.id,
            user.role
        );

        // Generate refresh token
        const refreshToken = generateRefreshToken();

        // Hash refresh token
        const tokenHash = hashRefreshToken(refreshToken);

        // Calculate expiry
        const expiresAt = getRefreshTokenExpiry();

        // Create new token family for this login session
        const family_id = crypto.randomUUID();

        // Store refresh token hash
        await userRepository.createRefreshToken({
            userId: user.id,
            tokenHash,
            expiresAt,
            family_id
        });

        // Remove password hash from response
        const { password_hash, ...safeUser } = user;

        return {
            user: safeUser,
            accessToken,
            refreshToken,
            expiresAt
        };

    }

    // REFRESH ACCESS TOKEN
    async refreshAccessToken(refreshToken) {

        // Validate refresh token format
        if (
            typeof refreshToken !== "string" ||
            !/^[a-f0-9]{64}$/i.test(refreshToken)
        ) {
            throw createError("Invalid refresh token", 401);
        }

        // Hash received refresh token
        const tokenHash = hashRefreshToken(refreshToken);

        // Generate replacement refresh token
        const newRefreshToken = generateRefreshToken();

        const newTokenHash = hashRefreshToken(newRefreshToken);

        // Calculate new expiry
        const newExpiresAt = getRefreshTokenExpiry();

        // Rotate refresh token in database
        const result = await userRepository.rotateRefreshToken({
            tokenHash,
            newTokenHash,
            newExpiresAt
        });

        // Handle repository results
        if (result.status === "invalid") {
            throw createError("Invalid refresh token", 401);
        }

        if (result.status === "expired") {
            throw createError("Refresh token expired", 401);
        }

        if (result.status === "reuse_detected") {
            throw createError(
                "Refresh token reuse detected. Please login again.",
                401
            );
        }

        // Generate new access token
        const accessToken = generateAccessToken(
            result.userId,
            result.role
        );

        return {
            accessToken,
            refreshToken: newRefreshToken,
            expiresAt: newExpiresAt
        };

    }

    // LOGOUT 
    async logoutUser(refreshToken) {

        // Hash the original refresh token
        const tokenHash = hashRefreshToken(refreshToken);

        // Revoke token in database
        await userRepository.revokeRefreshToken(tokenHash);

        return {
            message: "Logout successful"
        };
    }


}

export default new AuthService();
