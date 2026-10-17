import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addProperty } from "../../../lib/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  ArrowLeft,
  Building2,
  Upload,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { PROPERTY_CATEGORIES } from "../../../lib/propertyCategories";
import { NIGERIAN_STATES } from "../../../lib/nigerianStates";
import { amountToDigits, formatAmountInput, numberToWords } from "../../../lib/numberToWords";
import {
  IMAGE_FORMAT_LABEL,
  MAX_PHOTOS,
  isImageFile,
  logRejectedFiles,
  rejectedFilesMessage,
} from "../../../lib/imageFiles";

const PROPERTY_TYPES = [
  "Multi-Family",
  "Single-Family",
  "Commercial",
  "Duplex",
];

const NAME_MIN = 10;
const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 1000;
const MAX_RENT = 1_000_000_000;
const MIN_RENT = 1_000;

const inputCls =
  "w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10";

const errorInputCls =
  "border-red-400 focus:border-red-400 focus:ring-red-100";

/* `onCreated` lets the dashboard keep the landlord in their workspace: instead
   of navigating to a standalone page, the new property is opened inside the
   dashboard's own property detail view. */
export default function AddPropertyPage({ onBack, onCreated }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [photoMessage, setPhotoMessage] = useState("");
  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "Multi-Family",
    propertyCategory: PROPERTY_CATEGORIES[0],
    address: "",
    city: "",
    state: "",
    description: "",
    targetRent: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addProperty,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      // Straight to the property itself, where it can be edited or deleted.
      if (onCreated) {
        onCreated(data?.propertyId);
        return;
      }
      navigate(
        data?.propertyId
          ? `/landlord/properties/${data.propertyId}`
          : "/dashboard",
      );
    },
    onError: (error) => {
      // The API answers with one message per field; show them all.
      const serverFieldErrors = error.response?.data?.errors;
      if (serverFieldErrors && typeof serverFieldErrors === "object") {
        setFieldErrors(serverFieldErrors);
      }
      setFormError(
        error.response?.data?.message ||
          "We couldn't save your property. Please try again.",
      );
    },
  });

  const update = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    update(name, name === "targetRent" ? formatAmountInput(value) : value);
  };

  /* Only real image files make it into the list. Anything else is logged to
     the console (so a bad upload is easy to trace) and reported on the form. */
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(isImageFile);
    const rejectedFiles = files.filter((file) => !isImageFile(file));

    logRejectedFiles(rejectedFiles, "on the add-property form");

    const remainingSlots = Math.max(0, MAX_PHOTOS - photos.length);
    const acceptedFiles = imageFiles.slice(0, remainingSlots);
    setPhotos((prev) => [...prev, ...acceptedFiles]);

    setPhotoMessage(
      imageFiles.length > remainingSlots
        ? `You can upload up to ${MAX_PHOTOS} photos. Extra files were not added.`
        : "",
    );
    setFieldErrors((prev) => ({
      ...prev,
      photos: rejectedFiles.length ? rejectedFilesMessage(rejectedFiles) : "",
    }));
    setFormError("");
    e.target.value = "";
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPhotoMessage("");
  };

  /* The whole step is checked in one pass so every problem is listed at once. */
  const validateStep1 = () => {
    const errors = {};
    const propertyName = formData.propertyName.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();

    if (!propertyName) errors.propertyName = "Property name is required.";
    else if (propertyName.length < NAME_MIN)
      errors.propertyName = `Property name must be at least ${NAME_MIN} characters.`;
    else if (propertyName.length > 120)
      errors.propertyName = "Property name must be at most 120 characters.";

    if (!PROPERTY_TYPES.includes(formData.propertyType))
      errors.propertyType = "Choose a property type.";

    if (!address) errors.address = "Street address is required.";
    else if (address.length < 5)
      errors.address = "Street address must be at least 5 characters.";
    else if (address.length > 200)
      errors.address = "Street address must be at most 200 characters.";

    if (!city) errors.city = "City is required.";
    else if (city.length < 2) errors.city = "City must be at least 2 characters.";
    else if (city.length > 100) errors.city = "City must be at most 100 characters.";

    if (!formData.state) errors.state = "Select a state.";
    else if (!NIGERIAN_STATES.includes(formData.state))
      errors.state = "Select a state from the list.";

    if (!PROPERTY_CATEGORIES.includes(formData.propertyCategory))
      errors.propertyCategory = "Choose a property category.";

    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    const description = formData.description.trim();
    const rent = Number(amountToDigits(formData.targetRent));

    if (photos.length === 0)
      errors.photos = "Add at least one property photo before publishing.";

    if (!amountToDigits(formData.targetRent))
      errors.targetRent = "Target rent is required.";
    else if (!Number.isFinite(rent) || rent <= 0)
      errors.targetRent = "Enter the target rent as a number.";
    else if (rent < MIN_RENT)
      errors.targetRent = "Target rent looks too low — check the amount.";
    else if (rent > MAX_RENT)
      errors.targetRent = "Target rent is higher than this platform allows.";

    if (!description) errors.description = "A description is required.";
    else if (description.length < DESCRIPTION_MIN)
      errors.description = `Description must be at least ${DESCRIPTION_MIN} characters.`;
    else if (description.length > DESCRIPTION_MAX)
      errors.description = `Description must be at most ${DESCRIPTION_MAX} characters.`;

    return errors;
  };

  const applyErrors = (errors) => {
    setFieldErrors(errors);
    const messages = Object.values(errors);
    if (messages.length === 0) {
      setFormError("");
      return true;
    }
    setFormError(
      messages.length === 1
        ? messages[0]
        : `Please fix ${messages.length} problems: ${messages.join(" ")}`,
    );
    return false;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (applyErrors(validateStep1())) setStep(2);
  };

  const handleBackStep = () => {
    setFormError("");
    setFieldErrors({});
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!applyErrors(validateStep2())) return;

    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      body.append(
        key,
        // Rent goes to the API as digits only so it stays filterable.
        key === "targetRent" ? amountToDigits(value) : value,
      );
    });
    photos.forEach((photo) => body.append("images", photo));

    setFormError("");
    mutate(body);
  };

  const rentWords = numberToWords(formData.targetRent);

  const fieldError = (name) =>
    fieldErrors[name] ? (
      <p className="mt-1.5 text-xs font-medium text-red-600">
        {fieldErrors[name]}
      </p>
    ) : null;

  const withError = (name) => (fieldErrors[name] ? errorInputCls : "");

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-6 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header & Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex cursor-pointer items-center text-xs font-semibold text-slate-500 hover:text-[#00332F] mb-2 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
                Back to Dashboard
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#00332F] mb-2 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
                Back to Dashboard
              </Link>
            )}
            <h1 className="text-2xl font-extrabold tracking-tight text-[#00332F]">
              Add New Property
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Expand your real estate portfolio on Univora Homes
            </p>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-[#FEFDFC] rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,51,47,0.06)] border border-slate-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#00332F] px-8 py-7 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-[#0F766E]/20 pointer-events-none blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F59E0B]/20 text-[#F59E0B]">
                  <Building2 className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-bold tracking-tight">
                  Property Registration
                </h2>
              </div>
              <p className="text-xs text-white/70">
                Step {step} of 2 —{" "}
                <span className="text-[#F59E0B] font-medium">
                  {step === 1 ? "Basic Information" : "Property Media"}
                </span>
              </p>
            </div>

            {/* Step Indicators */}
            <div className="relative z-10 flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= 1
                    ? "bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/30"
                    : "bg-white/10 text-white/60"
                }`}
              >
                1
              </div>
              <div className="w-10 h-0.5 bg-white/20 relative overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-[#F59E0B] transition-all duration-300 ${step >= 2 ? "w-full" : "w-0"}`}
                />
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= 2
                    ? "bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/30"
                    : "bg-white/10 text-white/60"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
            {formError && (
              <div
                role="alert"
                className="flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm text-red-700 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">
                    !
                  </span>
                  <p className="font-medium">{formError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormError("")}
                  aria-label="Dismiss message"
                  className="shrink-0 rounded-lg p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      name="propertyName"
                      placeholder="e.g., Lekki Phase 1 Heights"
                      value={formData.propertyName}
                      onChange={handleInputChange}
                      className={`${inputCls} ${withError("propertyName")}`}
                    />
                    <p className="mt-1.5 text-xs text-slate-400">
                      {formData.propertyName.trim().length}/{NAME_MIN} characters
                      minimum
                    </p>
                    {fieldError("propertyName")}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Property Type *
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className={`${inputCls} cursor-pointer ${withError("propertyType")}`}
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {fieldError("propertyType")}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="e.g., Plot 14B, Admiralty Way"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`${inputCls} ${withError("address")}`}
                  />
                  {fieldError("address")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g., Lekki"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`${inputCls} ${withError("city")}`}
                    />
                    {fieldError("city")}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      State *
                    </label>
                    <div className="relative">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`${inputCls} cursor-pointer appearance-none ${formData.state ? "text-slate-800" : "text-slate-400"} ${withError("state")}`}
                      >
                        <option value="" disabled>
                          Select state
                        </option>
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                    {fieldError("state")}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Property Category *
                    </label>
                    <select
                      name="propertyCategory"
                      value={formData.propertyCategory}
                      onChange={handleInputChange}
                      className={`${inputCls} cursor-pointer ${withError("propertyCategory")}`}
                    >
                      {PROPERTY_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {fieldError("propertyCategory")}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Property Photos *
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="photo-upload"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`border-2 border-dashed rounded-2xl p-8 text-center hover:border-[#00332F] transition-colors cursor-pointer block group ${
                      fieldErrors.photos
                        ? "border-red-300 bg-red-50/40"
                        : "border-slate-200 bg-[#F7F5F0]"
                    }`}
                  >
                    <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-[#00332F]/5 text-[#00332F] mb-3 group-hover:bg-[#00332F] group-hover:text-white transition-colors">
                      <Upload className="w-5 h-5" />
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload or drag and drop property images
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {IMAGE_FORMAT_LABEL} images only — any other file type is
                      refused
                    </p>
                  </label>

                  {photos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {photos.map((photo, idx) => (
                        <div
                          key={`${photo.name}-${photo.lastModified}-${idx}`}
                          className="flex items-center gap-2 rounded-xl bg-[#00332F]/10 px-3.5 py-2 text-xs font-semibold text-[#00332F] border border-[#00332F]/15"
                        >
                          <span className="max-w-48 truncate">
                            📎 {photo.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            aria-label={`Remove ${photo.name}`}
                            className="rounded-full p-1 text-[#00332F]/70 transition hover:bg-[#00332F]/20 hover:text-[#00332F] cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {photoMessage && (
                    <p
                      className="mt-2 text-xs font-medium text-amber-700"
                      role="status"
                    >
                      {photoMessage}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    {photos.length} of {MAX_PHOTOS} photos selected
                  </p>
                  {fieldError("photos")}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Default Target Rent per Unit (₦) *
                  </label>
                  <input
                    type="text"
                    name="targetRent"
                    inputMode="numeric"
                    placeholder="e.g., 450,000"
                    value={formData.targetRent}
                    onChange={handleInputChange}
                    className={`${inputCls} font-semibold ${withError("targetRent")}`}
                  />
                  {rentWords ? (
                    <p className="mt-1.5 text-xs font-medium text-[#00332F]">
                      {rentWords} naira per unit, per year
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Numbers only — the amount is spelled out as you type.
                    </p>
                  )}
                  {fieldError("targetRent")}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Property Description & Notes *
                  </label>
                  <textarea
                    rows="4"
                    name="description"
                    placeholder="Enter key details about the building, facilities, or security..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`${inputCls} resize-none ${withError("description")}`}
                  ></textarea>
                  <p
                    className={`mt-1.5 text-xs ${
                      formData.description.trim().length > DESCRIPTION_MAX
                        ? "font-medium text-red-600"
                        : "text-slate-400"
                    }`}
                  >
                    {formData.description.trim().length}/{DESCRIPTION_MAX}{" "}
                    characters (minimum {DESCRIPTION_MIN})
                  </p>
                  {fieldError("description")}
                </div>
              </div>
            )}

            {/* Footer Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBack || (() => navigate("/dashboard"))}
                  className="px-6 py-3 rounded-xl text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 cursor-pointer py-3 bg-[#00332F] text-white rounded-xl font-bold text-sm hover:bg-[#00332F]/90 shadow-lg shadow-[#00332F]/20 transition-all flex items-center gap-2 group"
                >
                  Continue to Property Media
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-8 cursor-pointer py-3 bg-[#F59E0B] text-white rounded-xl font-bold text-sm hover:bg-[#F59E0B]/90 shadow-lg shadow-[#F59E0B]/25 transition-all disabled:cursor-wait disabled:opacity-60 flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save & Publish Property
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
