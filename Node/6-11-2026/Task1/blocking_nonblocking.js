const fs = require("fs");

// Blocking
console.log("Before readFileSync");

const data = fs.readFileSync("sample.txt","utf8");
console.log("Blocking Data",data);

console.log("After readFileSync");

// Non-blocking
console.log("Before readFile");

fs.readFile("sample.txt", "utf8", (err, data) => {
    if (err) return console.log(err);
    console.log("Non-blocking Data",data);
});

console.log("After readFile");