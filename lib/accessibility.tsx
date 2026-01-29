/**
 * Accessibility Utilities
 * Helper functions and hooks for improving accessibility
 */

import React, { useEffect, useRef, useState } from 'react';

/**
 * Announce message to screen readers
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive' for urgent announcements
 */
export function announceToScreenReader(
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
) {
    if (typeof window === 'undefined') return;

    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Hook to manage focus trap in modals/dialogs
 * @param isOpen - Whether the modal is open
 * @param containerRef - Ref to the modal container
 */
export function useFocusTrap(
    isOpen: boolean,
    containerRef: React.RefObject<HTMLElement>
) {
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        // Store the currently focused element
        previousFocusRef.current = document.activeElement as HTMLElement;

        // Focus the first focusable element in the container
        const container = containerRef.current;
        if (container) {
            const focusableElements = container.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }

        // Return focus when modal closes
        return () => {
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen, containerRef]);
}

/**
 * Hook to handle keyboard navigation
 * @param handlers - Object mapping keys to handler functions
 */
export function useKeyboardShortcuts(
    handlers: Record<string, (e: KeyboardEvent) => void>,
    enabled = true
) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const modifiers = {
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey,
                meta: e.metaKey,
            };

            // Create a key combination string (e.g., "ctrl+k", "shift+?")
            let combination = '';
            if (modifiers.ctrl) combination += 'ctrl+';
            if (modifiers.alt) combination += 'alt+';
            if (modifiers.shift) combination += 'shift+';
            if (modifiers.meta) combination += 'meta+';
            combination += key;

            // Check if we have a handler for this combination
            if (handlers[combination]) {
                handlers[combination](e);
            } else if (handlers[key]) {
                handlers[key](e);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers, enabled]);
}

/**
 * Generate a unique ID for accessibility attributes
 * @param prefix - Prefix for the ID
 */
let idCounter = 0;
export function useA11yId(prefix = 'a11y'): string {
    const idRef = useRef<string | undefined>(undefined);

    if (!idRef.current) {
        idCounter += 1;
        idRef.current = `${prefix}-${idCounter}`;
    }

    return idRef.current;
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
}

/**
 * Get accessible label for badge count
 * @param count - Number to display
 * @param singular - Singular form (e.g., "item")
 * @param plural - Plural form (e.g., "items")
 */
export function getBadgeLabel(
    count: number,
    singular: string,
    plural?: string
): string {
    const pluralForm = plural || `${singular}s`;
    return `${count} ${count === 1 ? singular : pluralForm}`;
}

/**
 * Visually hidden component for screen reader only content
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
    return <span className="sr-only">{children}</span>;
}

/**
 * Live region component for announcing dynamic content
 */
interface LiveRegionProps {
    message: string;
    priority?: 'polite' | 'assertive';
    clearAfter?: number;
}

export function LiveRegion({
    message,
    priority = 'polite',
    clearAfter = 5000,
}: LiveRegionProps) {
    const [currentMessage, setCurrentMessage] = useState(message);

    useEffect(() => {
        setCurrentMessage(message);

        if (clearAfter > 0) {
            const timer = setTimeout(() => setCurrentMessage(''), clearAfter);
            return () => clearTimeout(timer);
        }
    }, [message, clearAfter]);

    return (
        <div
            role="status"
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
        >
            {currentMessage}
        </div>
    );
}

/**
 * Skip link component for keyboard navigation
 */
export function SkipLink({ href = '#main-content', children = 'Skip to main content' }: { href?: string; children?: React.ReactNode }) {
    return (
        <a
            href={href}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
            {children}
        </a>
    );
}
