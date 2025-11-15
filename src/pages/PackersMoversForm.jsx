import React, { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaBox, FaImages, FaTrash, FaPlus, FaTimes } from "react-icons/fa"; // Added icons for style

// PackersMoversForm.jsx
// ... (rest of your existing logic) ...

export default function PackersMoversForm() {
  const { t } = useTranslation("packersForm"); // Use translation for header
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pickupAddress: "",
    dropoffAddress: "",
    pickupDate: "",
    pickupTime: "",
    vehicleType: "",
    estimatedWeight: "",
    insurance: false,
    notes: "",
  });

  const [items, setItems] = useState([
    { id: Date.now(), name: "Sofa", qty: 1, fragile: false },
  ]);

  const [images, setImages] = useState([]); // {file, url}
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  // --- All your existing logic (validate, handleChange, etc.) stays exactly the same ---
  // ... (validate, handleChange, addItem, updateItem, removeItem, handleFiles, removeImage, handleSubmit) ...
  // [NOTE: I've omitted the identical logic functions here for brevity]
  // --- All your existing logic (validate, handleChange, etc.) stays exactly the same ---
  const validate = useCallback(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.phone.trim() || !/^\d{10,15}$/.test(form.phone.replace(/\s+/g, "")))
      e.phone = "Enter a valid phone number (10-15 digits).";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.pickupAddress.trim()) e.pickupAddress = "Pickup address required.";
    if (!form.dropoffAddress.trim())
      e.dropoffAddress = "Dropoff address required.";
    if (!form.pickupDate) e.pickupDate = "Select a pickup date.";
    if (items.length === 0) e.items = "Add at least one item.";
    return e;
  }, [form, items]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const addItem = useCallback(() => {
    setItems((list) => [
      ...list,
      { id: Date.now() + Math.random(), name: "", qty: 1, fragile: false },
    ]);
  }, []);

  const updateItem = useCallback((id, key, value) => {
    setItems((list) =>
      list.map((it) => (it.id === id ? { ...it, [key]: value } : it))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((list) => list.filter((it) => it.id !== id));
  }, []);

  const handleFiles = useCallback((files) => {
    const arr = Array.from(files).slice(0, 6); // limit to 6
    const mapped = arr.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...mapped]);
  }, []);

  const removeImage = useCallback((idx) => {
    setImages((imgs) => {
      const toRevoke = imgs[idx];
      if (toRevoke) URL.revokeObjectURL(toRevoke.url);
      return imgs.filter((_, i) => i !== idx);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const payload = new FormData();
      // ... (all your payload.append calls) ...
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("pickupAddress", form.pickupAddress);
      payload.append("dropoffAddress", form.dropoffAddress);
      payload.append("pickupDate", form.pickupDate);
      payload.append("pickupTime", form.pickupTime);
      payload.append("vehicleType", form.vehicleType);
      payload.append("estimatedWeight", form.estimatedWeight);
      payload.append("insurance", form.insurance ? "true" : "false");
      payload.append("notes", form.notes);
      payload.append("items", JSON.stringify(items));
      images.forEach((img) => payload.append("images", img.file));

      const res = await fetch("/api/services/packers", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Submission failed");
      }

      setSuccessMsg(
        "Request submitted successfully. We'll contact you shortly."
      );
      // ... (resetting form state) ...
      setForm({
        name: "",
        email: "",
        phone: "",
        pickupAddress: "",
        dropoffAddress: "",
        pickupDate: "",
        pickupTime: "",
        vehicleType: "",
        estimatedWeight: "",
        insurance: false,
        notes: "",
      });
      setItems([{ id: Date.now(), name: "Sofa", qty: 1, fragile: false }]);
      images.forEach((i) => URL.revokeObjectURL(i.url));
      setImages([]);
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to reset the form
  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      pickupAddress: "",
      dropoffAddress: "",
      pickupDate: "",
      pickupTime: "",
      vehicleType: "",
      estimatedWeight: "",
      insurance: false,
      notes: "",
    });
    setItems([{ id: Date.now(), name: "Sofa", qty: 1, fragile: false }]);
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setErrors({});
    setSuccessMsg("");
    setErrorMsg("");
  };

  // Helper for input classes
  const inputClass = (name) =>
    `mt-1 block w-full rounded-xl border border-[#001F3F]/20 px-3 py-2.5 text-[#001F3F] placeholder:text-[#001F3F]/40 focus:outline-none focus:ring-2 focus:ring-[#0091D5]/40 focus:border-[#0091D5]/80 ${
      errors[name] ? "border-red-500/60" : "border-[#001F3F]/20"
    }`;

  // Helper for label classes
  const labelClass = "text-sm font-semibold text-[#001F3F]/90";

  return (
    // 1. ADDED: Page wrapper to match other pages
    <section
      id="packers-form"
      className="bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. ADDED: Standard page header */}
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#001F3F]">
            {t("header.title", { defaultValue: "Packers & Movers Quote" })}
          </h2>
          <p className="text-sm sm:text-lg text-[#001F3F]/70 max-w-2xl mx-auto mt-3">
            {t("header.subtitle", {
              defaultValue:
                "Please fill in the details below for an accurate quote. We'll get back to you shortly.",
            })}
          </p>
        </div>

        {/* 3. UPDATED: Form container styled as a main "card" */}
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-[#001F3F]/10 shadow-xl">
          {/* Form title moved inside the card */}
          <h3 className="text-2xl font-bold text-[#001F3F] mb-6 border-b border-[#001F3F]/10 pb-4">
            Shifting Details
          </h3>

          <form onSubmit={handleSubmit} noValidate>
            {/* --- Personal Details --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <label className="block">
                {/* 4. UPDATED: Label styling */}
                <span className={labelClass}>Full name *</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  // 5. UPDATED: Input styling
                  className={inputClass("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                />
                {errors.name && (
                  <p id="err-name" className="text-xs text-red-600 mt-1">
                    {errors.name}
                  </p>
                )}
              </label>

              <label className="block">
                <span className={labelClass}>Phone *</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  inputMode="tel"
                  className={inputClass("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "err-phone" : undefined}
                />
                {errors.phone && (
                  <p id="err-phone" className="text-xs text-red-600 mt-1">
                    {errors.phone}
                  </p>
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className={labelClass}>Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                />
                {errors.email && (
                  <p id="err-email" className="text-xs text-red-600 mt-1">
                    {errors.email}
                  </p>
                )}
              </label>
            </div>

            {/* --- Address Details --- */}
            <div className="mt-6 grid grid-cols-1 gap-y-5">
              <label>
                <span className={labelClass}>Pickup address *</span>
                <textarea
                  name="pickupAddress"
                  value={form.pickupAddress}
                  onChange={handleChange}
                  rows={3}
                  className={inputClass("pickupAddress")}
                />
                {errors.pickupAddress && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.pickupAddress}
                  </p>
                )}
              </label>

              <label>
                <span className={labelClass}>Dropoff address *</span>
                <textarea
                  name="dropoffAddress"
                  value={form.dropoffAddress}
                  onChange={handleChange}
                  rows={3}
                  className={inputClass("dropoffAddress")}
                />
                {errors.dropoffAddress && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.dropoffAddress}
                  </p>
                )}
              </label>
            </div>

            {/* --- Date, Time, Vehicle --- */}
            <fieldset className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
              <label>
                <span className={labelClass}>Pickup date *</span>
                <input
                  name="pickupDate"
                  type="date"
                  value={form.pickupDate}
                  onChange={handleChange}
                  className={inputClass("pickupDate")}
                />
                {errors.pickupDate && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.pickupDate}
                  </p>
                )}
              </label>

              <label>
                <span className={labelClass}>Preferred time</span>
                <input
                  name="pickupTime"
                  type="time"
                  value={form.pickupTime}
                  onChange={handleChange}
                  className={inputClass("pickupTime")}
                />
              </label>

              <label>
                <span className={labelClass}>Vehicle type</span>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className={inputClass("vehicleType")}
                >
                  <option value="">Select vehicle</option>
                  <option>Mini Truck</option>
                  <option>10 ft</option>
                  <option>14 ft</option>
                  <option>22 ft</option>
                  <option>Container</option>
                </select>
              </label>
            </fieldset>

            {/* --- Item List --- */}
            <div className="mt-8 pt-6 border-t border-[#001F3F]/10">
              <h3 className="font-semibold text-lg text-[#001F3F] flex items-center gap-2">
                <FaBox /> Items to move
              </h3>
              {errors.items && (
                <p className="text-xs text-red-600 mt-1">{errors.items}</p>
              )}

              <div className="space-y-3 mt-4">
                {items.map((it, idx) => (
                  <div
                    key={it.id}
                    className="flex flex-wrap sm:flex-nowrap gap-2 items-center"
                  >
                    <input
                      aria-label={`Item name ${idx + 1}`}
                      value={it.name}
                      onChange={(e) => updateItem(it.id, "name", e.target.value)}
                      placeholder="Item name (e.g. Wardrobe)"
                      className={`${inputClass(
                        "item_name"
                      )} flex-1 min-w-[150px]`}
                    />
                    <input
                      aria-label={`Quantity ${idx + 1}`}
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) =>
                        updateItem(
                          it.id,
                          "qty",
                          Math.max(1, Number(e.target.value || 1))
                        )
                      }
                      className={`${inputClass("item_qty")} w-24`}
                    />
                    <label className="flex items-center gap-2 text-sm text-[#001F3F]/90 p-2">
                      <input
                        type="checkbox"
                        checked={it.fragile}
                        onChange={(e) =>
                          updateItem(it.id, "fragile", e.target.checked)
                        }
                        className="rounded text-[#0091D5] focus:ring-[#0091D5]/40"
                      />
                      <span>Fragile</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="text-sm font-medium text-red-600/80 hover:text-red-600 px-2 py-1 flex items-center gap-1"
                      aria-label={`Remove item ${idx + 1}`}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                ))}
                <div>
                  {/* 6. UPDATED: "Add item" button style */}
                  <button
                    type="button"
                    onClick={addItem}
                    className="mt-2 px-5 py-2 rounded-full bg-[#001F3F] text-white font-semibold transition-opacity hover:opacity-90 flex items-center gap-2"
                  >
                    <FaPlus size={12} /> Add item
                  </button>
                </div>
              </div>
            </div>

            {/* --- Other Details --- */}
            <div className="mt-8 pt-6 border-t border-[#001F3F]/10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <label>
                <span className={labelClass}>Estimated weight (kg)</span>
                <input
                  name="estimatedWeight"
                  value={form.estimatedWeight}
                  onChange={handleChange}
                  className={inputClass("estimatedWeight")}
                  placeholder="e.g. 500"
                />
              </label>
              <label className="flex items-center gap-3 sm:mt-6">
                <input
                  name="insurance"
                  type="checkbox"
                  checked={form.insurance}
                  onChange={handleChange}
                  className="rounded text-[#0091D5] focus:ring-[#0091D5]/40"
                />
                <span className="text-sm font-medium text-[#001F3F]/90">
                  Require transit insurance
                </span>
              </label>
            </div>

            <label className="block mt-6">
              <span className={labelClass}>Additional notes</span>
              <textarea
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                className={inputClass("notes")}
                placeholder="e.g. Need lift, narrow stairs, parking issues..."
              />
            </label>

            {/* --- File Upload --- */}
            <div className="mt-8 pt-6 border-t border-[#001F3F]/10">
              <label className="font-semibold text-lg text-[#001F3F] flex items-center gap-2">
                <FaImages /> Photos (optional, up to 6)
              </label>
              <p className="text-sm text-[#001F3F]/70 mt-1">
                Use photos to show large items, stairs, or building access.
              </p>
              <div className="mt-3 flex gap-2 items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                {/* 7. UPDATED: "Upload" button style */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2 rounded-full border border-[#001F3F]/30 font-semibold text-[#001F3F]/80 transition-colors hover:bg-[#001F3F]/5"
                >
                  Upload photos
                </button>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {images.map((img, i) => (
                    <div
                      key={img.url}
                      className="relative rounded-lg overflow-hidden border border-[#001F3F]/10 aspect-square"
                    >
                      <img
                        src={img.url}
                        alt={`preview ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm rounded-full p-1 text-red-600 hover:bg-white"
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- Submit / Reset --- */}
            <div className="mt-8 pt-6 border-t border-[#001F3F]/10 flex flex-col sm:flex-row items-center gap-4">
              {/* 8. UPDATED: Submit button matches P&M service color */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0091D5] text-white font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Request Quote"}
              </button>

              {/* 9. UPDATED: Reset button style */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#001F3F]/30 font-semibold text-[#001F3F]/80 transition-colors hover:bg-[#001F3F]/5"
              >
                Reset
              </button>
            </div>

            {successMsg && (
              <p className="mt-4 text-green-600 font-semibold">{successMsg}</p>
            )}
            {errorMsg && (
              <p className="mt-4 text-red-600 font-semibold">{errorMsg}</p>
            )}
          </form>

          <div className="mt-6 text-xs text-[#001F3F]/60">
            Tips: provide photos of heavy/large items and stairs for accurate
            quotations. By submitting, you agree to be contacted for service
            confirmation.
          </div>
        </div>
      </div>
    </section>
  );
}