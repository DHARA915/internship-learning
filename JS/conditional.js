// Turnary operator(? :)
age=5
let x=age>18?"eligible":"not eligible"
console.log(x)

// Nullish coalescing operaor(??)
// The ?? operator returns the first argument if it is not nullish (null or undefined).

let names = "not";
let text = "missing";
let result = names ?? text;
Boolean(result)
console.log(result)

// The ?. operator returns undefined if an object is undefined or null (instead of throwing an error).
const car = {type:"Fiat", model:"500", color:"white"};
console.log(car?.name)

console.log(new Date())
console.log(new Date().getDate())
console.log(new Date().getDay())

//Filter Falsy values

const arr = [0, 1, false, 2, '', 3, null, undefined, NaN];
const filteredArr = arr.filter(Boolean);
console.log("Filtered Array:", filteredArr); 
