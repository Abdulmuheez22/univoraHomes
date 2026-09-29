import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AddPropertyPage({ onBack, onSave }) {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'Multi-Family',
    address: '',
    city: '',
    state: 'Lagos',
    totalUnits: 1,
    description: '',
    targetRent: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
  };

  const validateStep1 = () => {
    if (!formData.propertyName.trim()) return 'Property name is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    if (formData.totalUnits < 1) return 'Total units must be at least 1';
    return null;
  };

  const handleNext = () => {
    const error = validateStep1();
    if (error) {
      alert(error);
      return;
    }
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, photos });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Header & Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <Link
            to="/dashboard"
              onClick={onBack}
              className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-[#00332F] mb-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#00332F]">Add New Property</h1>
            <p className="text-xs text-gray-500 mt-0.5">Expand your real estate portfolio on Univora Homes</p>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-[#FEFDFC] rounded-2xl shadow-xl border border-[#F7F5F0] overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#00332F] px-8 py-6 text-white flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Property Registration</h2>
              <p className="text-xs text-gray-300 mt-0.5">Step {step} of 2 — {step === 1 ? 'Basic Information' : 'Units & Media'}</p>
            </div>
            
            {/* Step Indicators */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#F59E0B] text-white' : 'bg-white/10 text-gray-300'}`}>1</div>
              <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-[#F59E0B]' : 'bg-white/20'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#F59E0B] text-white' : 'bg-white/10 text-gray-300'}`}>2</div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Property Name *</label>
                    <input 
                      type="text" 
                      name="propertyName"
                      required
                      placeholder="e.g., Lekki Phase 1 Heights"
                      value={formData.propertyName}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00332F]/20 focus:border-[#00332F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Property Type</label>
                    <select 
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00332F]/20 focus:border-[#00332F]"
                    >
                      <option value="Multi-Family">Multi-Family Apartments</option>
                      <option value="Single-Family">Single-Family House</option>
                      <option value="Commercial">Commercial Space</option>
                      <option value="Duplex">Duplex / Triplex</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Street Address *</label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    placeholder="e.g., Plot 14B, Admiralty Way"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7F5F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00332F]/20 focus:border-[#00332F]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">City *</label>
                    <input 
                      type="text" 
                      name="city"
                      required
                      placeholder="e.g., Lekki"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00332F]/20 focus:border-[#00332F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00332F]/20 focus:border-[#00332F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Total Units *</label>
                    <input 
                      type="number" 
                      name="totalUnits"
                      min="1"
                      required
                      value={formData.totalUnits}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F5F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00332F]/20 focus:border-[#00332F]"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Property Photos</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    id="photo-upload"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label htmlFor="photo-upload" className="border-2 border-dashed border-gray-200 bg-[#F7F5F0] rounded-2xl p-8 text-center hover:border-[#00332F] transition-colors cursor-pointer block">
                    <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop property images</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
                  </label>
                  {photos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {photos.map((photo, idx) => (
                        <span key={idx} className="text-xs bg-[#00332F]/10 text-[#00332F] px-3 py-1.5 rounded-lg font-medium">
                          📎 {photo.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Default Target Rent per Unit (₦)</label>
                  <input 
                    type="text" 
                    name="targetRent"
                    placeholder="e.g., 450,000"
                    value={formData.targetRent}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7F5F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00332F]/20 focus:border-[#00332F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Property Description & Notes</label>
                  <textarea 
                    rows="4"
                    name="description"
                    placeholder="Enter key details about the building, facilities, or security..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7F5F0] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00332F]/20 focus:border-[#00332F]"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Footer Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl text-gray-500 font-medium text-sm hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#00332F] text-white rounded-xl font-medium text-sm hover:bg-[#00332F]/90 shadow-lg shadow-[#00332F]/20 transition-all"
                >
                  Continue to Units & Media
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#F59E0B] text-white rounded-xl font-medium text-sm hover:bg-[#F59E0B]/90 shadow-lg shadow-[#F59E0B]/20 transition-all"
                >
                  Save & Publish Property
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}