console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => {
    console.log("3");
  });
  queueMicrotask(() => {
    console.log("4");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("5");
  setTimeout(() => {
    console.log("6");
  }, 0);
  queueMicrotask(() => {
    console.log("7");
  });
  Promise.resolve().then(() => {
    console.log("8");
  });
});

queueMicrotask(() => {
  console.log("9");
});

async function test() {
  console.log("10");
  await Promise.resolve();
  console.log("11");
  setTimeout(() => {
    console.log("12");
  }, 0);
  Promise.resolve().then(() => {
    console.log("13");
  });
}

test();


console.log("15");