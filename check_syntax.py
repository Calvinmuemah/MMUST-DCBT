import os

def check_balance(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    stack = []
    for i, char in enumerate(content):
        if char in '({[':
            stack.append((char, i))
        elif char in ')}]':
            if not stack:
                return False, f"Extra closing '{char}' at index {i}"
            top, _ = stack.pop()
            if (top == '(' and char != ')') or \
               (top == '{' and char != '}') or \
               (top == '[' and char != ']'):
                return False, f"Mismatched '{char}' at index {i}, expected match for '{top}'"
    
    if stack:
        char, i = stack[0]
        return False, f"Unclosed '{char}' at index {i}"
    
    return True, "Balanced"

def main():
    screens_dir = 'mmustcare/lib/screens'
    for root, dirs, files in os.walk(screens_dir):
        for file in files:
            if file.endswith('.dart'):
                path = os.path.join(root, file)
                balanced, msg = check_balance(path)
                if not balanced:
                    print(f"{path}: {msg}")

if __name__ == "__main__":
    main()
