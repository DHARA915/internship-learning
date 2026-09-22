
//For let variable
{

    let a = 10;
    console.log(a)
    // let a=50;//a alredydeclare error
    a = 20;
    console.log(a)

    {
        let a = 30;
        console.log(a)
        a = 40;
        console.log(a)
    }

    console.log(a);//access  block level  latest assign value




    //let variable practice task;

    let score = 100;
    let bonus = 20;

    {
        let score = 200;

        {
            let bonus = 50;
            score += bonus;//here score become 250 so take it next for this block
            console.log("First-score", score)

        }
        score += bonus;
        console.log("second-secore", score)
        score = 300;
        score += bonus;
        console.log("Third-score", score)
    }

    score += bonus;
    console.log("Last-score", score)

}

//For Const variable

{
    // const b = 100
    // console.log("b", b)

    // // b=300; //cannot reassign value to const variable
    // // console.log("b",b)
    // // const b=200//cannot redeclare
    // {
    //     const b = 500;
    //     console.log("b", b)
    //     // b=900;
    //     // console.log(b)//cannot reassign and redeclare

    // }

    // console.log(b)



    const user = {
        name: "Dhara",
        skills: ["JS", "React"]
    };

    const skills = user.skills;

    {
        const user = {
            name: "Alex",
            skills: ["Python"]
        };

        user.skills.push("Node");

        skills.push("MongoDB");

        console.log(user.skills);//refer inner user 
    }

    console.log(user.skills);
    console.log(skills);

    user.name = "John";

    // user = {  //cannot reasign value to const variable
    //   name: "Mike",
    //   skills: []
    // };

}


//copy by reference for array
let arr1 = [1, 2, 3];

let arr2 = arr1;

arr2.push(4);//Change Original Array

console.log(arr1);
console.log(arr2);

//to prevent it use:
{

    let arr2 = [...arr1]
}

//for object: By default object give shallow copy array object point same location
const user1 = {
    name: "Dhara",
    age: 21
};

const user2 = user1;

user2.name = "Alex";

console.log(user1.name); // Alex

//to prevent it use: 
{
    const user1 = {
        name: "Dhara",
        age: 21,
        skills:["js","react"]
    };

    const user2 = { ...user1 };

    user2.name = "Alex";
    user2.skills.push("MongoDb")

    console.log(user1.name); // Dhara
    console.log(user2.name); // Alex
    console.log(user1.skills);//js,react,mongoDB //shallow copy
    console.log(user2.skills)//js,react,mongoDB
}

//Deep copy

{
    const user1 = {
        name: "Dhara",
        age: 21,
        skills:["js","react"]
    };

    const user2 = structuredClone(user1);

    user2.name = "Alex";
    user2.skills.push("MongoDb")

    console.log(user1.name); // Dhara
    console.log(user2.name); // Alex
    console.log(user1.skills);//js,react //Deep copy
    console.log(user2.skills)//js,react,mongoDB
}
