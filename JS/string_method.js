student="Dhara patel"
a="Hello"
trim1="  hello   "

console.log(student.length)
console.log(student.charAt(6))
console.log(student.charCodeAt(6))
console.log(student.at(6))
console.log(student[6])
console.log(student.slice(2,7))
console.log(student.substring(2,7))//outdated method
console.log(student.substr(2,7))//second parameter stands for how many character you want 
console.log(student.toUpperCase())
console.log(student.toLowerCase())
console.log(student.to)

c=a.concat(" ",student)
console.log(c)

console.log(trim1.trim());
console.log(trim1.trimStart());
console.log(trim1.trimEnd());

console.log(student.padStart(20,"0"))
console.log(student.padEnd(20,"0"))

console.log(student.repeat(3))
