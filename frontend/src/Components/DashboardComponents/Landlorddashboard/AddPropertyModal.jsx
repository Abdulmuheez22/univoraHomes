import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addProperty } from '../../../lib/services/auth.service';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, ArrowLeft, Building2, Upload, CheckCircle2 } from "lucide-react";

export default function AddPropertyPage({ onBack }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [formError, setFormError] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'Multi-Family',
    address: '',
    city: '',
    state: '',
    totalUnits: 1,
    description: '',
    targetRent: '',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addProperty,
    onSuccess: (data) => {
      console.log("Property added success: ", data);
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("error Adding property: ", error);
      setFormError(
        error.response?.data?.message ||
          "We couldn't save your property. Please try again.",
      );
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = Math.max(0, 5 - photos.length);
    const acceptedFiles = files.slice(0, remainingSlots);
    setPhotos((prev) => [...prev, ...acceptedFiles]);
    setPhotoMessage(
      files.length > remainingSlots
        ? "You can upload up to 5 photos. Extra files were not added."
        : "",
    );
    setFormError("");
    e.target.value = "";
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPhotoMessage("");
  };

  const validateStep1 = () => {
    if (!formData.propertyName.trim()) return 'Property name is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    if (formData.totalUnits < 1) return 'Total units must be at least 1';
    return null;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const error = validateStep1();
    if (error) {
      setFormError(error);
      return;
    }
    setFormError("");
    setStep(2);
  };

  const handleBackStep = () => {
    setFormError("");
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (photos.length === 0) {
      setFormError("Add at least one property photo before publishing.");
      return;
    }

    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => body.append(key, value));
    photos.forEach((photo) => body.append("images", photo));

    setFormError("");
    mutate(body);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-6 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Header & Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/dashboard"
              onClick={onBack}
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#00332F] mb-2 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#00332F]">Add New Property</h1>
            <p className="text-xs text-slate-500 mt-0.5">Expand your real estate portfolio on Univora Homes</p>
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
                <h2 className="text-lg font-bold tracking-tight">Property Registration</h2>
              </div>
              <p className="text-xs text-white/70">
                Step {step} of 2 — <span className="text-[#F59E0B] font-medium">{step === 1 ? 'Basic Information' : 'Units & Media'}</span>
              </p>
            </div>
            
            {/* Step Indicators */}
            <div className="relative z-10 flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 1 ? 'bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/30' : 'bg-white/10 text-white/60'
              }`}>
                1
              </div>
              <div className="w-10 h-0.5 bg-white/20 relative overflow-hidden">
                <div className={`absolute inset-y-0 left-0 bg-[#F59E0B] transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 2 ? 'bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/30' : 'bg-white/10 text-white/60'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {formError && (
              <div
                role="alert"
                className="flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm text-red-700 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">!</span>
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Property Name *</label>
                    <input 
                      type="text" 
                      name="propertyName"
                      required
                      placeholder="e.g., Lekki Phase 1 Heights"
                      value={formData.propertyName}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Property Type</label>
                    <select 
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10 cursor-pointer"
                    >
                      <option value="Multi-Family">Multi-Family Apartments</option>
                      <option value="Single-Family">Single-Family House</option>
                      <option value="Commercial">Commercial Space</option>
                      <option value="Duplex">Duplex</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Street Address *</label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    placeholder="e.g., Plot 14B, Admiralty Way"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">City *</label>
                    <input 
                      type="text" 
                      name="city"
                      required
                      placeholder="e.g., Lekki"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">State</label>
                    <input 
                      type="text" 
                      name="state"
                      placeholder='e.g., Lagos'
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Total Units *</label>
                    <input 
                      type="number" 
                      name="totalUnits"
                      min="1"
                      required
                      value={formData.totalUnits}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Property Photos</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    id="photo-upload"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label htmlFor="photo-upload" className="border-2 border-dashed border-slate-200 bg-[#F7F5F0] rounded-2xl p-8 text-center hover:border-[#00332F] transition-colors cursor-pointer block group">
                    <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-[#00332F]/5 text-[#00332F] mb-3 group-hover:bg-[#00332F] group-hover:text-white transition-colors">
                      <Upload className="w-5 h-5" />
                    </span>
                    <p className="text-sm font-semibold text-slate-800">Click to upload or drag and drop property images</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG or GIF (max. 5MB each)</p>
                  </label>
                  
                  {photos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {photos.map((photo, idx) => (
                        <div
                          key={`${photo.name}-${photo.lastModified}-${idx}`}
                          className="flex items-center gap-2 rounded-xl bg-[#00332F]/10 px-3.5 py-2 text-xs font-semibold text-[#00332F] border border-[#00332F]/15"
                        >
                          <span className="max-w-48 truncate">📎 {photo.name}</span>
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
                    <p className="mt-2 text-xs font-medium text-amber-700" role="status">
                      {photoMessage}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    {photos.length} of 5 photos selected
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Default Target Rent per Unit (₦)</label>
                  <input 
                    type="text" 
                    name="targetRent"
                    placeholder="e.g., 450,000"
                    value={formData.targetRent}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Property Description & Notes</label>
                  <textarea 
                    rows="4"
                    name="description"
                    placeholder="Enter key details about the building, facilities, or security..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7F5F0] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#00332F] focus:bg-white focus:ring-4 focus:ring-[#00332F]/10 resize-none"
                  ></textarea>
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
                  onClick={onBack}
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
                  Continue to Units & Media
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