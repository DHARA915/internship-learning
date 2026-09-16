async function weather() {

    let gujaratweather = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("27 deg");
        }, 2000)

    })

    let rajesthanweather = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("21 deg");
        },4000)

    })

    let a= await gujaratweather
    console.log(a)
    console.log(gujaratweather)//pending............ if await not run
    let b=await rajesthanweather
    console.log(b)

}
weather()
