
import accountRepository from "../repositories/account.repository.js";

export const transferBalance = async (req, res, next) => {
    try {
        const { fromAccountId, toAccountId, amount } = req.body;

        // Basic validation
        if (
            !Number.isInteger(fromAccountId) ||
            !Number.isInteger(toAccountId) ||
            fromAccountId <= 0 ||
            toAccountId <= 0 ||
            fromAccountId === toAccountId ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid account IDs or transfer amount"
            });
        }

        const result = await accountRepository.transferBalance(
            fromAccountId,
            toAccountId,
            amount
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        if (
            error.message === "Insufficient balance" ||
            error.message === "One or both accounts not found"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    }
};
