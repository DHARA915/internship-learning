console.log("typeof window:",typeof window); //undefined
console.log("typeof globalThis:",typeof globalThis); //object
console.log("__dirname:",__dirname); //dir_path
console.log("__filename:",__filename);//file_path
console.log("process.platform:",process.platform);//win32

// Difference between node.js and brower

// 1. Node.js runs JavaScript outside the browser.
//    Browsers run JavaScript inside web pages.

// 2. Node.js uses global.
//    Browsers use window.

// 3. Node.js provides fs module for file handling.
//    Browsers cannot freely access the local file system.

// 4. Node.js provides process object.
//    Browsers do not have the Node.js process object.

// 5. Node.js is commonly used for backend development.
//    Browsers are commonly used for frontend development.