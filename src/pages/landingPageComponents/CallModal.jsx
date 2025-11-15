import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Loader2, CheckCircle } from "lucide-react";

// Animation variants for the backdrop
const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

// Animation variants for the modal
const modalVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: 30, scale: 0.95 },
};

export default function CallModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formState, setFormState] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  
  const nameInputRef = useRef(null);

  // Auto-focus the first input when the modal opens
  useEffect(() => {
    if (isOpen && formState === "idle") {
      // Timeout allows the spring animation to start before focusing
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, formState]);

  // Handle manual close (backdrop, 'X' button)
  const handleClose = () => {
    if (formState === "loading") return; // Don't close while loading
    
    onClose();

    // Delay form reset to allow exit animation to complete
    setTimeout(() => {
      setName("");
      setPhone("");
      setFormState("idle");
      setError(null);
    }, 500);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState === "loading") return; // Prevent double submit

    setFormState("loading");
    setError(null);

    try {
      // Await the promise from the parent
      await onSubmit({ name, phone });

      // Show success state
      setFormState("success");

      // Automatically close and reset after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      // Show error state
      setError(err.message || "Something went wrong. Please try again.");
      setFormState("error");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.2 }}
        onClick={handleClose} // Use enhanced close handler
        aria-hidden="true"
      />

      {/* 2. Modal Panel */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog" // AX: Add role
        aria-modal="true" // AX: Add modal state
        aria-labelledby="modal-title" // AX: Link to title
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
            <h3 id="modal-title" className="text-lg sm:text-xl font-semibold text-[#001F3F]">
              Get a Call Back
            </h3>
            <button
              onClick={handleClose} // Use enhanced close handler
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1"
              aria-label="Close modal"
              disabled={formState === 'loading'}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form / Success State Container */}
          <AnimatePresence mode="wait">
            {formState === "success" ? (
              // --- SUCCESS STATE ---
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4"
              >
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h4 className="text-xl font-semibold text-[#001F3F]">Request Received!</h4>
                <p className="text-gray-600">We will call you back shortly.</p>
              </motion.div>
            ) : (
              // --- FORM STATE ---
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-6 space-y-4"
              >
                {/* Name Input */}
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    id="modal-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0091D5] focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Phone Input */}
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <input
                    type="tel"
                    id="modal-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9]{10}" // Simple 10-digit validation
                    title="Please enter a 10-digit phone number"
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0091D5] focus:border-transparent"
                    placeholder="Enter your 10-digit number"
                  />
                </div>
                
                {/* Error Message */}
                {formState === 'error' && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="w-full px-8 py-3 bg-[#0091D5] hover:cursor-pointer text-white rounded-full font-semibold transition hover:opacity-80
                             flex items-center justify-center
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formState === 'loading' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}