import os

def find_null_bytes(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'rb') as f:
                        content = f.read()
                        if b'\x00' in content:
                            print(f"Null byte found in: {path}")
                except Exception as e:
                    print(f"Could not read {path}: {e}")

find_null_bytes('.')
