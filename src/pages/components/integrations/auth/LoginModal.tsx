import { createPortal } from "react-dom";
import { SignInForm } from "@pages/components/integrations/auth/SignInForm";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: Props) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">Sign In</h3>
        <SignInForm onSuccess={onClose} />
      </div>
    </div>,
    document.body
  );
} 