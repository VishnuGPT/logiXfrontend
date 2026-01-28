import React, { useEffect, useState } from "react";
import { User, Phone, Building2, FileText, Image, CreditCard, Calendar } from "lucide-react";

// Dummy data for demonstration
const DUMMY_DRIVERS = [
  {
    id: 2001,
    driverName: "Suresh Yadav",
    driverAadharUpload: "/uploads/aadhar_2001.pdf",
    driverLicenseUpload: "/uploads/license_2001.pdf",
    driverPhoneNumber: "+91 98765 12345",
    transporterId: 1001,
    driverPhotoUpload: "/uploads/photo_2001.jpg",
    transporterName: "Swift Logistics Pvt Ltd",
    createdAt: "2024-06-15T10:30:00Z"
  },
  {
    id: 2002,
    driverName: "Vikram Singh",
    driverAadharUpload: "/uploads/aadhar_2002.pdf",
    driverLicenseUpload: "/uploads/license_2002.pdf",
    driverPhoneNumber: "+91 87654 23456",
    transporterId: 1002,
    driverPhotoUpload: "/uploads/photo_2002.jpg",
    transporterName: "Express Transport Solutions",
    createdAt: "2024-07-22T14:15:00Z"
  },
  {
    id: 2003,
    driverName: "Ramesh Kumar",
    driverAadharUpload: "/uploads/aadhar_2003.pdf",
    driverLicenseUpload: "/uploads/license_2003.pdf",
    driverPhoneNumber: "+91 76543 34567",
    transporterId: 1001,
    driverPhotoUpload: "/uploads/photo_2003.jpg",
    transporterName: "Swift Logistics Pvt Ltd",
    createdAt: "2024-08-10T09:45:00Z"
  },
  {
    id: 2004,
    driverName: "Ajay Sharma",
    driverAadharUpload: "/uploads/aadhar_2004.pdf",
    driverLicenseUpload: "/uploads/license_2004.pdf",
    driverPhoneNumber: "+91 65432 45678",
    transporterId: 1003,
    driverPhotoUpload: "/uploads/photo_2004.jpg",
    transporterName: "FastMove Cargo Services",
    createdAt: "2024-09-05T16:20:00Z"
  },
  {
    id: 2005,
    driverName: "Manoj Verma",
    driverAadharUpload: "/uploads/aadhar_2005.pdf",
    driverLicenseUpload: "/uploads/license_2005.pdf",
    driverPhoneNumber: "+91 54321 56789",
    transporterId: 1006,
    driverPhotoUpload: "/uploads/photo_2005.jpg",
    transporterName: "Prime Movers India Ltd",
    createdAt: "2024-10-18T11:30:00Z"
  },
  {
    id: 2006,
    driverName: "Rahul Patel",
    driverAadharUpload: "/uploads/aadhar_2006.pdf",
    driverLicenseUpload: "/uploads/license_2006.pdf",
    driverPhoneNumber: "+91 43210 67890",
    transporterId: 1002,
    driverPhotoUpload: "/uploads/photo_2006.jpg",
    transporterName: "Express Transport Solutions",
    createdAt: "2024-11-25T13:45:00Z"
  },
  {
    id: 2007,
    driverName: "Deepak Rao",
    driverAadharUpload: "/uploads/aadhar_2007.pdf",
    driverLicenseUpload: "/uploads/license_2007.pdf",
    driverPhoneNumber: "+91 32109 78901",
    transporterId: 1004,
    driverPhotoUpload: "/uploads/photo_2007.jpg",
    transporterName: "Northern Freight Carriers",
    createdAt: "2024-12-12T08:15:00Z"
  },
  {
    id: 2008,
    driverName: "Sanjay Gupta",
    driverAadharUpload: "/uploads/aadhar_2008.pdf",
    driverLicenseUpload: "/uploads/license_2008.pdf",
    driverPhoneNumber: "+91 21098 89012",
    transporterId: 1001,
    driverPhotoUpload: "/uploads/photo_2008.jpg",
    transporterName: "Swift Logistics Pvt Ltd",
    createdAt: "2025-01-03T15:30:00Z"
  }
];

