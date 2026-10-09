import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LogOut, ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "../../lib/services/auth.service";

export default function SignOutConfirmation({ open, onClose }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  const confirmSignOut = async () => {
    setIsSigningOut(true);
    setError("");
    try {
      await signOut();
      queryClient.clear();
      navigate("/signin", { replace: true });
    } catch {
      setError("We couldn't sign you out. Please try again.");
      setIsSigningOut(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#002622]/65 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSigningOut) onClose();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
          >
            <button
              type="button"
              aria-label="Close sign out confirmation"
              disabled={isSigningOut}
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <LogOut className="h-6 w-6" />
            </div>
            <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your account stays protected
            </div>
            <h2
              id="signout-title"
              className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900"
            >
              Ready to sign out?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              You’ll be securely signed out of Univora Homes and taken to the
              sign-in page. You can pick up right where you left off next time.
            </p>
            {error && (
              <p role="alert" className="mt-4 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isSigningOut}
                onClick={onClose}
                className="h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Stay signed in
              </button>
              <button
                type="button"
                disabled={isSigningOut}
                onClick={confirmSignOut}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#004741] px-4 text-sm font-bold text-white transition hover:bg-[#00332F] disabled:cursor-wait disabled:opacity-70"
              >
                {isSigningOut ? "Signing out..." : "Yes, sign out"}
                {!isSigningOut && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
