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

def decode_bae64_to_text(encoded_string):
    """Decode a base64 encoded string to text."""
    decoded_numbers = decode_base64(encoded_string)
    return ''.join([chr(i) for i in decoded_numbers])

def decode_base64_to_numbers(encoded_string):
    """Decode a base64 encoded string to a list of numbers."""
    binary_string = base64_to_binary(encoded_string)
    return fibonacci_cipher_decoder(binary_string)


if __name__ == "__main__":
    # Test the Fibonacci cipher encoder and decoder
    print(f"fibonacci_cipher_encoder('Odyhibit was here!'): {fibonacci_cipher_encoder('Odyhibit was here!')}")
    print(f"base64 test {binary_to_base64(fibonacci_cipher_encoder('Odyhibit was here!'))}")

    print(f"fibonacci_cipher_decoder' {fibonacci_cipher_decoder(fibonacci_cipher_encoder('Odyhibit was here!'))}")
    print(f"base64 to text :{decode_bae64_to_text (binary_to_base64(fibonacci_cipher_encoder('Odyhibit was here!')))}")
    print(f"base64 test {binary_to_base64(fibonacci_cipher_encoder('Hello World!'))}")
    rev_5_cipher = "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"
    print(f"base64 to text :{decode_base64_to_numbers(rev_5_cipher)}")
    print(f"base64 to text :{decode_bae64_to_text('CtEZIxJlZIxJlYQysSaoyRyjqGVMrBGENIdQyspqGVKBBg==')}")

    print(f"base64 to text :{decode_bae64_to_text('pOoco5RwTKyrgnROUZQ6sA==')}")
    print(f"base64 to text :{decode_bae64_to_text('RHUOUco4JlcU4J0TlGUM')}")
