console.log("V8 Version",process.versions.v8);
console.log("Node.js Vesrion",process.version);

// Memory Usage in MB : Memory usage means the amount of RAM (Random Access Memory) your Node.js application is currently consuming while running.

const memory = process.memoryUsage();
console.log(memory);

console.log({
    rss: (memory.rss / 1024 / 1024).toFixed(2) + " MB",
    heapTotal: (memory.heapTotal / 1024 / 1024).toFixed(2) + " MB",
    heapUsed: (memory.heapUsed / 1024 / 1024).toFixed(2) + " MB",
    external: (memory.external / 1024 / 1024).toFixed(2) + " MB",
    arrayBuffers: (memory.arrayBuffers / 1024 / 1024).toFixed(2) + " MB"
});