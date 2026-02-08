

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  MapPin,
  Truck,
  Weight,
  DollarSign,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit,
  Ruler,
  FileText,
  Box,
  Thermometer,
  Users,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';

const FTLDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ftl, setFtl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [newCost, setNewCost] = useState('');

  useEffect(() => {
    fetchFtlDetails();
  }, [id]);

  const fetchFtlDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/ftl/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('FTL Details:', response.data?.data);
      setFtl(response.data?.data);
      setError('');
    } catch (err) {
      console.error('Error fetching FTL details:', err);
      setError('Failed to load FTL request details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/ftl/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchFtlDetails();
      alert(`Status updated to ${newStatus} successfully!`);
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCost = async () => {
    if (!newCost || isNaN(newCost) || Number(newCost) <= 0) {
      alert('Please enter a valid cost');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/ftl/${id}/status`,
        { cost: Number(newCost) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchFtlDetails();
      setShowCostModal(false);
      setNewCost('');
      alert('Cost updated successfully!');
    } catch (err) {
      alert('Failed to update cost');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === null) return 'Not Set';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      accepted: 'bg-blue-100 text-blue-800 border-blue-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      ongoing: 'bg-purple-100 text-purple-800 border-purple-300',
      completed: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FTL request details...</p>
        </div>
      </div>
    );
  }

  if (error || !ftl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-800 font-medium">{error || 'FTL request not found'}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to List
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                FTL Request #{ftl.id}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Created on {formatDate(ftl.created_at)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              {ftl.status === 'accepted' && (
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm Payment
                </button>
              )}

              {ftl.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange('ongoing')}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Truck className="w-5 h-5" />
                  Mark Ongoing
                </button>
              )}

              {ftl.status === 'ongoing' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark Completed
                </button>
              )}

              <button
                onClick={() => {
                  setShowCostModal(true);
                  setNewCost(ftl.cost || '');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Edit className="w-5 h-5" />
                {ftl.cost ? 'Update Cost' : 'Set Cost'}
              </button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
              ftl.status
            )}`}
          >
            <Clock className="w-4 h-4" />
            Status: {ftl.status.charAt(0).toUpperCase() + ftl.status.slice(1)}
          </span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Client Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<User className="w-5 h-5 text-blue-600" />}
                    label="Name"
                    value={ftl.owner?.name || 'N/A'}
                  />
                  <InfoItem
                    icon={<Building className="w-5 h-5 text-blue-600" />}
                    label="Company"
                    value={ftl.owner?.companyName || 'Not Provided'}
                  />
                  <InfoItem
                    icon={<Mail className="w-5 h-5 text-blue-600" />}
                    label="Email"
                    value={ftl.owner?.email || 'N/A'}
                  />
                  <InfoItem
                    icon={<Phone className="w-5 h-5 text-blue-600" />}
                    label="Phone"
                    value={ftl.owner?.phoneNumber || 'N/A'}
                  />
                </div>
              </div>
            </div>

            {/* Transporter Information */}
            {ftl.Transporter && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Truck className="w-6 h-6" />
                    Assigned Transporter
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem
                      icon={<Building className="w-5 h-5 text-orange-600" />}
                      label="Company"
                      value={ftl.Transporter.companyName || 'N/A'}
                    />
                    <InfoItem
                      icon={<User className="w-5 h-5 text-orange-600" />}
                      label="Owner"
                      value={ftl.Transporter.ownerName || 'N/A'}
                    />
                    <InfoItem
                      icon={<Mail className="w-5 h-5 text-orange-600" />}
                      label="Email"
                      value={ftl.Transporter.email || 'N/A'}
                    />
                    <InfoItem
                      icon={<Phone className="w-5 h-5 text-orange-600" />}
                      label="Phone"
                      value={ftl.Transporter.phoneNumber || 'N/A'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Route Information */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Route Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pickup */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Pickup Location</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700 font-medium">{ftl.pickupAddressLine}</p>
                      <p className="text-gray-700">
                        {ftl.pickupCity}, {ftl.pickupState}
                      </p>
                      <p className="text-gray-700">PIN: {ftl.pickupPincode}</p>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-red-900">Delivery Location</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700 font-medium">{ftl.deliveryAddressLine}</p>
                      <p className="text-gray-700">
                        {ftl.deliveryCity}, {ftl.deliveryState}
                      </p>
                      <p className="text-gray-700">PIN: {ftl.deliveryPincode}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <InfoItem
                    icon={<Calendar className="w-5 h-5 text-green-600" />}
                    label="Expected Pickup Date"
                    value={formatDate(ftl.expectedPickupDate)}
                  />
                  <InfoItem
                    icon={<Calendar className="w-5 h-5 text-red-600" />}
                    label="Expected Delivery Date"
                    value={formatDate(ftl.expectedDeliveryDate)}
                  />
                </div>
              </div>
            </div>

            {/* Cargo Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Box className="w-6 h-6" />
                  Cargo Details
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Package className="w-5 h-5 text-purple-600" />}
                    label="Material Type"
                    value={ftl.materialType || 'N/A'}
                  />
                  {ftl.customMaterialType && (
                    <InfoItem
                      icon={<FileText className="w-5 h-5 text-purple-600" />}
                      label="Custom Material"
                      value={ftl.customMaterialType}
                    />
                  )}
                  <InfoItem
                    icon={<Weight className="w-5 h-5 text-purple-600" />}
                    label="Weight"
                    value={`${ftl.weightKg} kg`}
                  />
                  {ftl.volumetricWeightKg && (
                    <InfoItem
                      icon={<Weight className="w-5 h-5 text-purple-600" />}
                      label="Volumetric Weight"
                      value={`${ftl.volumetricWeightKg} kg`}
                    />
                  )}
                  {ftl.length && ftl.width && ftl.height && (
                    <>
                      <InfoItem
                        icon={<Ruler className="w-5 h-5 text-purple-600" />}
                        label="Dimensions (L×W×H)"
                        value={`${ftl.length} × ${ftl.width} × ${ftl.height} ${ftl.dimensionUnit || 'cm'}`}
                      />
                    </>
                  )}
                  {ftl.materialValue && (
                    <InfoItem
                      icon={<DollarSign className="w-5 h-5 text-purple-600" />}
                      label="Material Value"
                      value={formatCurrency(ftl.materialValue)}
                    />
                  )}
                </div>

                {ftl.additionalNotes && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Additional Notes
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{ftl.additionalNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Logistics Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Truck className="w-6 h-6" />
                  Logistics Details
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Truck className="w-5 h-5 text-indigo-600" />}
                    label="Transport Mode"
                    value={(ftl.transportMode?.toUpperCase()) || 'N/A'}
                  />
                  <InfoItem
                    icon={<Box className="w-5 h-5 text-indigo-600" />}
                    label="Body Type"
                    value={ftl.bodyType?.charAt(0).toUpperCase() + ftl.bodyType?.slice(1) || 'N/A'}
                  />
                  {ftl.truckSize && (
                    <InfoItem
                      icon={<Truck className="w-5 h-5 text-indigo-600" />}
                      label="Truck Size"
                      value={ftl.truckSize}
                    />
                  )}
                  {ftl.smallVehicleType && (
                    <InfoItem
                      icon={<Truck className="w-5 h-5 text-indigo-600" />}
                      label="Small Vehicle Type"
                      value={ftl.smallVehicleType}
                    />
                  )}
                  {ftl.coolingType && (
                    <InfoItem
                      icon={<Thermometer className="w-5 h-5 text-indigo-600" />}
                      label="Cooling Type"
                      value={ftl.coolingType}
                    />
                  )}
                  <InfoItem
                    icon={<Users className="w-5 h-5 text-indigo-600" />}
                    label="Manpower Required"
                    value={ftl.manpower === 'yes' ? 'Yes' : 'No'}
                  />
                  {ftl.manpower === 'yes' && ftl.noOfLabours > 0 && (
                    <InfoItem
                      icon={<Users className="w-5 h-5 text-indigo-600" />}
                      label="Number of Labours"
                      value={ftl.noOfLabours.toString()}
                    />
                  )}
                  <InfoItem
                    icon={<Package className="w-5 h-5 text-indigo-600" />}
                    label="Shipment Type"
                    value={ftl.shipmentType?.toUpperCase() || 'FTL'}
                  />
                </div>
              </div>
            </div>
            <pre>{JSON.stringify(ftl, null, 2)}</pre>
            <button  className='border-2 border-red-600 p-4 font-bold hover:bg-red-400' >ADMIN PAYMENT BYPASS</button>
          </div>


          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  Order Summary
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Cost */}
                <div className={`${ftl.cost
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
                  } border rounded-lg p-4`}>
                  <p className={`text-sm font-medium mb-1 ${ftl.cost ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                    Order Value
                  </p>
                  <p className={`text-3xl font-bold ${ftl.cost ? 'text-green-900' : 'text-yellow-900'
                    }`}>
                    {formatCurrency(ftl.cost)}
                  </p>
                  {!ftl.cost && (
                    <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Cost not set yet
                    </p>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Request ID</span>
                    <span className="text-sm font-semibold text-gray-900">
                      #{ftl.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Shipment Type</span>
                    <span className="text-sm font-semibold text-gray-900 uppercase">
                      {ftl.shipmentType || 'FTL'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Weight</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {ftl.weightKg} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Transport Mode</span>
                    <span className="text-sm font-semibold text-gray-900 uppercase">
                      {ftl.transportMode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Body Type</span>
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {ftl.bodyType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Status</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                        ftl.status
                      )}`}
                    >
                      {ftl.status.charAt(0).toUpperCase() + ftl.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Pickup Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(ftl.expectedPickupDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Delivery Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(ftl.expectedDeliveryDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Created On</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(ftl.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Quick Contact */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Contact</h4>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${ftl.owner?.email}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Mail className="w-4 h-4" />
                      {ftl.owner?.email}
                    </a>
                    {ftl.owner?.phoneNumber && (
                      <a
                        href={`tel:${ftl.owner?.phoneNumber}`}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Phone className="w-4 h-4" />
                        {ftl.owner?.phoneNumber}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {showCostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {ftl.cost ? 'Update Order Cost' : 'Set Order Cost'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Amount (₹)
              </label>
              <input
                type="number"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter cost amount"
                min="0"
                step="100"
              />
              {ftl.cost && (
                <p className="text-sm text-gray-500 mt-2">
                  Current cost: {formatCurrency(ftl.cost)}
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCostModal(false);
                  setNewCost('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCost}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Updating...' : ftl.cost ? 'Update Cost' : 'Set Cost'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base text-gray-900 font-medium break-words">{value}</p>
    </div>
  </div>
);

export default FTLDetails;