# Fibonacci coding 

The Python script is a simple Fibonacci encoder and decoder. The encoder takes a string and encodes it using the Fibonacci sequence, and returns the binary code.
You can use the script to encode/decode binary, a list of decimal numbers, or a base64 string.

The webpage is a simple interface that encodes a string to base64 using Fibonacci coding.
It will decode a base64 string back to the original string.
Try it out with the online version https://odyhibit.github.io/fibonacci_cipher_decoder/

Basics of Fibonacci coding:
The Fibonacci sequence is a series of numbers where a number is the sum of the two preceding ones, starting from 0 and 1. 
The Fibonacci sequence is 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...
It is based the Zeckendorf representation of integers using Fibonacci numbers.

The Zeckendorf representation of an integer is a representation of that integer as the sum of non-consecutive Fibonacci numbers.

For example, the number 10 can be represented as 8 + 2, which can be displayed as a bit mask 01001 for the sequence of Fibonacci numbers starting with the second 1. To complete the encoding you just append a 1 to signify the end of this digit.
So the number 10 is encoded as 010011.

```plaintext
fibonacci sequence:  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...
the number 10        0  1  0  0  1  
```
You just add the numbers in the sequence that match where the bitmask is a 1.

