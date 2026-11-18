
import userRepository from "../repositories/user.repository.js";

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userRepository.findAllUsers();

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await userRepository.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (name === undefined && email === undefined) {
            return res.status(400).json({
                success: false,
                message: "Provide name or email to update"
            });
        }

        const updatedUser = await userRepository.updateUser(
            req.params.id,
            { name, email }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        next(error);
    }
};

export default {
    getAllUsers,
    getProfile,
    updateUser
};
