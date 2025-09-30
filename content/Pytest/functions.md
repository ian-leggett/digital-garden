---
title: "Testing Functions with Pytest"
description: "Essential guide to testing Python functions using pytest with fixtures, mocking, and API testing"
tags: [python, pytest, testing, functions, mocking, api]
draft: false
date: 2025-07-17
lastmod: 2025-07-17
---

Pytest is a powerful testing framework for Python that makes it easy to write simple and scalable test cases. This guide covers how to set up pytest, write basic tests, use fixtures, and mock external dependencies.

## Basic Function Testing

### Simple Function Tests
```python
# math_utils.py
def add(a, b):
    """Add two numbers"""
    return a + b

def divide(a, b):
    """Divide two numbers"""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def is_even(number):
    """Check if a number is even"""
    return number % 2 == 0

def calculate_discount(price, discount_percent):
    """Calculate discounted price"""
    if discount_percent < 0 or discount_percent > 100:
        raise ValueError("Discount must be between 0 and 100")
    return price * (1 - discount_percent / 100)
```

### Basic Test Cases
```python
# test_math_utils.py
import pytest
from math_utils import add, divide, is_even, calculate_discount

def test_add_positive_numbers():
    """Test adding positive numbers"""
    result = add(2, 3)
    assert result == 5

def test_add_negative_numbers():
    """Test adding negative numbers"""
    result = add(-2, -3)
    assert result == -5

def test_add_mixed_numbers():
    """Test adding positive and negative numbers"""
    result = add(5, -3)
    assert result == 2

def test_divide_positive_numbers():
    """Test dividing positive numbers"""
    result = divide(10, 2)
    assert result == 5.0

def test_divide_by_zero_raises_error():
    """Test that dividing by zero raises ValueError"""
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)

def test_is_even_with_even_number():
    """Test is_even returns True for even numbers"""
    assert is_even(4) is True
    assert is_even(0) is True
    assert is_even(-2) is True

def test_is_even_with_odd_number():
    """Test is_even returns False for odd numbers"""
    assert is_even(3) is False
    assert is_even(1) is False
    assert is_even(-1) is False
```

## Parametrized Tests

### Testing Multiple Input Cases
```python
@pytest.mark.parametrize("a, b, expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
    (10, -5, 5),
    (3.5, 2.5, 6.0),
])
def test_add_parametrized(a, b, expected):
    """Test add function with multiple parameter sets"""
    assert add(a, b) == expected

@pytest.mark.parametrize("number, expected", [
    (2, True),
    (3, False),
    (0, True),
    (-4, True),
    (-3, False),
])
def test_is_even_parametrized(number, expected):
    """Test is_even function with multiple cases"""
    assert is_even(number) == expected

@pytest.mark.parametrize("price, discount, expected", [
    (100, 10, 90.0),
    (50, 20, 40.0),
    (100, 0, 100.0),
    (200, 50, 100.0),
])
def test_calculate_discount_valid(price, discount, expected):
    """Test calculate_discount with valid inputs"""
    assert calculate_discount(price, discount) == expected

@pytest.mark.parametrize("price, discount", [
    (100, -5),
    (100, 101),
    (50, 150),
])
def test_calculate_discount_invalid(price, discount):
    """Test calculate_discount with invalid discount percentages"""
    with pytest.raises(ValueError, match="Discount must be between 0 and 100"):
        calculate_discount(price, discount)
```

## Testing with Fixtures

### Setup and Teardown
```python
# conftest.py
import pytest
import tempfile
import os

@pytest.fixture
def sample_data():
    """Provide sample data for tests"""
    return {
        'users': [
            {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'},
            {'id': 2, 'name': 'Bob', 'email': 'bob@example.com'},
        ],
        'products': [
            {'id': 1, 'name': 'Laptop', 'price': 999.99},
            {'id': 2, 'name': 'Mouse', 'price': 25.50},
        ]
    }

@pytest.fixture
def temp_file():
    """Create a temporary file for testing"""
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
        f.write("test content")
        temp_path = f.name
    
    yield temp_path
    
    # Cleanup
    if os.path.exists(temp_path):
        os.unlink(temp_path)
```

