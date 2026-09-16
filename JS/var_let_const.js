// global scope

// var x=10;
// console.log(x);
//  var x=20;
// console.log(x)

// {
//     var x=100;
//     console.log(x);
// }

// {
//     var x=500;
//     console.log(x);
// }

//  function sco(){
//     var x=30;
//     console.log(x)
//     var x=50;
//     console.log(x);
// }

// sco(); 
// console.log(x) 

// // function scope
// var x=10;
// console.log(x);
// function scope(){
//     var x=20;
//     console.log(x);
// }

// scope();
// console.log(x);

// used last value of var except function scope
// ...................................................................................
// block scope

// let x=10;
// console.log(x);
// x=30//no error
 // let x=20;//error
// console.log(x)

// {
//     let x=20;
//     console.log(x);
// }

// function scope(){
//     let x=20;
//     console.log(x);
// }
// scope()
// console.log(x)



// ..........................................................................................

// block scope
const x=10;
console.log(x);
// x=50;//error
console.log(x)

//  var x=20;//error
// console.log(x)

{
    const x=20;
    console.log(x);
}
{
    const x=30;
    console.log(x)
    // const x=50;//error
    // console.log(x);
}
console.log(x)

