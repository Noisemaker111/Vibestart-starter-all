import { createPortal } from "react-dom";
import { useAuth } from "@client/context/AuthContext";
import { UploadButton } from "@client/utils/uploadthing";
import { supabase } from "@shared/supabase";
import { DEFAULT_AVATAR_URL } from "@shared/constants";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AccountSettingsModal({ open, onClose }: Props) {
  const { session } = useAuth();

  if (!open) return null;

  const user = session?.user;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">Account Settings</h3>

        {/* User details */}
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={user.user_metadata?.avatar_url || DEFAULT_AVATAR_URL}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user.user_metadata?.full_name || user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Upload new avatar */}
            <div className="relative inline-block group">
              <img
                src={user.user_metadata?.avatar_url || DEFAULT_AVATAR_URL}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />

              {/* Invisible upload trigger covers avatar */}
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={async (res) => {
                  const url = res?.[0]?.url;
                  if (!url) return;
                  await supabase.auth.updateUser({
                    data: { avatar_url: url },
                  });

                  // Update avatar URL in all existing ideas
                  await fetch("/api/user/avatar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: user.id, avatar_url: url }),
                  });
                }}
                onUploadError={(err) => alert("Upload error: " + err.message)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {/* Plus icon overlay */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-gray-800 transition-transform group-hover:scale-105 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>

            {/* Placeholder for future settings */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              Additional account settings will appear here.
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No user information available.</p>
        )}
      </div>
    </div>,
    document.body
  );
} 