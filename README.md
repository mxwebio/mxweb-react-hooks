# @mxweb/react-hooks

A collection of useful React hooks for building web applications.

> **Note:** This initial release (v0.0.1, v0.0.2, v0.0.3) was created to provide quick support for `@mxweb/viewport` package, particularly to address the iOS 26 viewport bug issue. The `useMediaQuery` and `useCombineRefs` hooks are essential utilities for handling viewport-related functionality across different devices and browsers.

## Installation

```bash
npm install @mxweb/react-hooks
# or
yarn add @mxweb/react-hooks
# or
pnpm add @mxweb/react-hooks
```

## Hooks

### `useBreakpointValue`

Returns a responsive value based on the current viewport breakpoint. Perfect for defining different values for different screen sizes.

```tsx
import { useBreakpointValue } from '@mxweb/react-hooks';

function MyComponent() {
  const width = useBreakpointValue({
    "100%": "(max-width: 639px)",    // Mobile: full width
    "500px": "(min-width: 640px)",   // Desktop: fixed width
  });

  return <div style={{ width }}>Responsive content</div>;
}
```

**Advanced usage:**

```tsx
function ResponsiveGrid() {
  const columns = useBreakpointValue({
    "1": "(max-width: 639px)",
    "2": "(min-width: 640px) and (max-width: 1023px)",
    "4": "(min-width: 1024px)",
  });

  const gap = useBreakpointValue({
    "8px": "(max-width: 639px)",
    "16px": "(min-width: 640px)",
  });

  return <div style={{ display: 'grid', gap }}>Grid content</div>;
}
```

### `useCombineCallback`

Combines multiple callback functions into a single memoized callback that executes all of them in parallel. Useful for triggering multiple actions from a single event.

```tsx
import { useCombineCallback } from '@mxweb/react-hooks';

function MyComponent({ onSave, onLog }) {
  const handleSave = useCombineCallback(
    onSave,
    (data) => console.log('Saving:', data),
    onLog
  );

  return <button onClick={() => handleSave({ id: 1 })}>Save</button>;
}
```

### `combineCallback`

A non-hook utility function that combines multiple callbacks into a single callback function.

```tsx
import { combineCallback } from '@mxweb/react-hooks';

const onClick1 = () => console.log('Click 1');
const onClick2 = () => console.log('Click 2');
const combinedClick = combineCallback(onClick1, onClick2);

<button onClick={combinedClick}>Click me</button>
```

### `useCombineEvents`

Combines multiple event handler callbacks into a single memoized callback that executes them sequentially. Designed for DOM event handlers with async support and event propagation control.

```tsx
import { useCombineEvents } from '@mxweb/react-hooks';

function MyComponent({ onClick, onAnalytics }) {
  const handleClick = useCombineEvents(
    onClick,
    async (e) => {
      await logEvent('button_clicked');
    },
    onAnalytics
  );

  return <button onClick={handleClick}>Click me</button>;
}
```

**With event.preventDefault():**

```tsx
function Form() {
  const handleSubmit = useCombineEvents(
    (e) => {
      if (!isValid) {
        e.preventDefault(); // Stops subsequent handlers
      }
    },
    async (e) => {
      // This won't run if preventDefault was called
      await submitForm(e);
    }
  );

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### `combineEvents`

A non-hook utility function that combines multiple event handlers with sequential execution.

```tsx
import { combineEvents } from '@mxweb/react-hooks';

const handleClick1 = (e) => console.log('Handler 1');
const handleClick2 = async (e) => {
  await fetch('/api/log');
  console.log('Handler 2');
};

const combinedHandler = combineEvents(handleClick1, handleClick2);
<button onClick={combinedHandler}>Click me</button>
```

### `useCombineRefs`

Combines multiple React refs into a single memoized callback ref. Useful when you need to use both a forwarded ref and a local ref, or when working with multiple ref-based libraries.

```tsx
import { useRef, forwardRef } from 'react';
import { useCombineRefs } from '@mxweb/react-hooks';

const MyComponent = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
  const localRef = useRef<HTMLDivElement>(null);
  const combinedRef = useCombineRefs(localRef, forwardedRef);

  return <div ref={combinedRef}>Content</div>;
});
```

### `combineRefs`

A non-hook utility function that combines multiple refs into a single callback ref function.

```tsx
import { useRef } from 'react';
import { combineRefs } from '@mxweb/react-hooks';

function MyComponent() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const combinedRef = combineRefs(ref1, ref2);

  return <div ref={combinedRef}>Content</div>;
}
```

### `useDisclosure`

Manages boolean state with convenient control functions. Perfect for modals, dropdowns, tooltips, or any component that can be opened/closed.

```tsx
import { useDisclosure } from '@mxweb/react-hooks';

function MyComponent() {
  const [isOpen, { open, close, toggle }] = useDisclosure();

  return (
    <>
      <button onClick={open}>Open Modal</button>
      <button onClick={toggle}>Toggle Modal</button>

      {isOpen && (
        <Modal onClose={close}>
          <p>Modal content</p>
        </Modal>
      )}
    </>
  );
}
```

### `useMediaQuery`

Tracks whether media query(ies) match the current viewport. Supports both single media queries and multiple named queries.

**Single query:**

```tsx
import { useMediaQuery } from '@mxweb/react-hooks';

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

**Multiple named queries:**

```tsx
import { useMediaQuery } from '@mxweb/react-hooks';

function ResponsiveComponent() {
  const { mobile, tablet, desktop } = useMediaQuery({
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
  });

  if (mobile) return <MobileView />;
  if (tablet) return <TabletView />;
  if (desktop) return <DesktopView />;
}
```

## TypeScript Support

This package is written in TypeScript and includes full type definitions. All hooks are fully typed and provide excellent IntelliSense support.

## Requirements

- React >= 16.8.0 (hooks support)
- TypeScript >= 4.0.0 (if using TypeScript)

## License

MIT © MXWeb Team

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[https://github.com/mxwebio/mxweb-react-hooks](https://github.com/mxwebio/mxweb-react-hooks)
