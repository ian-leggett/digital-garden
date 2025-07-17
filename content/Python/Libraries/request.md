---
title: "Python Requests Library"
description: "Essential guide to making HTTP requests in Python using the requests library"
tags: [python, http, api, web-requests, networking]
draft: false
date: 2025-07-15
lastmod: 2025-07-15
---

# Python Requests Library
The `requests` library is a powerful and user-friendly HTTP client for Python. It simplifies the process of making HTTP requests, handling responses, and managing sessions. This guide covers the essential features, methods, and patterns for using the requests library effectively.

## Installation and Basic Usage

```python
# Install: pip install requests
import requests

# Basic GET request
response = requests.get('https://api.github.com/users/octocat')
print(response.status_code)  # 200
print(response.json())       # Parsed JSON response
```

## HTTP Methods

### GET Requests
```python
# Simple GET
response = requests.get('https://httpbin.org/get')

# GET with parameters
params = {'q': 'python', 'sort': 'updated'}
response = requests.get('https://api.github.com/search/repositories', params=params)

# GET with headers
headers = {'User-Agent': 'MyApp/1.0'}
response = requests.get('https://api.github.com/user', headers=headers)
```

### POST Requests
```python
# POST with JSON data
data = {'username': 'alice', 'email': 'alice@example.com'}
response = requests.post('https://httpbin.org/post', json=data)

# POST with form data
form_data = {'username': 'alice', 'password': 'secret'}
response = requests.post('https://httpbin.org/post', data=form_data)

# POST with files
files = {'file': open('document.pdf', 'rb')}
response = requests.post('https://httpbin.org/post', files=files)
```

### Other HTTP Methods
```python
# PUT request
response = requests.put('https://httpbin.org/put', json={'key': 'value'})

# PATCH request
response = requests.patch('https://httpbin.org/patch', json={'key': 'new_value'})

# DELETE request
response = requests.delete('https://httpbin.org/delete')

# HEAD request (headers only)
response = requests.head('https://httpbin.org/get')
```

## Response Handling

### Accessing Response Data
```python
response = requests.get('https://api.github.com/users/octocat')

# Status and headers
print(response.status_code)    # 200
print(response.headers)        # Response headers dict
print(response.url)            # Final URL after redirects

# Response content
print(response.text)           # Raw text content
print(response.json())         # Parsed JSON (if applicable)
print(response.content)        # Raw bytes
```

### Status Code Checking
```python
response = requests.get('https://httpbin.org/status/404')

# Check if request was successful
if response.status_code == 200:
    print("Success!")
elif response.status_code == 404:
    print("Not found")

# Raise exception for bad status codes
try:
    response.raise_for_status()
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
```

## Authentication

### Basic Authentication
```python
from requests.auth import HTTPBasicAuth

# Method 1: Using auth parameter
response = requests.get('https://httpbin.org/basic-auth/user/pass', 
                       auth=('user', 'pass'))

# Method 2: Using HTTPBasicAuth
auth = HTTPBasicAuth('user', 'pass')
response = requests.get('https://httpbin.org/basic-auth/user/pass', auth=auth)
```

### Token Authentication
```python
# Bearer token
headers = {'Authorization': 'Bearer your-token-here'}
response = requests.get('https://api.example.com/data', headers=headers)

# API key in headers
headers = {'X-API-Key': 'your-api-key'}
response = requests.get('https://api.example.com/data', headers=headers)
```

## Session Management

### Using Sessions for Multiple Requests
```python
session = requests.Session()

# Set common headers for all requests
session.headers.update({'User-Agent': 'MyApp/1.0'})

# Authentication persists across requests
session.auth = ('user', 'pass')

# Make multiple requests
response1 = session.get('https://httpbin.org/get')
response2 = session.post('https://httpbin.org/post', json={'key': 'value'})

# Cookies are automatically handled
session.get('https://httpbin.org/cookies/set/session_id/12345')
response = session.get('https://httpbin.org/cookies')  # Cookie included
```

## Error Handling and Timeouts

