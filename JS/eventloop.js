console.log("1. User selects ticket");

function reserveSeat() {
console.log("2. Checking seat availability");

return Promise.resolve("Seat available");
}

function makePayment() {
console.log("3. Starting payment");

return new Promise((resolve) => {
setTimeout(() => {
console.log("4. Payment gateway completed");
resolve("Payment successful");
}, 0);
});
}

async function bookTicket() {

console.log("5. Booking started");

const seat = await reserveSeat();

console.log("6. Seat status:", seat);

Promise.resolve().then(() => {
console.log("7. Payment notification prepared");
});

const payment = await makePayment();

console.log("8. Payment status:", payment);
}

setTimeout(() => {
console.log("9. Session validation");
}, 0);

Promise.resolve().then(() => {
console.log("10. User authentication completed");
});

bookTicket();

console.log("11. Booking page loaded");