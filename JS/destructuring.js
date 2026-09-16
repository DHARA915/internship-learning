//Destructuring in object

const person={
    "firstname":"Dhara",
    "lastname": "Patel"
}

 var {lastname,firstname}=person
console.log(lastname)
console.log(firstname)
console.log(person) //Destructuring does not change the original object.

//For potentially missing properties we can set default values:
var {lastname,firstname,middlename="vijaykumar"}=person
console.log(middlename)
console.log(person)

//Object Property Alias
var {lastname:names}=person
console.log(names)//change lastname with names variable

//String Destructuring
// One use for destructuring is unpacking string characters.

let string="dhara"
let [a,b,c,d,e]=string
console.log(a)//d
console.log()
//Destructuring can be used with any iterables.
const fruits = ["Bananas", "Oranges", "Apples", "Mangos"];

// Destructuring
let [fruit1, fruit2] = fruits;
console.log(fruit1)//Bananas
console.log()

//Skipping Array Values
//We can skip array values using two or more commas:

let [fruit11, , ,fruit22]=fruits
console.log(fruit11)//Bananas
console.log(fruit22)//Mangoes
console.log()

// Array Position Values
// We can pick up values from specific index locations of an array:
const fruitss = ["Bananas", "Oranges", "Apples", "Mangos"];
// Destructuring
let {[0]:fruit111 ,[2]:fruit222} = fruitss;
console.log(fruit111)//Bananas
console.log(fruit222)//Apples

//The Rest Property
// You can end a destructuring syntax with a rest property.
// This syntax will store all remaining values into a new array:

const numbers = [10, 20, 30, 40, 50, 60, 70];

// Destructuring
const [x,y, ...rest] = numbers
console.log(x)//10
console.log(y)//20
console.log(rest)//[ 30, 40, 50, 60, 70 ]

//Destructuring using Map
const fruit = new Map([
    ["apples", 500],
    ["bananas", 300],
    ["oranges", 200]
  ]);

  let [key,value,parameter]=fruit//variable
  console.log(key)
  console.log(value)
  console.log(parameter)
  
//   Destructing
  let text = "";
  for (const [key, value] of fruit) {
    text += key + " is " + value;
  }
  console.log(text)

//Swapping of javascript variables
  let firstName = "Dhara";
let lastName = "Patel";

// Destructing
[firstName, lastName] = [lastName, firstName];//swapp firstname with last name
console.log(firstName)//Patel
console.log(lastName)//Dhara