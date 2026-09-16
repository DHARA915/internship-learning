// function maxargument(){
//     let max= -Infinity;

//     for(let i=0;i<arguments.length;i++){
//         if(arguments[i]>max){
//             max=arguments[i]
//         }
//     }

//     console.log("Maximum argument is:",max)
// }
// maxargument(1000,200,35,84,52,96,7,998,9,10)


function maxargument(...args){
    let max= -Infinity;

    for(let arg of args){
        if(arg>max){
            max=arg
        }
    }

    console.log("Maximum argument is:",max)
}
maxargument(1000,200,35,8004,52,96,7,998,9,10)