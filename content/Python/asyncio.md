---
title: "Asyncio in Python"
description: "Simple guide to asynchronous programming with asyncio"
tags: [python, asyncio, async, await, concurrency]
draft: false
date: 2025-10-08
lastmod: 2025-10-08
---

## Core Concepts

Asyncio lets you run multiple tasks at the same time without blocking. Perfect for web requests, file operations, and database queries that involve waiting.

- **async**: Mark a function as asynchronous
- **await**: Wait for an async operation to complete
- **asyncio.run()**: Start an async program

## Basic Example

```python
import asyncio

async def say_hello():
    print("Hello")
    await asyncio.sleep(1)  # Wait 1 second without blocking
    print("World")

# Run it
asyncio.run(say_hello())
```

## Running Multiple Tasks

```python
async def fetch_data(name):
    print(f"Fetching {name}...")
    await asyncio.sleep(2)  # Simulate slow operation
    return f"Data for {name}"

async def main():
    # Run 3 tasks at the same time (takes 2 seconds total, not 6)
    results = await asyncio.gather(
        fetch_data("user"),
        fetch_data("posts"),
        fetch_data("comments")
    )
    print(results)

asyncio.run(main())
```

## Real Example: Web Requests

```python
import aiohttp
import asyncio

async def get_website(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return response.status

async def check_multiple_sites():
    sites = [
        "https://google.com",
        "https://github.com", 
        "https://stackoverflow.com"
    ]
    
    # Check all sites at once
    statuses = await asyncio.gather(
        *[get_website(site) for site in sites]
    )
    
    for site, status in zip(sites, statuses):
        print(f"{site}: {status}")

asyncio.run(check_multiple_sites())
```

## Error Handling

```python
async def might_fail():
    await asyncio.sleep(1)
    raise ValueError("Oops!")

async def safe_call():
    try:
        result = await might_fail()
        return result
    except ValueError:
        return "Failed, but handled"

# Handle errors in multiple tasks
async def main():
    tasks = [
        asyncio.create_task(safe_call()),
        asyncio.create_task(fetch_data("test"))
    ]
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    print(results)

asyncio.run(main())
```

## Common Patterns

### With Timeout

```python
async def slow_task():
    await asyncio.sleep(5)
    return "Done"

async def main():
    try:
        result = await asyncio.wait_for(slow_task(), timeout=3)
        print(result)
    except asyncio.TimeoutError:
        print("Too slow!")

asyncio.run(main())
```

### Background Task

```python
async def background_worker():
    while True:
        print("Working in background...")
        await asyncio.sleep(2)

async def main():
    # Start background task
    task = asyncio.create_task(background_worker())
    
    # Do main work
    await asyncio.sleep(6)
    
    # Stop background task
    task.cancel()

asyncio.run(main())
```

## When NOT to Use Async

```python
# Don't use for CPU-heavy work
async def bad_example():
    total = sum(range(1000000))  # CPU work - no benefit from async
    return total

# Don't mix blocking operations
async def also_bad():
    time.sleep(1)  # This blocks everything!
    return "Done"

# Use for I/O operations
async def good_example():
    await asyncio.sleep(1)  # Non-blocking wait
    return "Done"
```

## Quick Tips

- Use `async def` to create async functions
- Use `await` to call other async functions
- Use `asyncio.gather()` to run multiple tasks together
- Use `asyncio.run()` to start your async program
- Never use `time.sleep()` in async functions - use `asyncio.sleep()`

## Related Topics

- [[concurrency]] - Threading and multiprocessing
- [[web-apis]] - Building async web applications
