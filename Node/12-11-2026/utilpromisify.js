// Task:3 Q:15 Use util.promisify to convert setTimeout into a sleep(ms) function, use it in an async function

const util = require("util");

const sleep = util.promisify(setTimeout);

async function runTask() {
    console.log("Task Starting");

    console.log("Waiting for 2 seconds...")
    await sleep(2000);
    console.log("2 seconds completed!");

    console.log("Waiting for 3 seconds...");
    await sleep(3000);

    console.log("3 seconds completed!");

    console.log("Task finished");

}

runTask();