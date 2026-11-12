// Task:3 Q:13 Build an interactive CLI tool using readline: ask name, age, email - validate each input - save to JSON file

const readline = require("readline/promises");
const fs = require("fs/promises");
const path = require("path");
const { stdin, stdout } = require("process");

const FILE_PATH = path.join(__dirname, "users.json");

// Create readline interface
const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

// Validation functions
function validateName(name) {
    return /^[\p{L}][\p{L}\s'-]*$/u.test(name);
}

function validateAge(age) {
    const value = Number(age);

    return Number.isInteger(value) && value >= 1 && value <= 120;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Ask until valid input is received
async function askValidInput(question, validator, errorMessage) {
    while (true) {
        const answer = (await rl.question(question)).trim();

        if (validator(answer)) {
            return answer;
        }

        console.log("Invalid input:", errorMessage);
    }
}

// Read existing users from JSON file
async function getUsers() {
    try {
        const data = await fs.readFile(FILE_PATH, "utf8");
        const users = JSON.parse(data);

        if (!Array.isArray(users)) {
            throw new Error("users.json must contain a JSON array");
        }

        return users;
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }

        throw error;
    }
}

// Main registration function
async function registerUser() {
    try {
        console.log("\n===== User Registration =====\n");

        // Get and validate name
        const name = await askValidInput(
            "Enter your name: ",
            validateName,
            "Name must contain valid letters."
        );

        // Get and validate age
        const age = await askValidInput(
            "Enter your age: ",
            validateAge,
            "Age must be a whole number between 1 and 120."
        );

        // Get and validate email
        const email = await askValidInput(
            "Enter your email: ",
            validateEmail,
            "Please enter a valid email address."
        );

        // Load existing users
        const users = await getUsers();

        // Create new user
        const newUser = {
            id: users.length > 0
                ? Math.max(...users.map(user => user.id)) + 1
                : 1,
            name,
            age: Number(age),
            email,
            createdAt: new Date().toISOString()
        };

        // Add new user
        users.push(newUser);

        // Save updated users
        await fs.writeFile(
            FILE_PATH,
            JSON.stringify(users, null, 2),
            "utf8"
        );

        console.log("\nRegistration successful!");
        console.log("User Details:", newUser);

    } catch (error) {
        console.error("\nRegistration failed:", error.message);

    } finally {
        rl.close();
    }
}

// Start application
registerUser();