// // set

// const v=new Set()
// v.add("a")//add methon is used to add values in set
// v.add("b")
// v.add("c")
// v.add("d")
// console.log(v) //Set(4) { 'a', 'b', 'c', 'd' }

// const letters = new Set(["a","b","c"]);

// // List all Elements
// let text = "";
// for (const x of letters) { //for of method is used in set,array,map
//   text += x;
// }
// console.log(text)
// console.log(typeof letters )
// console.log(Boolean(letters instanceof Set));  //return true because letters is istanceof Set
// console.log(letters.has('a'))//return true if letter exist in set
// console.log(letters.has('p'))//return false if letter does not exist in set

// //set Methods

// //add method used for adding values in set]
//   const setsadd=new Set()
//   setsadd.add("D")
//   setsadd.add("h")
//   setsadd.add("a")
//   setsadd.add("r")
//   setsadd.add("a")//not consider in set becase it has unique value
//  console.log(setsadd)

//  var str=""
//  for(const x of setsadd){
//     str += x
//  }
//  console.log(str)

//  //.has():it is used for cheak if particular character is in set or not
//  //it returns true or false (Boolean)value
//  console.log(setsadd.has('a'))//true
//  console.log(setsadd.has('l'))//false

//  //forEach(): method invokes a function for each Set element:

//  var str=""
//  setsadd.forEach(function(value){
//     str+=value
//  })
//  console.log(str)

//  //values():method returns an Iterator object with the values in a set
//  const myiterator=setsadd.values()
//  console.log("sets value:",myiterator)
//  console.log(typeof myiterator)

//  //A Set has no keys, so keys() returns the same as values().
//  //This makes Sets compatible with Maps.

//  const myIterator = setsadd.keys();
//  console.log(myIterator)

//  //entries() : returns an Iterator with [value,value] pairs from a Set.
//  const MyIterator = setsadd.entries();
//  console.log(MyIterator)


//  const newSet=new Set(["Dhara","Khushi","Parthiv","Harsh","Karan"])

//  console.log("Newset",newSet)
//  console.log(newSet.has("Karan"))//true

//  console.log("Set Keys:",newSet.keys())
//  console.log("Set Entries:",newSet.entries())//key and values is same and in object of an array

//  //extracting value from set
//  let text="";
//  const setIterator = newSet.values();
//  for (const entry of setIterator) {
//     text += entry+" ";
//   }
//   console.log("Extracting value from newSet:",text)


//  for(let name of newSet){
//    console.log(name)
//  }

//  const arr = [...newSet]
//  console.log("Array:",arr)
//  console.log(arr.findLast((name) => name === "Dhara"))

 //Set Logic

 const set1= new Set([1,2,3,4,5,6,7,8,9])
 const set2= new Set([5,6,7,8,9,10,11,12,13])
 const set3 =  new Set([50,60,70,80,90,100])

 console.log("Set Union:",set1.union(set2));
 console.log("Set Intersection:",set1.intersection(set2));//values in both sets
 console.log("Set Difference:",set1.difference(set2));//values in set1 but not in set 2
 console.log("Set Symmetric Difference:",set1.symmetricDifference(set2));//no common values in both sets
 console.log("Set is Disjoint Method:",set1.isDisjointFrom(set3));//yes beacuse there is no common values in both set
 
