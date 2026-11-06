import { add, subtract, multiply } from "./es_math.js";
import Calculator from "./es_calculator.js";

console.log("Addition:", add(10, 5));
console.log("Subtraction:", subtract(10, 5));
console.log("Multiplication:", multiply(10, 5));

const calc = new Calculator();

console.log("Division:", calc.divide(10, 5));


/*
3 Differences between CommonJS and ES Modules:

1. CommonJS uses require(); ES Modules use import.
2. CommonJS uses module.exports; ES Modules use export.
3. CommonJS traditionally uses synchronous require();
   ES Modules support static and dynamic imports.
*/