// A JavaScript Boolean represents one of two values: true or false.

console.log(1<5)//true
console.log(55>96)//false
console.log(false)//false
console.log(true)//true

// Boolean() is used for  find out if an expression (or a variable) is true:

val=Boolean(12>56)
console.log(val)//false

val=Boolean('')
console.log(val)//false:empty string returns false

val=Boolean('dhara')
console.log(val)//true

val=Boolean(0)
console.log(val)//false

val=Boolean(0)
console.log(val)//false

val=Boolean('0')
console.log(val)//true

var x;
console.log(Boolean(x)) //false:undefined  returns false

var x=null;
console.log(Boolean(x)) //false:null  returns false


var x = 10 / "Hallo";
console.log(Boolean(x)) //false

var x = false;
var y = new Boolean(false);//true
console.log(x==y)

var x = false;
var y = new Boolean(false);//false
console.log(x===y)

var x = new Boolean(false);
var y = new Boolean(false);
console.log(x===y) //false : Comparing two JavaScript objects always return false.
