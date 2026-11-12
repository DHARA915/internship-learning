// Task:3 Q:7 Build a system info script using os module: CPU cores, total/free memory, platform, uptime, network interfaces

const os = require('os');

// convert bytes into readable format

function formatMemory(bytes) {
    return `${(bytes / (1024 ** 3)).toFixed(2)} GB`;
}

// convert seconds into days , hours , minutes and seconds

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
}

// Generate system information 

function getSystemInfo() {
    try {
        const cpus = os.cpus();

        // memory information
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;

        // Network information

        const networkInterfaces = os.networkInterfaces();

        console.log("\n========== SYSTEM INFORMATION ==========\n");
        // CPU details
        console.log("CPU INFORMATION:");
        console.log(`CPU Model       : ${cpus[0]?.model || "Unknown"}`);
        console.log(`CPU Cores       : ${cpus.length}`);

        cpus.forEach((cpu, index) => {
            console.log(`Core ${index + 1}        : ${cpu.model}`);
        });

        // Memory details
        console.log("\nMEMORY INFORMATION:");
        console.log(`Total Memory    : ${formatMemory(totalMemory)}`);
        console.log(`Free Memory     : ${formatMemory(freeMemory)}`);
        console.log(`Used Memory     : ${formatMemory(usedMemory)}`);

        // Platform information
        console.log("\nPLATFORM INFORMATION:");
        console.log(`Platform        : ${os.platform()}`);
        console.log(`Architecture    : ${os.arch()}`);
        console.log(`Operating System: ${os.type()}`);
        console.log(`Hostname        : ${os.hostname()}`);

        // Uptime information
        console.log("\nUPTIME INFORMATION:");
        console.log(`System Uptime   : ${formatUptime(os.uptime())}`);

        // Network information
        console.log("\nNETWORK INTERFACES:");

        for (const [interfaceName, addresses] of Object.entries(networkInterfaces)) {
            console.log(`\n${interfaceName}:`);

            addresses.forEach((address) => {
                console.log(`  IP Address : ${address.address}`);
                console.log(`  Family     : ${address.family}`);
                console.log(`  MAC Address: ${address.mac}`);
                console.log(`  Internal   : ${address.internal}`);
            });
        }

        console.log("\n========================================");
    }
    catch (error) {
        console.error("Failed to retrieve system information:", error.message);
        process.exitCode = 1;
    }
}

getSystemInfo();