
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "./src/config/db.js";

dotenv.config();

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: "Admin@123",
        role: "admin"
    },
    {
        name: "Editor User",
        email: "editor@example.com",
        password: "Editor@123",
        role: "editor"
    },
    {
        name: "Normal User 1",
        email: "user1@example.com",
        password: "User@123",
        role: "user"
    },
    {
        name: "Normal User 2",
        email: "user2@example.com",
        password: "User@123",
        role: "user"
    },
    {
        name: "Normal User 3",
        email: "user3@example.com",
        password: "User@123",
        role: "user"
    }
];

async function seedUsers() {
    try {
        for (const user of users) {

            const passwordHash = await bcrypt.hash(
                user.password,
                Number(process.env.BCRYPT_SALT_ROUNDS) || 12
            );

            await pool.query(
                `INSERT INTO users (name, email, password_hash, role)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (email) DO NOTHING`,
                [
                    user.name,
                    user.email,
                    passwordHash,
                    user.role
                ]
            );
        }

        console.log("5 test users seeded successfully!");

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await pool.end();
    }
}

seedUsers();
