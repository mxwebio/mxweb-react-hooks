import { useState } from "react";

/**
 * Return type for the useDisclosure hook.
 *
 * A tuple containing:
 * - The current state (boolean)
 * - An object with control functions (open, close, toggle)
 *
 * @since 0.0.1
 */
export type UseDisclosureReturn = [
  boolean,
  { open: () => void; close: () => void; toggle: () => void },
];

/**
 * A React hook for managing boolean state with convenient control functions.
 *
 * This hook is particularly useful for managing UI states such as modals, dropdowns,
 * tooltips, or any component that can be opened/closed or shown/hidden.
 *
 * @param {boolean} [initialState=false] - The initial state value (defaults to false)
 * @returns {UseDisclosureReturn} A tuple containing:
 *   - [0]: The current boolean state
 *   - [1]: An object with control functions:
 *     - `open()`: Sets the state to true
 *     - `close()`: Sets the state to false
 *     - `toggle()`: Toggles the state between true and false
 *
 * @example
 * ```tsx
 * import { useDisclosure } from '@mxweb/react-hooks';
 *
 * function MyComponent() {
 *   const [isOpen, { open, close, toggle }] = useDisclosure();
 *
 *   return (
 *     <>
 *       <button onClick={open}>Open Modal</button>
 *       <button onClick={toggle}>Toggle Modal</button>
 *
 *       {isOpen && (
 *         <Modal onClose={close}>
 *           <p>Modal content</p>
 *         </Modal>
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With initial state
 * const [isVisible, { toggle }] = useDisclosure(true);
 * ```
 *
 * @since 0.0.1
 */
export function useDisclosure(initialState: boolean = false): UseDisclosureReturn {
  const [state, setState] = useState(initialState);

  const open = () => setState(true);
  const close = () => setState(false);
  const toggle = () => setState((s) => !s);

  return [state, { open, close, toggle }];
}
