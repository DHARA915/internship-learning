// task:3 --> Q:1 :Read a file, convert content to uppercase, write to new file - using fs/promises


const fs = require('fs/promises');
const path = require('path');

const INPUT_FILE = path.join(__dirname, "files", "input.txt");
const OUPUT_FILE = path.join(__dirname, "files", "output.txt");

async function convertToUppercase() {
    try {
        const content = await fs.readFile(INPUT_FILE, 'utf-8');

        const uppercaseContent = content.toUpperCase();

        await fs.writeFile(OUPUT_FILE, uppercaseContent, 'utf-8');
        console.log("File converted successfully!");
        console.log(`Output file: ${OUPUT_FILE}`);

    }
    catch (err) {
        console.log("File Processting failed", err.message);
        process.exitCode = 1;
    }
}

convertToUppercase();
