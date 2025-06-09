---
title: "Handling Async Operations in React Testing Library"
tags:
  - react
  - testing
  - javascript
  - async
description: "How to properly test asynchronous operations with React Testing Library"
date: 2025-05-29
---

# Handling Async Operations in React Testing Library

When testing components with asynchronous behavior (like API calls, timeouts, or promises), we need special techniques to wait for those operations to complete.

## Waiting for Loading to Finish

The `waitFor` utility helps us wait for asynchronous operations to complete before making assertions.

### Example: Testing a Feedback Component

Here's how to test a component that submits feedback asynchronously:

```jsx
// Mock the API call with a promise
const mockPostFeedback = () => {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
};

// Component props
const props = {
  title: 'Was this page helpful?',
  location: 'data-catalogue',
  successMessage: 'Thanks for letting us know, your response has been recorded',
  postFeedback: mockPostFeedback
};

// Test case
it('should render a success message when an option is submitted', async () => {
  // Setup the component
  const setUp = () => render(<InlineFeedback {...props} />);
  const { getByRole } = setUp();
  
  // Interact with the component
  fireEvent.click(getByRole('button', { name: 'Yes' }));
  
  // Wait for the async operation and assert the result
  await waitFor(() => {
    expect(
      getByRole('heading', {
        name: 'Thanks for letting us know, your response has been recorded',
        level: 2
      })
    ).toBeInTheDocument();
  });
});
```


