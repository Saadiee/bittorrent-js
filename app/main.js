const process = require("process");
const util = require("util");

function decodeBencode(bencodedValue) {
  // Decode String
  if (!isNaN(bencodedValue[0])) {
    decodeString(bencodedValue)
  }
  // Decode Number
  else if (bencodedValue[0] === "i") {
    decodeNumber(bencodedValue)
  }
  // Decode List
  else if (bencodedValue[0] === "l") {
    decodeList(bencodedValue)
  }
  else {
    throw new Error("Only strings are supported at the moment");
  }
}

function main() {
  const command = process.argv[2];

  // You can use print statements as follows for debugging, they'll be visible when running tests.
  console.error("Logs from your program will appear here!");

  if (command === "decode") {
    const bencodedValue = process.argv[3];
    console.log(JSON.stringify(decodeBencode(bencodedValue)));
  } else {
    throw new Error(`Unknown command ${command}`);
  }
}

function decodeString(bencodedValue) {
  const firstColonIndex = bencodedValue.indexOf(":");
  if (firstColonIndex === -1) {
    throw new Error("Invalid encoded string: missing colon");
  }

  const lengthStr = bencodedValue.substring(0, firstColonIndex);
  const length = parseInt(lengthStr, 10); // Convert the length string to an integer
  if (isNaN(length)) {
    throw new Error("Invalid encoded string: length prefix is not a number");
  }
  const stringDataStartIndex = firstColonIndex + 1;
  const stringDataEndIndex = stringDataStartIndex + length;
  const decodedString = bencodedValue.slice(stringDataStartIndex, stringDataEndIndex);
  if (decodedString.length !== length) {
    throw new Error("Invalid encoded string: data length does not match specified length");
  }

  return decodedString;
}

function decodeNumber(bencodedValue) {
  return Number(bencodedValue.slice(1, - 1))
}

function decodeList(bencodedValue) {
  const bencodeList = []
  bencodedValue = bencodedValue.slice(1, bencodedValue.lastIndexOf('e'))
  const indexOfi = bencodedValue.indexOf("i");
  if (indexOfi !== -1) {
    const firstPart = bencodedValue.slice(0, indexOfi);
    const secondPart = bencodedValue.slice(indexOfi)
    let decodedStr = decodeString(firstPart);
    let decodedNum = decodeNumber(secondPart)
    bencodeList.push(decodedStr, decodedNum)
  }
  return bencodeList;
}

main();
