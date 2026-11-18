
import apiKeyService from "../services/apiKey.service.js";

const createApiKey = async (req, res, next) => {
    try {

        // Get authenticated user's ID
        const userId = req.user.id;

        // Generate API key
        const result = await apiKeyService.generateApiKey(userId);

        return res.status(201).json({
            success: true,
            message: "API key generated successfully. Save it securely; it will not be shown again.",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export default {
    createApiKey
};
