
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validator.js";
import authService from "../services/auth.service.js";

class AuthController {

  //   Register User
  async register(req, res, next) {
    try {
      // 1. Validate request body
      const validatedData = registerSchema.parse(req.body);

      // 2. Register user
      const user = await authService.register(validatedData);

      // 3. Send response
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      // 1. Validate login data
      const validatedData = loginSchema.parse(req.body);

      // 2. Authenticate user
      const user = await authService.login(validatedData);

      // 3. Send response
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: user.user,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh Token
  async refresh(req, res, next) {
    try {
      const validatedData = refreshTokenSchema.parse(req.body);

      const tokens = await authService.refresh(
        validatedData.refreshToken
      );

      return res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const validatedData = refreshTokenSchema.parse(req.body);

      await authService.logout(validatedData.refreshToken);

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Check Middleare working 
  getProfile(req, res) {
  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: {
      user: req.user,
    },
  });
}

}

export default new AuthController();
