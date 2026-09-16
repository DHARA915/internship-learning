//promise chaining....
//resolving call back hell or pyramid of dom problem

let p1=new Promise((resolve,reject)=>{
    console.log("pending...")
    setTimeout(()=>{
        resolve(56)

    },2000)
})

p1.then((value)=>{
    console.log(value)

    return new Promise((resolve,reject)=>{
        console.log("After 3 second....")
        setTimeout(()=>{
            resolve("Dhara")
        },2000)
    })
}).then((value)=>{
  console.log(value)  
   return 2
}).then((value)=>{
    console.log(value)
})