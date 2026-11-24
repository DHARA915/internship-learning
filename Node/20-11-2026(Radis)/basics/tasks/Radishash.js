
import userService from "../services/CachingService/user.service.js";

export default async function run() {
    // User object
    const user = {
        id: 102,
        name: "Khushi",
        email: "Khushi@example.com",
        age: 21
    };

    // Store user
    const result = await userService.createUser(user);
    console.log(result.message);

    // Retrieve only name
    const name = await userService.getUserName(108);
    console.log("User name:", name);

    // Retrieve complete user
    const userData = await userService.getUser(108);
    console.log("Complete user:", userData);
}
