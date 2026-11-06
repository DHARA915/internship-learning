import fs from "node:fs";

if (fs.existsSync("temp")) {
    fs.rmSync("temp", { recursive: true, force: true });
    console.log("Temp folder cleaned!");
} else {
    console.log("Temp folder does not exist.");
}