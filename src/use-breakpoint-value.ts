import { useMediaQuery } from "./use-media-query";

/**
 * Represents a responsive value that can be static or vary by breakpoint.
 *
 * Can be:
 * - A static value (string or number)
 * - An object mapping values to media query conditions
 */
export type BreakpointValue = string | number | Record<string, number | string>;

/**
 * A React hook that returns a responsive value based on the current viewport breakpoint.
 *
 * This hook allows you to define different values for different screen sizes using media queries.
 * It's useful for responsive designs where you need to change values like widths, heights,
 * font sizes, colors, or any other CSS/component properties based on viewport size.
 *
 * @param {BreakpointValue} size - A static value or an object mapping values to media queries
 * @returns {string | number | undefined} The value corresponding to the matched breakpoint, or undefined if no match
 *
 * @example
 * ```tsx
 * import { useBreakpointValue } from '@mxweb/react-hooks';
 *
 * function MyComponent() {
 *   const width = useBreakpointValue({
 *     "100%": "(max-width: 639px)",    // Mobile: full width
 *     "500px": "(min-width: 640px)",   // Desktop: fixed width
 *   });
 *
 *   return <div style={{ width }}>Responsive content</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Use with different value types
 * function ResponsiveGrid() {
 *   const columns = useBreakpointValue({
 *     "1": "(max-width: 639px)",
 *     "2": "(min-width: 640px) and (max-width: 1023px)",
 *     "4": "(min-width: 1024px)",
 *   });
 *
 *   const gap = useBreakpointValue({
 *     "8px": "(max-width: 639px)",
 *     "16px": "(min-width: 640px)",
 *   });
 *
 *   return <div style={{ display: 'grid', gap }}>Grid content</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With static value (no breakpoints)
 * const size = useBreakpointValue("24px"); // Returns "24px"
 * ```
 *
 * @since 0.0.3
 */
export function useBreakpointValue(size: BreakpointValue): string | number | undefined {
  const query = useMediaQuery(size as Record<string, string>);

  if (["string", "number", "undefined"].includes(typeof size) || size === null) {
    return size as string | number | undefined;
  }

  for (const key in query) {
    if (query[key]) {
      return key;
    }
  }

  return undefined;
}
