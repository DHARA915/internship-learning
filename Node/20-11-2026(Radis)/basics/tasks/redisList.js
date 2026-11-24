
import listService from "../services/list.service.js";

export default async function run() {
    // Add notifications
    await listService.addToEnd("Welcome to our application");
    await listService.addToEnd("Your profile was updated");
    await listService.addToEnd("You received a new message");

    // Add at beginning
    await listService.addToStart("Important: Security alert");

    // Display all notifications
    console.log("\nAll Notifications:");
    console.table(await listService.getAll());

    // Get list length
    console.log("Total notifications:", await listService.getLength());

    // Get notification by index
    console.log("Notification at index 0:", await listService.getByIndex(0));

    // Remove first notification
    console.log("\nRemoved first:", await listService.removeFirst());

    // Display updated list
    console.log("\nUpdated Notifications:");
    console.table(await listService.getAll());
}
