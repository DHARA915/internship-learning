// The JavaScript Math object allows you to perform mathematical tasks on numbers.
// Unlike other objects. the Math object has no constructor.
// The Math object is static.
// All methods and properties can be used without creating a Math object first.
// The syntax for any Math property is : Math.property.

a=Math.E        // returns Euler's number
console.log(a)
a=Math.PI       // returns PI
console.log(a)
a=Math.SQRT2    // returns the square root of 2
console.log(a)
a=Math.SQRT1_2  // returns the square root of 1/2
console.log(a)
a=Math.LN2      // returns the natural logarithm of 2
console.log(a)
a=Math.LN10     // returns the natural logarithm of 10
console.log(a)
a=Math.LOG2E  // returns base 2 logarithm of E
console.log(a)
a=Math.LOG10E   // returns base 10 logarithm of E
console.log(a)

// .............................      Math methods    ...........................

let x=3.9

a=Math.round(x) //round off number to the nearest
console.log(a)

a=Math.ceil(x)// round off to up
console.log(a)

a=Math.floor(x)//round off to down
console.log(a)

a=Math.trunc(x)//return integer part 
console.log(a)

a=Math.pow(2,3)//return 2^3=8
console.log(a)

a=Math.sin(x)//return value between -1 to 1
console.log(a)

a=Math.cos(x)//return value between -1 to 1
console.log(a)

let b;
c=Math.sign(b)//return 1 for positive -1 for negative and 0 for null or 0. for undifined NaN.
console.log(c)


a=Math.log(x)//log(3.9)
console.log(a)

a=Math.log2(x)//Based 2 log(3.9)
console.log(a)

d=Math.abs(-6.3)//returns absolute positive value
console.log(d)

d=Math.min(0, 150, 30, 20, -8, -200);//Returns minimum element of an array
console.log(d)
d=Math.max(0, 150, 30, 20, -8, -200);//Return maximum element of an array

//...............      Math.random function        ..................................
console.log(Math.floor(Math.random()*20))
console.log(Math.floor(Math.random() * 10))
console.log(Math.floor(Math.random() * 10) + 1);