### Using Fixtures in Tests
```python
# data_processor.py
def filter_users_by_email_domain(users, domain):
    """Filter users by email domain"""
    return [user for user in users if user['email'].endswith(f'@{domain}')]

def calculate_total_price(products):
    """Calculate total price of all products"""
    return sum(product['price'] for product in products)

def read_file_content(filepath):
    """Read content from file"""
    with open(filepath, 'r') as f:
        return f.read()

# test_data_processor.py
from data_processor import filter_users_by_email_domain, calculate_total_price, read_file_content

def test_filter_users_by_domain(sample_data):
    """Test filtering users by email domain"""
    users = sample_data['users']
    result = filter_users_by_email_domain(users, 'example.com')
    
    assert len(result) == 2
    assert all(user['email'].endswith('@example.com') for user in result)

def test_calculate_total_price(sample_data):
    """Test calculating total price"""
    products = sample_data['products']
    total = calculate_total_price(products)
    
    assert total == 1025.49  # 999.99 + 25.50

def test_read_file_content(temp_file):
    """Test reading file content"""
    content = read_file_content(temp_file)
    assert content == "test content"
```

## Mocking Examples

### Basic Mocking
```python
from unittest.mock import Mock, patch, MagicMock

# user_service.py
import requests

def get_user_data(user_id):
    """Fetch user data from API"""
    response = requests.get(f'https://api.example.com/users/{user_id}')
    response.raise_for_status()
    return response.json()

def create_user(user_data):
    """Create a new user via API"""
    response = requests.post('https://api.example.com/users', json=user_data)
    response.raise_for_status()
    return response.json()

def send_email(to_email, subject, body):
    """Send email using external service"""
    import smtplib
    # Email sending logic here
    print(f"Sending email to {to_email}")
    return True
```

### Mocking External Dependencies
```python
# test_user_service.py
from unittest.mock import patch, Mock
import pytest
import requests
from user_service import get_user_data, create_user, send_email

@patch('user_service.requests.get')
def test_get_user_data_success(mock_get):
    """Test successful user data retrieval"""
    # Setup mock response
    mock_response = Mock()
    mock_response.json.return_value = {
        'id': 1,
        'name': 'John Doe',
        'email': 'john@example.com'
    }
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response
    
    # Test the function
    result = get_user_data(1)
    
    # Assertions
    assert result['id'] == 1
    assert result['name'] == 'John Doe'
    mock_get.assert_called_once_with('https://api.example.com/users/1')
    mock_response.raise_for_status.assert_called_once()

@patch('user_service.requests.get')
def test_get_user_data_api_error(mock_get):
    """Test handling of API errors"""
    # Setup mock to raise exception
    mock_response = Mock()
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("404 Not Found")
    mock_get.return_value = mock_response
    
    # Test that exception is raised
    with pytest.raises(requests.exceptions.HTTPError):
        get_user_data(999)
    
    mock_get.assert_called_once_with('https://api.example.com/users/999')

@patch('user_service.requests.post')
def test_create_user_success(mock_post):
    """Test successful user creation"""
    # Setup mock response
    mock_response = Mock()
    mock_response.json.return_value = {
        'id': 2,
        'name': 'Jane Smith',
        'email': 'jane@example.com',
        'created': True
    }
    mock_response.raise_for_status.return_value = None
    mock_post.return_value = mock_response
    
    # Test data
    user_data = {
        'name': 'Jane Smith',
        'email': 'jane@example.com'
    }
    
    # Test the function
    result = create_user(user_data)
    
    # Assertions
    assert result['id'] == 2
    assert result['created'] is True
    mock_post.assert_called_once_with('https://api.example.com/users', json=user_data)
```

## API Request Testing

