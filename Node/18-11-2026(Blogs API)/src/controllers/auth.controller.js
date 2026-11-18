
import authService from "../services/auth.service.js";

// Register user
const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user
            }
        });

    } catch (error) {
        next(error);
    }
};

// Login user
const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    const result = await authService.logoutUser(req.body);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

// refresh access token 
const refresh = async (req, res, next) => {
    try {
        const result = await authService.refreshAccessToken(req.body);

        return res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPasswordUser(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      ...(result.resetToken && {
        resetToken: result.resetToken
      })
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPasswordUser(req.body);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export default {
    register,
    login,
    logout,
    refresh,
    forgotPassword,
    resetPassword
};
