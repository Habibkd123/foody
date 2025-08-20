
// useClickOutside.ts - TypeScript Click Outside Hook

import { useEffect, useRef } from 'react';

/**
 * Custom hook for detecting clicks outside a referenced element
 * @param callback - Function to call when click outside is detected
 * @param enabled - Whether the hook is enabled (default: true)
 * @returns React ref to attach to the target element
 */
export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  enabled: boolean = true
): React.RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: Event): void => {
      const target = event.target as Node;

      // Check if the clicked element is outside the referenced element
      if (ref.current && target && !ref.current.contains(target)) {
        callback();
      }
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup function to remove event listeners
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback, enabled]);

  return ref;
};

// /**
//  * Alternative hook with more options and better TypeScript support
//  */
// export interface UseClickOutsideOptions {
//   /** Function to call when click outside is detected */
//   onClickOutside: () => void;
//   /** Whether the hook is enabled */
//   enabled?: boolean;
//   /** Events to listen for (default: ['mousedown', 'touchstart']) */
//   events?: string[];
//   /** Whether to prevent the default behavior */
//   preventDefault?: boolean;
//   /** Whether to stop event propagation */
//   stopPropagation?: boolean;
// }

// export const useClickOutsideAdvanced = <T extends HTMLElement = HTMLDivElement>(
//   options: UseClickOutsideOptions
// ): React.RefObject<T> => {
//   const {
//     onClickOutside,
//     enabled = true,
//     events = ['mousedown', 'touchstart'],
//     preventDefault = false,
//     stopPropagation = false,
//   } = options;

//   const ref = useRef<T>(null);

//   useEffect(() => {
//     if (!enabled) return;

//     const handleEvent = (event: Event): void => {
//       const target = event.target as Node;

//       if (ref.current && target && !ref.current.contains(target)) {
//         if (preventDefault) {
//           event.preventDefault();
//         }

//         if (stopPropagation) {
//           event.stopPropagation();
//         }

//         onClickOutside();
//       }
//     };

//     // Add event listeners for specified events
//     events.forEach(eventName => {
//       document.addEventListener(eventName, handleEvent);
//     });

//     // Cleanup function
//     return (): void => {
//       events.forEach(eventName => {
//         document.removeEventListener(eventName, handleEvent);
//       });
//     };
//   }, [onClickOutside, enabled, events, preventDefault, stopPropagation]);

//   return ref;
// };

// /**
//  * Hook for detecting clicks outside multiple elements
//  */
// export const useClickOutsideMultiple = (
//   callback: () => void,
//   enabled: boolean = true
// ): ((element: HTMLElement | null) => void) => {
//   const refs = useRef<Set<HTMLElement>>(new Set());

//   const addRef = (element: HTMLElement | null): void => {
//     if (element) {
//       refs.current.add(element);
//     }
//   };

//   const removeRef = (element: HTMLElement | null): void => {
//     if (element) {
//       refs.current.delete(element);
//     }
//   };

//   useEffect(() => {
//     if (!enabled) return;

//     const handleClickOutside = (event: Event): void => {
//       const target = event.target as Node;
//       let isOutside = true;

//       // Check if click is outside all referenced elements
//       refs.current.forEach(element => {
//         if (element && element.contains(target)) {
//           isOutside = false;
//         }
//       });

//       if (isOutside) {
//         callback();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('touchstart', handleClickOutside);

//     return (): void => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('touchstart', handleClickOutside);
//     };
//   }, [callback, enabled]);

//   // Return function to add refs (for multiple elements)
//   return addRef;
// };

// /**
//  * Hook with escape key support
//  */
// export interface UseClickOutsideWithEscapeOptions extends UseClickOutsideOptions {
//   /** Whether to also close on Escape key press */
//   enableEscapeKey?: boolean;
//   /** Custom key to listen for (default: 'Escape') */
//   escapeKey?: string;
// }

// export const useClickOutsideWithEscape = <T extends HTMLElement = HTMLDivElement>(
//   options: UseClickOutsideWithEscapeOptions
// ): React.RefObject<T> => {
//   const {
//     onClickOutside,
//     enabled = true,
//     enableEscapeKey = true,
//     escapeKey = 'Escape',
//     events = ['mousedown', 'touchstart'],
//     preventDefault = false,
//     stopPropagation = false,
//   } = options;

//   const ref = useRef<T>(null);

//   useEffect(() => {
//     if (!enabled) return;

//     const handleClickOutside = (event: Event): void => {
//       const target = event.target as Node;

//       if (ref.current && target && !ref.current.contains(target)) {
//         if (preventDefault) {
//           event.preventDefault();
//         }

//         if (stopPropagation) {
//           event.stopPropagation();
//         }

//         onClickOutside();
//       }
//     };

//     const handleKeyPress = (event: KeyboardEvent): void => {
//       if (event.key === escapeKey) {
//         if (preventDefault) {
//           event.preventDefault();
//         }

//         if (stopPropagation) {
//           event.stopPropagation();
//         }

//         onClickOutside();
//       }
//     };

//     // Add event listeners
//     events.forEach(eventName => {
//       document.addEventListener(eventName, handleClickOutside);
//     });

//     if (enableEscapeKey) {
//       document.addEventListener('keydown', handleKeyPress);
//     }

//     // Cleanup function
//     return (): void => {
//       events.forEach(eventName => {
//         document.removeEventListener(eventName, handleClickOutside);
//       });

//       if (enableEscapeKey) {
//         document.removeEventListener('keydown', handleKeyPress);
//       }
//     };
//   }, [
//     onClickOutside,
//     enabled,
//     enableEscapeKey,
//     escapeKey,
//     events,
//     preventDefault,
//     stopPropagation,
//   ]);

//   return ref;
// };

// // Export default hook
// export default useClickOutside;

// // Type exports for convenience
// export type ClickOutsideRef<T extends HTMLElement = HTMLDivElement> = React.RefObject<T>;
// export type ClickOutsideCallback = () => void;