const InfoRow = ({ icon: Icon, label, value, className = "" }) => {
  if (!value) return null;

  return (
    <div className={`flex items-start gap-2 text-sm ${className}`}>
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-gray-500 text-xs block">{label}</span>
        <span className="text-gray-900 font-medium break-words">{value}</span>
      </div>
    </div>
  );
};

const DocumentLink = ({ icon: Icon, label, url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium group"
    >
      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>{label}</span>
      <span className="ml-auto text-xs">↗</span>
    </a>
  );
};

const DriverCard = ({ driver, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header with Photo */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 border-b border-gray-200">
        <div className="flex gap-4 items-start">
          {/* Driver Photo */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-gray-200">
            {!imageError ? (
              <img
                src={driver.driverPhotoUpload}
                alt={driver.driverName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl font-bold">
                {driver.driverName.charAt(0)}
              </div>
            )}
          </div>

          {/* Driver Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              {driver.driverName}
            </h3>
            <p className="text-xs text-gray-500 font-mono mb-2">Driver ID: {driver.id}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
              <Building2 className="w-3 h-3" />
              {driver.transporterName}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <div className="space-y-3 mb-4">
          <InfoRow icon={Phone} label="Phone Number" value={driver.driverPhoneNumber} />
          <InfoRow
            icon={Building2}
            label="Transporter ID"
            value={`#${driver.transporterId}`}
          />
          {driver.createdAt && (
            <InfoRow
              icon={Calendar}
              label="Registered On"
              value={new Date(driver.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            />
          )}
        </div>

        {/* Documents Section */}
        <div className="border-t border-gray-100 pt-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <DocumentLink
              icon={CreditCard}
              label="Aadhar Card"
              url={driver.driverAadharUpload}
            />
            <DocumentLink
              icon={FileText}
              label="License"
              url={driver.driverLicenseUpload}
            />
            <DocumentLink
              icon={Image}
              label="Photo"
              url={driver.driverPhotoUpload}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(driver)}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
};

const DriverModal = ({ driver, onClose }) => {
  if (!driver) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{driver.driverName}</h2>
              <p className="text-purple-100 text-sm">Driver ID: {driver.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Photo */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
              {driver.driverName.charAt(0)}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
              <p className="font-semibold text-gray-900">{driver.driverPhoneNumber}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-gray-500 block mb-1">Transporter</label>
              <p className="font-semibold text-gray-900">{driver.transporterName}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-gray-500 block mb-1">Driver ID</label>
              <p className="font-semibold text-gray-900">#{driver.id}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-gray-500 block mb-1">Transporter ID</label>
              <p className="font-semibold text-gray-900">#{driver.transporterId}</p>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Documents
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <DocumentLink
                icon={CreditCard}
                label="Aadhar Card"
                url={driver.driverAadharUpload}
              />
              <DocumentLink
                icon={FileText}
                label="Driving License"
                url={driver.driverLicenseUpload}
              />
              <DocumentLink
                icon={Image}
                label="Driver Photo"
                url={driver.driverPhotoUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState(DUMMY_DRIVERS);

  const [loading, setLoading] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDrivers = async () => {


    setLoading(true);
    try {
      const token = localStorage.getItem("token");


      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/get-drivers`,
        {
          headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await res.json();
      setDrivers(data?.data?.length ? data.data : DUMMY_DRIVERS);

    } catch (error) {
      console.error("Error fetching drivers:", error);
      setDrivers(DUMMY_DRIVERS);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Management</h1>
              <p className="text-gray-500">Manage and monitor all registered drivers</p>
            </div>

          </div>
        </div>





        {/* Driver Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading drivers...</p>
          </div>
        ) : drivers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No drivers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((d) => (
              <DriverCard
                key={d.id}
                driver={d}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedDriver && (
          <DriverModal
            driver={selectedDriver}
            onClose={() => setSelectedDriver(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDrivers;