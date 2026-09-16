// A regular expression is a sequence of characters that forms a search pattern.
//When you search for data in a text, you can use this search pattern to describe what you are searching for.
//A regular expression can be a single character, or a more complicated pattern.
//Regular expressions can be used to perform all types of text search and text replace operations.
//Regular expressions can make your search much more powerful (case insensitive for example).

var text = "Visit W3Schools!";
var n = text.search("W3Schools");
console.log(n)
console.log()


var text = "Visit W3Schools";
var n = text.search(/w3schools/); //-1 because of casesensitive string is not found
console.log(n)
console.log()

text = "Visit Microsoft!";
result = text.replace(/microsoft/i, "W3Schools");
console.log(result)

/*Using test()
The test() method is a RegExp expression method.
It searches a string for a pattern, and returns true or false, depending on the result.
The following example searches a string for the character "e":*/

const pattern = /are free/;
console.log(pattern.test("The best things in life are free!")); //true

