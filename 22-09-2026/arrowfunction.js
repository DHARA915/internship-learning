// //Normal Funtion

// function add(a,b){
//     console.log("a+b",a+b)
// }
// add(10,20);

// const addition = (a,b) => {
//   console.log("A+B:",a+b)
// }

// addition(50,50)
// console.log(addition)//[function:addition]

// //when to use normal function.........................................................................................

// // You need your own this.
// // Creating a constructor with new.
// // You need the function's own arguments.
// // The function is more complex and normal syntax is clearer.

// //when to use Arrow function...........................................................................................
// // Function is short/simple.
// // Using map(), filter(), reduce().
// // Writing React callbacks/event handlers.
// // You want this from the surrounding scope.

// //for creating constructore and use arguments use normal function.......................................................................................

// function Person(name){
//     console.log("Person Name:" , name)
// }   

// let p1= new Person("Dhara")
// let p2 = new Person("Bansi")

// console.log(p1,p2)

// function argumentcheak(){
//     console.log(arguments)// it return object 
// }
// argumentcheak()

//When we want to use array method: Map , filter , reduce then use arrow function
//Arrow function

import { employees } from "./data/employees.js";

const analyzingEmplyee = (employees)=>{
// console.log("Employees:", employees)

const activeEmployees = employees.filter(emp=>emp.active==true)
console.log("Active Employees:" ,activeEmployees )

const totalSalary = employees.reduce((prev,emp)=>emp.salary+prev,0) 
console.log("Total Salary:" , totalSalary)

const averageSalary =totalSalary/employees.length
console.log(averageSalary)

const ReactDeveloper =  employees.filter((emp)=> emp.skills.includes("React"))
console.log("React Developers:",ReactDeveloper)

const MaximumSalary = employees.reduce((emp,prev)=>emp.salary>prev.salary?emp:prev)
console.log("Maximum Salary:",MaximumSalary )

}
analyzingEmplyee(employees)

