// //Give result as resolved

// fetch("https://jsonplaceholder.typicode.com/posts").then(response => response.json()).then((users) => console.log(users))

// fetch("https://jsonplaceholder.typicode.com/users/1").then(response => {
//     if(!response.ok){
//         throw new Error("User not found!")
//     }
//     return response.json()
// }).then((users) => console.log(users))


//Promise all Give result when all promises are resolved or rejected (If any promise is rejected then it will return error message)
// Promise.all([
//     fetch("https://jsonplaceholder.typicode.com/posts/1"),
//     fetch("https://jsonplaceholder.typicode.com/users/1"),
//     fetch("https://jsonplaceholder.typicode.com/users/2"),
//     fetch("https://jsonplaceholder.typicode.com/users/3"),
    
// ]).then(results=>{
//     return Promise.all(
//         results.map(response=>response.json())
//     )
// })
// .then(data=>{console.log(data)})
// .catch(error=>{console.log(error.message)})

//Using Async and Await 

    d1=fetch("https://jsonplaceholder.typicode.com/posts/1");
    d2=fetch("https://jsonplaceholder.typicode.com/users/1");
    d3=fetch("https://jsonplaceholder.typicode.com/users/2");
    d4=fetch("https://jsonplaceholder.typicode.com/users/3");

async function getData(){
const response = await Promise.all([
    d1,d2,d3,d4
])

const [post1,user1,user2,user3]=await Promise.all(
 response.map(res=>res.json())
)
 console.log("Posts: ",post1)
 console.log("user1: ",user1)
 console.log("user2: ",user2)
 console.log("user3: ",user3)
 console.log(post1)
}
   
getData()