### Complete API Testing Example
```python
# api_client.py
import requests
from typing import Dict, List, Optional

class APIClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def get_users(self) -> List[Dict]:
        """Get all users"""
        response = self.session.get(f'{self.base_url}/users')
        response.raise_for_status()
        return response.json()
    
    def get_user(self, user_id: int) -> Dict:
        """Get specific user"""
        response = self.session.get(f'{self.base_url}/users/{user_id}')
        response.raise_for_status()
        return response.json()
    
    def create_user(self, user_data: Dict) -> Dict:
        """Create new user"""
        response = self.session.post(f'{self.base_url}/users', json=user_data)
        response.raise_for_status()
        return response.json()
    
    def update_user(self, user_id: int, user_data: Dict) -> Dict:
        """Update existing user"""
        response = self.session.put(f'{self.base_url}/users/{user_id}', json=user_data)
        response.raise_for_status()
        return response.json()
    
    def delete_user(self, user_id: int) -> bool:
        """Delete user"""
        response = self.session.delete(f'{self.base_url}/users/{user_id}')
        response.raise_for_status()
        return response.status_code == 204
```

### Testing API Client
```python
# test_api_client.py
import pytest
from unittest.mock import Mock, patch
import requests
from api_client import APIClient

@pytest.fixture
def api_client():
    """Create API client instance for testing"""
    return APIClient('https://api.example.com', 'test-api-key')

@pytest.fixture
def sample_user():
    """Sample user data for testing"""
    return {
        'id': 1,
        'name': 'Test User',
        'email': 'test@example.com',
        'active': True
    }

class TestAPIClient:
    """Test suite for API client"""
    
    @patch('api_client.requests.Session.get')
    def test_get_users_success(self, mock_get, api_client):
        """Test successful retrieval of all users"""
        mock_response = Mock()
        mock_response.json.return_value = [
            {'id': 1, 'name': 'User 1'},
            {'id': 2, 'name': 'User 2'}
        ]
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = api_client.get_users()
        
        assert len(result) == 2
        assert result[0]['id'] == 1
        mock_get.assert_called_once_with('https://api.example.com/users')
    
    @patch('api_client.requests.Session.get')
    def test_get_user_success(self, mock_get, api_client, sample_user):
        """Test successful retrieval of specific user"""
        mock_response = Mock()
        mock_response.json.return_value = sample_user
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = api_client.get_user(1)
        
        assert result['id'] == 1
        assert result['name'] == 'Test User'
        mock_get.assert_called_once_with('https://api.example.com/users/1')
    
    @patch('api_client.requests.Session.get')
    def test_get_user_not_found(self, mock_get, api_client):
        """Test handling of user not found"""
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("404 Not Found")
        mock_get.return_value = mock_response
        
        with pytest.raises(requests.exceptions.HTTPError):
            api_client.get_user(999)
    
    @patch('api_client.requests.Session.post')
    def test_create_user_success(self, mock_post, api_client):
        """Test successful user creation"""
        user_data = {'name': 'New User', 'email': 'new@example.com'}
        created_user = {**user_data, 'id': 3, 'active': True}
        
        mock_response = Mock()
        mock_response.json.return_value = created_user
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        result = api_client.create_user(user_data)
        
        assert result['id'] == 3
        assert result['name'] == 'New User'
        mock_post.assert_called_once_with('https://api.example.com/users', json=user_data)
    
    @patch('api_client.requests.Session.put')
    def test_update_user_success(self, mock_put, api_client):
        """Test successful user update"""
        user_data = {'name': 'Updated User'}
        updated_user = {'id': 1, 'name': 'Updated User', 'email': 'test@example.com'}
        
        mock_response = Mock()
        mock_response.json.return_value = updated_user
        mock_response.raise_for_status.return_value = None
        mock_put.return_value = mock_response
        
        result = api_client.update_user(1, user_data)
        
        assert result['name'] == 'Updated User'
        mock_put.assert_called_once_with('https://api.example.com/users/1', json=user_data)
    
    @patch('api_client.requests.Session.delete')
    def test_delete_user_success(self, mock_delete, api_client):
        """Test successful user deletion"""
        mock_response = Mock()
        mock_response.status_code = 204
        mock_response.raise_for_status.return_value = None
        mock_delete.return_value = mock_response
        
        result = api_client.delete_user(1)
        
        assert result is True
        mock_delete.assert_called_once_with('https://api.example.com/users/1')
```

## Advanced Mocking Patterns

