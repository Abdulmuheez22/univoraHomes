import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ImagePlus,
  Loader2,
  Pencil,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROPERTY_CATEGORIES } from "../lib/propertyCategories";
import {
  IMAGE_FORMAT_LABEL,
  MAX_PHOTOS,
  isImageFile,
  logRejectedFiles,
  rejectedFilesMessage,
} from "../lib/imageFiles";
import {
  deleteLandlordProperty,
  updateLandlordProperty,
} from "../lib/services/auth.service";

const PROPERTY_TYPES = [
  "Multi-Family",
  "Single-Family",
  "Duplex",
  "Commercial",
];

/* `onDeleted` lets a host view (the dashboard) handle the removal itself
   instead of bouncing the landlord to a separate page. */
export default function LandlordPropertyActions({ property, onDeleted }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [newPhotos, setNewPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [formData, setFormData] = useState(null);
  const photoCount = property.propertyImages?.length || 0;

  const updateMutation = useMutation({
    mutationFn: updateLandlordProperty,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["landlord-properties"] }),
        queryClient.invalidateQueries({ queryKey: ["saved-properties"] }),
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({
          queryKey: ["property", property.propertyId],
        }),
      ]);
      setModal(null);
      setNewPhotos([]);
      setNotice("Your property details have been updated.");
    },
    onError: (error) => {
      setFormError(
        error?.response?.data?.message ||
          "We couldn't save those changes. Please try again.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLandlordProperty,
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["landlord-properties"] }),
        queryClient.invalidateQueries({ queryKey: ["saved-properties"] }),
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({
          queryKey: ["landlord-connection-requests"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["tenant-connection-requests"],
        }),
        queryClient.invalidateQueries({ queryKey: ["landlord-tenants"] }),
      ]);
      if (onDeleted) {
        onDeleted(response);
        return;
      }
      navigate("/dashboard", { state: { propertyNotice: response.message } });
    },
    onError: (error) => {
      setFormError(
        error?.response?.data?.message ||
          "We couldn't delete this property. Please try again.",
      );
    },
  });

  const openEditor = () => {
    setFormData({
      propertyName: property.propertyName || "",
      propertyType: property.propertyType || "",
      propertyCategory: property.propertyCategory || "",
      address: property.propertyAddress || "",
      city: property.city || "",
      state: property.state || "",
      description: property.description || "",
      targetRent: property.targetRent || "",
    });
    setNewPhotos([]);
    setPhotoError("");
    setFormError("");
    setNotice("");
    setModal("edit");
  };

  const closeModal = () => {
    if (updateMutation.isPending || deleteMutation.isPending) return;
    setModal(null);
    setPhotoError("");
    setFormError("");
  };

  /* Images only: anything else is logged to the console and refused with a
     message on the form instead of being silently attached. */
  const handlePhotoSelection = (event) => {
    const selectedPhotos = Array.from(event.target.files || []);
    const imagePhotos = selectedPhotos.filter(isImageFile);
    const rejectedPhotos = selectedPhotos.filter((file) => !isImageFile(file));

    logRejectedFiles(rejectedPhotos, "on the edit-property form");

    const remainingSlots = Math.max(
      0,
      MAX_PHOTOS - photoCount - newPhotos.length,
    );
    setNewPhotos((previous) => [
      ...previous,
      ...imagePhotos.slice(0, remainingSlots),
    ]);
    setPhotoError(
      rejectedPhotos.length ? rejectedFilesMessage(rejectedPhotos) : "",
    );
    setFormError(
      imagePhotos.length > remainingSlots
        ? `You can add ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"} (${MAX_PHOTOS} maximum per property).`
        : "",
    );
    event.target.value = "";
  };

  const requestUpdateConfirmation = (event) => {
    event.preventDefault();
    setFormError("");
    setModal("confirm-edit");
  };

  const confirmUpdate = () => {
    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      body.append(key, value),
    );
    newPhotos.forEach((photo) => body.append("images", photo));
    updateMutation.mutate({
      propertyId: property.propertyId,
      property: body,
    });
  };

  const setField = (name, value) =>
    setFormData((previous) => ({ ...previous, [name]: value }));
  const isPending = updateMutation.isPending || deleteMutation.isPending;

  return (
    <>
      <div className="flex flex-col items-start gap-3 sm:items-end">
        {notice && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800"
          >
            <Check className="h-4 w-4" />
            {notice}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openEditor}
            className="inline-flex items-center gap-2 rounded-xl border border-[#004741]/15 bg-white px-4 py-2.5 text-sm font-bold text-[#004741] shadow-sm transition hover:border-[#004741]/40 hover:bg-emerald-50"
          >
            <Pencil className="h-4 w-4" />
            Edit property
          </button>
          <button
            type="button"
            onClick={() => {
              setFormError("");
              setModal("confirm-delete");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="property-action-title"
              className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/25"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {modal === "edit" ? (
                <>
                  <div className="relative overflow-hidden bg-[#00332F] px-6 py-6 text-white sm:px-8">
                    <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-100">
                          <Pencil className="h-3.5 w-3.5" />
                          LISTING EDITOR
                        </span>
                        <h2
                          id="property-action-title"
                          className="mt-3 text-2xl font-extrabold"
                        >
                          Refine your property
                        </h2>
                        <p className="mt-1 text-sm text-white/70">
                          Keep your listing accurate and inviting.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close editor"
                        className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form
                    onSubmit={requestUpdateConfirmation}
                    className="max-h-[75vh] space-y-5 overflow-y-auto p-6 sm:p-8"
                  >
                    {formError && (
                      <p
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                      >
                        {formError}
                      </p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ["propertyName", "Property name"],
                        ["address", "Street address"],
                        ["city", "City"],
                        ["state", "State"],
                      ].map(([name, label]) => (
                        <label
                          key={name}
                          className={
                            name === "propertyName" || name === "address"
                              ? "sm:col-span-2"
                              : ""
                          }
                        >
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                            {label}
                          </span>
                          <input
                            required
                            name={name}
                            value={formData?.[name] || ""}
                            onChange={(event) =>
                              setField(name, event.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:ring-4 focus:ring-emerald-900/5"
                          />
                        </label>
                      ))}

                      <label>
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                          Property type
                        </span>
                        <select
                          required
                          name="propertyType"
                          value={formData?.propertyType || ""}
                          onChange={(event) =>
                            setField("propertyType", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F766E] focus:bg-white"
                        >
                          {!PROPERTY_TYPES.includes(formData?.propertyType) && (
                            <option value={formData?.propertyType}>
                              {formData?.propertyType || "Select type"}
                            </option>
                          )}
                          {PROPERTY_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                          Category
                        </span>
                        <select
                          required
                          name="propertyCategory"
                          value={formData?.propertyCategory || ""}
                          onChange={(event) =>
                            setField("propertyCategory", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F766E] focus:bg-white"
                        >
                          {!PROPERTY_CATEGORIES.includes(
                            formData?.propertyCategory,
                          ) && (
                            <option value={formData?.propertyCategory}>
                              {formData?.propertyCategory || "Select category"}
                            </option>
                          )}
                          {PROPERTY_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                          Annual target rent (₦)
                        </span>
                        <input
                          required
                          min="1"
                          step="1"
                          type="number"
                          name="targetRent"
                          value={formData?.targetRent || ""}
                          onChange={(event) =>
                            setField("targetRent", event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F766E] focus:bg-white"
                        />
                      </label>
                      <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                          Description
                        </span>
                        <textarea
                          required
                          rows={4}
                          name="description"
                          value={formData?.description || ""}
                          onChange={(event) =>
                            setField("description", event.target.value)
                          }
                          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F766E] focus:bg-white"
                        />
                      </label>
                    </div>

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Add more photos
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {photoCount + newPhotos.length} of {MAX_PHOTOS} photos
                            selected
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            {IMAGE_FORMAT_LABEL} images only
                          </p>
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#004741] shadow-sm ring-1 ring-slate-200 transition hover:bg-emerald-50">
                          <ImagePlus className="h-4 w-4" />
                          Choose photos
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoSelection}
                            disabled={
                              photoCount + newPhotos.length >= MAX_PHOTOS
                            }
                            className="sr-only"
                          />
                        </label>
                      </div>
                      {photoError && (
                        <p
                          role="alert"
                          className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                        >
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {photoError}
                        </p>
                      )}
                      {newPhotos.length > 0 && (
                        <ul className="mt-3 space-y-1 text-xs text-slate-600">
                          {newPhotos.map((photo, index) => (
                            <li
                              key={`${photo.name}-${index}`}
                              className="flex items-center justify-between gap-3"
                            >
                              <span className="truncate">{photo.name}</span>
                              <button
                                type="button"
                                aria-label={`Remove ${photo.name}`}
                                onClick={() =>
                                  setNewPhotos((previous) =>
                                    previous.filter(
                                      (_, itemIndex) => itemIndex !== index,
                                    ),
                                  )
                                }
                                className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-xl px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:bg-[#00332F]"
                      >
                        Review changes
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="p-6 sm:p-8">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      modal === "confirm-delete"
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-[#004741]"
                    }`}
                  >
                    {modal === "confirm-delete" ? (
                      <AlertTriangle className="h-7 w-7" />
                    ) : (
                      <ShieldCheck className="h-7 w-7" />
                    )}
                  </div>
                  <h2
                    id="property-action-title"
                    className="mt-5 text-2xl font-extrabold text-slate-900"
                  >
                    {modal === "confirm-delete"
                      ? "Delete this property?"
                      : "Save these changes?"}
                  </h2>
                  <p className="mt-2 leading-6 text-slate-600">
                    {modal === "confirm-delete"
                      ? `“${property.propertyName}” will be permanently removed, including its photos, saved entries, and connection requests. This can't be undone.`
                      : `You're updating “${property.propertyName}”${
                          newPhotos.length
                            ? ` and adding ${newPhotos.length} ${
                                newPhotos.length === 1 ? "photo" : "photos"
                              }`
                            : ""
                        }. Confirm to publish these changes to your listing.`}
                  </p>

                  {formError && (
                    <p
                      role="alert"
                      className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                    >
                      {formError}
                    </p>
                  )}

                  <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        setFormError("");
                        setModal(modal === "confirm-delete" ? null : "edit");
                      }}
                      className="rounded-xl px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                      {modal === "confirm-delete" ? "Keep property" : "Go back"}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={
                        modal === "confirm-delete"
                          ? () => deleteMutation.mutate(property.propertyId)
                          : confirmUpdate
                      }
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        modal === "confirm-delete"
                          ? "bg-red-600 shadow-red-900/15 hover:bg-red-700"
                          : "bg-[#004741] shadow-emerald-950/15 hover:bg-[#00332F]"
                      }`}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : modal === "confirm-delete" ? (
                        <Trash2 className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {updateMutation.isPending
                        ? "Saving changes..."
                        : deleteMutation.isPending
                          ? "Deleting property..."
                          : modal === "confirm-delete"
                            ? "Yes, delete property"
                            : "Confirm & save"}
                    </button>
                  </div>
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
