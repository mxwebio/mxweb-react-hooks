import { useMemo } from "react";

/**
 * A callback function type that can be synchronous or asynchronous.
 *
 * @template Args - The tuple type of the callback arguments
 * @template Return - The return type of the callback (defaults to void)
 *
 * @since 0.0.2
 */
export type Callback<Args extends unknown[] = unknown[], Return = void> = (
  ...args: Args
) => Return | Promise<Return>;

/**
 * Combines multiple callback functions into a single callback that executes all of them.
 *
 * All callbacks are executed in parallel (not waiting for async callbacks to complete).
 * This is useful when you need to trigger multiple actions from a single event.
 *
 * @template Args - The tuple type of the callback arguments
 * @param {...Array<Callback<Args> | undefined | null>} callbacks - One or more callbacks to combine
 * @returns {Callback<Args>} A combined callback function that executes all provided callbacks
 *
 * @example
 * ```tsx
 * const onClick1 = () => console.log('Click 1');
 * const onClick2 = () => console.log('Click 2');
 * const combinedClick = combineCallback(onClick1, onClick2);
 *
 * <button onClick={combinedClick}>Click me</button>
 * // Logs: "Click 1" and "Click 2" when clicked
 * ```
 *
 * @since 0.0.2
 */
export function combineCallback<Args extends unknown[] = unknown[]>(
  ...callbacks: Array<Callback<Args> | undefined | null>
): Callback<Args> {
  return function combinedCallback(...args: Args) {
    callbacks.forEach((callback) => callback?.(...args));
  };
}

/**
 * A React hook that combines multiple callback functions into a single memoized callback.
 *
 * This is the memoized version of `combineCallback` that prevents unnecessary re-creation
 * of the combined callback function when the callbacks array doesn't change.
 *
 * All callbacks are executed in parallel (not waiting for async callbacks to complete).
 *
 * @template Args - The tuple type of the callback arguments
 * @param {...Array<Callback<Args> | undefined | null>} callbacks - One or more callbacks to combine
 * @returns {Callback<Args>} A memoized combined callback function
 *
 * @example
 * ```tsx
 * import { useCombineCallback } from '@mxweb/react-hooks';
 *
 * function MyComponent({ onSave, onLog }) {
 *   const handleSave = useCombineCallback(
 *     onSave,
 *     (data) => console.log('Saving:', data),
 *     onLog
 *   );
 *
 *   return <button onClick={() => handleSave({ id: 1 })}>Save</button>;
 * }
 * ```
 *
 * @since 0.0.2
 */
export function useCombineCallback<Args extends unknown[] = unknown[]>(
  ...callbacks: Array<Callback<Args> | undefined | null>
): Callback<Args> {
  return useMemo(() => combineCallback(...callbacks), [callbacks]);
}
