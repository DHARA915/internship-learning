// 3.(Promises) Write a delay(ms) helper that returns a Promise. Use Promise.all to run 3 delays in parallel, then Promise.race and Promise.allSettled with one rejecting promise. Explain each result.

function delay(ms, shouldReject = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldReject) {
                reject(`Failed after ${ms}ms`);
            } else {
                resolve(`Completed after ${ms}ms`);
            }
        }, ms);
    });
}

// 1. Promise.all()
Promise.all([
    delay(1000),
    delay(2000),
    delay(3000)
])
.then(result => console.log("Promise.all:", result))
.catch(error => console.log("Error:", error));

// 2. Promise.race()
Promise.race([
    delay(1000),
    delay(2000, true),
    delay(3000)
])
.then(result => console.log("Promise.race:", result))
.catch(error => console.log("Race Error:", error));

// 3. Promise.allSettled()
Promise.allSettled([
    delay(1000),
    delay(2000, true),
    delay(3000)
])
.then(result => console.log("Promise.allSettled:", result));

// 4. (Async/Await) Rewrite exercise 2 with async/await. Run the 3 independent steps in parallel using await Promise.all.

function delay(ms, taskName) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`${taskName} completed after ${ms}ms`);
        }, ms);
    });
}

async function runTasks(){
    console.log("Starting tasks...");

    try{
        // rum all 3 tasks in parallel
        const results = await Promise.all([
            delay(100,"Task 1"),
            delay(200,"Task 2"),
            delay(300,"Task 3")
        ])
        console.log("All tasks completed:", results);
    }
    catch(error){
        console.log("Error:",error);
    }
    finally{
        console.log("All tasks finished.")
    }

}
runTasks();

