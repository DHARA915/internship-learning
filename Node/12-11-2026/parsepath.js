// Task:3 Q:6 Use path module to parse 10 different file paths - extract dir, filename, extension for each

const path = require('path');

// 10 different file paths
const filePaths = [
    "D:/projects/backend/src/app.js",
    "D:/projects/frontend/components/Navbar.jsx",
    "D:/documents/resume.pdf",
    "D:/images/profile/photo.png",
    "D:/videos/tutorial.mp4",
    "D:/database/config/database.json",
    "D:/downloads/report.xlsx",
    "D:/music/artist/song.mp3",
    "D:/projects/backend/routes/user.ts",
    "D:/notes/todo.txt"
];

// Extract path information

function parseFilePaths(paths) {
   for(const filepath of paths){
    const parsed = path.parse(filepath);
    console.log("\n--------------------------------");
        console.log(`Original Path : ${filepath}`);
        console.log(`Directory     : ${parsed.dir}`);
        console.log(`Filename      : ${parsed.name}`);
        console.log(`Extension     : ${parsed.ext}`);


   }
}

parseFilePaths(filePaths);