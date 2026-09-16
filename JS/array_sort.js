//in js arrays are sorted alphabetically

fruits = ['Banana', 'Grapes', 'Apple', 'Pineapple'];
console.log(fruits.sort())

num = [12, 33, 56, 100, 89, 75]
console.log(num.sort())//arrays are sorted as UTF- code not as numbers

console.log(num.sort((x, y) => x - y))//Ascending order
console.log(num.sort((x, y) => y - x))//Decending order

num1 = [12, 54, 33, 98, 78, 52]
console.log(num1.reverse()) //to reverse an array
const sorted = num1.toSorted();//sort an array without altering original array
console.log(sorted)

const reverse = num1.toReversed();//reverse an array without altering original array
console.log(reverse)

// maximum and minimum element of an array
const points = [40, 100, 1, 5, 25, 10];
function myArrayMin(arr) {
    return Math.min.apply(null, arr);
}
function myArraymax(arr) {
    return Math.min.apply(null, arr);//Older way
    
}
function MyArrayTesting(arr) {
   return Math.max(...arr) //Modern way 
}
console.log(myArrayMin(points))
console.log(myArraymax(points))
console.log(MyArrayTesting([40,100,1,5,25,10]))
