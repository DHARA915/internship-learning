const name = process.argv[2];

if(!name){
    console.error("Error : please provide your name");
    process.exit(1);
}
else{
    console.log(`hello , ${name}! Welcome to Node.js`);
}