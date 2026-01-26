import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Package,
  Calendar,
  Truck,
  Scale,
  Ruler,
  AlertCircle,
  BadgeCheck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Thermometer,
  User, // Added for Contact Name
  Phone, // Added for Phone
  Mail, // Added for Email
} from 'lucide-react';
// Note: I am replacing the Button import with styled <button> tags
// to ensure 100% style consistency with your other pages,
// removing the dependency on @/components/ui/button
// import { Button } from '@/components/ui/button';
import LoaderOne from '@/components/ui/LoadingScreen';
import axios from 'axios';

/**
 * Standalone Shipment Request Page + Form
 * - [THEMED] Styles updated to match Services/PackersMoversForm
 */

// ... (indianStates, materialTypes, etc. all remain the same) ...
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadwee', 'Puducherry'
].sort();
const materialTypes = [
  'Electronics & Technology', 'Automotive Parts', 'Machinery & Equipment', 'Textiles & Clothing',
  'Food & Beverages', 'Pharmaceuticals', 'Chemicals', 'Raw Materials', 'Construction Materials',
  'Furniture & Home Goods', 'Books & Documents', 'Hazardous Materials', 'Fragile Items', 'Perishable Goods', 'Others'
];
const transportModes = ['Road Transport', 'Rail Transport', 'Air Transport', 'Sea Transport', 'Intermodal'];
const coolingType = ['Ambient temperature/Non-Refrigerated', 'Refrigerated Frozen temperature', 'Refrigerated Chiller'];
const truckSize = ['Small Vehicle', '12 ft', '14 ft', '17 ft', '19 ft', '20 ft', '22 ft', '24 ft', '32 ft', '40 ft'];
const units = ['Ft', 'Meter', 'Inch', 'Cm', 'Yard'];
const smallVehicle = ['Tata Ace', 'Bolero', 'Echo', 'Champion'];


const cx = (...cn) => cn.filter(Boolean).join(' ');
const formatINR = (val) => {
  // ... (no change) ...
  if (val === '' || val === null || val === undefined) return '';
  const num = Number(val);
  if (Number.isNaN(num)) return String(val);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
};
const formatDate = (d) => {
  // ... (no change) ...
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
};

