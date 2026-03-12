import { useEffect, useRef, useState } from "react";
import { useGoogleLogin, useSetUsername } from "@placewise/shared";

// Minimal type declaration for the Google Identity Services global
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: object) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

interface Props {
  onClose: () => void;
}

type Step = "google" | "username";

export default function AuthDialog({ onClose }: Props) {
  const [step, setStep] = useState<Step>("google");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const googleLogin = useGoogleLogin();
  const setUsernameMutation = useSetUsername();

  // Initialize and render the Google Sign-In button
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) return;

    const initButton = () => {
      if (!window.google || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const result = await googleLogin.mutateAsync(response.credential);
            if (result.is_new_user) {
              // Fetch the auto-generated username to pre-fill the picker
              const { authApi } = await import("@placewise/shared");
              const me = await authApi.me();
              setUsername(me.username);
              setStep("username");
            } else {
              onClose();
            }
          } catch {
            // error handled via googleLogin.isError
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: googleButtonRef.current.offsetWidth || 320,
        text: "signin_with",
      });
    };

    if (window.google) {
      initButton();
    } else {
      // Script is still loading — wait for it
      const script = document.querySelector(
        'script[src*="accounts.google.com/gsi/client"]'
      ) as HTMLScriptElement | null;
      if (script) {
        script.addEventListener("load", initButton, { once: true });
      }
    }
  }, []);

  const handleSetUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError("");
    try {
      await setUsernameMutation.mutateAsync(username);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to set username";
      if (message.includes("already taken")) {
        setUsernameError("That username is already taken.");
      } else if (message.includes("422") || message.includes("pattern")) {
        setUsernameError("Username must be 3–50 lowercase letters, numbers, or underscores.");
      } else {
        setUsernameError(message);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        {step === "google" && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Sign in to Placewise</h2>
            <p className="text-sm text-gray-500 mb-6">
              Share, vote, and comment on places your community loves.
            </p>

            {!GOOGLE_CLIENT_ID && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2 mb-4">
                <strong>VITE_GOOGLE_CLIENT_ID</strong> is not set. Add it to your{" "}
                <code>.env</code> file to enable Google Sign-In.
              </p>
            )}

            {googleLogin.isError && (
              <p className="text-sm text-red-600 mb-3">
                Sign-in failed. Please try again.
              </p>
            )}

            <div ref={googleButtonRef} className="w-full" />

            {googleLogin.isPending && (
              <p className="text-sm text-gray-400 text-center mt-3">Signing in…</p>
            )}
          </>
        )}

        {step === "username" && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Choose a username</h2>
            <p className="text-sm text-gray-500 mb-5">
              This is how others will see you. You can change it later.
            </p>

            <form onSubmit={handleSetUsername} className="space-y-4">
              <div>
                <input
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                    setUsernameError("");
                  }}
                  placeholder="e.g. jane_doe"
                  autoFocus
                  minLength={3}
                  maxLength={50}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Lowercase letters, numbers, and underscores only.
                </p>
                {usernameError && (
                  <p className="text-xs text-red-600 mt-1">{usernameError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={username.length < 3 || setUsernameMutation.isPending}
                className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {setUsernameMutation.isPending ? "Saving…" : "Continue"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
