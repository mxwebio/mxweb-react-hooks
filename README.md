# @mxweb/react-hooks

A collection of useful React hooks for building web applications.

> **Note:** This initial release (v0.0.1) was created to provide quick support for `@mxweb/viewport` package, particularly to address the iOS 26 viewport bug issue. The `useMediaQuery` and `useCombineRefs` hooks are essential utilities for handling viewport-related functionality across different devices and browsers.

## Installation

```bash
npm install @mxweb/react-hooks
# or
yarn add @mxweb/react-hooks
# or
pnpm add @mxweb/react-hooks
```

## Hooks

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