/* Small UI primitives (Themed) */
const Field = ({ label, icon, id, required, children, hint, error }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="flex items-center text-sm font-semibold text-[#001F3F]/90"> {/* 1. THEMED */}
      {icon && <span className="mr-2 text-[#0091D5]">{icon}</span>} {/* 2. THEMED */}
      {label}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
    {children}
    <div className="min-h-[1.25rem]">
      {error ? (
        <p className="text-xs text-rose-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  </div>
);

const TextInput = ({ id, error, className, ...props }) => (
  <input
    id={id}
    aria-invalid={!!error}
    aria-describedby={error ? `${id}-error` : undefined}
    className={cx(
      'w-full px-4 py-2.5 rounded-xl border bg-white/80 backdrop-blur-sm shadow-sm outline-none', // 3. THEMED (py-2.5)
      'text-[#001F3F] placeholder:text-[#001F3F]/40', // 4. THEMED
      error
        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-300/40' // 5. THEMED (ring-2)
        : 'border-[#001F3F]/20 focus:border-[#0091D5]/80 focus:ring-2 focus:ring-[#0091D5]/40', // 6. THEMED
      className
    )}
    {...props}
  />
);

const SelectInput = ({ id, error, className, children, ...props }) => (
  <select
    id={id}
    aria-invalid={!!error}
    className={cx(
      'w-full px-4 py-2.5 rounded-xl border bg-white/80 backdrop-blur-sm shadow-sm outline-none', // 7. THEMED (py-2.5)
      'text-[#001F3F]', // 8. THEMED
      error
        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-300/40' // 9. THEMED (ring-2)
        : 'border-[#001F3F]/20 focus:border-[#0091D5]/80 focus:ring-2 focus:ring-[#0091D5]/40', // 10. THEMED
      className
    )}
    {...props}
  >
    {children}
  </select>
);

const Radio = ({ name, value, checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2 text-sm text-[#001F3F]/90 cursor-pointer select-none"> {/* 11. THEMED */}
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-[#0091D5] border-gray-300 focus:ring-[#0091D5]/40" /* 12. THEMED */
    />
    <span>{label}</span>
  </label>
);

/* Preview Card (Themed) */
const RequestPreview = ({ formData, onEdit, onConfirm, loading }) => {
  const renderValue = (value, fallback = 'Not Provided') =>
    value && value !== 'null' && value !== 'undefined' && value !== ''
      ? value
      : <span className="text-gray-400 italic">{fallback}</span>;

  const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
      <p className="text-xs font-medium text-[#001F3F]/70">{label}</p> {/* 13. THEMED */}
      <p className="text-sm font-semibold text-[#001F3F] break-words">{value}</p> {/* 14. THEMED */}
    </div>
  );

  const PreviewSection = ({ title, icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-gradient-to-br from-white to-slate-50 border border-[#001F3F]/10 rounded-2xl p-5 shadow-sm" /* 15. THEMED */
    >
      <h3 className="font-semibold text-[#001F3F]/90 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4"> {/* 16. THEMED */}
        {icon}
        <span>{title}</span>
      </h3>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-6 border border-[#001F3F]/10"> {/* 17. THEMED */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#001F3F]">Confirm Your Shipment Request</h2> {/* 18. THEMED */}
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#0091D5]/10 text-[#0091D5] border border-[#0091D5]/20"> {/* 19. THEMED */}
          <BadgeCheck className="w-4 h-4" />
          Review
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreviewSection title="Contact" icon={<User size={18} className="text-[#0091D5]" />}> {/* 20. THEMED */}
          <DetailItem label="Contact Name" value={renderValue(formData.contactName || formData.pickupAddressLine1)} />
          <DetailItem label="Phone" value={renderValue(formData.phone)} />
          <DetailItem label="Email" value={renderValue(formData.email)} />
        </PreviewSection>
        {/* ... (other preview sections are fine with their semantic colors) ... */}
        <PreviewSection title="Schedule" icon={<Calendar size={18} className="text-green-600" />}>
          <DetailItem label="Expected Pickup Date" value={renderValue(formatDate(formData.expectedPickup))} />
          <DetailItem label="Expected Delivery Date" value={renderValue(formatDate(formData.expectedDelivery))} />
        </PreviewSection>

        <PreviewSection title="Cargo Details" icon={<Package size={18} className="text-yellow-600" />}>
          <DetailItem
            label="Material Type"
            value={renderValue(formData.materialType === 'Others' ? formData.customMaterialType : formData.materialType)}
          />
          <DetailItem label="Weight" value={renderValue(`${formData.weight} kg`)} />
          {formData.length && formData.width && formData.height && (
            <DetailItem label="Dimensions (L×W×H)" value={`${formData.length} × ${formData.width} × ${formData.height} ${formData.unit || 'units'}`} />
          )}
          <DetailItem label="Material Value" value={renderValue(formatINR(formData.materialValue))} />
          {formData.additionalNotes && (
            <DetailItem label="Additional Notes" value={renderValue(formData.additionalNotes)} />
          )}
        </PreviewSection>

        <PreviewSection title="Logistics Requirements" icon={<Truck size={18} className="text-purple-600" />}>
          <DetailItem label="Body Type" value={renderValue(formData.bodyType)} />
          <DetailItem label="Transport Mode" value={renderValue(formData.transportMode)} />
          {formData.transportMode === 'Road Transport' && (
            <DetailItem label="Truck Size" value={renderValue(formData.truckSize)} />
          )}
          <DetailItem label="Temperature" value={renderValue(formData.coolingType || 'Ambient')} />
          <DetailItem label="Manpower Required" value={renderValue(formData.manpower)} />
          {formData.manpower === 'yes' && (
            <DetailItem label="Number of Labours" value={renderValue(formData.noOfLabours)} />
          )}
        </PreviewSection>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        {/* 21. THEMED: Replaced shadcn Button with custom styled button */}
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 sm:flex-none sm:w-1/3 px-6 py-3 rounded-full border border-[#001F3F]/30 font-semibold text-[#001F3F]/80 transition-colors hover:bg-[#001F3F]/5 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="mr-2" /> Edit Details
        </button>
        {/* 22. THEMED: Replaced shadcn Button with custom styled button */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 sm:w-2/3 px-8 py-3 rounded-full bg-[#0091D5] text-white font-bold text-base transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? (
            <>
              <LoaderOne />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            <>
              <CheckCircle size={16} className="mr-2" /> Confirm & Submit Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const ShipmentRequestForm = ({ onComplete }) => {
  const [formStep, setFormStep] = useState('editing');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // ... (no changes to state) ...
    phone: '',
    email: '',
    contactName: '',
    pickupAddressLine1: '',
    pickupAddressLine2: '',
    pickupState: '',
    pickupPincode: '',
    dropAddressLine1: '',
    dropAddressLine2: '',
    dropState: '',
    dropPincode: '',
    materialType: '',
    customMaterialType: '',
    bodyType: '', // Open / Closed
    manpower: '', // yes / no
    noOfLabours: '',
    weight: '',
    materialValue: '',
    additionalNotes: '',
    length: '',
    width: '',
    height: '',
    unit: '',
    expectedPickup: '',
    expectedDelivery: '',
    transportMode: '',
    truckSize: '',
    coolingType: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailToken, setEmailToken] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);
  useEffect(() => {
    setOtpSent(false);
    setOtp('');
    setEmailVerified(false);
    setEmailToken(null);
  }, [formData.email]);




  // ... (no changes to validation logic or useEffect) ...
  const validatePincode = (pincode) => {
    if (!pincode) return 'Pincode is required';
    if (!/^\d{6}$/.test(pincode)) return 'Pincode must be exactly 6 digits';
    return null;
  };
  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^\d{10}$/.test(phone)) return 'Phone number must be 10 digits';
    return null;
  };
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) return 'Invalid email address';
    return null;
  };
  const validatePickupDate = (date) => {
    if (!date) return 'Pickup date is required';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDate = new Date(date);
    if (pickupDate <= today) return 'Pickup date must be in the future';
    return null;
  };
  const validateDeliveryDate = (pickupDate, deliveryDate) => {
    if (!deliveryDate) return 'Delivery date is required';
    if (!pickupDate) return 'Please select pickup date first';
    const pickup = new Date(pickupDate);
    const delivery = new Date(deliveryDate);
    if (delivery <= pickup) return 'Delivery date must be after pickup date';
    return null;
  };
  useEffect(() => {
    const newErrors = {};
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;
    const pickupPincodeError = validatePincode(formData.pickupPincode);
    if (pickupPincodeError) newErrors.pickupPincode = pickupPincodeError;
    const dropPincodeError = validatePincode(formData.dropPincode);
    if (dropPincodeError) newErrors.dropPincode = dropPincodeError;
    const pickupDateError = validatePickupDate(formData.expectedPickup);
    if (pickupDateError) newErrors.expectedPickup = pickupDateError;
    const deliveryDateError = validateDeliveryDate(formData.expectedPickup, formData.expectedDelivery);
    if (deliveryDateError) newErrors.expectedDelivery = deliveryDateError;
    if (formData.weight && parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }
    if (formData.materialValue && parseFloat(formData.materialValue) <= 0) {
      newErrors.materialValue = 'Material value must be greater than 0';
    }
    if (formData.noOfLabours && parseInt(formData.noOfLabours) <= 0) {
      newErrors.noOfLabours = 'Number of labours must be greater than 0';
    }
    const requiredFields = [
      'phone', 'email',
      'pickupAddressLine1', 'pickupAddressLine2', 'pickupState', 'pickupPincode',
      'dropAddressLine1', 'dropAddressLine2', 'dropState', 'dropPincode', 'materialType', 'bodyType', 'manpower', 'weight',
      'expectedPickup', 'expectedDelivery', 'transportMode'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      newErrors.required = 'Please fill in all required fields';
    }
    if (formData.materialType === 'Others' && !formData.customMaterialType) {
      newErrors.customMaterialType = 'Please specify the material type';
    }
    if (formData.manpower === 'yes' && !formData.noOfLabours) {
      newErrors.noOfLabours = 'Please specify number of labours';
    }
    if (formData.bodyType === 'Closed' && !formData.coolingType) {
      newErrors.coolingType = 'Please select cooling type for closed body';
    }
    if (formData.transportMode === 'Road Transport' && !formData.truckSize) {
      newErrors.truckSize = 'Please select truck size for road transport';
    }
    if (!emailVerified) {
      newErrors.emailVerification = 'Please verify your email';
    }
    setErrors(newErrors);
    const hasNoErrors = Object.keys(newErrors).length === 0;
    const allRequiredFilled = requiredFields.every(field => formData[field]);
    const conditionalFieldsValid =
      (formData.materialType !== 'Others' || formData.customMaterialType) &&
      (formData.manpower !== 'yes' || formData.noOfLabours) &&
      (formData.bodyType !== 'Closed' || formData.coolingType) &&
      (formData.transportMode !== 'Road Transport' || formData.truckSize);
    setIsFormValid(hasNoErrors && allRequiredFilled && conditionalFieldsValid && emailVerified);
  }, [formData, emailVerified]);

  const handleInputChange = (e) => {
    // ... (no change) ...
    const { name, value, type, checked } = e.target;
    if (name === 'pickupPincode' || name === 'dropPincode' || name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handlePreviewSubmit = (e) => {
    // ... (no change) ...
    e.preventDefault();
    setFormStep('previewing');
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        // Contact Info
        contactNumber: formData.phone, // Aligned with Controller normalization
        email: formData.email,
        contactName: formData.contactName,

        // Pickup
        pickupAddressLine: formData.pickupAddressLine1, // Controller: pickupAddressLine
        pickupCity: formData.pickupAddressLine2,       // Mapping City/Area to City
        pickupState: formData.pickupState,
        pickupPincode: formData.pickupPincode,

        // Delivery
        deliveryAddressLine: formData.dropAddressLine1,
        deliveryCity: formData.dropAddressLine2,
        deliveryState: formData.dropState,
        deliveryPincode: formData.dropPincode,

        // Schedule
        expectedPickupDate: formData.expectedPickup,
        expectedDeliveryDate: formData.expectedDelivery,

        // Cargo
        materialType: formData.materialType.toLowerCase() === 'others' ? 'other' : formData.materialType,
        customMaterialType: formData.customMaterialType,
        weightKg: Number(formData.weight),
        length: formData.length ? Number(formData.length) : null,
        width: formData.width ? Number(formData.width) : null,
        height: formData.height ? Number(formData.height) : null, dimensionUnit: formData.unit,
        materialValue: Number(formData.materialValue),
        additionalNotes: formData.additionalNotes,

        // Logistics
        transportMode: formData.transportMode.split(' ')[0].toLowerCase(), // "Road Transport" -> "road"
        bodyType: formData.bodyType.toLowerCase(), // "Closed" -> "closed"
        truckSize: formData.truckSize,
        smallVehicleType: formData.vehicleType, // Match the fix I suggested for the controller
        coolingType: formData.coolingType,
        manpower: formData.manpower,
        noOfLabours: Number(formData.noOfLabours || 0),
      };

      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_URL}/api/ftl/create`;

      // 2. Send as JSON (standard for Sequelize/Express apps without files)
      const res = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-email-token': emailToken,
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      setLoading(false);
      alert('Request submitted successfully!');
      setFormData({
        phone: '', email: '', contactName: '',
        pickupAddressLine1: '', pickupAddressLine2: '', pickupState: '', pickupPincode: '',
        dropAddressLine1: '', dropAddressLine2: '', dropState: '', dropPincode: '',
        materialType: '', customMaterialType: '', bodyType: '', manpower: '', noOfLabours: '',
        weight: '', materialValue: '', additionalNotes: '', expectedPickup: '', expectedDelivery: '',
        transportMode: '', truckSize: '', coolingType: '', length: '', width: '', height: '', unit: '',
      });
      onComplete && onComplete(res.data);
      setFormStep('editing');
    } catch (err) {
      console.error('Error submitting request:', err);
      setLoading(false);
      const msg = err?.response?.data?.message || err.message || 'An error occurred. Please try again.';
      alert(msg);
    }
  };

  const StepBadge = ({ active, children }) => ( /* 23. THEMED: Updated to pass children */
    <span
      className={cx(
        'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold', // 24. THEMED: Size change
        active ? 'bg-[#0091D5] text-white' : 'bg-gray-200 text-gray-600' // 25. THEMED: Color change
      )}
    >
      {children}
    </span>
  );

  if (formStep === 'previewing') {
    return (
      <RequestPreview
        loading={loading}
        formData={formData}
        onEdit={() => setFormStep('editing')}
        onConfirm={handleFinalSubmit}
      />
    );
  }

  return (
    <form onSubmit={handlePreviewSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* 26. THEMED: Removed sticky header wrapper, as it's better to let the page scroll */}
      {/* The sticky header was fighting with the new page background */}

      {/* 27. THEMED: Main card styling updated */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-8 border border-[#001F3F]/10">
        <div className="border-b border-[#001F3F]/10 pb-6"> {/* 28. THEMED: Border color */}
          {/* 29. THEMED: Header fonts and colors */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001F3F]">
            Request a New Shipment
          </h2>
          <p className="text-sm sm:text-base text-[#001F3F]/70 mt-2">
            Fill in the details below to get a quote for your shipment.
          </p>

          {/* 30. THEMED: Validation box styles updated */}
          <div className="mt-6 p-4 rounded-xl border border-[#001F3F]/10 bg-[radial-gradient(circle_at_top_left,rgba(0,145,213,0.05),transparent)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#001F3F]/90">Form Status</span>
              <span className={cx('px-3 py-1 rounded-full text-xs font-medium', isFormValid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800')}>
                {isFormValid ? 'Ready to Preview' : 'Incomplete'}
              </span>
            </div>

            {isFormValid ? (
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">All fields complete. Ready to preview.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center text-amber-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Please fix validation errors to proceed.</span>
                </div>
                {errors.required && (
                  <p className="text-rose-600 text-sm ml-7">{errors.required}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
          {/* Contact Name */}
          <div>
            <Field label="Contact Name" id="contactName" icon={<User className="w-4 h-4" />}>
              <TextInput
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Contact person name"
              />
            </Field>
          </div>

          {/* Phone */}
          <div>
            <Field
              label="Phone Number"
              id="phone"
              required
              error={errors.phone}
              icon={<Phone className="w-4 h-4" />}
            >
              <TextInput
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10 digit phone number"
                maxLength={10}
                inputMode="numeric"
              />
            </Field>
          </div>

          {/* Email + Verify + OTP */}
          <div>
            <Field
              label="Email"
              id="email"
              required
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            >
              <div className="flex gap-2 items-start">
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled={emailVerified}
                  onChange={handleInputChange}
                  placeholder="contact@example.com"
                  className="flex-1"
                />

                {!emailVerified && (
                  <button
                    type="button"
                    disabled={!!errors.email || cooldown > 0}
                    onClick={async () => {
                      await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/ftl/send-otp`,
                        { email: formData.email }
                      );
                      setOtpSent(true);
                      setCooldown(60);
                    }}
                    className={cx(
                      'px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap',
                      cooldown > 0 || !!errors.email
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-[#0091D5] text-white hover:opacity-90'
                    )}
                  >
                    {cooldown > 0 ? `${cooldown}s` : 'Verify'}
                  </button>
                )}
              </div>
            </Field>

            {/* OTP – perfectly aligned under Email */}
            {otpSent && !emailVerified && (
              <div className="mt-2 flex gap-2">
                <TextInput
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const res = await axios.post(
                      `${import.meta.env.VITE_API_URL}/api/ftl/verify-otp`,
                      { email: formData.email, otp }
                    );

                    setEmailToken(res.data.tempToken);
                    setEmailVerified(true);
                    setOtpSent(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:opacity-90"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {/* Verified state */}
            {emailVerified && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Email verified
              </p>
            )}
          </div>
        </div>




        {/* Pickup and Drop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#001F3F]/10">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="rounded-2xl border border-[#001F3F]/10 bg-white p-4 shadow-sm"> {/* 31. THEMED */}
              <div className="flex items-center text-sm font-semibold text-[#001F3F] mb-3"> {/* 32. THEMED */}
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />Pick Up Location
                <span className="ml-1 text-rose-500">*</span>
              </div>
              <div className="space-y-3">
                <TextInput id="pickupAddressLine1" name="pickupAddressLine1" value={formData.pickupAddressLine1} onChange={handleInputChange} placeholder="Building no, street" required />
                <TextInput id="pickupAddressLine2" name="pickupAddressLine2" value={formData.pickupAddressLine2} onChange={handleInputChange} placeholder="City / Area" required />
                <SelectInput id="pickupState" name="pickupState" value={formData.pickupState} onChange={handleInputChange} required>
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </SelectInput>
                <TextInput
                  id="pickupPincode"
                  name="pickupPincode"
                  value={formData.pickupPincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  error={errors.pickupPincode}
                  required
                />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div className="rounded-2xl border border-[#001F3F]/10 bg-white p-4 shadow-sm"> {/* 33. THEMED */}
              <div className="flex items-center text-sm font-semibold text-[#001F3F] mb-3"> {/* 34. THEMED */}
                <MapPin className="w-4 h-4 mr-2 text-red-500" />Drop Location
                <span className="ml-1 text-rose-500">*</span>
              </div>
              <div className="space-y-3">
                <TextInput id="dropAddressLine1" name="dropAddressLine1" value={formData.dropAddressLine1} onChange={handleInputChange} placeholder="Building no, street" required />
                <TextInput id="dropAddressLine2" name="dropAddressLine2" value={formData.dropAddressLine2} onChange={handleInputChange} placeholder="City / Area" required />
                <SelectInput id="dropState" name="dropState" value={formData.dropState} onChange={handleInputChange} required>
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </SelectInput>
                <TextInput
                  id="dropPincode"
                  name="dropPincode"
                  value={formData.dropPincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  error={errors.dropPincode}
                  required
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* More fields (material, weight, dims) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-[#001F3F]/10">
          <div>
            <Field label="Material Type" id="materialType" required icon={<Package className="w-4 h-4" />} error={errors.customMaterialType}>
              <SelectInput id="materialType" name="materialType" value={formData.materialType} onChange={handleInputChange} required>
                <option value="">Select material type</option>
                {materialTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </SelectInput>
            </Field>
            {formData.materialType === 'Others' && (
              <Field label="Specify Material" id="customMaterialType" error={errors.customMaterialType}>
                <TextInput id="customMaterialType" name="customMaterialType" value={formData.customMaterialType} onChange={handleInputChange} placeholder="Please specify" required />
              </Field>
            )}
          </div>

          <div>
            <Field label="Weight (kg)" id="weight" required icon={<Scale className="w-4 h-4" />} error={errors.weight}>
              <TextInput
                id="weight"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter weight in kg"
                min={0}
                step={0.1}
                error={errors.weight}
                required
              />
            </Field>
          </div>
        </div>

        <div>
          <div className="flex items-center text-sm font-semibold text-[#001F3F]/90 mb-2"><Ruler className="w-4 h-4 mr-2 text-orange-600" />Dimensions</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <TextInput type="number" name="length" value={formData.length} onChange={handleInputChange} placeholder="Length" min={0} step={0.1} />
            <TextInput type="number" name="width" value={formData.width} onChange={handleInputChange} placeholder="Width" min={0} step={0.1} />
            <TextInput type="number" name="height" value={formData.height} onChange={handleInputChange} placeholder="Height" min={0} step={0.1} />
            <SelectInput id="unit" name="unit" value={formData.unit} onChange={handleInputChange} required>
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </SelectInput>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-[#001F3F]/10">
          <Field label="Expected Pickup Date" id="expectedPickup" required icon={<Calendar className="w-4 h-4" />} error={errors.expectedPickup}>
            <TextInput
              id="expectedPickup"
              type="date"
              name="expectedPickup"
              value={formData.expectedPickup}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </Field>

          <Field label="Expected Delivery Date" id="expectedDelivery" required icon={<Calendar className="w-4 h-4" />} error={errors.expectedDelivery}>
            <TextInput
              id="expectedDelivery"
              type="date"
              name="expectedDelivery"
              value={formData.expectedDelivery}
              onChange={handleInputChange}
              min={formData.expectedPickup || new Date().toISOString().split('T')[0]}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start pt-4 border-t border-[#001F3F]/10">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#001F3F]/90">Body Type <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-4 pt-2">
              <Radio name="bodyType" value="Closed" checked={formData.bodyType === 'Closed'} onChange={handleInputChange} label="Closed" />
              <Radio name="bodyType" value="Open" checked={formData.bodyType === 'Open'} onChange={handleInputChange} label="Open" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#001F3F]/90">Manpower Required <span className="text-rose-500">*</span></label>
            <div className="flex flex-wrap gap-4 pt-2">
              <Radio name="manpower" value="yes" checked={formData.manpower === 'yes'} onChange={handleInputChange} label="Yes" />
              <Radio name="manpower" value="no" checked={formData.manpower === 'no'} onChange={handleInputChange} label="No" />
            </div>
          </div>

          {formData.manpower === 'yes' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#001F3F]/90">Number of Labours <span className="text-rose-500">*</span></label>
              <TextInput
                type="number"
                name="noOfLabours"
                value={formData.noOfLabours}
                onChange={handleInputChange}
                placeholder="Enter number of labours"
                min={1}
                error={errors.noOfLabours}
                required
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-[#001F3F]/10">
          <Field label="Value of Material (₹)" id="materialValue" required icon={<Scale className="w-4 h-4" />} error={errors.materialValue}>
            <TextInput
              id="materialValue"
              type="number"
              name="materialValue"
              value={formData.materialValue}
              onChange={handleInputChange}
              placeholder="Enter material value"
              min={0}
              required
            />
            {formData.materialValue && (
              <p className="text-xs text-gray-500 mt-1">Approx: {formatINR(formData.materialValue)}</p>
            )}
          </Field>

          <Field label="Mode of Transportation" id="transportMode" required icon={<Truck className="w-4 h-4" />}>
            <SelectInput id="transportMode" name="transportMode" value={formData.transportMode} onChange={handleInputChange} required>
              <option value="">Select transport mode</option>
              {transportModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </SelectInput>
          </Field>

          {formData.transportMode === 'Road Transport' && (
            <div className="md:col-span-1">
              <Field label="Truck Size" id="truckSize" error={errors.truckSize} icon={<Truck className="w-4 h-4" />}>
                <SelectInput id="truckSize" name="truckSize" value={formData.truckSize} onChange={handleInputChange}>
                  <option value="">Select truck size</option>
                  {truckSize.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          )}
          {formData.truckSize === 'Small Vehicle' && (
            <div className="md:col-span-1">
              <Field label="Vehicle Type" id="vehicleType" error={errors.vehicleType} icon={<Truck className="w-4 h-4" />}>
                <SelectInput id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleInputChange}>
                  <option value="">Select vehicle type</option>
                  {smallVehicle.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          )}

          {formData.bodyType === 'Closed' && (
            <div className="md:col-span-1">
              <Field label="Vehicle Temperature" id="coolingType" required error={errors.coolingType} icon={<Thermometer className="w-4 h-4" />}>
                <SelectInput id="coolingType" name="coolingType" value={formData.coolingType} onChange={handleInputChange} required>
                  <option value="">Select temperature</option>
                  {coolingType.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          )}
        </div>

        <Field label="Additional Notes" id="additionalNotes" hint="Add any special handling instructions, loading constraints, or timing notes.">
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            className={cx(
              'w-full px-4 py-3 min-h-[120px] rounded-xl border bg-white/80 backdrop-blur-sm shadow-sm outline-none',
              'text-[#001F3F] placeholder:text-[#001F3F]/40', // 35. THEMED
              'border-[#001F3F]/20 focus:border-[#0091D5]/80 focus:ring-2 focus:ring-[#0091D5]/40' // 36. THEMED
            )}
            placeholder="Enter any additional notes"
            rows={4}
          />
        </Field>

        {errors.required && (
          <p className="text-rose-600 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> {errors.required}</p>
        )}

        <div className="pt-4 border-t border-[#001F3F]/10"> {/* 37. THEMED */}
          {/* 38. THEMED: Updated primary button style */}
          <button
            type="submit"
            className={cx(
              'w-full py-3 px-6 rounded-full font-bold text-base transition-all transform',
              'focus:ring-4 focus:ring-[#0091D5]/40',
              isFormValid
                ? 'bg-[#0091D5] text-white hover:opacity-90 hover:scale-[1.01]'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            )}
            disabled={!isFormValid}
          >
            {isFormValid ? (
              <span className="inline-flex items-center justify-center"><ArrowRight className="w-5 h-5 mr-2" /> Preview Request</span>
            ) : (
              'Complete Form to Continue'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default function ShipmentRequestPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(0,145,213,0.05),rgba(227,38,54,0.03))] py-10 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShipmentRequestForm onComplete={(data) => console.log('Created shipment:', data)} />
      </div>
    </div>
  );
}