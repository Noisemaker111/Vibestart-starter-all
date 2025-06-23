import { useEffect, useRef, useState } from "react";
import { supabase } from "@shared/supabase";
import type { User } from "@supabase/supabase-js";
import { AccountSettingsModal } from "@client/components/AccountSettingsModal";
import { DEFAULT_AVATAR_URL } from "@shared/constants";

interface Props {
  user: User;
}

export function AvatarDropdown({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const displayName = (user.user_metadata?.full_name || user.user_metadata?.name || user.email) as string | undefined;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
          {displayName}
        </span>
        <img
          src={avatarUrl || DEFAULT_AVATAR_URL}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-40">
          <button
            onClick={() => {
              setSettingsOpen(true);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
          >
            Account Settings
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Account Settings Modal */}
      <AccountSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
} 