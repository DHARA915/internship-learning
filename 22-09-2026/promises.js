// Basic Promis.....................................

const getUser = () => {
    return new Promise((resolve,reject)=>{
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((response)=>{
            if(!response.ok){
                 throw new Error("Failed to fetch users");
            }
            return response.json()
        })
        .then((data)=>{
            console.log("Data By Basic Promise:", data)
            resolve(data)
        })
        .catch(((error)=>{
            reject(error)
        }))
    })
}

getUser()

//Using async/await

const getUsers = async() =>{
    try{

        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data= await response.json();
        console.log("Data from async/await",data)
    }
    catch(error){
        console.log(error.message)
    }
}
getUsers()

