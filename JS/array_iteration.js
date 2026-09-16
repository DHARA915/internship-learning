arr=[100,52,65,78,9,23,29]

arr.forEach(x=>{return x})
console.log(arr)


//map methoed used for creating new array by performing a function on element
let newarr=arr.map(x=>{
    return x-1
})
console.log(newarr)

//faltmap function ,first map all element of an array and then create new array by flatting on array element
let arr2= arr.flatMap(x=>x*2)
console.log(arr2)

//filter methode is used for filtering element of an array based on condition
let arr3=arr.filter(x=>x>50)
console.log(arr3)

//reduce methode reduce an array
fun1 = (value) =>{
    return value
   }
let arr4=arr.reduce(fun1)

console.log(arr4)

//every methode cheak all element satisfied condtion written in function
const numbers = [45, 4, 9, 16, 25];
let allOver18 = numbers.every(myFunction);
let AllOver18 = numbers.some(myFunction);
function myFunction(value, index, array) {
    return value > 18;
  }
console.log(allOver18)
console.log(AllOver18)

