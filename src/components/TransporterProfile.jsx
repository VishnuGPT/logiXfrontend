import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FileText,
  User, Building, AlertCircle, Save,
  Truck, Plus, Trash2, CheckCircle2, Info, UploadCloud, X, Paperclip,
  Mail, BadgeCheck, Phone, Contact
} from "lucide-react";
import { toast } from "react-hot-toast";
import LoaderOne from "@/components/ui/LoadingScreen";
import axios from "axios";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (matches backend multer limit)
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"];

/** Human-readable labels for document keys in validation messages */
const DOC_LABELS = {
  rcCopy: "RC",
  roadPermit: "Road Permit",
  pollutionCert: "Pollution Certificate",
  aadhar: "Aadhar",
  license: "License",
  photo: "Photo",
};

/** Extract user-friendly message from API error (multer/validation/network) */
function getApiErrorMessage(err, defaultMsg = "Something went wrong") {
  if (!err) return defaultMsg;
  const msg = err.response?.data?.message;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (err.code === "ERR_NETWORK") return "Network error. Please check your connection.";
  if (err.response?.status === 401) return "Session expired. Please sign in again.";
  if (err.response?.status >= 500) return "Server error. Please try again later.";
  return defaultMsg;
}

/* =======================
    SHARED UI HELPERS
======================= */
const cx = (...cn) => cn.filter(Boolean).join(" ");

const Field = ({ label, icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center text-sm font-semibold text-[#001F3F]/90">
      {icon && <span className="mr-2 text-[#0091D5]">{icon}</span>}
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-rose-600 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" /> {error}
      </p>
    )}
  </div>
);

const Input = ({ error, className, ...props }) => (
  <input
    {...props}
    className={cx(
      "w-full px-4 py-2.5 rounded-xl border bg-white shadow-sm outline-none transition-all",
      "text-[#001F3F] placeholder:text-[#001F3F]/40",
      error
        ? "border-rose-400 focus:ring-2 focus:ring-rose-300/40"
        : "border-[#001F3F]/20 focus:border-[#0091D5]/80 focus:ring-2 focus:ring-[#0091D5]/40",
      className
    )}
  />
);

