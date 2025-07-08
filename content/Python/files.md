---
title: "File Operations"
description: "Essential guide to reading, writing, and manipulating files in Python"
tags: [python, files, io, file-handling, pathlib]
draft: false
date: 2025-07-07
lastmod: 2025-07-07
---

# Python File Operations
Python provides powerful tools for file handling, allowing you to read, write, and manipulate files easily. This guide covers the essential operations, methods, and patterns for working with files in Python, including reading and writing text and binary files, handling file paths with `pathlib`, and managing file encoding.

## Basic File Operations

### Reading Files
```python
# Basic file reading
with open('data.txt', 'r') as file:
    content = file.read()          # Read entire file
    
with open('data.txt', 'r') as file:
    lines = file.readlines()       # Read all lines as list

with open('data.txt', 'r') as file:
    first_line = file.readline()   # Read single line

# Line-by-line iteration (memory efficient)
with open('large_file.txt', 'r') as file:
    for line in file:
        process_line(line.strip())
```

### Writing Files
```python
# Write (overwrites existing content)
with open('output.txt', 'w') as file:
    file.write('Hello, World!\n')
    file.writelines(['Line 1\n', 'Line 2\n'])

# Append (adds to existing content)
with open('log.txt', 'a') as file:
    file.write('New log entry\n')

# Write multiple lines
lines = ['First line', 'Second line', 'Third line']
with open('output.txt', 'w') as file:
    file.write('\n'.join(lines))
```

## File Modes and Encoding

### Common File Modes
```python
# Text modes
with open('file.txt', 'r') as f:    # Read text
with open('file.txt', 'w') as f:    # Write text (overwrite)
with open('file.txt', 'a') as f:    # Append text
with open('file.txt', 'r+') as f:   # Read and write

# Binary modes
with open('image.jpg', 'rb') as f:  # Read binary
with open('image.jpg', 'wb') as f:  # Write binary
with open('data.bin', 'ab') as f:   # Append binary

# Exclusive creation (fails if file exists)
with open('new_file.txt', 'x') as f:
    f.write('Content')
```

### Encoding Handling
```python
# Specify encoding (UTF-8 recommended)
with open('unicode.txt', 'r', encoding='utf-8') as file:
    content = file.read()

with open('output.txt', 'w', encoding='utf-8') as file:
    file.write('Hello, 世界! 🌍')

# Handle encoding errors
with open('file.txt', 'r', encoding='utf-8', errors='ignore') as file:
    content = file.read()  # Skip invalid characters

with open('file.txt', 'r', encoding='utf-8', errors='replace') as file:
    content = file.read()  # Replace invalid with �
```

## Modern Path Handling with pathlib

### Path Creation and Manipulation
```python
from pathlib import Path

# Create paths
file_path = Path('data/input.txt')
absolute_path = Path('/home/user/documents/file.txt')
current_dir = Path.cwd()
home_dir = Path.home()

# Path operations
parent = file_path.parent           # Path('data')
name = file_path.name              # 'input.txt'
stem = file_path.stem              # 'input'
suffix = file_path.suffix          # '.txt'

# Join paths
config_path = Path('config') / 'settings.json'
user_file = Path.home() / 'documents' / 'file.txt'
```

### Path Information and Testing
```python
path = Path('data/file.txt')

# Existence and type checking
exists = path.exists()
is_file = path.is_file()
is_dir = path.is_dir()
is_symlink = path.is_symlink()

# File information
size = path.stat().st_size
modified_time = path.stat().st_mtime
permissions = path.stat().st_mode

# Absolute and resolved paths
absolute = path.absolute()
resolved = path.resolve()  # Resolve symlinks and relative paths
```

### Directory Operations
```python
# Create directories
Path('new_dir').mkdir()                    # Create single directory
Path('deep/nested/dirs').mkdir(parents=True, exist_ok=True)

# List directory contents
for item in Path('.').iterdir():
    if item.is_file():
        print(f"File: {item}")
    elif item.is_dir():
        print(f"Directory: {item}")

# Glob patterns
txt_files = list(Path('.').glob('*.txt'))
all_py_files = list(Path('.').rglob('**/*.py'))  # Recursive
```

## File Operations with pathlib

### Reading and Writing
```python
from pathlib import Path

path = Path('data.txt')

# Read text
content = path.read_text(encoding='utf-8')
lines = content.splitlines()

# Write text
path.write_text('Hello, World!', encoding='utf-8')

# Read/write binary
binary_data = path.read_bytes()
path.write_bytes(b'Binary content')

# Safe writing with context manager
with path.open('w', encoding='utf-8') as file:
    file.write('Content')
```

## Error Handling

### Common Exceptions
```python
from pathlib import Path

def safe_file_operation(filename):
    try:
        path = Path(filename)
        content = path.read_text()
        return content
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None
    except PermissionError:
        print(f"Permission denied for {filename}")
        return None
    except UnicodeDecodeError:
        print(f"Cannot decode {filename}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
```

### Robust File Operations
```python
def safe_write_file(path, content, backup=True):
    path = Path(path)
    
    # Create backup if file exists
    if backup and path.exists():
        backup_path = path.with_suffix(path.suffix + '.bak')
        backup_path.write_bytes(path.read_bytes())
    
    try:
        # Write to temporary file first
        temp_path = path.with_suffix(path.suffix + '.tmp')
        temp_path.write_text(content, encoding='utf-8')
        
        # Atomic move
        temp_path.replace(path)
        return True
    except Exception as e:
        if temp_path.exists():
            temp_path.unlink()  # Clean up temp file
        raise e
```

