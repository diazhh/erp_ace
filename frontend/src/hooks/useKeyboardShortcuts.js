import { useEffect, useCallback } from 'react';

const useKeyboardShortcuts = (shortcuts, options = {}) => {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;

    for (const shortcut of shortcuts) {
      const {
        key,
        ctrl = false,
        alt = false,
        shift = false,
        meta = false,
        action,
        allowInInput = false,
      } = shortcut;

      // Skip if in input and not allowed
      if (isInput && !allowInInput) continue;

      // Check if all modifiers match
      const modifiersMatch = 
        event.ctrlKey === ctrl &&
        event.altKey === alt &&
        event.shiftKey === shift &&
        event.metaKey === meta;

      // Check if key matches (case-insensitive)
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();

      if (modifiersMatch && keyMatches) {
        if (preventDefault) {
          event.preventDefault();
        }
        action(event);
        break;
      }
    }
  }, [shortcuts, enabled, preventDefault]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

// Common shortcut presets
export const COMMON_SHORTCUTS = {
  SAVE: { key: 's', ctrl: true },
  NEW: { key: 'n', ctrl: true },
  SEARCH: { key: 'k', ctrl: true },
  ESCAPE: { key: 'Escape' },
  ENTER: { key: 'Enter' },
};

export default useKeyboardShortcuts;
