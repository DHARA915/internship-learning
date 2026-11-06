const process = require("node:process");

console.log("Start");

setTimeout(() => {
    console.log("2. setTimeout");
},0);

setImmediate(() => {
    console.log("3. setImmediate");
});

process.nextTick(()=>{
    console.log("4. process.nextTick");
})

Promise.resolve().then(() => {
    console.log("5. Promise");
});

console.log("End");