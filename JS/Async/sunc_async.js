let prompt=require('prompt-sync')();
//synchronous

let a=prompt("Enter you Name:")
let b=prompt("Enter you age:")
let c=prompt("Enter you favorate color:")

let ans=(`${a} have age${b} and favorate color ${c}`) //synchronous
console.log(ans)

//Asynchronous
console.log("start")
setTimeout(function(){
    console.log("Dhara...")//run after 3 second
},3000)
console.log("end")