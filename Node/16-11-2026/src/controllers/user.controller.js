
import userRepository from "../repositories/user.repository.js";


export const getUsers = async (req, res, next) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // Validate pagination values
        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or limit"
            });
        }

        const result = await userRepository.findAllPaginated(
            page,
            limit
        );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

export const getUsersWithCursor = async (req, res, next) => {

    try {

        const limit = Number(req.query.limit) || 10;

        // Cursor is optional for the first page
        const cursor = req.query.cursor === undefined
            ? 0
            : Number(req.query.cursor);

        // Validate cursor and limit
        if (
            !Number.isSafeInteger(cursor) ||
            cursor < 0 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid cursor or limit"
            });
        }

        const result = await userRepository.findAllWithCursor(
            cursor,
            limit
        );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

// GET /api/users/:id - Get user by ID
export const getUserById = async (req, res, next) => {
    try {
        const user = await userRepository.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
};


// POST /api/users - Create user
export const createUser = async (req, res, next) => {
    try {

        const { name, email, passwordHash, role } = req.body;

        const existingUser = await userRepository.findByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const user = await userRepository.create({
            name,
            email,
            passwordHash,
            role
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
};


// PUT /api/users/:id - Update user
export const updateUser = async (req, res, next) => {
    try {
        const { name, email, password_hash, role } = req.body;

        const user = await userRepository.update(
            req.params.id,
            { name, email, password_hash, role }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
};


// DELETE /api/users/:id - Delete user
export const deleteUser = async (req, res, next) => {
    try {
        const user = await userRepository.delete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
};
