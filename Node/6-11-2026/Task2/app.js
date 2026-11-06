const {add, subtract, multiply} = require('./math');

const Calculator = require('./calculator');

console.log("Addition: ", add(5, 3)); // Output: 8
console.log("Subtraction: ", subtract(5, 3));
console.log("Multiplication: ", multiply(5, 3));

const calc = new Calculator();

console.log("Division:",calc.divide(10, 2));