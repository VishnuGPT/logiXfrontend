import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, Weight, DollarSign, ArrowRight, Filter, Search, Activity, CheckCircle, Clock, TrendingUp } from 'lucide-react';

// Mock data based on your API structure
const mockActiveShipments = [
  {
    id: 1,
    status: "confirmed",
    pickupCity: "Mumbai",
    deliveryCity: "Delhi",
    weightKg: 5000,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Closed Container",
    truckSize: "32ft",
    cost: 45000,
    updated_at: "2026-01-25T10:30:00Z",
    Client: {
      id: 101,
      name: "Tech Solutions Pvt Ltd",
      email: "contact@techsolutions.com"
    }
  },
  {
    id: 2,
    status: "ongoing",
    pickupCity: "Pune",
    deliveryCity: "Bangalore",
    weightKg: 8000,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Open Flatbed",
    truckSize: "40ft",
    cost: 62000,
    updated_at: "2026-01-24T14:20:00Z",
    Client: {
      id: 102,
      name: "Industrial Goods Co",
      email: "info@industrialgoods.com"
    }
  },
  {
    id: 3,
    status: "completed",
    pickupCity: "Hyderabad",
    deliveryCity: "Chennai",
    weightKg: 3000,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Refrigerated",
    truckSize: "24ft",
    cost: 38000,
    updated_at: "2026-01-23T09:15:00Z",
    Client: {
      id: 103,
      name: "Fresh Farms Ltd",
      email: "orders@freshfarms.com"
    }
  },
  {
    id: 4,
    status: "ongoing",
    pickupCity: "Kolkata",
    deliveryCity: "Guwahati",
    weightKg: 6500,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Closed Container",
    truckSize: "32ft",
    cost: 55000,
    updated_at: "2026-01-25T16:45:00Z",
    Client: {
      id: 104,
      name: "Eastern Logistics",
      email: "support@easternlogistics.com"
    }
  },
  {
    id: 5,
    status: "confirmed",
    pickupCity: "Ahmedabad",
    deliveryCity: "Jaipur",
    weightKg: 4200,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Open Body",
    truckSize: "24ft",
    cost: 32000,
    updated_at: "2026-01-24T11:20:00Z",
    Client: {
      id: 105,
      name: "Gujarat Traders",
      email: "contact@gujarattraders.com"
    }
  },
  {
    id: 6,
    status: "ongoing",
    pickupCity: "Surat",
    deliveryCity: "Indore",
    weightKg: 7200,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Closed Container",
    truckSize: "32ft",
    cost: 48000,
    updated_at: "2026-01-25T08:30:00Z",
    Client: {
      id: 106,
      name: "Textile Exports Ltd",
      email: "info@textileexports.com"
    }
  },
  {
    id: 7,
    status: "completed",
    pickupCity: "Lucknow",
    deliveryCity: "Kanpur",
    weightKg: 2800,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Open Body",
    truckSize: "20ft",
    cost: 25000,
    updated_at: "2026-01-22T15:10:00Z",
    Client: {
      id: 107,
      name: "UP Traders",
      email: "contact@uptraders.com"
    }
  }
];

const OngoingShipmentsDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTransportMode, setFilterTransportMode] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setShipments(mockActiveShipments);
      setLoading(false);
    }, 800);
  }, []);

  const handleCardClick = (id) => {
    console.log(`Redirecting to /shipment/${id}`);
    alert(`Redirecting to Shipment #${id} detail page`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: {
        label: 'Confirmed',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300',
        icon: CheckCircle
      },
      ongoing: {
        label: 'In Transit',
        color: 'orange',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-300',
        icon: Activity
      },
      completed: {
        label: 'Delivered',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300',
        icon: CheckCircle
      }
    };
    return configs[status] || configs.confirmed;
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.Client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.pickupCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.deliveryCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.id.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesTransport = filterTransportMode === 'all' || shipment.transportMode === filterTransportMode;
    
    return matchesSearch && matchesStatus && matchesTransport;
  });

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.updated_at) - new Date(a.updated_at);
    } else if (sortBy === 'cost') {
      return b.cost - a.cost;
    } else if (sortBy === 'weight') {
      return b.weightKg - a.weightKg;
    }
    return 0;
  });

  const stats = {
    total: shipments.length,
    confirmed: shipments.filter(s => s.status === 'confirmed').length,
    ongoing: shipments.filter(s => s.status === 'ongoing').length,
    completed: shipments.filter(s => s.status === 'completed').length,
    totalRevenue: shipments.reduce((sum, s) => sum + (s.cost || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading active shipments...</p>
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
                <Activity className="w-8 h-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">Active Shipments</h1>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Monitor confirmed, ongoing, and completed shipments
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
              <div className="text-center">
                <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600 mt-1">Total Active</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{stats.confirmed}</p>
                <p className="text-xs text-blue-700 mt-1">Confirmed</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
              <div className="text-center">
                <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-900">{stats.ongoing}</p>
                <p className="text-xs text-orange-700 mt-1">In Transit</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                <p className="text-xs text-green-700 mt-1">Delivered</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-purple-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-purple-700 mt-1">Total Value</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shipments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="ongoing">In Transit</option>
                <option value="completed">Delivered</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                value={filterTransportMode}
                onChange={(e) => setFilterTransportMode(e.target.value)}
              >
                <option value="all">All Transport</option>
                <option value="Road">Road</option>
                <option value="Rail">Rail</option>
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
              </select>
            </div>

            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
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
        {sortedShipments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedShipments.map((shipment) => {
              const statusConfig = getStatusConfig(shipment.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={shipment.id}
                  onClick={() => handleCardClick(shipment.id)}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border-2 overflow-hidden group hover:${statusConfig.borderColor}`}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r from-${statusConfig.color}-500 to-${statusConfig.color}-600 px-4 py-3 text-white`}
                       style={{
                         background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                         backgroundImage: shipment.status === 'confirmed' 
                           ? 'linear-gradient(to right, rgb(59 130 246), rgb(37 99 235))'
                           : shipment.status === 'ongoing'
                           ? 'linear-gradient(to right, rgb(249 115 22), rgb(234 88 12))'
                           : 'linear-gradient(to right, rgb(34 197 94), rgb(22 163 74))'
                       }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-semibold">Shipment #{shipment.id}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs ${statusConfig.bgColor} ${statusConfig.textColor} px-2 py-1 rounded-full font-medium`}
                            style={{
                              backgroundColor: shipment.status === 'confirmed' 
                                ? 'rgba(191, 219, 254, 0.9)'
                                : shipment.status === 'ongoing'
                                ? 'rgba(254, 215, 170, 0.9)'
                                : 'rgba(187, 247, 208, 0.9)'
                            }}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Client Info */}
                    <div className="pb-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{shipment.Client.name}</p>
                      <p className="text-sm text-gray-500">{shipment.Client.email}</p>
                    </div>

                    {/* Route Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">{shipment.pickupCity}</span>
                        </div>
                        <div className="flex-1 mx-2">
                          <div className="border-t-2 border-dashed border-gray-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">{shipment.deliveryCity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipment Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-blue-700">Truck Size</p>
                            <p className="text-sm font-semibold text-blue-900">{shipment.truckSize || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <Weight className="w-4 h-4 text-orange-600" />
                          <div>
                            <p className="text-xs text-orange-700">Weight</p>
                            <p className="text-sm font-semibold text-orange-900">{shipment.weightKg} kg</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body Type & Transport */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                        {shipment.bodyType}
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                        {shipment.transportMode}
                      </span>
                    </div>

                    {/* Cost */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-xs text-green-700 font-medium">Shipment Value</span>
                        </div>
                        <span className="text-lg font-bold text-green-900">
                          {formatCurrency(shipment.cost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Updated {formatDate(shipment.updated_at)}
                      </p>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OngoingShipmentsDashboard;