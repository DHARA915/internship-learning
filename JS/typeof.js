// The typeof operator returns the data type of a JavaScript variable.
/*JavaScript has 7 primitive data types:

string
number
boolean
bigint
symbol
null
undefined*/

typeof "John"         // Returns string
typeof ("John"+"Doe") // Returns string
typeof 3.14           // Returns number
typeof 33             // Returns number
typeof (33 + 66)      // Returns number
typeof true           // Returns boolean
typeof false          // Returns boolean
typeof 1234n          // Returns bigint
typeof Symbol()       // Returns symbol
typeof x              // Returns undefined

typeof null           // Returns object primitive value

typeof {name:'John'}   // Returns object
typeof [1,2,3,4]       // Returns object
typeof new Map()       // Returns object
typeof new Set()       // Returns object

console.log(typeof function (){} );  // Returns function

// An empty value has nothing to do with undefined.
let car = "";
console.log(typeof car)//string
let y
console.log(typeof y)//undefined






