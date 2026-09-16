// //new Map([iterable])  
// //The JavaScript Map object is used to map keys to values. It stores each element as key-value pair. It operates the elements such as search, update and delete on the basis of specified key.

// const fruits = new Map([
//     ["apples", 500],
//     ["bananas", 300],
//     ["oranges", 200]
// ],)
// console.log(fruits.has("bananas"))

// console.log(fruits) //Map(3) { 'apples' => 500, 'bananas' => 300, 'oranges' => 200 }
// console.log(fruits.get("apples"));//get method
// fruits.set("pineapple", 560)
// console.log(fruits)
// console.log(fruits.size)//3


// fruits.set("apples", 600)//upadate value
// console.log(fruits)


// console.log(fruits.size)//3

// fruits.delete("apples")
// console.log(fruits)
// // fruits.clear()
// // console.log(fruits)//{}

// //The has() method returns true if a key exists in a map:
// console.log(fruits.has("bananas"))//true
// console.log(fruits.has("apples"))//false

// //entries()
// var text = "";
// for (const x of fruits.entries()) {
//   text += x;
// }
// console.log(text)

// //key
// var text = "";
// for (const x of fruits.keys()) {
//   text += x+" ";
// }
// console.log(text)

// //values
// var text = "";
// for (const x of fruits.values()) {
//   text += x+" ";
// }
// console.log(text)


//Example of Prie of Playing elements;

let element = new Map([
  ["Ball",50],
  ["Bat",100],
  ["Gloves",75] ,
  ["Helmet",150],
])

console.log(element)

element.set("Bat",150);
element.set("stumps",500);
console.log(element);

console.log(element.get("Ball"))
console.log(element.has("Helmet"))
console.log(element.has("Tshirt"))
console.log("Size:",element.size)


for(const ele of element){
  console.log(ele)
}

console.log("Keys.................................................................")

for(const ele of element.keys()){
  console.log(ele)
}

console.log("Values.................................................................")
for(const ele of element.values()){
  console.log(ele)
}

console.log("Entries.................................................................")

for(const [key,value] of element.entries()){
  console.log(key, value)
}