### Comprehensive Error Handling
```python
import requests
from requests.exceptions import RequestException, Timeout, ConnectionError

try:
    response = requests.get('https://api.example.com/data', 
                          timeout=5,  # 5 second timeout
                          params={'key': 'value'})
    response.raise_for_status()
    return response.json()
    
except Timeout:
    print("Request timed out")
except ConnectionError:
    print("Connection failed")
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
except RequestException as e:
    print(f"Request failed: {e}")
```

### Timeout Configuration
```python
# Single timeout value (total time)
response = requests.get('https://httpbin.org/delay/3', timeout=5)

# Separate connect and read timeouts
response = requests.get('https://httpbin.org/delay/3', 
                       timeout=(3.05, 10))  # (connect, read)
```

## Advanced Features

### Custom Headers and User Agents
```python
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}
response = requests.get('https://api.example.com', headers=headers)
```

### Handling Redirects
```python
# Allow redirects (default)
response = requests.get('https://httpbin.org/redirect/3')

# Disable redirects
response = requests.get('https://httpbin.org/redirect/3', allow_redirects=False)
print(response.status_code)  # 302

# Access redirect history
response = requests.get('https://httpbin.org/redirect/3')
print(response.history)  # List of redirect responses
```

### SSL Verification
```python
# Disable SSL verification (not recommended for production)
response = requests.get('https://self-signed.badssl.com', verify=False)

# Custom CA bundle
response = requests.get('https://api.example.com', verify='/path/to/ca-bundle.crt')
```

## Common Patterns

### API Client Class
```python
class APIClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def get(self, endpoint, **kwargs):
        url = f"{self.base_url}/{endpoint}"
        return self._request('GET', url, **kwargs)
    
    def post(self, endpoint, data=None, **kwargs):
        url = f"{self.base_url}/{endpoint}"
        return self._request('POST', url, json=data, **kwargs)
    
    def _request(self, method, url, **kwargs):
        try:
            response = self.session.request(method, url, timeout=10, **kwargs)
            response.raise_for_status()
            return response.json()
        except RequestException as e:
            print(f"API request failed: {e}")
            raise

# Usage
client = APIClient('https://api.example.com', 'your-api-key')
data = client.get('users/123')
```

### Retry Logic with Exponential Backoff
```python
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_session_with_retries():
    session = requests.Session()
    
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    return session

# Usage
session = create_session_with_retries()
response = session.get('https://api.example.com/data')
```

## Performance Considerations

### Connection Pooling
```python
# Sessions automatically handle connection pooling
session = requests.Session()

# Multiple requests reuse connections
for i in range(10):
    response = session.get(f'https://api.example.com/item/{i}')
```

### Streaming Large Responses
```python
# Stream large files
with requests.get('https://example.com/large-file.zip', stream=True) as response:
    response.raise_for_status()
    with open('large-file.zip', 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
```

## Best Practices

### Essential Guidelines
- **Always use timeouts** to prevent hanging requests
- **Handle exceptions** appropriately for production code
- **Use sessions** for multiple requests to the same host
- **Don't disable SSL verification** in production
- **Close sessions** when done to free resources
- **Check status codes** before processing response data

### Production-Ready Request Function
```python
def make_request(url, method='GET', **kwargs):
    """Production-ready request function with proper error handling"""
    session = kwargs.pop('session', requests)
    timeout = kwargs.get('timeout', 10)
    
    try:
        response = session.request(method, url, timeout=timeout, **kwargs)
        response.raise_for_status()
        return response
    except Timeout:
        raise Exception(f"Request to {url} timed out after {timeout}s")
    except ConnectionError:
        raise Exception(f"Failed to connect to {url}")
    except requests.exceptions.HTTPError as e:
        raise Exception(f"HTTP {e.response.status_code}: {e}")
    except RequestException as e:
        raise Exception(f"Request failed: {e}")
```

## Related Topics
- [[Python files]] - File handling for uploads and downloads
- [[Python dictionaries]] - Working with JSON response data
- [[Python strings]] - URL manipulation and formatting