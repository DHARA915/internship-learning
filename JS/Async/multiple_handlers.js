//we can handle promise with multhiple handler

let p1=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(5)
    },5000)
})

p1.then((value)=>{
    console.log(value)
    console.log("promise is resolve")
})

p1.then(()=>{
    console.log("Now we can use another promise")  //multiple handler
})