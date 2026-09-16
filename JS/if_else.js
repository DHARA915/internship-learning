// If else statement...................................................
function sign(num){
    if(num>0){
        console.log("positive")
    }
    else if(num<0){
        console.log("negative")
    }
    else if(num==0){
        console.log("Zero")
    }
    else{
        console.log("Invalid")
    }
}

sign('A')
sign(0)

//switch case example....................................................
let prompt=require('prompt-sync')();
function cheak(num1,num2){
    
    console.log("1-addition")
    console.log("2-substraction")
    console.log("3-multiplication")
    console.log("4-division")
    let operation=parseInt(prompt("Enter operation type:"))
    switch(operation){
        case 1:
            console.log(`${num1+num2}`)
            break;
        case 2:
            console.log(`${num1-num2}`)
            break;
        case 3:
            console.log(`${num1 * num2}`)
            break;
        case 4:
            console.log(`${num1/num2}`)
            break;
        default:
            console.log("Invalid choice")
    }
}
cheak(4,2)