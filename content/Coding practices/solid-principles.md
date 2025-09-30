---
title: "SOLID Principles"
description: "Essential SOLID principles for maintainable object-oriented design"
tags: [design-patterns, oop, software-engineering, clean-code]
draft: false
date: 2025-07-01
lastmod: 2025-07-01
---

Five fundamental principles for writing maintainable, extensible object-oriented code.

## Single Responsibility Principle (SRP)

A class should have only one reason to change.

```python
# Bad: Multiple responsibilities
class User:
    def save_to_database(self):
        pass
    def send_email(self):
        pass

# Good: Single responsibility
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserRepository:
    def save(self, user):
        pass

class EmailService:
    def send(self, user):
        pass
```

## Open/Closed Principle (OCP)

Classes should be open for extension, closed for modification.

```python
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def process(self, amount):
        pass

class CreditCardProcessor(PaymentProcessor):
    def process(self, amount):
        return f"Processing ${amount} via credit card"

class PayPalProcessor(PaymentProcessor):
    def process(self, amount):
        return f"Processing ${amount} via PayPal"
```

## Liskov Substitution Principle (LSP)

Derived classes must be substitutable for their base classes.

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
    
    def area(self):
        return self.width * self.width
```

## Interface Segregation Principle (ISP)

Clients shouldn't depend on interfaces they don't use.

```python
from abc import ABC, abstractmethod

# Bad: Fat interface
class Worker(ABC):
    @abstractmethod
    def work(self):
        pass
    @abstractmethod
    def eat_lunch(self):
        pass

# Good: Segregated interfaces
class Workable(ABC):
    @abstractmethod
    def work(self):
        pass

class LunchEater(ABC):
    @abstractmethod
    def eat_lunch(self):
        pass

class Human(Workable, LunchEater):
    def work(self):
        return "Working"
    def eat_lunch(self):
        return "Eating lunch"

class Robot(Workable):
    def work(self):
        return "Working"
```

## Dependency Inversion Principle (DIP)

Depend on abstractions, not concretions.

```python
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def save(self, data):
        pass

class PostgresDatabase(Database):
    def save(self, data):
        return f"Saving to PostgreSQL: {data}"

class UserService:
    def __init__(self, database: Database):
        self.database = database
    
    def create_user(self, user_data):
        return self.database.save(user_data)

# Usage
db = PostgresDatabase()
service = UserService(db)
```

## Common Patterns

**Dependency Injection**: Pass dependencies through constructor
**Strategy Pattern**: Implements OCP by allowing algorithm swapping
**Template Method**: Uses LSP for consistent interfaces
**Adapter Pattern**: Helps maintain ISP by adapting interfaces

## Benefits

- **Maintainability**: Easier to modify and extend
- **Testability**: Dependencies can be mocked
- **Flexibility**: Components can be swapped easily
- **Readability**: Clear separation of concerns

## Related Topics

- [[Design Patterns]]
- [[Clean Code]]
- [[Testing]]
- [[Dependency Injection]]