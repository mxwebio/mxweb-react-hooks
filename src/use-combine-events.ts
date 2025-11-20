import { useMemo } from "react";
import { Callback } from "./use-combine-callback";

/**
 * A callback function type for event handlers.
 *
 * This is an alias for the Callback type, used specifically for event handling scenarios.
 *
 * @template Args - The tuple type of the event handler arguments
 *
 * @since 0.0.2
 */
export type EventCallback<Args extends unknown[] = unknown[]> = Callback<Args>;

/**
 * Combines multiple event handler callbacks into a single callback that executes them sequentially.
 *
 * This function is specifically designed for DOM event handlers with the following features:
 * - Executes callbacks sequentially (one after another)
 * - Waits for async callbacks to complete before executing the next one
 * - Stops execution if `event.defaultPrevented` is true
 * - Each callback runs in a separate task using `setTimeout` to prevent blocking
 *
 * @template Args - The tuple type of the event handler arguments (first arg should be an event object)
 * @param {...Array<Callback<Args> | undefined | null>} callbacks - One or more event handlers to combine
 * @returns {Callback<Args>} A combined event handler function
 *
 * @example
 * ```tsx
 * const handleClick1 = (e) => {
 *   console.log('Handler 1');
 *   // e.preventDefault() would stop subsequent handlers
 * };
 *
 * const handleClick2 = async (e) => {
 *   await fetch('/api/log');
 *   console.log('Handler 2');
 * };
 *
 * const combinedHandler = combineEvents(handleClick1, handleClick2);
 * <button onClick={combinedHandler}>Click me</button>
 * ```
 *
 * @since 0.0.2
 */
export function combineEvents<Args extends unknown[] = unknown[]>(
  ...callbacks: Array<Callback<Args> | undefined | null>
): Callback<Args> {
  return function combinedCallback(...args: Args) {
    const uniqueCallbacks = new Set(callbacks);

    function execute() {
      if (!uniqueCallbacks.size) {
        return;
      }

      const callback = uniqueCallbacks.values().next().value;
      uniqueCallbacks.delete(callback);

      if (callback) {
        const event = args[0] as Record<string, unknown>;

        if (
          Object.prototype.hasOwnProperty.call(event, "defaultPrevented") &&
          event.defaultPrevented
        ) {
          return;
        }

        new Promise((resolve, reject) => {
          try {
            resolve(callback(...args));
          } catch (error) {
            reject(error);
          }
        }).then(() => {
          setTimeout(execute, 0);
        });
      } else {
        setTimeout(execute, 0);
      }
    }

    execute();
  };
}

/**
 * A React hook that combines multiple event handler callbacks into a single memoized callback.
 *
 * This is the memoized version of `combineEvents` that prevents unnecessary re-creation
 * of the combined event handler when the callbacks array doesn't change.
 *
 * The combined handler executes callbacks sequentially with these features:
 * - Waits for async callbacks to complete before executing the next one
 * - Stops execution if `event.defaultPrevented` is true
 * - Each callback runs in a separate task to prevent blocking
 *
 * @template Args - The tuple type of the event handler arguments (first arg should be an event object)
 * @param {...Array<Callback<Args> | undefined | null>} callbacks - One or more event handlers to combine
 * @returns {Callback<Args>} A memoized combined event handler function
 *
 * @example
 * ```tsx
 * import { useCombineEvents } from '@mxweb/react-hooks';
 *
 * function MyComponent({ onClick, onAnalytics }) {
 *   const handleClick = useCombineEvents(
 *     onClick,
 *     async (e) => {
 *       await logEvent('button_clicked');
 *     },
 *     onAnalytics
 *   );
 *
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With event.preventDefault() to stop propagation
 * function Form() {
 *   const handleSubmit = useCombineEvents(
 *     (e) => {
 *       if (!isValid) {
 *         e.preventDefault(); // Stops subsequent handlers
 *       }
 *     },
 *     async (e) => {
 *       // This won't run if preventDefault was called
 *       await submitForm(e);
 *     }
 *   );
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 *
 * @since 0.0.2
 */
export function useCombineEvents<Args extends unknown[] = unknown[]>(
  ...callbacks: Array<Callback<Args> | undefined | null>
): Callback<Args> {
  return useMemo(() => combineEvents(...callbacks), [callbacks]);
}
