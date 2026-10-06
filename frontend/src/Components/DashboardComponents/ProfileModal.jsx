import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPin, Phone, ShieldCheck, User, X } from "lucide-react";

const PROFILE_FIELDS = [
  { key: "userEmail", label: "Email address", icon: Mail },
  { key: "userPhone", label: "Phone number", icon: Phone },
  { key: "userCity", label: "City", icon: MapPin },
  { key: "userState", label: "State", icon: MapPin },
];

export default function ProfileModal({
  open,
  onClose,
  profile,
  isLoading,
  isError,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="min-h-dvh w-full overflow-y-auto bg-white"
          >
            <div className="relative min-h-64 overflow-hidden bg-[#00332F] px-6 pb-8 pt-6 sm:px-10 lg:px-16">
              <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-[#F59E0B]/15 blur-3xl" />
              <div className="mx-auto flex w-full max-w-6xl justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close profile"
                  className="relative z-10 rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="relative mx-auto mt-8 flex w-full max-w-6xl items-center gap-5 sm:mt-10">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B] text-2xl font-extrabold text-[#00332F] sm:h-24 sm:w-24">
                  {profile?.userName?.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || (
                    <User className="h-9 w-9" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60 sm:text-sm">
                    Account profile
                  </p>
                  <h2
                    id="profile-modal-title"
                    className="mt-1 truncate text-2xl font-bold text-white sm:text-3xl"
                  >
                    {profile?.userName || "Your profile"}
                  </h2>
                  {profile?.userRole && (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold capitalize text-[#F9D993]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {profile.userRole}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
              {isLoading ? (
                <p className="py-8 text-center text-sm text-slate-500" role="status">
                  Loading your profile...
                </p>
              ) : isError ? (
                <p className="py-8 text-center text-sm text-red-600" role="alert">
                  We couldn't load your profile. Please close this window and try again.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {PROFILE_FIELDS.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:p-6"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <Icon className="h-4 w-4 text-[#0F766E]" />
                        {label}
                      </div>
                      <p className="mt-2 break-words text-base font-semibold text-slate-800">
                        {profile?.[key] || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-[#004741] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#00332F]"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
