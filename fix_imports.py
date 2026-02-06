import os

def replace_in_file(filepath, old_str, new_str):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if old_str in content:
            new_content = content.replace(old_str, new_str)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed: {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

def main():
    target_dir = os.path.join(os.getcwd(), 'app')
    print(f"Scanning {target_dir}...")
    
    # We want to replace '../context/ThemeContext' with '@/context/ThemeContext'
    # And potentially '../../context/ThemeContext' if mixed.
    # But grep showed '../context/ThemeContext'.
    
    count = 0
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                replace_in_file(filepath, "'../context/ThemeContext'", "'@/context/ThemeContext'")
                replace_in_file(filepath, '"../context/ThemeContext"', '"@/context/ThemeContext"')
                count += 1
                
    print(f"Scanned {count} files.")

if __name__ == '__main__':
    main()
