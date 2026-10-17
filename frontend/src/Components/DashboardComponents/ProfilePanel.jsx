import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Trash2,
  CircleUserRound,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  deleteUserAccount,
  updateUserProfile,
} from "../../lib/services/auth.service";
import RoleSwitchButton from "./RoleSwitchButton";

const EASE = [0.22, 1, 0.36, 1];

const PROFILE_FIELDS = [
  { key: "userName", label: "Full name", icon: User, editable: true },
  { key: "userEmail", label: "Email address", icon: Mail, editable: false },
  { key: "userPhone", label: "Phone number", icon: Phone, editable: true },
  { key: "userCity", label: "City", icon: MapPin, editable: true },
  { key: "userState", label: "State", icon: MapPin, editable: true },
];

const FIELD_NAMES = {
  userName: "fullName",
  userPhone: "phoneNumber",
  userCity: "city",
  userState: "state",
};

const toProfileForm = (profile) => ({
  fullName: profile?.userName || "",
  phoneNumber: profile?.userPhone || "",
  city: profile?.userCity || "",
  state: profile?.userState || "",
});

const initialsOf = (name) =>
  (name || "U")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const inputCls =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-800 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15";

/* Rendered inline inside the dashboard so the profile is one single page
   instead of a section that opens a separate overlay. */
export default function ProfilePanel({ profile, isLoading, isError }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [form, setForm] = useState(() => toProfileForm(profile));

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["user-profile"], updatedProfile);
      setIsEditing(false);
    },
  });
  const deleteAccountMutation = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      queryClient.clear();
      navigate("/signin", { replace: true });
    },
  });

  const startEditing = () => {
    setForm(toProfileForm(profile));
    updateProfileMutation.reset();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(toProfileForm(profile));
    updateProfileMutation.reset();
    setIsEditing(false);
  };

  const openDeleteConfirmation = () => {
    deleteAccountMutation.reset();
    setIsDeleteConfirmationOpen(true);
  };

  const handleFormChange = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    updateProfileMutation.mutate(form);
  };

  const updateError =
    updateProfileMutation.error?.response?.data?.message ||
    (updateProfileMutation.isError
      ? "We couldn't save your changes. Please try again."
      : "");
  const deleteError =
    deleteAccountMutation.error?.response?.data?.message ||
    (deleteAccountMutation.isError
      ? "We couldn't delete your account. Please try again."
      : "");

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00332F] via-[#004741] to-[#0F766E] p-5 text-white shadow-lg shadow-[#004741]/15 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#F59E0B]/15 blur-3xl" />
        <div className="relative flex items-center gap-4 sm:gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B] text-xl font-extrabold text-[#00332F] sm:h-20 sm:w-20 sm:text-2xl">
            {profile?.userName ? (
              initialsOf(profile.userName)
            ) : (
              <CircleUserRound className="h-8 w-8" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Account profile
            </p>
            <h2 className="mt-1 truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
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

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] sm:p-7">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-slate-500" role="status">
            Loading your profile...
          </p>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-red-600" role="alert">
            We couldn&apos;t load your profile. Please refresh this page and try
            again.
          </p>
        ) : (
          <form onSubmit={handleSave}>
            <RoleSwitchButton
              currentRole={profile?.userRole}
              variant="profile"
            />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">Account details</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your contact information up to date so tenants and
                  landlords can always reach you.
                </p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#004741] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#00332F]"
                >
                  <Pencil className="h-4 w-4" />
                  Edit profile
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {PROFILE_FIELDS.map(({ key, label, icon: Icon, editable }) => {
                const fieldName = FIELD_NAMES[key];

                return (
                  <label
                    key={key}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:p-6"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <Icon className="h-4 w-4 text-[#0F766E]" />
                      {label}
                    </span>
                    {isEditing && editable ? (
                      <input
                        name={fieldName}
                        value={form[fieldName]}
                        onChange={handleFormChange}
                        required={
                          fieldName === "fullName" ||
                          fieldName === "phoneNumber"
                        }
                        maxLength={
                          fieldName === "fullName"
                            ? 100
                            : fieldName === "phoneNumber"
                              ? 20
                              : 100
                        }
                        minLength={
                          fieldName === "fullName"
                            ? 2
                            : fieldName === "phoneNumber"
                              ? 7
                              : undefined
                        }
                        aria-label={label}
                        className={inputCls}
                      />
                    ) : (
                      <>
                        <span className="mt-2 block break-words text-base font-semibold text-slate-800">
                          {profile?.[key] || "Not provided"}
                        </span>
                        {isEditing && !editable && (
                          <span className="mt-1 block text-xs text-slate-500">
                            Email address can&apos;t be changed here.
                          </span>
                        )}
                      </>
                    )}
                  </label>
                );
              })}
            </div>

            {updateError && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {updateError}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={openDeleteConfirmation}
                disabled={updateProfileMutation.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50 sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>

              {isEditing && (
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={updateProfileMutation.isPending}
                    className="w-full rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#004741] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#00332F] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Pencil className="h-4 w-4" />
                    )}
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save changes"}
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      <AnimatePresence>
        {isDeleteConfirmationOpen && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#002622]/65 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget &&
                !deleteAccountMutation.isPending
              ) {
                setIsDeleteConfirmationOpen(false);
              }
            }}
          >
            <motion.section
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-profile-title"
              aria-describedby="delete-profile-description"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
            >
              <button
                type="button"
                aria-label="Close account deletion confirmation"
                disabled={deleteAccountMutation.isPending}
                onClick={() => setIsDeleteConfirmationOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3
                id="delete-profile-title"
                className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900"
              >
                Delete your account?
              </h3>
              <p
                id="delete-profile-description"
                className="mt-2 text-sm leading-6 text-slate-600"
              >
                This permanently deletes your account and associated property
                listings. This action can&apos;t be undone.
              </p>
              {deleteError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {deleteError}
                </p>
              )}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={deleteAccountMutation.isPending}
                  onClick={() => setIsDeleteConfirmationOpen(false)}
                  className="h-12 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Keep account
                </button>
                <button
                  type="button"
                  disabled={deleteAccountMutation.isPending}
                  onClick={() => deleteAccountMutation.mutate()}
                  className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-70"
                >
                  {deleteAccountMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      Delete account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
