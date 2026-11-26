
import { randomBytes, createHash, randomUUID } from "node:crypto";

// Generate a secure refresh token
export const generateRefreshToken = () => {
  return randomBytes(64).toString("hex");
};

// Hash refresh token before storing in database
export const hashRefreshToken = (token) => {
  return createHash("sha256")
    .update(token)
    .digest("hex");
};

// Generate a token family ID
export const generateTokenFamilyId = () => {
  return randomUUID();
};

export const getRefreshTokenExpiry = () => {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

  const match = expiresIn.match(/^(\d+)([dhm])$/);

  if (!match) {
    throw new Error("Invalid REFRESH_TOKEN_EXPIRES_IN format");
  }

  const value = Number(match[1]);
  const unit = match[2];

  const milliseconds = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
  };

  return new Date(Date.now() + value * milliseconds[unit]);
};
