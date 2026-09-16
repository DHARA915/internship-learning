console.log("Promise")

//Promise resolve
let p1 = new Promise((resolve, reject) => {
    console.log("Promise is pending")
    setTimeout(() => {
        console.log("I am a promise and I am resolved")
        resolve("Dhara")
    }, 4000)
})

p1.then((value) => {
    console.log(value)
})

//promise reject
let p2 = new Promise((resolve, reject) =>{
    console.log("Promise is pending")
      setTimeout(() => {
        console.log("promise is rejected")
        reject(new Error("error in code"))
    }, 4000)
})

// p2.catch((error)=>{
//     console.log(error)//original
//     console.log("Error occuring in code")//handling the error
// })

p2.then((value)=>{
    console.log(value)
},(error)=>{
    console.log(error)
    console.log("Error ocuure in code")
})