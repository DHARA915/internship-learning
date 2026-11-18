import authService from "../services/auth.service.js";

class AuthController {

    // REGISTER
    async register(req, res, next) {


        try {

            const user = await authService.registerUser(
                req.validatedBody
            );

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                user
            });

        } catch (error) {

            next(error);

        }

    }

    // LOGIN
    async login(req, res, next) {


        try {

            const result = await authService.loginUser(
                req.validatedBody
            );

            return res.status(200).json({

                success: true,
                message: "Login successful",

                user: result.user,

                tokens: {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
                    refreshTokenExpiresAt: result.expiresAt
                }

            });

        } catch (error) {

            next(error);

        }

    }

    // Refresh Token 
    async refresh(req, res, next) {

        try {

            const result = await authService.refreshAccessToken(
                req.validatedBody.refreshToken
            );

            return res.status(200).json({

                success: true,
                message: "Token refreshed successfully",

                tokens: {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
                    refreshTokenExpiresAt: result.expiresAt
                }

            });

        } catch (error) {
            next(error);
        }

    }

    // LOGOUT 
    async logout(req, res, next) {
        try {

            await authService.logoutUser(
                req.validatedBody.refreshToken
            );

            // Clear cookie only if your application uses one
            // res.clearCookie("refreshToken");

            return res.status(200).json({
                success: true,
                message: "Logout successful"
            });

        } catch (error) {
            next(error);
        }
    }



}

export default new AuthController();