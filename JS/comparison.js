// Comparing data of different types may give unexpected results.

// When comparing a string with a number, JavaScript will convert the string to a number when doing the comparison. An empty string converts to 0. A non-numeric string converts to NaN which is always false.

Number("2") < Number("12"); // true
Number("2") > Number("12"); // false
c=Number("12") === Number("22"); // false
console.log("C",c)

console.log(2 < 12);        // true
console.log(2 < "12");      // true
console.log(2 < "John");    // false
console.log(2 > "John");    // false
console.log(2 == "John");   // false

console.log([10,10]=="10,10") //true: when comparing array with string, it convert array to string and then compare it with string.
console.log([10,10]==[10,10])//false:comparing two array is always false because they are different object in memory even if they have same properties and values.
let x = "John";
let y = new String("John");

//comparing with bigInt;

let a=10n;
let b=10;

console.log("Comparing BigInt and Number loosely:",a==b);
console.log("Comparing BigInt and Number strictly:",a===b);

console.log(x==y) //true
console.log(x===y) //false

//Note: Alway comparing objectt with === it give false because it compare reference of object not value of object.
//compparing two js object is always false because they are different object in memn=ory even if they have same properties and values.