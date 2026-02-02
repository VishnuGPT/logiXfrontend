import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Building2,
  MapPin,
  Mail,
  FileText,
  CreditCard,
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Truck,
  Calendar,
  Download,
  ExternalLink,
  AlertCircle,
  Eye
} from 'lucide-react';
import axios from 'axios';

const DriverDetailPage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [imageModal, setImageModal] = useState({ isOpen: false, src: '', title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDriverDetails();
  }, [driverId]);

  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/get-driver/${driverId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.isValid) {
        setDriver(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching driver details:', err);
      setError('Failed to fetch driver details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this driver?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/driver/${driverId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh data
      await fetchDriverDetails();
      alert(`Driver ${newStatus} successfully!`);
    } catch (err) {
      alert(`Failed to ${newStatus} driver`);
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      verified: {
        label: 'Verified',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        icon: CheckCircle,
        iconColor: 'text-emerald-600'
      },
      unverified: {
        label: 'Unverified',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        icon: Clock,
        iconColor: 'text-amber-600'
      },
      suspended: {
        label: 'Suspended',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: XCircle,
        iconColor: 'text-red-600'
      }
    };
    return configs[status] || configs.unverified;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openImageModal = (src, title) => {
    setImageModal({ isOpen: true, src, title });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, src: '', title: '' });
  };

  // Helper function to check if URL is a PDF
  const isPDF = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('pdf');
  };

  // Helper function to open document in new tab
  const openDocument = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <Truck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600" />
          </div>
          <p className="mt-6 text-slate-600 font-medium text-lg">Loading driver details...</p>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Error</h2>
          <p className="text-slate-600 text-center mb-6">{error || 'Driver not found'}</p>
          <button
            onClick={() => navigate('/drivers')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Drivers
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(driver.status);
  const StatusIcon = statusConfig.icon;
  const transporter = driver.Transporter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} font-semibold text-sm flex items-center gap-2`}>
                <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                {statusConfig.label}
              </span>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {driver.status !== 'verified' && (
                  <button
                    onClick={() => handleStatusChange('verified')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verify
                  </button>
                )}
                
                {driver.status !== 'suspended' && (
                  <button
                    onClick={() => handleStatusChange('suspended')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Suspend
                  </button>
                )}

                {driver.status === 'suspended' && (
                  <button
                    onClick={() => handleStatusChange('unverified')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Driver Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl shadow-2xl overflow-hidden mb-8 border border-indigo-400">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-xl">
                  {driver.driverPhotoUrl ? (
                    <img
                      src={driver.driverPhotoUrl}
                      alt={driver.driverName}
                      className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                      onClick={() => openImageModal(driver.driverPhotoUrl, `${driver.driverName} - Photo`)}
                    />
                  ) : (
                    <User className="w-16 h-16 text-white/70" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <Truck className="w-6 h-6 text-indigo-600" />
                </div>
              </div>

              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{driver.driverName}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">{driver.driverPhoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Driver ID: #{driver.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'transporter', label: 'Transporter Info', icon: Building2 }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-b-3 ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'border-transparent text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                  style={{ borderBottomWidth: '3px' }}
                >
                  <TabIcon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Driver Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Driver Information
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <InfoRow icon={User} label="Full Name" value={driver.driverName} />
                  <InfoRow icon={Phone} label="Phone Number" value={driver.driverPhoneNumber} />
                  <InfoRow
                    icon={StatusIcon}
                    label="Status"
                    value={
                      <span className={`px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} font-semibold text-sm`}>
                        {statusConfig.label}
                      </span>
                    }
                  />
                  <InfoRow icon={Building2} label="Transporter ID" value={`#${driver.transporterId}`} />
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Timeline
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <InfoRow
                    icon={Calendar}
                    label="Created At"
                    value={formatDate(driver.created_at)}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Last Updated"
                    value={formatDate(driver.updated_at)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DocumentCard
                title="Aadhar Card"
                icon={CreditCard}
                documentUrl={driver.driverAadharUrl}
                onView={() => {
                  if (isPDF(driver.driverAadharUrl)) {
                    openDocument(driver.driverAadharUrl);
                  } else {
                    openImageModal(driver.driverAadharUrl, 'Aadhar Card');
                  }
                }}
                isPDF={isPDF(driver.driverAadharUrl)}
                gradient="from-orange-500 to-red-500"
              />
              <DocumentCard
                title="Driving License"
                icon={FileText}
                documentUrl={driver.driverLicenseUrl}
                onView={() => {
                  if (isPDF(driver.driverLicenseUrl)) {
                    openDocument(driver.driverLicenseUrl);
                  } else {
                    openImageModal(driver.driverLicenseUrl, 'Driving License');
                  }
                }}
                isPDF={isPDF(driver.driverLicenseUrl)}
                gradient="from-blue-500 to-indigo-500"
              />
              <DocumentCard
                title="Driver Photo"
                icon={ImageIcon}
                documentUrl={driver.driverPhotoUrl}
                onView={() => {
                  if (isPDF(driver.driverPhotoUrl)) {
                    openDocument(driver.driverPhotoUrl);
                  } else {
                    openImageModal(driver.driverPhotoUrl, 'Driver Photo');
                  }
                }}
                isPDF={isPDF(driver.driverPhotoUrl)}
                gradient="from-purple-500 to-pink-500"
              />
            </div>
          )}

          {/* Transporter Info Tab */}
          {activeTab === 'transporter' && (
            <>
              {transporter ? (
                <div className="space-y-6">
                  {/* Company Overview */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Building2 className="w-6 h-6" />
                        Company Information
                      </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoRow icon={Building2} label="Company Name" value={transporter.companyName} />
                      <InfoRow icon={User} label="Owner Name" value={transporter.ownerName || 'N/A'} />
                      <InfoRow icon={Phone} label="Owner Phone" value={transporter.ownerPhoneNumber || 'N/A'} />
                      <InfoRow icon={Mail} label="Email" value={transporter.email} />
                      <InfoRow icon={Phone} label="Company Phone" value={transporter.phoneNumber} />
                      <InfoRow icon={FileText} label="Designation" value={transporter.designation} />
                    </div>
                  </div>

                  {/* Registration Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <FileText className="w-6 h-6" />
                          Registration Details
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <InfoRow icon={CreditCard} label="GST Number" value={transporter.gstNumber} />
                        <InfoRow icon={FileText} label="CIN Number" value={transporter.cinNumber || 'N/A'} />
                        <InfoRow icon={Phone} label="Customer Service" value={transporter.customerServiceNumber || 'N/A'} />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <MapPin className="w-6 h-6" />
                          Location & Status
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <InfoRow icon={MapPin} label="Company Address" value={transporter.companyAddress} multiline />
                        <InfoRow
                          icon={CheckCircle}
                          label="Profile Status"
                          value={
                            <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                              transporter.profileStatus === 'completed'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            }`}>
                              {transporter.profileStatus}
                            </span>
                          }
                        />
                        <InfoRow
                          icon={Shield}
                          label="Verification Status"
                          value={
                            <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                              transporter.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : transporter.status === 'suspended'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {transporter.status}
                            </span>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                  <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Transporter Information</h3>
                  <p className="text-slate-600">This driver is not associated with any transporter.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{imageModal.title}</h3>
              <button
                onClick={closeImageModal}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors duration-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={imageModal.src}
                alt={imageModal.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
              <a
                href={imageModal.src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
             
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// Helper Components
const InfoRow = ({ icon: Icon, label, value, multiline = false }) => (
  <div className="flex items-start gap-4">
    <div className="bg-indigo-100 rounded-lg p-2 flex-shrink-0">
      <Icon className="w-5 h-5 text-indigo-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <div className={`text-slate-900 font-semibold ${multiline ? '' : 'truncate'}`}>
        {value || 'N/A'}
      </div>
    </div>
  </div>
);

const DocumentCard = ({ title, icon: Icon, documentUrl, onView, isPDF, gradient }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
    <div className={`bg-gradient-to-br ${gradient} px-6 py-4`}>
      <div className="flex items-center gap-3 text-white">
        <Icon className="w-6 h-6" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </div>
    <div className="p-4">
      {documentUrl ? (
        <>
          {isPDF ? (
            <div className="aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden mb-4 border-2 border-slate-200 flex flex-col items-center justify-center group-hover:border-indigo-300 transition-colors">
              <FileText className="w-16 h-16 text-red-500 mb-2" />
              <p className="text-slate-600 font-medium text-sm">PDF Document</p>
            </div>
          ) : (
            <div className="relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden mb-4 border-2 border-slate-200 group-hover:border-indigo-300 transition-colors">
              <img
                src={documentUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center">
                      <svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p class="text-slate-500 font-medium text-sm mt-2">Image not available</p>
                    </div>
                  `;
                }}
              />
            </div>
          )}
          <button
            onClick={onView}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {isPDF ? 'Open PDF' : 'View Document'}
          </button>
        </>
      ) : (
        <div className="aspect-[4/3] bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 mb-4">
          <Icon className="w-12 h-12 text-slate-400 mb-2" />
          <p className="text-slate-500 font-medium text-sm">Not Uploaded</p>
        </div>
      )}
    </div>
  </div>
);

export default DriverDetailPage;