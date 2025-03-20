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
    let segments = [];

    // Split the binary string into segments at "1" marker positions
    let currentSegment = "";
    for (let i = 0; i < encodedBinary.length; i++) {
        currentSegment += encodedBinary[i];
        if (currentSegment.endsWith("1") && i > 0 && encodedBinary[i-1] === "1") {
            // Found a "11" pattern - end of segment
            segments.push(currentSegment.slice(0, -1)); // Remove the last "1" as it's just a separator
            currentSegment = "";
        }
    }

    // Process each segment
    for (let segment of segments) {
        if (segment.length === 0) continue;

        // Convert binary to Fibonacci indices
        let binaryArray = segment.split("").map(bit => parseInt(bit));

        // Generate enough Fibonacci numbers
        let fib = [1, 2];
        while (fib.length < binaryArray.length) {
            fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
        }

        // Calculate the code point value
        let codePoint = 0;
        for (let i = 0; i < binaryArray.length; i++) {
            if (binaryArray[i] === 1) {
                codePoint += fib[i];
            }
        }

        // Convert code point to character
        decodedText += String.fromCodePoint(codePoint);
    }

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