/* =======================
    FILE UPLOAD COMPONENT
======================= */
const FileUploader = ({ label, fileName, onFileSelect, onClear }) => {
  const fileInputRef = useRef(null);

  return (
    <div
      onClick={() => !fileName && fileInputRef.current?.click()}
      className={cx(
        "p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all min-h-[46px]",
        fileName ? "bg-emerald-50 border-emerald-200" : "bg-white hover:bg-slate-50 border-dashed"
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {fileName ? <Paperclip size={14} className="text-emerald-600" /> : <UploadCloud size={16} className="text-[#0091D5]" />}
        <span className={cx("font-semibold truncate", fileName ? "text-emerald-700" : "text-[#001F3F]")}>
          {fileName || label}
        </span>
      </div>
      {fileName && (
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600"
        >
          <X size={14} />
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
};

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  verified: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};
const DRIVER_STATUS_STYLES = {
  verified: "bg-emerald-100 text-emerald-700",
  unverified: "bg-yellow-100 text-yellow-700",
  suspended: "bg-rose-100 text-rose-700",
};

const VehicleCard = ({ vehicle, onDelete, openVehicleDocument }) => {
  const status = vehicle.status || "pending";

  return (
    <div className="bg-white border border-[#001F3F]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#0091D5]/10 text-[#0091D5]">
            <Truck size={20} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#001F3F] leading-tight">
              {vehicle.vehicleName}
            </h3>
            <p className="text-sm text-slate-500">
              {vehicle.vehicleNumber}
            </p>
          </div>
        </div>

        <span
          className={`
            px-3 py-1 rounded-full text-xs font-bold capitalize
            ${STATUS_STYLES[status]}
          `}
        >
          {status}
        </span>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm">
        <div>
          <p className="text-slate-400">Capacity</p>
          <p className="font-semibold text-[#001F3F]">
            {vehicle.capacity || "—"}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Dimension</p>
          <p className="font-semibold text-[#001F3F]">
            {vehicle.dimension || "—"}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Body Type</p>
          <p className="font-semibold capitalize text-[#001F3F]">
            {vehicle.bodyType}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Refrigerated</p>
          <p className="font-semibold text-[#001F3F]">
            {vehicle.isRefrigerated ? "Yes" : "No"}
          </p>
        </div>
        <div>
          <p className="text-slate-400">GPS Status</p>
          <p className="font-semibold text-[#001F3F]">
            {vehicle.hasGps ? "Installed" : "Not Available"}
          </p>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="flex flex-wrap gap-4 mt-5">
        {[
          { label: "RC", type: "rc" },
          { label: "Road Permit", type: "roadPermit" },
          { label: "Pollution", type: "pollution" },
        ].map((doc) => (
          <button
            key={doc.type}
            onClick={() => openVehicleDocument(vehicle.id, doc.type)}
            className="flex items-center gap-2 text-sm font-semibold text-[#0091D5] hover:underline"
          >
            <FileText size={16} />
            {doc.label}
          </button>
        ))}
      </div>

      {/* FOOTER ACTION */}
      <div className="mt-6 pt-4 border-t border-[#001F3F]/10 flex justify-end">
        <button
          onClick={() => onDelete(vehicle.id)}
          className="flex items-center gap-2 text-rose-600 text-sm font-bold hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
        >
          <Trash2 size={16} />
          Remove Vehicle
        </button>
      </div>
    </div>
  );
};
const DriverCard = ({ driver, onDelete, openDriverDocument }) => {
  const status = driver.status || "unverified";

  return (
    <div className="bg-white border border-[#001F3F]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#0091D5]/10 text-[#0091D5]">
            <User size={20} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#001F3F] leading-tight">
              {driver.driverName}
            </h3>
            <p className="text-sm text-slate-500">
              {driver.driverPhoneNumber}
            </p>
          </div>
        </div>

        <span
          className={cx(
            "px-3 py-1 rounded-full text-xs font-bold capitalize",
            DRIVER_STATUS_STYLES[status]
          )}
        >
          {status}
        </span>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5 text-sm">
        <div>
          <p className="text-slate-400">Aadhar</p>
          <p className="font-semibold text-[#001F3F]">
            {driver.driverAadharUpload ? "Uploaded" : "—"}
          </p>
        </div>

        <div>
          <p className="text-slate-400">License</p>
          <p className="font-semibold text-[#001F3F]">
            {driver.driverLicenseUpload ? "Uploaded" : "—"}
          </p>
        </div>

        <div>
          <p className="text-slate-400">Photo</p>
          <p className="font-semibold text-[#001F3F]">
            {driver.driverPhotoUpload ? "Uploaded" : "—"}
          </p>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="flex flex-wrap gap-4 mt-5">
        {driver.driverAadharUpload && (
          <button
            onClick={() => openDriverDocument(driver.id, "aadhar")}
            className="flex items-center gap-2 text-sm font-semibold text-[#0091D5] hover:underline"
          >
            <FileText size={16} />
            Aadhar
          </button>
        )}

        {driver.driverLicenseUpload && (
          <button
            onClick={() => openDriverDocument(driver.id, "license")}
            className="flex items-center gap-2 text-sm font-semibold text-[#0091D5] hover:underline"
          >
            <FileText size={16} />
            License
          </button>
        )}

        {driver.driverPhotoUpload && (
          <button
            onClick={() => openDriverDocument(driver.id, "photo")}
            className="flex items-center gap-2 text-sm font-semibold text-[#0091D5] hover:underline"
          >
            <FileText size={16} />
            Photo
          </button>
        )}
      </div>

      {/* FOOTER ACTION */}
      <div className="mt-6 pt-4 border-t border-[#001F3F]/10 flex justify-end">
        <button
          onClick={() => onDelete(driver.id)}
          className="flex items-center gap-2 text-rose-600 text-sm font-bold hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
        >
          <Trash2 size={16} />
          Remove Driver
        </button>
      </div>
    </div>
  );
};
/* =======================
    MAIN PAGE
======================= */
export default function FleetManager({ user }) {

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Lists
  const [vehicles, setVehicles] = useState([
    { id: 1, vehicleName: "Tata Ace", vehicleNumber: "DL01-AB-1234", capacity: "1.5 Ton", bodyType: "open", status: "verified" }
  ]);
  const [drivers, setDrivers] = useState([]);

  // Form States
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);


  const [newVehicle, setNewVehicle] = useState({ vehicleName: '', dimension: '', vehicleNumber: '', capacity: '', isRefrigerated: false, bodyType: 'open', hasGps: false });
  const [vehicleFiles, setVehicleFiles] = useState({ rcCopy: null, roadPermit: null, pollutionCert: null });

  const [newDriver, setNewDriver] = useState({ name: '', phoneNumber: '' });
  const [driverFiles, setDriverFiles] = useState({ aadhar: null, license: null, photo: null });
  const [documentData, setDocumentData] = useState({});

  const [newDocument, setNewDocument] = useState({});
  // Add this inside FleetManager component
  const validateFiles = (filesObject, requiredKeys = []) => {
    // 1. Check for missing required files
    for (const key of requiredKeys) {
      if (!filesObject[key]) {
        const label = DOC_LABELS[key] || key;
        return `Please upload the required document: ${label}.`;
      }
    }

    // 2. Check size and type for all selected files
    for (const key in filesObject) {
      const file = filesObject[key];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          return `File "${file.name}" is too large (max 5 MB per file).`;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          return `File "${file.name}" has an invalid format. Only PDF, PNG, and JPG are allowed.`;
        }
      }
    }
    return null;
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/document/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("DOCUMENT DATA FROM API:", res.data);

      setDocumentData(res.data);
    } catch (err) {
      console.error("Fetch documents error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Failed to load documents"));
    }
  };
  useEffect(() => {
    if (activeTab === "document") {
      fetchDocuments();
    }
  }, [activeTab]);

  const handleSubmitAllDocuments = async () => {
    const entries = Object.entries(newDocument).filter(([_, file]) => file instanceof File);
    if (entries.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    const fileError = validateFiles(newDocument);
    if (fileError) {
      toast.error(fileError);
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        entries.map(async ([key, file]) => {
          const formData = new FormData();
          formData.append("file", file);
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/document/add-${key}`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
      toast.success("Documents submitted successfully");
      setNewDocument({});
      await fetchDocuments();
    } catch (err) {
      console.error("Document upload error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Failed to upload documents. Check file types (PDF/PNG/JPG) and size (max 5 MB)."));
    } finally {
      setIsSubmitting(false);
    }
  };
  const fetchVehicleData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vehicle/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehicles(res.data.vehicles ?? []);
    } catch (err) {
      console.error("Fetch vehicles error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Failed to load vehicles"));
    }
  };
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          fetchDrivers(),
          fetchDocuments(),
          fetchCoverage(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);


  const openVehicleDocument = async (vehicleId, type) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vehicle/${vehicleId}/document/${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.url) window.open(res.data.url, '_blank');
      else toast.error("Document URL not available");
    } catch (err) {
      console.error("Open vehicle document error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Unable to open document"));
    }
  };

  const openDriverDocument = async (driverId, type) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/driver/${driverId}/document/${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.url) window.open(res.data.url, '_blank');
      else toast.error("Document URL not available");
    } catch (err) {
      console.error("Open driver document error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Unable to open document"));
    }
  };

  const openDocument = async (key) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/document/${key}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.url) window.open(res.data.url, "_blank");
      else toast.error("Document URL not available");
    } catch (err) {
      console.error("Open document error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Unable to open document"));
    }
  };

  const SERVICES = [
    { key: "FTL", label: "Full Truck Load" },
    { key: "PTL", label: "Part Truck Load" },
    { key: "PACKERS", label: "Packers & Movers" },
    { key: "COURIER", label: "Courier Services" },
  ];
  const toggleService = (serviceKey) => {
    setServicesOffered((prev) =>
      prev.includes(serviceKey)
        ? prev.filter((s) => s !== serviceKey)
        : [...prev, serviceKey]
    );
  };


  const [servicesOffered, setServicesOffered] = useState([]);



  const [coverage, setCoverage] = useState({
    pickup: { panIndia: false, locations: [] },
    drop: { panIndia: false, locations: [] },
  });
  useEffect(() => {
    if (activeTab === "coverage") {
      fetchCoverage();
    }
  }, [activeTab]);



  const STATES = [
    // States
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",

    // Union Territories
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];
  const togglePanIndia = (type) => {
    setCoverage((prev) => ({
      ...prev,
      [type]: {
        panIndia: !prev[type].panIndia,
        locations: [], // IMPORTANT: clear states
      },
    }));
  };
  const toggleLocation = (type, state) => {
    setCoverage((prev) => {
      const exists = prev[type].locations.includes(state);

      const updatedLocations = exists
        ? prev[type].locations.filter((s) => s !== state)
        : [...prev[type].locations, state];

      return {
        ...prev,
        [type]: {
          panIndia: false, // IMPORTANT: auto-disable PAN India
          locations: updatedLocations,
        },
      };
    });
  };
  const fetchCoverage = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/coverage`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setServicesOffered(res.data.servicesOffered || []);
      setCoverage({
        pickup: res.data.pickup,
        drop: res.data.drop,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load coverage");
    }
  };

  const saveCoverage = async () => {
    if (servicesOffered.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coverage`,
        {
          servicesOffered,
          pickup: coverage.pickup,
          drop: coverage.drop,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Coverage saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save coverage");
    }
  };





  const handleAddVehicle = async () => {
    const token = localStorage.getItem('token');
    if (
      !newVehicle.vehicleName ||
      !newVehicle.vehicleNumber ||
      !newVehicle.capacity ||
      !newVehicle.dimension ||
      !newVehicle.bodyType
    ) {
      toast.error('Please fill all vehicle details.');
      return;
    }
    // Require all vehicle documents (RC, Road Permit, Pollution Certificate)
    if (!vehicleFiles.rcCopy || !vehicleFiles.roadPermit || !vehicleFiles.pollutionCert) {
      toast.error('All vehicle documents are required: RC, Road Permit, and Pollution Certificate.');
      return;
    }
    const fileError = validateFiles(vehicleFiles, ['rcCopy', 'roadPermit', 'pollutionCert']);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append('vehicleName', newVehicle.vehicleName);
      formData.append('vehicleNumber', newVehicle.vehicleNumber);
      formData.append('capacity', newVehicle.capacity);
      formData.append('dimension', newVehicle.dimension);
      formData.append('isRefrigerated', newVehicle.isRefrigerated);
      formData.append('hasGps', newVehicle.hasGps);
      formData.append('bodyType', newVehicle.bodyType);

      formData.append('rc', vehicleFiles.rcCopy);
      formData.append('roadPermit', vehicleFiles.roadPermit);
      formData.append('pollution', vehicleFiles.pollutionCert);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vehicle/add`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchVehicleData();
      toast.success('Vehicle added for verification');
      setShowAddVehicle(false);

      setNewVehicle({
        vehicleName: '',
        vehicleNumber: '',
        capacity: '',
        dimension: '',
        isRefrigerated: false,
        hasGps: false,
        bodyType: 'open',
      });
      setVehicleFiles({ rcCopy: null, roadPermit: null, pollutionCert: null });
    } catch (err) {
      console.error("Vehicle add error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Failed to add vehicle. Check file types (PDF/PNG/JPG) and size (max 5 MB)."));
    } finally {
      setIsSubmitting(false);
    }
  };
  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/driver/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDrivers(res.data.drivers ?? []);
    } catch (err) {
      console.error("Fetch drivers error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Failed to load drivers"));
    }
  };
  useEffect(() => {
    fetchDrivers();
  }, []);
  useEffect(() => {
    if (activeTab == 'fleet') {
      fetchVehicleData();
    }
  }, [activeTab])
  const handleAddDriver = async () => {
    if (!newDriver.name?.trim() || !newDriver.phoneNumber?.trim()) {
      toast.error("Driver name and phone number are required.");
      return;
    }
    // Require all driver documents (Aadhar, License, Photo)
    if (!driverFiles.aadhar || !driverFiles.license || !driverFiles.photo) {
      toast.error("All driver documents are required: Aadhar, License, and Photo.");
      return;
    }
    const fileError = validateFiles(driverFiles, ['aadhar', 'license', 'photo']);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("driverName", newDriver.name.trim());
      formData.append("driverPhoneNumber", newDriver.phoneNumber.trim());
      formData.append("aadhar", driverFiles.aadhar);
      formData.append("license", driverFiles.license);
      formData.append("photo", driverFiles.photo);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/driver/add`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Driver added successfully");
      setNewDriver({ name: "", phoneNumber: "" });
      setDriverFiles({ aadhar: null, license: null, photo: null });
      setShowAddDriver(false);
      fetchDrivers();
    } catch (err) {
      console.error("Driver add error:", err?.response?.data || err);
      toast.error(getApiErrorMessage(err, "Failed to add driver. Check file types (PDF/PNG/JPG) and size (max 5 MB)."));
    } finally {
      setIsSubmitting(false);
    }
  };
  const FIELD_CONFIG = [
    {
      label: "CIN Number",
      name: "cinNumber",
      icon: <BadgeCheck size={16} />,
      route: "/add-cin-number",
      allowMultiple: false,
      buttonText: "Add",
    },
    {
      label: "Owner Name",
      name: "ownerName",
      icon: <BadgeCheck size={16} />,
      route: "/add-owner-name",
      allowMultiple: true,
      buttonText: "Update",
    },
    {
      label: "Owner Phone Number",
      name: "ownerPhoneNumber",
      icon: <Phone size={16} />,
      route: "/add-owner-phone",
      allowMultiple: false,
      buttonText: "Add",
    },
    {
      label: "Customer Care Number",
      name: "customerServiceNumber",
      icon: <BadgeCheck size={16} />,
      route: "/update-customer-service-number",
      allowMultiple: true,
      buttonText: "Update",
    },
  ];
  const [formValues, setFormValues] = useState({});
  const [loadingField, setLoadingField] = useState(null);

  const handleChange = (name, value) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmitField = async (field) => {
    try {
      setLoadingField(field.name);
      console.log(formValues[field.name]);

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/transporter${field.route}`,
        { [field.name]: formValues[field.name] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `${field.label} ${field.allowMultiple ? "updated" : "added"} successfully`
      );


    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingField(null);
    }
  };

  if (loading) return <LoaderOne />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Navigation Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 w-fit mx-auto sm:mx-0">
        <button onClick={() => setActiveTab("profile")} className={cx("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'profile' ? "bg-white text-[#0091D5] shadow-sm" : "text-slate-500")}>Company Profile</button>
        <button onClick={() => setActiveTab("document")} className={cx("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'document' ? "bg-white text-[#0091D5] shadow-sm" : "text-slate-500")}>Documents</button>
        <button onClick={() => setActiveTab("fleet")} className={cx("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'fleet' ? "bg-white text-[#0091D5] shadow-sm" : "text-slate-500")}>My Fleet ({vehicles.length})</button>
        <button onClick={() => setActiveTab("driver")} className={cx("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'driver' ? "bg-white text-[#0091D5] shadow-sm" : "text-slate-500")}>My Drivers ({drivers.length})</button>
        <button onClick={() => setActiveTab("coverage")} className={cx("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'coverage' ? "bg-white text-[#0091D5] shadow-sm" : "text-slate-500")}>My Coverage</button>

      </div>
      {user.profileStatus == "pending" && (<div className="text-2xl text-red-400">Complete Your Profile</div>)}
      <AnimatePresence mode="wait">
        {activeTab === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-[#001F3F]/10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Company Name" icon={<Building size={16} />}><Input className="placeholder:text-black placeholder:font-medium" placeholder={user.companyName} disabled /></Field>
              <Field label="Email" icon={<Mail size={16} />}><Input className="placeholder:text-black placeholder:font-medium" placeholder={user.email} disabled /></Field>
              <Field label="Company Address" icon={<Building size={16} />}><Input className="placeholder:text-black placeholder:font-medium" placeholder={user.companyAddress} disabled /></Field>
              <Field label="GST Number" icon={<AlertCircle size={16} />}><Input className="placeholder:text-black placeholder:font-medium" placeholder={user.gstNumber} disabled /></Field>
              <Field label="Phone Number" icon={<User size={16} />}><Input className="placeholder:text-black placeholder:font-medium" placeholder={user.phoneNumber} disabled /></Field>
              <Field label="Profile Status" icon={<AlertCircle size={16} />}><Input className="placeholder:text-black placeholder:font-medium" placeholder={user.status} disabled /></Field>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#001F3F]/5">
              <h3 className="text-lg font-bold text-[#001F3F]">Additional Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {FIELD_CONFIG.map((field, idx) => {
                  const alreadyExists = Boolean(user[field.name]);
                  const canShowButton = field.allowMultiple || !alreadyExists;

                  return (
                    <React.Fragment key={idx}>
                      <div className="md:col-span-9">
                        <Field label={field.label} icon={field.icon}>
                          <Input
                            className="placeholder:text-black placeholder:font-medium"
                            placeholder={
                              user[field.name] ??
                              `Enter ${field.label}`
                            }
                            value={formValues[field.name] ?? ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            disabled={!field.allowMultiple && alreadyExists}
                          />
                        </Field>
                      </div>

                      {canShowButton && (
                        <div className="md:col-span-3">
                          <button
                            onClick={() => handleSubmitField(field)}
                            disabled={loadingField === field.name}
                            className="w-full bg-[#0091D5] hover:bg-[#007bb5] text-white h-[46px] rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-60"
                          >
                            <Save size={18} />
                            {loadingField === field.name ? "Saving..." : field.buttonText}
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "fleet" && (
          <motion.div key="fleet" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#001F3F]/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#001F3F]">Registered Vehicles</h2>
                <button onClick={() => setShowAddVehicle(!showAddVehicle)} className="flex items-center gap-2 bg-[#0091D5] text-white px-4 py-2 rounded-full text-sm font-bold">
                  {showAddVehicle ? <X size={18} /> : <Plus size={18} />} {showAddVehicle ? "Cancel" : "Add Vehicle"}
                </button>
              </div>

              {showAddVehicle && (
                <div className="mb-8 p-6 border-2 border-dashed border-[#0091D5]/30 rounded-2xl bg-[#0091D5]/5">
                  {/* Headline: Vehicle Details */}
                  <div className="flex items-center gap-2 mb-6 border-b border-[#0091D5]/10 pb-2">
                    <div className="p-1.5 bg-[#0091D5] text-white rounded-lg"><Truck size={16} /></div>
                    <h3 className="text-lg font-bold text-[#001F3F]">Vehicle Specifications</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Vehicle Name *"><Input placeholder="e.g. Ashok Leyland Dost" value={newVehicle.vehicleName} onChange={e => setNewVehicle({ ...newVehicle, vehicleName: e.target.value })} /></Field>
                    <Field label="Vehicle Number *"><Input placeholder="MH 12 AB 1234" value={newVehicle.vehicleNumber} onChange={e => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })} /></Field>
                    <Field label="Capacity"><Input placeholder="e.g. 3.5 Tons" value={newVehicle.capacity} onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })} /></Field>
                    <Field label="Body Type">
                      <select className="w-full px-4 py-2.5 rounded-xl border border-[#001F3F]/20 bg-white" value={newVehicle.bodyType} onChange={e => setNewVehicle({ ...newVehicle, bodyType: e.target.value })}>
                        <option value="open">Open Body</option>
                        <option value="closed">Closed Container</option>
                      </select>
                    </Field>
                    <Field label="Dimension *">
                      <Input
                        placeholder="e.g. 7 x 5 x 5 ft"
                        value={newVehicle.dimension || ''}
                        onChange={(e) =>
                          setNewVehicle({ ...newVehicle, dimension: e.target.value })
                        }
                      />
                    </Field>


                    <div className="flex items-center pt-8">
                      <label className="flex items-center cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 accent-[#0091D5]" checked={newVehicle.isRefrigerated} onChange={e => setNewVehicle({ ...newVehicle, isRefrigerated: e.target.checked })} />
                        <span className="ml-2 text-sm font-semibold text-[#001F3F]">Refrigerated?</span>
                      </label>
                      {/* NEW GPS FIELD */}
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#0091D5]"
                          checked={newVehicle.hasGps}
                          onChange={e => setNewVehicle({ ...newVehicle, hasGps: e.target.checked })}
                        />
                        <span className="ml-2 text-sm font-semibold text-[#001F3F]">GPS Installed?</span>
                      </label>
                    </div>
                    {/* Headline: Documents */}
                    <div className="flex items-center gap-2 mt-8 mb-6 border-b border-[#0091D5]/10 pb-2">
                      <div className="p-1.5 bg-[#0091D5] text-white rounded-lg"><UploadCloud size={16} /></div>
                      <h3 className="text-lg font-bold text-[#001F3F]">Vehicle Documents</h3>
                      <span className="text-xs font-normal text-slate-500 ml-auto">Max 2MB per file</span>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FileUploader label="RC Copy *" fileName={vehicleFiles.rcCopy?.name} onFileSelect={(f) => setVehicleFiles(p => ({ ...p, rcCopy: f }))} onClear={() => setVehicleFiles(p => ({ ...p, rcCopy: null }))} />
                      <FileUploader label="Road Permit" fileName={vehicleFiles.roadPermit?.name} onFileSelect={(f) => setVehicleFiles(p => ({ ...p, roadPermit: f }))} onClear={() => setVehicleFiles(p => ({ ...p, roadPermit: null }))} />
                      <FileUploader label="Pollution Cert." fileName={vehicleFiles.pollutionCert?.name} onFileSelect={(f) => setVehicleFiles(p => ({ ...p, pollutionCert: f }))} onClear={() => setVehicleFiles(p => ({ ...p, pollutionCert: null }))} />
                    </div>                    <button onClick={handleAddVehicle} disabled={isSubmitting} className="md:col-span-3 mt-4 w-full bg-[#001F3F] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Save size={18} /> {isSubmitting ? "Processing..." : "Register Vehicle"}
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {vehicles.length === 0 ? <p className="text-center py-6 text-slate-400">No vehicles added</p> : vehicles.map(v => <VehicleCard openVehicleDocument={openVehicleDocument} key={v.id} vehicle={v} onDelete={(id) => setVehicles(vehicles.filter(x => x.id !== id))} />)}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "driver" && (
          <motion.div key="driver" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#001F3F]/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#001F3F]">Manage Drivers</h2>
                <button onClick={() => setShowAddDriver(!showAddDriver)} className="flex items-center gap-2 bg-[#0091D5] text-white px-4 py-2 rounded-full text-sm font-bold">
                  {showAddDriver ? <X size={18} /> : <Plus size={18} />} {showAddDriver ? "Cancel" : "Add Driver"}
                </button>
              </div>

              {showAddDriver && (
                <div className="mb-8 p-6 border-2 border-dashed border-[#0091D5]/30 rounded-2xl bg-[#0091D5]/5">
                  <div className="flex items-center gap-2 mb-6 border-b border-[#0091D5]/10 pb-2">
                    <div className="p-1.5 bg-[#0091D5] text-white rounded-lg"><User size={16} /></div>
                    <h3 className="text-lg font-bold text-[#001F3F]">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Field label="Driver Name *">
                        <Input
                          value={newDriver.name}
                          onChange={(e) =>
                            setNewDriver((p) => ({ ...p, name: e.target.value }))
                          }
                        />
                      </Field>

                      <Field label="Driver Phone Number *">
                        <Input
                          value={newDriver.phoneNumber}
                          onChange={(e) =>
                            setNewDriver((p) => ({ ...p, phoneNumber: e.target.value }))
                          }
                        />
                      </Field>
                    </div>
                    <div className="flex items-center gap-2 mt-8 mb-6 border-b border-[#0091D5]/10 pb-2">
                      <div className="p-1.5 bg-[#0091D5] text-white rounded-lg"><UploadCloud size={16} /></div>
                      <h3 className="text-lg font-bold text-[#001F3F]">Verification Documents</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="Driver Aadhar *"><FileUploader label="Upload Aadhar" fileName={driverFiles.aadhar?.name} onFileSelect={(f) => setDriverFiles(p => ({ ...p, aadhar: f }))} onClear={() => setDriverFiles(p => ({ ...p, aadhar: null }))} /></Field>
                      <Field label="Driver Licence *"><FileUploader label="Upload Licence" fileName={driverFiles.license?.name} onFileSelect={(f) => setDriverFiles(p => ({ ...p, license: f }))} onClear={() => setDriverFiles(p => ({ ...p, license: null }))} /></Field>
                      <Field label="Driver Photo *"><FileUploader label="Upload Photo" fileName={driverFiles.photo?.name} onFileSelect={(f) => setDriverFiles(p => ({ ...p, photo: f }))} onClear={() => setDriverFiles(p => ({ ...p, photo: null }))} /></Field>
                    </div>
                    <button onClick={handleAddDriver} disabled={isSubmitting} className="md:col-span-2 mt-4 w-full bg-[#001F3F] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Save size={18} /> {isSubmitting ? "Saving..." : "Save Driver"}
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {drivers.length === 0 ? <p className="text-center py-12 text-slate-400">No drivers added yet.</p> : drivers.map(d => <DriverCard key={d.id} driver={d} openDriverDocument={openDriverDocument} onDelete={(id) => setDrivers(drivers.filter(x => x.id !== id))} />)}
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === "document" && (
          <motion.div
            key="document"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* NEW ALERT LINE */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-600 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Verification Requirement</h4>
                <p className="text-xs text-amber-700">
                  To verify your account as a transporter, you must upload PAN Card, Owner Aadhar, GST Certificate and <strong>either</strong> your Bank Passbook <strong>or</strong> a Cancelled Check.
                </p>
              </div>
            </div>
            {Object.entries(documentData).map(([key, value]) => {
              const isVerified = value.isVerified === "true";
              const isPending = value.isSubmitted && value.isVerified === "false";
              const isRejected = value.isVerified === "rejected";
              const isNeverUploaded = !value.isSubmitted && value.isVerified === "false";

              const canUpload = !value.isSubmitted || isRejected;

              return (
                <div
                  key={key}
                  className={cx(
                    "rounded-2xl border p-5 bg-white shadow-sm",
                    isVerified && "border-emerald-200",
                    isPending && "border-yellow-200",
                    isRejected && "border-rose-200",
                    isNeverUploaded && "border-slate-200"
                  )}
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-[#001F3F]">
                      {value.name}
                    </h3>

                    {/* STATUS BADGES */}
                    {isVerified && (
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                        Verified
                      </span>
                    )}

                    {isPending && (
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}

                    {isRejected && (
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
                        Rejected
                      </span>
                    )}
                  </div>

                  {/* BODY MESSAGE */}
                  <div className="mt-3 text-sm text-slate-600">
                    {isVerified && (
                      "Your document has been verified successfully."
                    )}

                    {isPending && (
                      "Your document is under review by our verification team."
                    )}

                    {isRejected && (
                      <p className="text-rose-600 font-medium">
                        Reason: {value.description}
                      </p>
                    )}

                    {isNeverUploaded && (
                      <span className="text-slate-500">
                        Document not uploaded yet.
                      </span>
                    )}
                  </div>

                  {/* VIEW DOCUMENT */}
                  {value.isSubmitted && value.isVerified !== "rejected" && (
                    <button
                      onClick={() => openDocument(key)}
                      className="mt-3 text-sm font-semibold text-[#0091D5] hover:underline flex items-center gap-2"
                    >
                      <FileText size={14} />
                      View Document
                    </button>
                  )}


                  {/* UPLOAD */}
                  {canUpload && (
                    <div className="mt-4 max-w-sm">
                      <FileUploader
                        label={
                          isRejected
                            ? "Upload corrected document"
                            : `Upload ${value.name}`
                        }
                        fileName={newDocument[key]?.name}
                        onFileSelect={(file) =>
                          setNewDocument((prev) => ({
                            ...prev,
                            [key]: file,
                          }))
                        }
                        onClear={() =>
                          setNewDocument((prev) => ({
                            ...prev,
                            [key]: null,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                onClick={handleSubmitAllDocuments}
                disabled={isSubmitting}
                className="bg-[#001F3F] text-white px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit All Documents"}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "coverage" && (
          <motion.div
            key="coverage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* SERVICES OFFERED */}
            <div className="bg-white rounded-3xl p-6 border border-[#001F3F]/10 shadow-sm">
              <h3 className="text-lg font-bold text-[#001F3F] mb-4">
                Services You Offer
              </h3>

              <div className="flex flex-wrap gap-3">
                {SERVICES.map((service) => {
                  const active = servicesOffered.includes(service.key);

                  return (
                    <button
                      key={service.key}
                      onClick={() => toggleService(service.key)}
                      className={cx(
                        "px-5 py-2 rounded-xl text-sm font-semibold border transition-all",
                        active
                          ? "bg-[#0091D5] text-white border-[#0091D5]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#0091D5]/40"
                      )}
                    >
                      {service.label}
                    </button>
                  );
                })}
              </div>

              {servicesOffered.length === 0 && (
                <p className="text-xs text-rose-500 mt-3 font-medium">
                  Please select at least one service
                </p>
              )}
            </div>

            {/* PICKUP COVERAGE */}
            <div className="bg-white rounded-3xl p-6 border border-[#001F3F]/10 shadow-sm">
              <h3 className="text-lg font-bold text-[#001F3F] mb-4">
                Pickup Coverage
              </h3>

              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coverage.pickup.panIndia}
                  onChange={() => togglePanIndia("pickup")}
                  className="w-5 h-5 accent-[#0091D5]"
                />
                <span className="font-semibold text-[#001F3F]">
                  PAN India
                </span>
              </label>

              <div
                className={cx(
                  "flex flex-wrap gap-2 transition-opacity",
                  coverage.pickup.panIndia && "opacity-40 pointer-events-none"
                )}
              >
                {STATES.map((state) => {
                  const active = coverage.pickup.locations.includes(state);

                  return (
                    <button
                      key={state}
                      onClick={() => toggleLocation("pickup", state)}
                      className={cx(
                        "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                        active
                          ? "bg-[#0091D5] text-white border-[#0091D5]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#0091D5]/40"
                      )}
                    >
                      {state}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DROP COVERAGE */}
            <div className="bg-white rounded-3xl p-6 border border-[#001F3F]/10 shadow-sm">
              <h3 className="text-lg font-bold text-[#001F3F] mb-4">
                Drop Coverage
              </h3>

              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coverage.drop.panIndia}
                  onChange={() => togglePanIndia("drop")}
                  className="w-5 h-5 accent-[#0091D5]"
                />
                <span className="font-semibold text-[#001F3F]">
                  PAN India
                </span>
              </label>

              <div
                className={cx(
                  "flex flex-wrap gap-2 transition-opacity",
                  coverage.drop.panIndia && "opacity-40 pointer-events-none"
                )}
              >
                {STATES.map((state) => {
                  const active = coverage.drop.locations.includes(state);

                  return (
                    <button
                      key={state}
                      onClick={() => toggleLocation("drop", state)}
                      className={cx(
                        "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                        active
                          ? "bg-[#0091D5] text-white border-[#0091D5]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#0091D5]/40"
                      )}
                    >
                      {state}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SAVE */}
            <div className="flex justify-end">
              <button
                onClick={saveCoverage}
                className="bg-[#001F3F] hover:bg-[#00172e] text-white px-8 py-3 rounded-xl font-bold shadow-sm active:scale-[0.98]"
              >
                Save Coverage
              </button>
            </div>
          </motion.div>
        )}


      </AnimatePresence>
    </div>
  );
}