function removeLeadingZeros(str) {
    return str.replace(/^0+/, '') || '0';
}

// Example usage
var numStr = "12,309,870.00";
var cleanedStr = removeLeadingZeros(numStr);
console.log(cleanedStr); // Output: "123"

numStr = "000";
cleanedStr = removeLeadingZeros(numStr);
console.log(cleanedStr); // Output: "0"
