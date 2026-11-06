
const [operation, num1, num2] = process.argv.slice(2);

const a = Number(num1);
const b = Number(num2);

if (!["add", "sub", "mul", "div"].includes(operation)) {
    console.log("Invalid operation! Use add, sub, mul, div.");
    process.exitCode = 1;
} 
else if (num1 === undefined || num2 === undefined ||
           num1.trim() === "" || num2.trim() === "" ||
           !Number.isFinite(a) || !Number.isFinite(b)) {
    console.log("Invalid input! Please enter two valid numbers.");
    process.exitCode = 1;
} 
else if (operation === "div" && b === 0) {
    console.log("Error: Division by zero is not allowed.");
    process.exitCode = 1;
} 
else {
    let result;

    switch (operation) {
        case "add":
            result = a + b;
            break;
        case "sub":
            result = a - b;
            break;
        case "mul":
            result = a * b;
            break;
        case "div":
            result = a / b;
            break;
    }

    console.log("Result:", result);
}
