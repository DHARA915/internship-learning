//  5. (Error Handling) Create a function that randomly throws. Handle it with try/catch/finally. Add process.on(‘unhandledRejection’) and process.on(‘uncaughtException’) handlers and trigger each once to see them work.

// 1,random throws an error
function randomError(){
     if(Math.random()<1){
        throw new Error("Random error occurred!");
     }
     return 'Success!';
}

// 2.handle using try/ catch / finally

try{
    console.log(randomError());
}catch(error){
    console.log("Caught error:",error.message);
} finally{
    console.log("Finally block executed.");
}

// 3. Handle unhandles Promise rejection
process.on("unhandledRejection",(reason)=>{
    console.log("Unhandled Rejection:",reason);
})

// 4.handle uncaught exception
process.on("uncaughtException",(error)=>{
    console.log("uncaught Exceptioon:",error.message);

    // Exit safely after logging
    process.exitcode=1;
}
);

Promise.reject("Promise failed!");

setTimeout(()=>{
    throw new Error("Uncaught exception!");
},1000)
