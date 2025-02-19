import base64


def generate_fibonacci(limit):
    """Generate Fibonacci numbers up to a given limit."""
    fib = [1, 2]  # Start with the first two Fibonacci numbers
    while fib[-1] + fib[-2] <= limit:
        fib.append(fib[-1] + fib[-2])
    return fib


def zeckendorf_representation(n):
    """Find the Zeckendorf representation of a given number."""
    if n <= 0:
        return []

    fib = generate_fibonacci(n)
    result = []

    # Find the largest Fibonacci number less than or equal to n
    while n > 0:
        for i in range(len(fib) - 1, -1, -1):
            if fib[i] <= n:
                result.append(fib[i])
                n -= fib[i]
                # Ensure non-consecutive Fibonacci numbers by skipping the next one
                fib = fib[:i - 1]
                break

    return result


def fibonacci_cipher_decoder(encoded_string):
    """Decode a Fibonacci cipher encoded binary string containing multiple numbers."""
    decoded_numbers = []

    while "11" in encoded_string:
        split_index = encoded_string.index("11") + 1  # End of the current encoded number
        current_encoded = encoded_string[:split_index]  # Extract the current encoded number
        encoded_string = encoded_string[split_index + 1:]  # Move to the next segment

        # Convert string to list of integers
        encoded_sequence = [int(bit) for bit in current_encoded]  # Remove the last '1'
        # print(encoded_sequence, end=" -> ")
        # Generate Fibonacci sequence up to the length of encoded sequence
        fib = [1, 2]
        while len(fib) < len(encoded_sequence):
            fib.append(fib[-1] + fib[-2])
        # print(fib, end=" = ")
        decoded_number = sum(f * b for f, b in zip(fib, encoded_sequence))
        decoded_numbers.append(decoded_number)
        # print(decoded_number)
    return decoded_numbers


def fibonacci_cipher_encoder(text):
    """Encode a string of characters into a Fibonacci cipher binary string."""
    encoded_string = ""
    for char in text:
        number = ord(char)  # Convert character to ASCII number
        zeckendorf_form = zeckendorf_representation(number)
        # print(f"{char} ({number}): {zeckendorf_form}", end=" -> ")

        # Generate Fibonacci sequence up to the largest number in the representation
        fib = [1, 2]
        while fib[-1] < zeckendorf_form[0]:
            fib.append(fib[-1] + fib[-2])

        # Create binary representation
        binary_representation = ["0"] * len(fib)
        for value in zeckendorf_form:
            index = fib.index(value)
            binary_representation[index] = "1"
        # print(binary_representation, end=" -> ")
        # Convert to string, remove leading zeros, and add termination '1'
        encoded_string += "".join(binary_representation) + "1"
        # print("".join(binary_representation) + "1")
    return encoded_string


def base64_to_binary(base64_string):
    """Converts a base64 string to a binary string."""
    decoded_bytes = base64.b64decode(base64_string)
    binary_string = ''.join(format(byte, '08b') for byte in decoded_bytes)
    return binary_string


def binary_to_base64(binary_string):
    """Converts a binary string to a base64 string."""
    base64_dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    # Pad the binary string to a multiple of 6 bits
    if len(binary_string) % 8 != 0:
        binary_string += "0" * (8 - len(binary_string) % 8)
    # Convert binary string to bytes and then to base64
    bytes_ = [base64_dict[(int(binary_string[i:i + 6], 2))] for i in range(0, len(binary_string), 6)]
    base64_string = ''.join(bytes_)
    return base64_string

def decode_base64(encoded_string):
    """Decode a base64 encoded string."""
    binary_string = base64_to_binary(encoded_string)
    return fibonacci_cipher_decoder(binary_string)



print(f"fibonacci_cipher_encoder('Odyhibit was here!'): {fibonacci_cipher_encoder('Odyhibit was here!')}")
print(f"base64 test {binary_to_base64(fibonacci_cipher_encoder('Odyhibit was here!'))}")

print(f"fibonacci_cipher_decoder' {fibonacci_cipher_decoder(fibonacci_cipher_encoder('Odyhibit was here!'))}")
print(f"base64 test :{''.join([chr(i) for i in decode_base64(binary_to_base64(fibonacci_cipher_encoder('Odyhibit was here!')))])}")