
import pool from "../config/db.js";

class AccountRepository {

    async transferBalance(fromAccountId, toAccountId, amount) {

        // Get a dedicated database connection
        const client = await pool.connect();

        try {

            // Start transaction
            await client.query("BEGIN");

            // Lock both accounts to prevent concurrent modifications
            const result = await client.query(
                `SELECT id, account_holder, balance
                 FROM accounts
                 WHERE id = ANY($1::int[])
                 ORDER BY id
                 FOR UPDATE`,
                [[fromAccountId, toAccountId]]
            );

            if (result.rows.length !== 2) {
                throw new Error("One or both accounts not found");
            }

            const fromAccount = result.rows.find(
                account => account.id === fromAccountId
            );

            const toAccount = result.rows.find(
                account => account.id === toAccountId
            );

            // Check sufficient balance
            if (Number(fromAccount.balance) < Number(amount)) {
                throw new Error("Insufficient balance");
            }

            // Debit from sender
            await client.query(
                `UPDATE accounts
                 SET balance = balance - $1
                 WHERE id = $2`,
                [amount, fromAccountId]
            );

            // Credit receiver
            await client.query(
                `UPDATE accounts
                 SET balance = balance + $1
                 WHERE id = $2`,
                [amount, toAccountId]
            );

            // Commit transaction
            await client.query("COMMIT");

            return {
                fromAccountId,
                toAccountId,
                amount,
                message: "Money transferred successfully"
            };

        } catch (error) {

            // Undo all changes if anything fails
            await client.query("ROLLBACK");

            throw error;

        } finally {
            // Release database connection - mandatory 
            client.release();
        }
    }
}

export default new AccountRepository();
