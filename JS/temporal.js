//Alternative and best version for accessing the date and time in JavaScript is using Temporal API. It is a new built-in object that provides a modern way to work with dates and times in JavaScript. The Temporal API is designed to be more accurate, reliable, and easier to use than the existing Date object.

import { Temporal } from "@js-temporal/polyfill";
const date = Temporal.PlainDate.from("2026-09-15");

console.log(date.toString()); // Output: 2026-09-15