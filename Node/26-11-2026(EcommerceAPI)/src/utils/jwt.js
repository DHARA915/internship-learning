
import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
      issuer: "ecommerce-api",
      audience: "ecommerce-users",
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET,
    {
      issuer: "ecommerce-api",
      audience: "ecommerce-users",
    }
  );
};
