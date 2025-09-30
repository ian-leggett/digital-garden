---
title: "Object-Oriented Programming"
description: "Essential OOP concepts including classes, static methods, and private methods with practical examples"
tags: [python, oop, classes, methods, encapsulation]
draft: false
date: 2025-09-30
lastmod: 2025-09-30
---

## Core Concepts

Object-Oriented Programming organizes code into classes and objects, promoting code reuse and maintainability through encapsulation, inheritance, and polymorphism.

- **Classes**: Blueprints for creating objects
- **Objects**: Instances of classes with state and behavior
- **Methods**: Functions defined within classes
- **Attributes**: Variables that store object data

## Basic Class Structure

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
    
    def display_info(self):
        return f"{self.name} ({self.email})"

# Create and use objects
user = User("Alice", "alice@example.com")
print(user.display_info())  # Alice (alice@example.com)
```

## Static Methods

Static methods don't access instance or class data. Use `@staticmethod` decorator.

```python
class MathUtils:
    @staticmethod
    def add(x, y):
        return x + y
    
    @staticmethod
    def is_even(number):
        return number % 2 == 0

# Call without creating instance
result = MathUtils.add(5, 3)        # 8
check = MathUtils.is_even(4)        # True

# Can also call from instance
math = MathUtils()
result = math.add(2, 3)             # 5
```

## Private Methods and Attributes

Use single underscore `_` for internal use, double underscore `__` for name mangling.

```python
class BankAccount:
    def __init__(self, balance):
        self.account_id = "ACC123"      # Public
        self._balance = balance         # Internal use
        self.__pin = "1234"            # Private (name mangled)
    
    def deposit(self, amount):
        if self._validate_amount(amount):
            self._balance += amount
            return True
        return False
    
    def _validate_amount(self, amount):  # Internal method
        return amount > 0
    
    def __encrypt_data(self, data):      # Private method
        return f"encrypted_{data}"
    
    def get_balance(self):
        return self._balance

account = BankAccount(1000)
print(account.get_balance())        # 1000
print(account._balance)             # 1000 (accessible but not recommended)
print(account._BankAccount__pin)    # "1234" (name mangled, avoid)
```

## Class Methods and Class Variables

Use `@classmethod` for methods that work with the class itself.

```python
class Product:
    tax_rate = 0.1  # Class variable
    
    def __init__(self, name, price):
        self.name = name
        self.price = price
    
    @classmethod
    def set_tax_rate(cls, rate):
        cls.tax_rate = rate
    
    @classmethod
    def from_string(cls, product_string):
        # Alternative constructor
        name, price = product_string.split(',')
        return cls(name, float(price))
    
    def total_price(self):
        return self.price * (1 + self.tax_rate)

# Using class methods
Product.set_tax_rate(0.15)
product = Product.from_string("Laptop,999.99")
print(product.total_price())        # 1149.99
```

## Inheritance

```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

dog = Dog("Buddy")
cat = Cat("Whiskers")
print(dog.speak())  # Buddy says Woof!
print(cat.speak())  # Whiskers says Meow!
```

## Property Decorators

Control access to attributes with getters and setters.

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32

temp = Temperature(25)
print(temp.celsius)     # 25
print(temp.fahrenheit)  # 77.0
temp.celsius = 30       # Uses setter
```

## Common Patterns

### Factory Pattern with Class Methods

```python
class User:
    def __init__(self, name, role):
        self.name = name
        self.role = role
    
    @classmethod
    def create_admin(cls, name):
        return cls(name, "admin")
    
    @classmethod
    def create_user(cls, name):
        return cls(name, "user")

admin = User.create_admin("Bob")
user = User.create_user("Alice")
```

### Validation with Private Methods

```python
class Email:
    def __init__(self, address):
        if self._is_valid(address):
            self._address = address
        else:
            raise ValueError("Invalid email")
    
    def _is_valid(self, email):
        return "@" in email and "." in email
    
    @property
    def address(self):
        return self._address

email = Email("test@example.com")
print(email.address)  # test@example.com
```

## Best Practices

- Use `@staticmethod` for utility functions that don't need class data
- Use single underscore `_` for internal methods/attributes
- Use `@property` for computed attributes or validation
- Keep classes focused on a single responsibility
- Use inheritance for "is-a" relationships

## Troubleshooting

### Common Issues

```python
# Issue: Forgetting self parameter
class Bad:
    def method():  # Missing self
        pass

# Solution: Always include self
class Good:
    def method(self):
        pass

# Issue: Accessing private attributes directly
class Account:
    def __init__(self):
        self.__balance = 100

acc = Account()
# Don't do: acc._Account__balance
# Do: Use public methods or properties
```

## Related Topics

- [[functions]] - Function definition and method concepts
- [[decorators]] - Understanding @staticmethod, @classmethod, @property
- [[inheritance]] - Advanced inheritance patterns
