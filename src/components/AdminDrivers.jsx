import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Building2, FileText, Image, CreditCard, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

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
  if (!url) return null;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium group"
    >
      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>{label}</span>
      <span className="ml-auto text-xs">↗</span>
    </a>
  );
};

const DriverCard = ({ driver, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      verified: {
        label: 'Verified',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        icon: CheckCircle,
      },
      unverified: {
        label: 'Unverified',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        icon: Clock,
      },
      suspended: {
        label: 'Suspended',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        icon: XCircle,
      }
    };
    return configs[status] || configs.unverified;
  };

  const statusConfig = getStatusConfig(driver.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
    >
      {/* Header with Photo */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 border-b border-gray-200">
        <div className="flex gap-4 items-start">
          {/* Driver Photo */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-gray-200">
            {driver.driverPhotoUrl && !imageError ? (
              <img
                src={driver.driverPhotoUrl}
                alt={driver.driverName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl font-bold">
                {driver.driverName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Driver Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2 group-hover:text-purple-600 transition-colors">
              <User className="w-5 h-5 text-purple-600" />
              {driver.driverName}
            </h3>
            <p className="text-xs text-gray-500 font-mono mb-2">Driver ID: #{driver.id}</p>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${statusConfig.bgColor} ${statusConfig.textColor} rounded-full text-xs font-semibold`}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
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
          {driver.created_at && (
            <InfoRow 
              icon={Calendar} 
              label="Registered On" 
              value={new Date(driver.created_at).toLocaleDateString('en-US', { 
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
            {driver.driverAadharUrl && (
              <DocumentLink 
                icon={CreditCard} 
                label="Aadhar Card" 
                url={driver.driverAadharUrl} 
              />
            )}
            {driver.driverLicenseUrl && (
              <DocumentLink 
                icon={FileText} 
                label="License" 
                url={driver.driverLicenseUrl} 
              />
            )}
            {driver.driverPhotoUrl && (
              <DocumentLink 
                icon={Image} 
                label="Photo" 
                url={driver.driverPhotoUrl} 
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={onClick}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2 group-hover:bg-purple-700"
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDrivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/get-drivers`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.isValid) {
        setDrivers(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch drivers');
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError('Failed to fetch drivers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDriverClick = (driverId) => {
    navigate(`/driver/${driverId}`);
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
              <p className="text-gray-500">
                Manage and monitor all registered drivers
                {drivers.length > 0 && (
                  <span className="ml-2 text-purple-600 font-semibold">
                    ({drivers.length} {drivers.length === 1 ? 'driver' : 'drivers'})
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={fetchDrivers}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

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
            <p className="text-gray-500">No drivers have been registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <DriverCard 
                key={driver.id} 
                driver={driver}
                onClick={() => handleDriverClick(driver.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDrivers;