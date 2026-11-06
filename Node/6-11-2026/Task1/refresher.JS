
const users = [
    { id: 1, name: "Dhara", age: 21, salary: 30000, active: true },
    { id: 2, name: "Rahul", age: 24, salary: 25000, active: true },
    { id: 3, name: "Priya", age: 22, salary: 35000, active: false },
    { id: 4, name: "Amit", age: 26, salary: 45000, active: true },
    { id: 5, name: "Neha", age: 23, salary: 40000, active: true }
];

// let / const
let totalUsers = users.length;
console.log(totalUsers);

// Arrow function
const greet = (name) => `Hello ${name}`;
console.log(greet("Dhara"));

// map()
const names = users.map(user => user.name);
console.log(names);

// filter()
const activeUsers = users.filter(user => user.active);
console.log(activeUsers);

// reduce()
const totalSalary = users.reduce(
    (total, user) => total + user.salary, 0
);
console.log(totalSalary);

// Destructuring
const { name, age } = users[0];
console.log(name, age);

// Spread operator
const newUser = { ...users[0], age: 22 };
const updatedUsers = [...users, newUser];

// Template literals
users.forEach(user => {
    console.log(`${user.name} earns ₹${user.salary}`);
});

console.log("newUser:", newUser);
console.log("updatedUsers:", updatedUsers);
