 // Define a function that tests if a number is even or odd
    function testNumber(number) {
    if (number % 2 === 0) {
    return number + " is even";
}
    else {
    return number + " is odd";
    }
}

    // Call the function with some test numbers
    console.log(testNumber(4)); // Output: "4 is even"
    console.log(testNumber(7)); // Output: "7 is odd"
    console.log(testNumber(0)); // Output: "0 is even"