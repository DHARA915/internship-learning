//Both work almost same here

//type
// type User = {
//   name: string;
//   age: number;
// };

let user: User = {
  name: "Dhara",
  age: 21
};

// interface
interface User1 {
  name: string;
  age: number;
}

let use1r: User1 = {
  name: "Dhara",
  age: 21
};

// Type - Union...............................

type PaymentStatus = "pending" | "paid" | "failed";

let paymentStatus: PaymentStatus = "pending";

console.log(paymentStatus);

type ProductId = string | number;

let productId: ProductId = 101;

productId = "PROD-101";

console.log(productId);
// Type - Union...............................


// Interface extends interface...................................

interface Person{
    name:string,
    age:number
}

interface Teacher extends Person{
    subject:string
}

let teacher:Teacher={
    name:"Radhika",
    age:28,
    subject:"Maths"
}
console.log("Teacher:",teacher)
// Interface extends interface...................................



// Interface Merge...........................................

interface User{
    name:string
}

interface User{
    age:number
}

const InterfaceMergeuser:User={
    name:"Dhara",
    age:21
}
console.log("InterfaceMergeuser",InterfaceMergeuser)

// Note:This work with only interface  not with type aliases

// Interface Merge...........................................


//type intersection.................................................................

type Address = {
  city: string;
  pincode: number;
};

type Customer = {
  name: string;
  email: string;
};

type CustomerDetails = Customer & Address;

let customer1: CustomerDetails = {
  name: "Amit",
  email: "amit@gmail.com",
  city: "Anand",
  pincode: 388001,
};

console.log(customer1);


//type intersection.................................................................

