---
title: "Discriminant Unions"
description: "Type-safe pattern matching with discriminated union types in TypeScript"
tags: [typescript, types, pattern-matching]
draft: false
date: 2026-01-26
lastmod: 2026-01-26
---

## Overview

Discriminant unions (also called tagged unions) use a common literal property to distinguish between union members. TypeScript narrows types automatically based on the discriminant property, enabling exhaustive type checking and safe pattern matching.

## Core Pattern

```typescript
type Success = {
  status: 'success';
  data: User[];
};

type Loading = {
  status: 'loading';
};

type Error = {
  status: 'error';
  message: string;
};

type ApiState = Success | Loading | Error;

function handleState(state: ApiState) {
  switch (state.status) {
    case 'success':
      return state.data; // TypeScript knows state is Success
    case 'loading':
      return null;
    case 'error':
      return state.message; // TypeScript knows state is Error
  }
}
```

The `status` property acts as the discriminant. TypeScript narrows the type automatically in each case block.

## Benefits

**Type Safety**: Prevents accessing properties that don't exist on specific union members.

**Exhaustiveness Checking**: Compiler ensures all cases are handled.

**Refactoring Support**: Adding new union members triggers errors at unhandled switch statements.

## Implementation Patterns

### Event Handling

```typescript
type ButtonClick = { type: 'click'; button: string };
type KeyPress = { type: 'keypress'; key: string };
type MouseMove = { type: 'mousemove'; x: number; y: number };

type Event = ButtonClick | KeyPress | MouseMove;

function handleEvent(event: Event) {
  if (event.type === 'click') {
    console.log(`Clicked: ${event.button}`);
  } else if (event.type === 'keypress') {
    console.log(`Key: ${event.key}`);
  } else {
    console.log(`Mouse at (${event.x}, ${event.y})`);
  }
}
```

### Result Types

```typescript
type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E> = Ok<T> | Err<E>;

function parseJSON(text: string): Result<object, string> {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: 'Invalid JSON' };
  }
}

const result = parseJSON('{"key": "value"}');
if (result.ok) {
  console.log(result.value); // TypeScript knows value exists
} else {
  console.error(result.error); // TypeScript knows error exists
}
```

### State Machines

```typescript
type Idle = { state: 'idle' };
type Fetching = { state: 'fetching'; controller: AbortController };
type Success = { state: 'success'; data: string[] };
type Failed = { state: 'failed'; error: Error; retryCount: number };

type RequestState = Idle | Fetching | Success | Failed;

function transition(current: RequestState, action: string): RequestState {
  switch (current.state) {
    case 'idle':
      return { state: 'fetching', controller: new AbortController() };
    case 'fetching':
      // Access controller property safely
      current.controller.abort();
      return { state: 'idle' };
    default:
      return current;
  }
}
```

## Exhaustiveness Checking

```typescript
type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
  switch (shape.type) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side ** 2;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default:
      // Ensures all cases handled
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}
```

The `never` type assignment fails at compile time if a case is missing.

## Common Pitfalls

**Optional Discriminants**: Discriminant properties must not be optional. Use `status: 'loading'` not `status?: 'loading'`.

**Shared Properties**: Non-discriminant properties with different types can cause issues. Keep discriminant logic clean.

```typescript
// Problematic
type A = { kind: 'a'; value: string };
type B = { kind: 'b'; value: number };
type C = A | B;

// Better
type A = { kind: 'a'; stringValue: string };
type B = { kind: 'b'; numericValue: number };
type C = A | B;
```

**Type Widening**: Ensure discriminant literals aren't widened to strings.

```typescript
// Wrong - status becomes string
const error = { status: 'error', message: 'Failed' };

// Correct - status is literal 'error'
const error: Error = { status: 'error', message: 'Failed' };
// or use 'as const'
const error = { status: 'error' as const, message: 'Failed' };
```

## Related Topics

- [[type-hints]] - Type annotation basics
- [[typing]] - Advanced typing patterns
