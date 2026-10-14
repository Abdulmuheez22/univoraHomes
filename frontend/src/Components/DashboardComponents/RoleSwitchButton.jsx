import { useState } from "react";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { switchUserRole } from "../../lib/services/auth.service";

/* Matches the sidebar expand animation so the label only appears once the
   rail has fully opened (prevents the text overflowing mid-animation). */
const SIDEBAR_OPEN_DELAY = 0.35;

export default function RoleSwitchButton({
  currentRole,
  variant = "sidebar",
  expanded = true,
  onSwitch,
}) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const isSwitching = useIsMutating({ mutationKey: ["switch-user-role"] }) > 0;
  const role = String(currentRole || "").toLowerCase();
  const nextRole =
    role === "landlord"
      ? "tenant"
      : role === "tenant"
        ? "landlord"
        : null;
  const targetLabel = nextRole === "tenant" ? "Tenant" : "Landlord";

  const switchMutation = useMutation({
    mutationKey: ["switch-user-role"],
    mutationFn: switchUserRole,
    onMutate: () => {
      setErrorMessage("");
    },
    onSuccess: (response) => {
      const switchedRole = response.role;
      onSwitch?.();
      queryClient.setQueryData(["dashboard", "user"], (previous) =>
        previous ? { ...previous, role: switchedRole } : previous,
      );
      queryClient.setQueryData(["user-profile"], (previous) =>
        previous ? { ...previous, userRole: switchedRole } : previous,
      );
    },
    onError: (error) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "Couldn't switch roles. Please try again.",
      );
    },
  });

  const handleSwitch = () => {
    if (!nextRole || isSwitching) return;
    switchMutation.mutate(nextRole);
  };

  if (!nextRole) return null;

  if (variant === "profile") {
    return (
      <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900">Workspace role</p>
          <p className="mt-1 text-sm text-slate-600">
            You&apos;re using the{" "}
            <span className="font-semibold capitalize">{role}</span> workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSwitch}
          disabled={isSwitching}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#004741] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#00332F] disabled:cursor-wait disabled:opacity-60"
        >
          {isSwitching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowLeftRight className="h-4 w-4" />
          )}
          {isSwitching ? "Switching..." : `Switch to ${targetLabel}`}
        </button>
        {errorMessage && (
          <p role="alert" className="basis-full text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        )}
      </section>
    );
  }

  return (
    <div className="px-3">
      <button
        type="button"
        onClick={handleSwitch}
        disabled={isSwitching}
        title={isSwitching ? "Switching workspace..." : `Switch to ${targetLabel}`}
        aria-label={`Switch to ${targetLabel} workspace`}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-60 ${
          expanded ? "" : "justify-center"
        }`}
      >
        {isSwitching ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
        ) : (
          <ArrowLeftRight className="h-5 w-5 shrink-0" />
        )}
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, delay: SIDEBAR_OPEN_DELAY }}
              className="truncate"
            >
              {isSwitching ? "Switching..." : `Switch to ${targetLabel}`}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      {expanded && errorMessage && (
        <p role="alert" className="px-3 pt-1 text-xs text-red-200">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
