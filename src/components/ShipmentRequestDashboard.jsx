import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, Weight, DollarSign, ArrowRight, Filter, Search, Clock, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShipmentRequestDashboard = () => {
  const navigate = useNavigate();
  const [ftlRequests, setFtlRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTransportMode, setFilterTransportMode] = useState('all');
  const [filterBodyType, setFilterBodyType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const fetchFtlRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/get-requested-ftls`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const data = await response?.data;
      console.log('Requested FTLs:', data?.data);
      setFtlRequests(data?.data || []); 
    } catch (error) {
      console.error("Error fetching FTL requests:", error);
      setFtlRequests([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFtlRequests();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/ftl-details/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === null) return 'Not Set';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredRequests = ftlRequests.filter(ftl => {
    const clientName = ftl?.owner?.name || '';
    const clientEmail = ftl?.owner?.email || '';
    const companyName = ftl?.owner?.companyName || '';
    const pickupCity = ftl?.pickupCity || '';
    const deliveryCity = ftl?.deliveryCity || '';
    const ftlId = ftl?.id?.toString() || '';
    
    const matchesSearch = 
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickupCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ftlId.includes(searchTerm);
    
    const matchesTransportFilter = filterTransportMode === 'all' || 
      ftl?.transportMode?.toLowerCase() === filterTransportMode.toLowerCase();
    
    const matchesBodyTypeFilter = filterBodyType === 'all' || 
      ftl?.bodyType?.toLowerCase() === filterBodyType.toLowerCase();

    const matchesStatusFilter = filterStatus === 'all' || 
      ftl?.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesTransportFilter && matchesBodyTypeFilter && matchesStatusFilter;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b?.created_at || 0) - new Date(a?.created_at || 0);
    } else if (sortBy === 'cost') {
      if (a?.cost === null && b?.cost === null) return 0;
      if (a?.cost === null) return 1;
      if (b?.cost === null) return -1;
      return (b?.cost || 0) - (a?.cost || 0);
    } else if (sortBy === 'weight') {
      return (b?.weightKg || 0) - (a?.weightKg || 0);
    }
    return 0;
  });

  const totalRevenue = ftlRequests.reduce((sum, ftl) => {
    return sum + (ftl?.cost !== null ? (ftl?.cost || 0) : 0);
  }, 0);

  const requestsWithCost = ftlRequests.filter(ftl => ftl?.cost !== null).length;

  const getStatusColor = (status) => {
    const colors = {
      requested: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      ongoing: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FTL requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <Package className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">FTL Requests</h1>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track all FTL shipment requests
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Requests</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{sortedRequests.length}</p>
                </div>
                <Package className="w-10 h-10 text-blue-600 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {totalRevenue > 0 ? formatCurrency(totalRevenue) : 'Not Set'}
                  </p>
                  {requestsWithCost > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      {requestsWithCost} of {ftlRequests.length} priced
                    </p>
                  )}
                </div>
                <DollarSign className="w-10 h-10 text-green-600 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Avg. Weight</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    {sortedRequests.length > 0 
                      ? `${(ftlRequests.reduce((sum, ftl) => sum + (ftl.weightKg || 0), 0) / sortedRequests.length).toFixed(1)} kg`
                      : '0 kg'
                    }
                  </p>
                </div>
                <Weight className="w-10 h-10 text-purple-600 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by client, city, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Transport Mode Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterTransportMode}
                onChange={(e) => setFilterTransportMode(e.target.value)}
              >
                <option value="all">All Transport Modes</option>
                <option value="road">Road</option>
                <option value="rail">Rail</option>
                <option value="air">Air</option>
                <option value="sea">Sea</option>
              </select>
            </div>

            {/* Body Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterBodyType}
                onChange={(e) => setFilterBodyType(e.target.value)}
              >
                <option value="all">All Body Types</option>
                <option value="closed">Closed</option>
                <option value="open">Open</option>
                <option value="container">Container</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="requested">Requested</option>
                <option value="accepted">Accepted</option>
                <option value="confirmed">Confirmed</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="cost">Sort by Cost</option>
                <option value="weight">Sort by Weight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {sortedRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No FTL requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterTransportMode !== 'all' || filterBodyType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No requests at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRequests.map((ftl) => (
              <div
                key={ftl?.id}
                onClick={() => handleCardClick(ftl?.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 overflow-hidden group hover:border-blue-500"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5" />
                      <span className="font-semibold">Request #{ftl?.id || 'N/A'}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ftl?.status)}`}>
                      {ftl?.status?.charAt(0).toUpperCase() + ftl?.status?.slice(1) || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Client Info */}
                  <div className="pb-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">
                      {ftl?.owner?.name || 'Unknown Client'}
                    </p>
                    {ftl?.owner?.companyName && (
                      <p className="text-xs text-gray-500">{ftl.owner.companyName}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {ftl?.owner?.email || 'No email'}
                    </p>
                    {ftl?.owner?.phoneNumber && (
                      <p className="text-sm text-gray-500">{ftl.owner.phoneNumber}</p>
                    )}
                  </div>

                  {/* Route Info */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {ftl?.pickupCity || 'N/A'}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {ftl?.deliveryCity || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-blue-700">Truck Size</p>
                          <p className="text-sm font-semibold text-blue-900 truncate">
                            {ftl?.truckSize || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <Weight className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-orange-700">Weight</p>
                          <p className="text-sm font-semibold text-orange-900">
                            {ftl?.weightKg ? `${ftl.weightKg} kg` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Type & Transport & Material */}
                  <div className="flex flex-wrap gap-2">
                    {ftl?.bodyType && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium capitalize">
                        {ftl.bodyType}
                      </span>
                    )}
                    {ftl?.transportMode && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium capitalize">
                        {ftl.transportMode}
                      </span>
                    )}
                    {ftl?.materialType && (
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full font-medium">
                        {ftl.materialType}
                      </span>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Pickup: {formatDate(ftl?.expectedPickupDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Delivery: {formatDate(ftl?.expectedDeliveryDate)}</span>
                    </div>
                  </div>

                  {/* Cost Highlight */}
                  <div className={`${
                    ftl?.cost !== null 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                      : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
                    } border rounded-lg p-3 mt-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className={`w-5 h-5 ${
                          ftl?.cost !== null ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                        <span className={`text-xs font-medium ${
                          ftl?.cost !== null ? 'text-green-700' : 'text-yellow-700'
                        }`}>
                          Order Value
                        </span>
                      </div>
                      <span className={`text-xl font-bold ${
                        ftl?.cost !== null ? 'text-green-900' : 'text-yellow-900'
                      }`}>
                        {formatCurrency(ftl?.cost)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Created {formatDate(ftl?.created_at)}</span>
                    </div>
                    <span className="text-blue-600 font-medium">View Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentRequestDashboard;