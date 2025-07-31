---
title: "Working with Dates and Times in Python"
description: "Comprehensive guide to date/time manipulation, UTC conversion, and formatting in Python"
tags: [python, datetime, timezone, utc, formatting]
draft: false
date: 2025-07-21
lastmod: 2025-07-21
---

# Working with Dates and Times in Python
In Python, handling dates and times is essential for many applications, from logging events to scheduling tasks. The `datetime` module provides powerful tools for creating, manipulating, and formatting date and time objects. This guide covers the core concepts, common patterns, and best practices for working with dates and times in Python.

## Core Concepts

Python provides several modules for date and time operations:
- **`datetime`**: Primary module for date/time manipulation
- **`time`**: Low-level time functions and Unix timestamps
- **`zoneinfo`**: Modern timezone handling (Python 3.9+)
- **`pytz`**: Third-party timezone library for older Python versions

## Basic Date and Time Operations

### Creating Date and Time Objects

```python
from datetime import datetime, date, time, timedelta
from zoneinfo import ZoneInfo

# Current date and time
now = datetime.now()
today = date.today()

# Specific date and time
specific_date = date(2025, 7, 21)
specific_datetime = datetime(2025, 7, 21, 14, 30, 0)

# With timezone
utc_now = datetime.now(ZoneInfo("UTC"))
local_time = datetime.now(ZoneInfo("America/New_York"))
```

### Date Arithmetic

```python
from datetime import timedelta

# Adding time
tomorrow = date.today() + timedelta(days=1)
next_week = datetime.now() + timedelta(weeks=1)
in_30_minutes = datetime.now() + timedelta(minutes=30)

# Subtracting time
yesterday = date.today() - timedelta(days=1)
last_month = datetime.now() - timedelta(days=30)

# Time difference
diff = datetime(2025, 12, 31) - datetime.now()
print(f"Days until year end: {diff.days}")
```

## Timezone Handling and UTC Conversion

### Modern Timezone Handling (Python 3.9+)

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Create timezone-aware datetime
utc_time = datetime.now(ZoneInfo("UTC"))
ny_time = datetime.now(ZoneInfo("America/New_York"))
london_time = datetime.now(ZoneInfo("Europe/London"))

# Convert between timezones
utc_dt = datetime(2025, 7, 21, 12, 0, 0, tzinfo=ZoneInfo("UTC"))
ny_dt = utc_dt.astimezone(ZoneInfo("America/New_York"))
tokyo_dt = utc_dt.astimezone(ZoneInfo("Asia/Tokyo"))
```

### UTC Conversion Patterns

```python
def to_utc(dt, source_timezone="UTC"):
    """Convert datetime to UTC"""
    if dt.tzinfo is None:
        # Assume source timezone if naive datetime
        dt = dt.replace(tzinfo=ZoneInfo(source_timezone))
    return dt.astimezone(ZoneInfo("UTC"))

def from_utc(utc_dt, target_timezone):
    """Convert UTC datetime to target timezone"""
    return utc_dt.astimezone(ZoneInfo(target_timezone))

# Usage
local_dt = datetime(2025, 7, 21, 14, 30)
utc_dt = to_utc(local_dt, "America/New_York")
london_dt = from_utc(utc_dt, "Europe/London")
```

### Legacy Timezone Handling with pytz

```python
import pytz
from datetime import datetime

# For Python < 3.9 or when pytz is preferred
utc = pytz.UTC
eastern = pytz.timezone('US/Eastern')
london = pytz.timezone('Europe/London')

# Create timezone-aware datetime
utc_time = utc.localize(datetime(2025, 7, 21, 12, 0))
local_time = eastern.localize(datetime(2025, 7, 21, 8, 0))

# Convert timezones
utc_converted = local_time.astimezone(utc)
london_converted = utc_time.astimezone(london)
```

## Date and Time Formatting

### Standard Formatting with strftime

```python
from datetime import datetime

now = datetime.now()

# Common formats
iso_format = now.strftime("%Y-%m-%d %H:%M:%S")          # 2025-07-21 14:30:00
us_format = now.strftime("%m/%d/%Y %I:%M %p")           # 07/21/2025 02:30 PM
european_format = now.strftime("%d/%m/%Y %H:%M")        # 21/07/2025 14:30
file_safe = now.strftime("%Y%m%d_%H%M%S")               # 20250721_143000

# Date only
date_only = now.strftime("%Y-%m-%d")                    # 2025-07-21
month_year = now.strftime("%B %Y")                      # July 2025
weekday = now.strftime("%A, %B %d, %Y")                # Monday, July 21, 2025
```

### ISO Format and RFC Standards

```python
from datetime import datetime
from zoneinfo import ZoneInfo

dt = datetime(2025, 7, 21, 14, 30, 0, tzinfo=ZoneInfo("UTC"))

# ISO 8601 format
iso_string = dt.isoformat()                             # 2025-07-21T14:30:00+00:00
iso_basic = dt.strftime("%Y%m%dT%H%M%SZ")              # 20250721T143000Z

# RFC 2822 format (email headers)
rfc_format = dt.strftime("%a, %d %b %Y %H:%M:%S %z")   # Mon, 21 Jul 2025 14:30:00 +0000
```

### Custom Formatting Functions

```python
def format_datetime_display(dt, timezone_name=None):
    """Format datetime for user-friendly display"""
    if timezone_name and dt.tzinfo:
        dt = dt.astimezone(ZoneInfo(timezone_name))
    
    return {
        "short": dt.strftime("%m/%d/%Y %H:%M"),
        "long": dt.strftime("%A, %B %d, %Y at %I:%M %p"),
        "iso": dt.isoformat(),
        "timestamp": int(dt.timestamp())
    }

def format_relative_time(dt):
    """Format datetime relative to now"""
    now = datetime.now(dt.tzinfo if dt.tzinfo else None)
    diff = now - dt
    
    if diff.days > 0:
        return f"{diff.days} days ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hours ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minutes ago"
    else:
        return "Just now"
```

## Parsing Date Strings

### Basic Parsing with strptime

```python
from datetime import datetime

# Parse common formats
iso_dt = datetime.strptime("2025-07-21 14:30:00", "%Y-%m-%d %H:%M:%S")
us_dt = datetime.strptime("07/21/2025 2:30 PM", "%m/%d/%Y %I:%M %p")
european_dt = datetime.strptime("21/07/2025 14:30", "%d/%m/%Y %H:%M")

# Parse ISO format
iso_string = "2025-07-21T14:30:00Z"
parsed_iso = datetime.fromisoformat(iso_string.replace('Z', '+00:00'))
```

### Robust Date Parsing

```python
from datetime import datetime
from zoneinfo import ZoneInfo

def parse_flexible_date(date_string, default_timezone="UTC"):
    """Parse various date formats with fallback"""
    formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d",
        "%m/%d/%Y %H:%M",
        "%m/%d/%Y",
        "%d/%m/%Y %H:%M",
        "%d/%m/%Y"
    ]
    
    for fmt in formats:
        try:
            dt = datetime.strptime(date_string.replace('T', ' '), fmt)
            # Add timezone if not present
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=ZoneInfo(default_timezone))
            return dt
        except ValueError:
            continue
    
    raise ValueError(f"Unable to parse date: {date_string}")
```

## Working with Unix Timestamps

### Timestamp Conversion

```python
from datetime import datetime
from zoneinfo import ZoneInfo
import time

# Current timestamp
current_timestamp = time.time()
current_dt = datetime.fromtimestamp(current_timestamp)

# Convert datetime to timestamp
dt = datetime(2025, 7, 21, 14, 30, 0)
timestamp = dt.timestamp()

# UTC timestamp conversion
utc_dt = datetime(2025, 7, 21, 14, 30, 0, tzinfo=ZoneInfo("UTC"))
utc_timestamp = utc_dt.timestamp()

# From timestamp with timezone
local_dt = datetime.fromtimestamp(timestamp, ZoneInfo("America/New_York"))
```

### Timestamp Utilities

```python
def timestamp_to_readable(timestamp, timezone_name="UTC"):
    """Convert Unix timestamp to readable format"""
    dt = datetime.fromtimestamp(timestamp, ZoneInfo(timezone_name))
    return dt.strftime("%Y-%m-%d %H:%M:%S %Z")

