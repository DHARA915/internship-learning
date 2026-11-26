
import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository.js";
import refreshTokenRepository from "../repositories/refresh-token.repository.js";
import { generateAccessToken } from "../utils/jwt.js";
import {
  generateRefreshToken,
  hashRefreshToken,
  generateTokenFamilyId,
  getRefreshTokenExpiry,
} from "../utils/refresh-token.js";

class AuthService {

  async register({ name, email, password }) {
    // 1. Check whether email already exists
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }

    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      // 3. Create user in PostgreSQL
      const user = await userRepository.create({
        name,
        email,
        passwordHash,
      });

      // 4. Return user details (without password)
      return user;
    } catch (error) {
      // Handle duplicate email if two requests arrive simultaneously
      if (
        error.code === "23505" &&
        error.constraint === "users_email_key"
      ) {
        const conflictError = new Error("Email is already registered");
        conflictError.statusCode = 409;
        throw conflictError;
      }

      throw error;
    }
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error("Your account is inactive");
      error.statusCode = 403;
      throw error;
    }

    const { password_hash, ...safeUser } = user;

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);

    const familyId = generateTokenFamilyId();
    const expiresAt = getRefreshTokenExpiry();

    await refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      familyId,
      expiresAt,
    });

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);

    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashRefreshToken(newRefreshToken);
    const newExpiresAt = getRefreshTokenExpiry();

    const result = await refreshTokenRepository.rotateToken({
      tokenHash,
      newTokenHash,
      newExpiresAt,
    });

    if (result.status === "not_found") {
      const error = new Error("Invalid refresh token");
      error.statusCode = 401;
      throw error;
    }

    if (result.status === "expired") {
      const error = new Error("Refresh token has expired");
      error.statusCode = 401;
      throw error;
    }

    if (result.status === "reuse_detected") {
      const error = new Error("Refresh token reuse detected. Please login again.");
      error.statusCode = 401;
      throw error;
    }

    // Generate a new access token.
    const user = await userRepository.findById(result.token.user_id);

    if (!user || !user.is_active) {
      await refreshTokenRepository.revokeFamily(result.token.family_id);

      const error = new Error("User account is unavailable");
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);

    await refreshTokenRepository.revokeByTokenHash(tokenHash);

    return {
      message: "Logged out successfully",
    };
  }

}

export default new AuthService();
