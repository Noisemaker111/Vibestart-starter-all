import React, { useEffect, useRef, useLayoutEffect } from "react";

export interface OptionMenuItem {
  key: string;
  label: string;
  /** Optional icon component shown at 16px */
  Icon?: React.ComponentType<{ className?: string }>;
  /** Whether the item is currently selected */
  selected?: boolean;
  /** When true, item is disabled and cannot be interacted with */
  disabled?: boolean;
}

interface OptionDropdownMenuProps {
  /** Screen-space left/top coordinates used to position the menu */
  anchor: { x: number; y: number };
  /** Items to render. Order is preserved. */
  items: OptionMenuItem[];
  /** Invoked when the user selects or deselects an item. The second boolean
   *  indicates the previous selected state (true = was selected → remove, false = was not selected → add).
   */
  onToggle: (key: string, wasSelected: boolean) => void;
  /** Called when the menu should close (click outside or item click when singleSelect). */
  onClose: () => void;
  /** When true, the menu closes automatically after a single selection. */
  singleSelect?: boolean;
  /** Additional Tailwind classes */
  className?: string;
}

/**
 * Generic dropdown menu for selecting (or toggling) option items.
 *
 * – Handles outside-click detection.
 * – Supports optional single-select behaviour.
 */
const OptionDropdownMenu: React.FC<OptionDropdownMenuProps> = ({
  anchor,
  items,
  onToggle,
  onClose,
  singleSelect = false,
  className,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pendingFocusKey = useRef<string | null>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Shift focus after items array updates
  useLayoutEffect(() => {
    if (!pendingFocusKey.current) return;
    const key = pendingFocusKey.current;
    pendingFocusKey.current = null;
    const btn = menuRef.current?.querySelector(`button[data-key="${key}"]`) as HTMLButtonElement | null;
    btn?.focus();
  }, [items]);

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 max-h-64 overflow-y-auto ${className ?? ""}`.trim()}
      style={{ left: anchor.x, top: anchor.y + 8 }}
    >
      {items.map((item) => {
        const { key, label, Icon, selected, disabled } = item;
        return (
          <button
            key={key}
            data-key={key}
            type="button"
            disabled={disabled}
            onClick={(e) => {
              if (disabled) return;

              const btn = e.currentTarget;
              // Determine key of next focus target BEFORE state mutation
              const findNextKey = () => {
                const next = btn.nextElementSibling as HTMLButtonElement | null;
                if (next && !next.disabled) return next.getAttribute("data-key");
                const prev = btn.previousElementSibling as HTMLButtonElement | null;
                if (prev && !prev.disabled) return prev.getAttribute("data-key");
                return null;
              };

              pendingFocusKey.current = findNextKey();
              onToggle(key, !!selected);

              if (singleSelect) {
                onClose();
                return;
              }
            }}
            className={`group w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-left transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
              selected
                ? "text-purple-600 dark:text-purple-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 ${selected ? "text-purple-600 dark:text-purple-400" : ""}`}
              />
            )}
            <span className="flex-1 truncate">{label}</span>
            {selected ? (
              // X button shown on hover (multi-select mode)
              !singleSelect && (
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-base">✕</span>
              )
            ) : (
              // + indicator on hover when not selected
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-base font-bold">+</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default OptionDropdownMenu; 