const student={
    name:"Dhara",
    surname:"Patel",
    age:18,
    village:"jalsan",
    education:"B.tech",
    fullname : function(){
            //  return  `Full name:${this.name}+${this.surname}`;
            return `Full name: ${this.name} ${this.surname}`;
             }
    
};
console.log(student.fullname()); 
console.log(student)
console.log()

student.age=19;
console.log(student);
console.log();

student.district="Anand";
console.log(student)

delete student.district;
console.log(student)
console.log()
// adding value externally..........................................................
const car={
};
car.name="I-10";
car.numplate="CB 122";
car.color="white";
console.log(car)
// creating onject by using new object()..............................................
const color= new Object();
color.color1="pink";
color.color2="yellow";
color.color3="green";

console.log(color)

// Accessing By for loops...........................................................
console.log("Accessing By for loops...........................................................")
const person = {
    firstName: "John",
    lastName: "Doe",
    id: 5566,
    fullName: function() {
      return this.firstName + " " + this.lastName;
    }
  };

  for(x in person){
    console.log(person[x])
  }

const t= Object.values(person);
// console.log(t)//it return array.......


//object.entries........................
//show key and value
const fruits = {Bananas:300, Oranges:200, Apples:500};

let text = "";
for (let [fruit, value] of Object.entries(fruits)) {
  text += fruit + ": " + value + "<br>";
}

console.log(person);

const my_string=JSON.stringify(person);
console.log(my_string);

//Object Constructor

function Person(first, last, age, eye) {
  this.firstName = first;
  this.lastName = last;
  this.age = age;
  this.eyeColor = eye;
}

let person1=new Person("Dhara", "Patel", 21, "Brown");
console.log(person1)    
let person2=new Person("Khushi", "Patel", 21, "Black");
console.log(person2)