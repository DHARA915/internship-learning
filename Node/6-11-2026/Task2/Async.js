// 1. (Async) Write callbacks.js using setTimeout to simulate 3 dependent steps (get user, get orders, get items) using nested callbacks. Note how hard it is to read.

function getUser(callback) {
    setTimeout(() => {
        console.log("1. User fetched");
        callback({ id: 1, name: "Dhara" });
    }, 1000);
}

function getOrders(userId, callback) {
    setTimeout(() => {
        console.log("2. Orders fetched for user:", userId);
        callback({ orderId: 101 });
    }, 1000);
}

function getItems(orderId, callback) {
    setTimeout(() => {
        console.log("3. Items fetched for order:", orderId);
        callback(["Laptop", "Mouse", "Keyboard"]);
    }, 1000);
}

// Nested callbacks (Callback Hell)
getUser((user) => {
    console.log(user);

    getOrders(user.id, (order) => {
        console.log(order);

        getItems(order.orderId, (items) => {
            console.log("Items:", items);
        });
    });
});


//2  (Promises) Rewrite exercise 1 with Promises and .then() chaining. Add .catch() and .finally().

function getUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id: 1, name: "Dhara" });
        }, 1000);
    });
}

function getOrders(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ orderId: 101, userId });
        }, 1000);
    });
}

function getItems(orderId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(["Laptop", "Mouse", "Keyboard"]);
        }, 1000);
    });
}

getUser()
    .then(user => {
        console.log("User:", user);
        return getOrders(user.id);
    })
    .then(order => {
        console.log("Order:", order);
        return getItems(order.orderId);
    })
    .then(items => {
        console.log("Items:", items);
    })
    .catch(error => {
        console.log("Error:", error);
    })
    .finally(() => {
        console.log("All operations completed.");
    });