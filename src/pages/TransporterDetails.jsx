import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TransporterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transporter, setTransporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransporter = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get-transporter/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransporter(res.data?.data);
      } catch (err) {
        setError("Failed to load transporter details");
      } finally {
        setLoading(false);
      }
    };
    fetchTransporter();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transporter details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      verified: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      unverified: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getVerificationColor = (status) => {
    if (status === "true" || status === true) return "bg-green-100 text-green-800";
    if (status === "false" || status === false) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getVerificationText = (status) => {
    if (status === "true" || status === true) return "Verified";
    if (status === "false" || status === false) return "Not Verified";
    return "Pending";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Transporter Details</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Company Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{transporter.companyName}</h2>
                <p className="text-blue-100">{transporter.designation}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(transporter.profileStatus)}`}>
                  {transporter.profileStatus}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(transporter.status)}`}>
                  {transporter.status}
                </span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6">
            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Owner Name" value={transporter.ownerName || "N/A"} />
                <InfoItem label="Email" value={transporter.email} />
                <InfoItem label="Phone Number" value={transporter.phoneNumber} />
                <InfoItem label="Owner Phone" value={transporter.ownerPhoneNumber || "N/A"} />
                <InfoItem label="Customer Care" value={transporter.customerServiceNumber || "N/A"} />
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* Business Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="GST Number" value={transporter.gstNumber} />
                <InfoItem label="CIN Number" value={transporter.cinNumber || "N/A"} />
              </div>
              <div className="mt-4">
                <InfoItem label="Company Address" value={transporter.companyAddress} fullWidth />
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="Profile Status"
                  value={
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(transporter.profileStatus)}`}>
                      {transporter.profileStatus}
                    </span>
                  }
                />
                <InfoItem
                  label="Verification Status"
                  value={
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(transporter.status)}`}>
                      {transporter.status}
                    </span>
                  }
                />
                <InfoItem
                  label="Created At"
                  value={new Date(transporter.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        {transporter.Document && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documents
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(transporter.Document).map(([key, doc]) => {
                  if (key === 'id' || key === 'transporterId' || key === 'createdAt' || key === 'updatedAt') return null;
                  if (typeof doc !== 'object') return null;

                  return (
                    <DocumentCard key={key} document={doc} />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Drivers Section */}
        {transporter.Drivers && transporter.Drivers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Drivers ({transporter.Drivers.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transporter.Drivers.map((driver) => (
                  <DriverCard
                    key={driver.id}
                    driver={driver}
                    onClick={() => navigate(`/driver/${driver.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Section */}
        {transporter.Vehicles && transporter.Vehicles.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Vehicles ({transporter.Vehicles.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transporter.Vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Vehicles (0)
              </h3>
            </div>
            <div className="p-6 text-center text-gray-500">
              <p>No vehicles registered yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-full" : ""}>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-base text-gray-900 font-medium">
      {typeof value === 'string' ? value : value}
    </p>
  </div>
);

const DocumentCard = ({ document }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">{document.name}</h4>

        {/* STATUS BADGE */}
        {!document.isSubmitted && (
          <span className="px-2 py-1 text-xs rounded bg-gray-200">
            Not Uploaded
          </span>
        )}

        {document.isSubmitted && document.isVerified === 'false' && (
          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
            Pending
          </span>
        )}

        {document.isVerified === 'true' && (
          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
            Approved
          </span>
        )}

        {document.isVerified === 'rejected' && (
          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
            Rejected
          </span>
        )}
      </div>

      {/* REJECTION REASON */}
      {document.isVerified === 'rejected' && document.description && (
        <p className="text-sm text-red-600">
          ❌ {document.description}
        </p>
      )}

      {/* VIEW DOCUMENT */}
      {document.isSubmitted && document.url && (
        <a
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline"
        >
          View Document
        </a>
      )}


      {/* ACTION BUTTONS */}
      {document.isSubmitted && document.isVerified === 'false' && (
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">
            Approve
          </button>

          <button className="px-3 py-1 bg-red-600 text-white text-sm rounded">
            Reject
          </button>
        </div>
      )}

    </div>
  );
};



// const getVerificationText = (status) => {
//   if (status === "true" || status === true) return "Verified";
//   if (status === "false" || status === false) return "Not Verified";
//   return "Pending";
// };

// return (
//   <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//     <div className="flex items-start justify-between mb-3">
//       <h4 className="font-semibold text-gray-900">{document.name}</h4>
//       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getVerificationColor(document.isVerified)}`}>
//         {getVerificationText(document.isVerified)}
//       </span>
//     </div>

//     {document.description && (
//       <p className="text-sm text-gray-600 mb-3">{document.description}</p>
//     )}

//     {document.key ? (
//       <a
//         href={`${import.meta.env.VITE_API_URL}/${document.key}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
//       >
//         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//         </svg>
//         View Document
//       </a>
//     ) : (
//       <p className="text-sm text-gray-400">Not uploaded</p>
//     )}
//   </div>
// );
// };

const DriverCard = ({ driver, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:border-blue-500"
    >
      <div className="flex items-center gap-4 mb-3">
        {driver.driverPhotoUpload ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/${driver.driverPhotoUpload}`}
            alt={driver.driverName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{driver.driverName}</h4>
          <p className="text-sm text-gray-600">{driver.driverPhoneNumber}</p>
        </div>
      </div>

      <div className="space-y-2">
        <DocumentLink
          label="Aadhar"
          url={driver.driverAadharUpload}
        />
        <DocumentLink
          label="License"
          url={driver.driverLicenseUpload}
        />
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </p>
      </div>
    </div>
  );
};

const VehicleCard = ({ vehicle, onClick, getStatusColor }) => {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:border-blue-500"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{vehicle.vehicleName}</h4>
          <p className="text-lg font-bold text-blue-600">{vehicle.vehicleNumber}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
          {vehicle.status}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <InfoRow label="Capacity" value={vehicle.capacity} />
        <InfoRow label="Dimension" value={vehicle.dimension} />
        <InfoRow label="Body Type" value={vehicle.bodyType} />
        <InfoRow
          label="Refrigerated"
          value={vehicle.isRefrigerated ? "Yes" : "No"}
        />
      </div>

      <div className="space-y-2 mb-3">
        <DocumentLink label="RC" url={vehicle.rcUrl} />
        <DocumentLink label="Road Permit" url={vehicle.roadPermitUrl} />
        <DocumentLink label="Pollution Certificate" url={vehicle.PollutionCertificateUrl} />
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </p>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}:</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

const DocumentLink = ({ label, url }) => {
  if (!url) {
    return (
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}:</span>
        <span className="text-gray-400">Not uploaded</span>
      </div>
    );
  }

  return (
    <div className="flex justify-between text-sm items-center">
      <span className="text-gray-500">{label}:</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
      >
        View
      </a>
    </div>
  );
};


export default TransporterDetails;