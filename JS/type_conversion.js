//JavaScript variables can be converted to a new variable and another data type:

//By the use of a JavaScript function
//Automatically by JavaScript itself

//The global method Number() converts a variable (or a value) into a number.
console.log(Number("3.14"),//3.14
    Number(Math.PI),//3.141592653589793
    Number(" "),//0
    Number(""))//0

console.log(Number("99 88"),//Nan
    Number("John"))//Nan

// The unary + operator can be used to convert a variable to a number:
y = "5";      // y is a string
x = + y;      // x is a number(Convert y into number using + operator at starting)
console.log(typeof x) //number
console.log("Cheaking x:" , x)

y = "John";   // y is a string
x = + y;      // x is a number (NaN)

//number to string
String(x)         // returns a string from a number variable x
String(123)       // returns a string from a number literal 123
String(100 + 23)  // returns a string from a number from an expression

// The Number method toString() does the same.
x.toString()
// (123).toString()
// (100 + 23).toString()

// The global method Number() can be used to convert dates to numbers.

d = new Date();
Number(d)          // returns 1404568027739
d = new Date();
d.getTime()        // returns 1404568027739

String(Date())  // returns "Thu Jul 17 2014 15:38:19 GMT+0200 (W. Europe Daylight Time)"
Date().toString()  // returns "Thu Jul 17 2014 15:38:19 GMT+0200 (W. Europe Daylight Time)"

//boolean to number
Number(false)     // returns 0
Number(true)      // returns 1

//boolean string
String(false)      // returns "false"
String(true)       // returns "true"

// Automatic Type Conversion

5 + null    // returns 5         because null is converted to 0
"5" + null  // returns "5null"   because null is converted to "null"
"5" + 2     // returns "52"      because 2 is converted to "2"
"5" - 2     // returns 3         because "5" is converted to 5
"5" * "2"   // returns 10        because "5" and "2" are converted to 5 and 2