## Working with Different File Types

### CSV Files
```python
import csv
from pathlib import Path

# Reading CSV
def read_csv(filename):
    with open(filename, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        return list(reader)

# Writing CSV
def write_csv(filename, data, fieldnames):
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

data = [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 25}]
write_csv('people.csv', data, ['name', 'age'])
```

### JSON Files
```python
import json
from pathlib import Path

# Reading JSON
def read_json(filename):
    path = Path(filename)
    return json.loads(path.read_text(encoding='utf-8'))

# Writing JSON
def write_json(filename, data, indent=2):
    path = Path(filename)
    path.write_text(
        json.dumps(data, indent=indent, ensure_ascii=False),
        encoding='utf-8'
    )

config = {'database': {'host': 'localhost', 'port': 5432}}
write_json('config.json', config)
```

### Configuration Files
```python
import configparser
from pathlib import Path

# Reading INI files
config = configparser.ConfigParser()
config.read('config.ini')

database_host = config['database']['host']
debug_mode = config.getboolean('settings', 'debug')

# Writing INI files
config['database'] = {
    'host': 'localhost',
    'port': '5432',
    'name': 'myapp'
}

with open('config.ini', 'w') as file:
    config.write(file)
```

## Performance and Best Practices

### Memory-Efficient Reading
```python
def process_large_file(filename):
    """Process large files without loading into memory"""
    with open(filename, 'r') as file:
        for line_num, line in enumerate(file, 1):
            # Process one line at a time
            if line_num % 10000 == 0:
                print(f"Processed {line_num} lines")
            
            yield process_line(line.strip())

# Use generator for memory efficiency
results = list(process_large_file('huge_file.txt'))
```

### Batch Operations
```python
def batch_file_processing(file_paths, batch_size=100):
    """Process files in batches"""
    for i in range(0, len(file_paths), batch_size):
        batch = file_paths[i:i + batch_size]
        
        for file_path in batch:
            try:
                process_file(file_path)
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
```

### Context Managers for Resource Management
```python
class FileManager:
    def __init__(self, filename, mode='r'):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()

# Usage
with FileManager('data.txt') as file:
    content = file.read()
```

## Common Patterns

### File Backup and Rotation
```python
from pathlib import Path
import shutil
from datetime import datetime

def rotate_log_file(log_path, max_files=5):
    """Rotate log files keeping only the most recent"""
    log_path = Path(log_path)
    
    if not log_path.exists():
        return
    
    # Create timestamped backup
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = log_path.with_name(f"{log_path.stem}_{timestamp}{log_path.suffix}")
    
    shutil.move(str(log_path), str(backup_path))
    
    # Clean up old backups
    pattern = f"{log_path.stem}_*{log_path.suffix}"
    old_files = sorted(log_path.parent.glob(pattern))
    
    for old_file in old_files[:-max_files]:
        old_file.unlink()
```

### File Synchronization
```python
def sync_files(source_dir, target_dir, extensions=None):
    """Sync files between directories"""
    source = Path(source_dir)
    target = Path(target_dir)
    
    target.mkdir(parents=True, exist_ok=True)
    
    for source_file in source.rglob('*'):
        if source_file.is_file():
            if extensions and source_file.suffix not in extensions:
                continue
            
            relative_path = source_file.relative_to(source)
            target_file = target / relative_path
            
            # Create target directory if needed
            target_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy if newer or doesn't exist
            if (not target_file.exists() or 
                source_file.stat().st_mtime > target_file.stat().st_mtime):
                shutil.copy2(source_file, target_file)
                print(f"Synced: {relative_path}")
```

### Temporary Files
```python
import tempfile
from pathlib import Path

# Temporary files
with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as tmp:
    tmp.write('Temporary content')
    temp_path = Path(tmp.name)

# Process temp file
try:
    process_file(temp_path)
finally:
    temp_path.unlink()  # Clean up

# Temporary directories
with tempfile.TemporaryDirectory() as temp_dir:
    temp_path = Path(temp_dir)
    work_file = temp_path / 'work.txt'
    work_file.write_text('Working...')
    # Directory automatically cleaned up
```

## Security Considerations

### Path Validation
```python
from pathlib import Path

def safe_path_join(base_dir, user_path):
    """Prevent directory traversal attacks"""
    base = Path(base_dir).resolve()
    full_path = (base / user_path).resolve()
    
    # Ensure the result is within the base directory
    try:
        full_path.relative_to(base)
        return full_path
    except ValueError:
        raise ValueError("Path traversal attempt detected")

# Usage
try:
    safe_file = safe_path_join('/safe/uploads', user_filename)
except ValueError:
    print("Invalid file path")
```

### File Permissions
```python
import stat
from pathlib import Path

def set_secure_permissions(file_path):
    """Set secure file permissions"""
    path = Path(file_path)
    
    # Owner read/write, group read, others none
    path.chmod(stat.S_IRUSR | stat.S_IWUSR | stat.S_IRGRP)

def check_file_permissions(file_path):
    """Check if file has secure permissions"""
    path = Path(file_path)
    mode = path.stat().st_mode
    
    # Check if others have any permissions
    others_perms = mode & (stat.S_IROTH | stat.S_IWOTH | stat.S_IXOTH)
    return others_perms == 0
```

## Related Topics
- [[Python strings]] - String manipulation for file content processing
- [[Python dictionaries]] - Working with structured data from files
- [[Python lists]] - Processing file lines and data collections