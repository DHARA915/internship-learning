const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "files", "large-file.dat");

// Create files folder if it doesn't exist
fs.mkdirSync(path.dirname(FILE_PATH), {
    recursive: true
});

const writeStream = fs.createWriteStream(FILE_PATH);

const chunk = Buffer.alloc(1024 * 1024, "A");
const totalChunks = 100;

let count = 0;

function writeData() {
    while (count < totalChunks) {
        count++;

        if (!writeStream.write(chunk)) {
            writeStream.once("drain", writeData);
            return;
        }
    }

    writeStream.end();
}

writeStream.on("finish", () => {
    console.log("100 MB file created successfully!");
});

writeStream.on("error", (error) => {
    console.log("Error:", error.message);
});

writeData();