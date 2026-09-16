const fruits =['Banana','Grapes','Apple','Pineapple'];

console.log(fruits.length)
console.log(fruits.toString())
console.log(fruits.flat())
console.log(fruits.at(2))

fruits.push("Mango")
console.log(fruits)

fruits.pop(2)
// fruits.pop()//give same output
// fruits.pop("Apple")
console.log(fruits)

console.log(fruits.shift())//use for remove first element
console.log(fruits.unshift("Lemon"))//use for add element in start
console.log(fruits)

fruits[fruits.length] = "Kiwi";
console.log(fruits)

delete fruits[3]
console.log(fruits)

//splice methode used for remove element from particular position
fruits.splice(3,1)//remove one element
console.log(fruits)

//concat two array............
let a=[10,20,30,40,50]
let b=[60,70,80,90,100]
let c=[110,120,130,140,150]
a.concat(b)//does not change original array
console.log(a)
p=a.concat(b,c)//concating more than one array
console.log(p)
// console.log(typeof a)

newstr=p.concat(200)
console.log(newstr)

//flatMap method

const newArr=[5,10,15,20]
let result=newArr.flatMap(x=>[x,x*2])
console.log("New Array After FlatMap:" , result)