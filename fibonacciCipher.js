function generateFibonacci(limit) {
    let fib = [1, 2];
    while (fib[fib.length - 1] + fib[fib.length - 2] <= limit) {
        fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib;
}

function zeckendorfRepresentation(n) {
    // Generate Fibonacci numbers up to n
    let fib = generateFibonacci(n);
    let result = [];

    // For each number, find the largest Fibonacci number less than or equal to n
    while (n > 0) {
        // Find the largest Fibonacci number less than or equal to n
        let i = fib.length - 1;
        while (i >= 0 && fib[i] > n) {
            i--;
        }

        if (i >= 0) {
            result.push(fib[i]);
            n -= fib[i];
        }
    }

    return result;
}

function fibonacciCipherEncoder(text) {
    let encodedBinary = "";

    // Convert string to array of code points to handle Unicode correctly
    let codePoints = Array.from(text).map(char => char.codePointAt(0));

    for (let codePoint of codePoints) {
        // Get Zeckendorf representation of the code point
        let zeckendorfForm = zeckendorfRepresentation(codePoint);

        // Generate Fibonacci sequence up to the largest value needed
        let maxValue = Math.max(...zeckendorfForm, 1);
        let fib = [1, 2];
        while (fib[fib.length - 1] < maxValue) {
            fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
        }

        // Create binary representation
        let binaryRepresentation = new Array(fib.length).fill("0");
        for (let value of zeckendorfForm) {
            let index = fib.indexOf(value);
            if (index !== -1) {
                binaryRepresentation[index] = "1";
            }
        }

        // Add to encoded binary string with separator
        encodedBinary += binaryRepresentation.join("") + "1";
    }

    return encodedBinary;
}

function binaryToBase64(binaryString) {
    // Make sure the binary string length is a multiple of 8
    let paddedBinary = binaryString.padEnd(Math.ceil(binaryString.length / 8) * 8, '0');

    let byteArray = [];
    for (let i = 0; i < paddedBinary.length; i += 8) {
        let byte = paddedBinary.substring(i, i + 8);
        byteArray.push(parseInt(byte, 2));
    }

    // Convert byte array to UTF-8 string then to base64
    let uint8Array = new Uint8Array(byteArray);
    let binaryData = String.fromCharCode.apply(null, uint8Array);
    let base64String = btoa(binaryData);

    return base64String;
}

function base64ToBinary(base64String) {
    let binaryString = "";
    try {
        // Decode base64 to binary string
        let decodedBytes = atob(base64String).split('').map(char => char.charCodeAt(0));
        decodedBytes.forEach(byte => {
            binaryString += byte.toString(2).padStart(8, '0');
        });
    } catch (e) {
        console.error("Error decoding Base64:", e);
        return "";
    }
    return binaryString;
}

function fibonacciCipherDecoder(encodedBinary) {
    let decodedText = "";
    let remainingBinary = encodedBinary;

    //console.log("Starting decode of:", remainingBinary);

    // Process until no more "11" patterns are found
    while (remainingBinary.includes("11")) {
        // Find position of next "11" pattern
        let splitIndex = remainingBinary.indexOf("11") + 1;  // End of segment includes first "1"

        // Extract current segment (up to and including first "1" of "11")
        let currentSegment = remainingBinary.substring(0, splitIndex);
        //console.log("Processing segment:", currentSegment);

        // Move to next segment (skip the second "1")
        remainingBinary = remainingBinary.substring(splitIndex + 1);
        //console.log("Remaining binary:", remainingBinary);

        // Convert segment to array of integers
        let binaryArray = currentSegment.split("").map(bit => parseInt(bit));
        //console.log("Binary array:", binaryArray);

        // Generate Fibonacci sequence
        let fib = [1, 2];
        while (fib.length < binaryArray.length) {
            fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
        }
        //console.log("Fibonacci sequence:", fib);

        // Calculate code point
        let codePoint = 0;
        for (let i = 0; i < binaryArray.length; i++) {
            if (binaryArray[i] === 1) {
                codePoint += fib[i];
            }
        }
        //console.log("Code point:", codePoint, "→", String.fromCodePoint(codePoint));

        // Add character to result
        decodedText += String.fromCodePoint(codePoint);
    }

    //console.log("Final decoded text:", decodedText);
    return decodedText;
}

function encodeText() {
    let inputText = document.getElementById("inputText").value;
    let encodedBinary = fibonacciCipherEncoder(inputText);
    let base64Encoded = binaryToBase64(encodedBinary);
    document.getElementById("outputText").value = base64Encoded;
}

function decodeText() {
    let inputText = document.getElementById("inputText").value;
    let binaryString = base64ToBinary(inputText);
    let decodedText = fibonacciCipherDecoder(binaryString);
    document.getElementById("outputText").value = decodedText;
}