def days_since_timestamp(timestamp):
    """Calculate days since a Unix timestamp"""
    then = datetime.fromtimestamp(timestamp)
    now = datetime.now()
    return (now - then).days

def next_midnight_timestamp(timezone_name="UTC"):
    """Get timestamp for next midnight in specified timezone"""
    tz = ZoneInfo(timezone_name)
    now = datetime.now(tz)
    next_day = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
    return int(next_day.timestamp())
```

## Common Patterns

### Date Range Operations

```python
def date_range(start_date, end_date, step_days=1):
    """Generate date range between two dates"""
    current = start_date
    while current <= end_date:
        yield current
        current += timedelta(days=step_days)

# Usage
start = date(2025, 7, 1)
end = date(2025, 7, 31)
for day in date_range(start, end):
    print(day.strftime("%Y-%m-%d"))
```

### Business Day Calculations

```python
def add_business_days(start_date, days):
    """Add business days (excluding weekends)"""
    current = start_date
    added_days = 0
    
    while added_days < days:
        current += timedelta(days=1)
        if current.weekday() < 5:  # Monday = 0, Friday = 4
            added_days += 1
    
    return current

def is_business_day(date_obj):
    """Check if date is a business day"""
    return date_obj.weekday() < 5
```

### Caching with Time Expiration

```python
from datetime import datetime, timedelta
from functools import wraps

def cache_with_expiry(expire_minutes=60):
    """Decorator for caching function results with time expiration"""
    def decorator(func):
        cache = {}
        
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(sorted(kwargs.items()))
            now = datetime.now()
            
            if key in cache:
                result, timestamp = cache[key]
                if now - timestamp < timedelta(minutes=expire_minutes):
                    return result
            
            result = func(*args, **kwargs)
            cache[key] = (result, now)
            return result
        
        return wrapper
    return decorator
```

## Performance Considerations

### Efficient Date Operations

```python
# Use date objects for date-only operations
from datetime import date, datetime

# More efficient for date comparisons
today = date.today()
target_date = date(2025, 12, 31)
days_until = (target_date - today).days

# Avoid unnecessary datetime operations
# Less efficient
dt_today = datetime.now().date()
dt_target = datetime(2025, 12, 31).date()
```

### Timezone-Aware vs Naive Datetimes

```python
# Prefer timezone-aware datetimes for consistency
from zoneinfo import ZoneInfo

# Good: timezone-aware
utc_dt = datetime.now(ZoneInfo("UTC"))
local_dt = utc_dt.astimezone(ZoneInfo("America/New_York"))

# Avoid: mixing naive and aware datetimes
naive_dt = datetime.now()  # Can cause comparison errors
# aware_dt = datetime.now(ZoneInfo("UTC"))
# diff = aware_dt - naive_dt  # TypeError
```

## Troubleshooting

### Common Issues

```python
# Issue: Naive datetime arithmetic across DST boundaries
# Solution: Use timezone-aware datetimes
from zoneinfo import ZoneInfo

# Wrong: naive datetime
naive_dt = datetime(2025, 3, 9, 1, 0)  # DST transition day
# next_day = naive_dt + timedelta(days=1)  # May be incorrect

# Correct: timezone-aware
aware_dt = datetime(2025, 3, 9, 1, 0, tzinfo=ZoneInfo("America/New_York"))
next_day = aware_dt + timedelta(days=1)

# Issue: Parsing timezone abbreviations
# Solution: Use full timezone names
# Wrong: "EST", "PST" (ambiguous)
# Correct: "America/New_York", "America/Los_Angeles"
```

### Validation Utilities

```python
def validate_datetime_string(date_string, format_string):
    """Validate if string matches datetime format"""
    try:
        datetime.strptime(date_string, format_string)
        return True
    except ValueError:
        return False

def ensure_timezone_aware(dt, default_timezone="UTC"):
    """Ensure datetime is timezone-aware"""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=ZoneInfo(default_timezone))
    return dt
```

## Related Topics

- [[strings]] - String formatting and manipulation for date strings
- [[data-types]] - Understanding datetime objects as data types
- [[files]] - Reading and writing timestamp data to files
