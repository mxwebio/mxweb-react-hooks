import { Ref, useMemo } from "react";

/**
 * Combines multiple React refs into a single callback ref function.
 *
 * This utility function allows you to pass multiple refs to a single element,
 * which is useful when you need to use both a forwarded ref and a local ref,
 * or when working with multiple ref-based libraries.
 *
 * @template T - The type of the element being referenced
 * @param {...Ref<T>[]} refs - One or more refs to be combined (can be callback refs or ref objects)
 * @returns {(instance: T | null) => void} A callback ref function that updates all provided refs
 *
 * @example
 * ```tsx
 * const ref1 = useRef<HTMLDivElement>(null);
 * const ref2 = useRef<HTMLDivElement>(null);
 * const combinedRef = combineRefs(ref1, ref2);
 *
 * <div ref={combinedRef}>Content</div>
 * ```
 */
export function combineRefs<T>(...refs: Ref<T>[]) {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref != null && Object.prototype.hasOwnProperty.call(ref, "current")) {
        ref.current = instance;
      }
    });
  };
}

/**
 * A React hook that combines multiple refs into a single memoized callback ref.
 *
 * This hook is a memoized version of `combineRefs` that prevents unnecessary re-renders
 * by only recreating the combined ref function when the refs array changes.
 *
 * @template T - The type of the element being referenced
 * @param {...Ref<T>[]} refs - One or more refs to be combined (can be callback refs or ref objects)
 * @returns {(instance: T | null) => void} A memoized callback ref function that updates all provided refs
 *
 * @example
 * ```tsx
 * import { useRef, forwardRef } from 'react';
 * import { useCombineRefs } from '@mxweb/react-hooks';
 *
 * const MyComponent = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
 *   const localRef = useRef<HTMLDivElement>(null);
 *   const combinedRef = useCombineRefs(localRef, forwardedRef);
 *
 *   return <div ref={combinedRef}>Content</div>;
 * });
 * ```
 *
 * @since 0.0.1
 */
export function useCombineRefs<T>(...refs: Ref<T>[]) {
  return useMemo(() => combineRefs(...refs), [refs]);
}
