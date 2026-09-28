
let FirstName: string = "Dhara"
console.log(FirstName)

let ag: number = 22;
let isStudent: boolean = true;

// Typescript Inference: automaticallu know types....

let Myname = "Dhara";
let Myage = 21;

// For Arrays

let names: string[] = ["Dhara", "Bansi", "Amit"];
let namess: Array<string> = ["Dhara", "Bansi", "Amit"];

let marks: number[] = [80, 90, 100];
let markss: Array<number> = [80, 90, 100]

// marks.push("Hello");// Give erro because marks only accept number array

// For Objects
let user: {
    name: string,
    age: number,
    isActive: boolean
} = {
    name: "Dhara",
    age: 21,
    isActive: true
}

// OR

// Using Type 
type User = {
    name: string,
    age: number,
    isActive: boolean
}

let user1:User={
    name: "Dhara",
  age: 21,
  isActive: true,
}
user1.age=25;
console.log("user1:",user1)

// Using Interface...

interface IntUser{
  name: string;
 readonly age: number;
  isActive: boolean;
}

let user2: IntUser = {
  name: "Dhara",
  age: 21,
  isActive: true,
};

// user2.age=29;//readonly define in Interface
console.log("User2:",user2)

// For functions

function add(a: number, b: number): number {
    return a + b;
}

// Void if function doesn't return anything:

function printName (name:string):void{
    console.log("name")
}

// option Parameter
function greet(name?: string) {
  console.log(name);
}

//Both work
greet();
greet("Dhara");

// Union Types : Multiple types allowed

let id:string|number;
id=1;
id="Dhara"
// id=true//error : not defined type

// Any : Not cheaked types

let data:any;

//All are valid
data="Dhara";
data=21;
data=true;
data={}

// Unknown : It is Safer then any
//Before using it as a perticular type , you need to cheak it.

//Like:
// if (typeof data === "string") {
//   console.log(data.toUpperCase());
// }

let data1:unknown;
data1 = "hello";
data1=25;

// Tuples: Define Type and order or array elements...

let tupleUser:[string,number]=["Dhara",21];
console.log("using Tuple",tupleUser)


// Union Types Alias

type Status = "pending" | "success" | "failed";

let statuss: Status;
statuss="pending",
statuss="success",
statuss="failed"

// statuss=10;Invalid