### Mocking with Context Managers
```python
# file_processor.py
def process_file(filename):
    """Process a file and return processed content"""
    with open(filename, 'r') as f:
        content = f.read()
    
    # Process content
    processed = content.upper().strip()
    
    # Write to output file
    output_filename = f"processed_{filename}"
    with open(output_filename, 'w') as f:
        f.write(processed)
    
    return output_filename

# test_file_processor.py
from unittest.mock import patch, mock_open
from file_processor import process_file

@patch('builtins.open', new_callable=mock_open, read_data="hello world")
def test_process_file(mock_file):
    """Test file processing with mocked file operations"""
    result = process_file('input.txt')
    
    assert result == 'processed_input.txt'
    
    # Verify file was opened for reading
    mock_file.assert_any_call('input.txt', 'r')
    
    # Verify file was opened for writing
    mock_file.assert_any_call('processed_input.txt', 'w')
    
    # Verify content was written
    mock_file().write.assert_called_with('HELLO WORLD')
```

### Mocking Class Methods
```python
# notification_service.py
class EmailService:
    def send_email(self, to, subject, body):
        """Send email"""
        # Email sending logic
        return True

class NotificationService:
    def __init__(self):
        self.email_service = EmailService()
    
    def notify_user(self, user_email, message):
        """Send notification to user"""
        subject = "Notification"
        return self.email_service.send_email(user_email, subject, message)

# test_notification_service.py
from unittest.mock import Mock, patch
from notification_service import NotificationService

@patch('notification_service.EmailService')
def test_notify_user(mock_email_service):
    """Test user notification"""
    # Setup mock
    mock_email_instance = Mock()
    mock_email_instance.send_email.return_value = True
    mock_email_service.return_value = mock_email_instance
    
    # Test
    service = NotificationService()
    result = service.notify_user('user@example.com', 'Test message')
    
    # Assertions
    assert result is True
    mock_email_instance.send_email.assert_called_once_with(
        'user@example.com',
        'Notification',
        'Test message'
    )
```

## Testing Edge Cases

### Error Handling Tests
```python
def test_divide_by_zero_custom_message():
    """Test custom error message for division by zero"""
    with pytest.raises(ValueError) as exc_info:
        divide(10, 0)
    
    assert "Cannot divide by zero" in str(exc_info.value)

def test_network_timeout_handling():
    """Test handling of network timeouts"""
    with patch('requests.get') as mock_get:
        mock_get.side_effect = requests.exceptions.Timeout("Request timed out")
        
        with pytest.raises(requests.exceptions.Timeout):
            get_user_data(1)

def test_invalid_json_response():
    """Test handling of invalid JSON response"""
    with patch('requests.get') as mock_get:
        mock_response = Mock()
        mock_response.json.side_effect = ValueError("Invalid JSON")
        mock_get.return_value = mock_response
        
        with pytest.raises(ValueError):
            get_user_data(1)
```

## Best Practices

### Test Organization
```python
class TestMathUtils:
    """Group related tests together"""
    
    def test_add_basic_cases(self):
        """Test basic addition cases"""
        assert add(1, 2) == 3
        assert add(0, 0) == 0
    
    def test_add_edge_cases(self):
        """Test edge cases for addition"""
        assert add(-1, 1) == 0
        assert add(float('inf'), 1) == float('inf')

class TestUserService:
    """Test user service functionality"""
    
    @patch('user_service.requests.get')
    def test_get_user_success(self, mock_get):
        """Test successful user retrieval"""
        # Test implementation
        pass
    
    @patch('user_service.requests.get')
    def test_get_user_failure(self, mock_get):
        """Test failed user retrieval"""
        # Test implementation
        pass
```

### Assertion Helpers
```python
def assert_user_data_valid(user_data):
    """Helper to validate user data structure"""
    assert 'id' in user_data
    assert 'name' in user_data
    assert 'email' in user_data
    assert '@' in user_data['email']

def test_get_user_data_structure(sample_user):
    """Test that user data has correct structure"""
    assert_user_data_valid(sample_user)
```

## Related Topics
- [[Python dictionaries]] - Working with API response data
- [[Python files]] - File operations and testing
- [[Python strings]] - String manipulation in functions
- [[Django testing]] - Testing Django-specific functionality