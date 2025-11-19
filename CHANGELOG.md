# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-11-19

### Added

- Initial release of `@mxweb/react-hooks`
- `useCombineRefs` hook: Combines multiple React refs into a single memoized callback ref
- `combineRefs` utility: Non-hook version for combining refs
- `useDisclosure` hook: Manages boolean state with control functions (open, close, toggle)
- `useMediaQuery` hook: Tracks media query matches with support for single or multiple named queries
- Full TypeScript support with comprehensive type definitions
- Complete JSDoc documentation for all hooks and utilities

### Notes

This initial release was created to provide quick support for `@mxweb/viewport` package, particularly to address the iOS 26 viewport bug issue. The `useMediaQuery` and `useCombineRefs` hooks are essential utilities for handling viewport-related functionality across different devices and browsers.
