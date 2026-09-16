a = new Date()
console.log(a)

a = Date()
console.log(a)

a=new Date("2023-12-02")//short
console.log(a)

a=new Date("2023/12/02")//short
console.log(a)

a=new Date("02-12-2023")//short
console.log(a)

a=new Date("dec 5,2024")//long
console.log(a)

a=new Date("jan 9,2024")//long
console.log(a)


//methods
a = new Date()
console.log(a.toString())

a = new Date()
console.log(a.toUTCString())

a = new Date()
console.log(a.toISOString())


// Get method for date
d = new Date("2021-03-25")
p=d.getFullYear()
console.log(d)
console.log(p)

d = new Date("2021-03-25")
p=d.getMonth()
console.log(p)


d = new Date("2021-03-25")
p=d.getDate()
console.log(p)

d = new Date("2021-03-25")
p=d.getHours()
console.log(p)

d = new Date("2021-03-25")
p=d.getMinutes()
console.log(p)

d = new Date("2021-03-25")
p=d.getSeconds()
console.log(p)

d = new Date("2021-03-25")
p=d.getDay()
console.log(p)


// set methods for dates

d = new Date("2021-03-25")
d.setFullYear(2005,0,9)
console.log(d)


d = new Date("2021-03-25")
p=d.setMonth(0)
console.log(d)


d = new Date("2021-03-25")
p=d.setDate(9)
console.log(d)

d = new Date("2021-03-25")
d.setHours(15)
console.log(d)

d = new Date("2021-03-25")
d.setMinutes(23)
console.log(d)

d = new Date("2021-03-25")
d.setSeconds(56)
console.log(d)

d = new Date();
d.setDate(d.getDate() + 50);
console.log(d)









