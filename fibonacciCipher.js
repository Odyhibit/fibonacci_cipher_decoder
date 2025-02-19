 function generateFibonacci(limit) {
            let fib = [1, 2];
            while (fib[fib.length - 1] + fib[fib.length - 2] <= limit) {
                fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
            }
            return fib;
        }

        function zeckendorfRepresentation(n) {
            let fib = generateFibonacci(n);
            let result = [];
            while (n > 0) {
                for (let i = fib.length - 1; i >= 0; i--) {
                    if (fib[i] <= n) {
                        result.push(fib[i]);
                        n -= fib[i];
                        fib = fib.slice(0, i - 1);
                        break;
                    }
                }
            }
            return result;
        }

        function fibonacciCipherEncoder(text) {
            let encodedBinary = "";
            for (let char of text) {
                let number = char.charCodeAt(0);
                let zeckendorfForm = zeckendorfRepresentation(number);
                let fib = [1, 2];
                while (fib[fib.length - 1] < zeckendorfForm[0]) {
                    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
                }
                let binaryRepresentation = new Array(fib.length).fill("0");
                for (let value of zeckendorfForm) {
                    let index = fib.indexOf(value);
                    binaryRepresentation[index] = "1";
                }
                encodedBinary += binaryRepresentation.join("") + "1";
            }
            return encodedBinary;
        }

        function binaryToBase64(binaryString) {
            let byteArray = [];
            for (let i = 0; i < binaryString.length; i += 8) {
                let byte = binaryString.substring(i, i + 8).padEnd(8, '0');
                byteArray.push(parseInt(byte, 2));
            }
            let uint8Array = new Uint8Array(byteArray);
            let base64String = btoa(String.fromCharCode.apply(null, uint8Array));
            return base64String;
        }

        function base64ToBinary(base64String) {
            let binaryString = "";
            let decodedBytes = atob(base64String).split('').map(char => char.charCodeAt(0));
            decodedBytes.forEach(byte => {
                binaryString += byte.toString(2).padStart(8, '0');
            });
            return binaryString;
        }

        function fibonacciCipherDecoder(encodedBinary) {
            let decodedNumbers = [];
            while (encodedBinary.includes("11")) {
                let splitIndex = encodedBinary.indexOf("11") + 1;
                let currentEncoded = encodedBinary.substring(0, splitIndex);
                encodedBinary = encodedBinary.substring(splitIndex + 1);
                let encodedSequence = currentEncoded.split("").map(bit => parseInt(bit));
                let fib = [1, 2];
                while (fib.length < encodedSequence.length) {
                    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
                }
                let decodedNumber = encodedSequence.reduce((sum, bit, idx) => sum + (bit * fib[idx]), 0);
                decodedNumbers.push(decodedNumber);
            }
            return decodedNumbers.map(num => String.fromCharCode(num)).join("");
        }

        function encodeText() {
            let inputText = document.getElementById("inputText").value;
            let encodedBinary = fibonacciCipherEncoder(inputText);
            let paddedBinary = encodedBinary.padEnd(Math.ceil(encodedBinary.length / 8) * 8, '0');
            let base64Encoded = binaryToBase64(paddedBinary);
            document.getElementById("outputText").value = base64Encoded;
        }

        function decodeText() {
            let inputText = document.getElementById("inputText").value;
            let binaryString = base64ToBinary(inputText);
            let decodedText = fibonacciCipherDecoder(binaryString);
            document.getElementById("outputText").value = decodedText;
        }