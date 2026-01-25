import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, Weight, DollarSign, ArrowRight, Filter, Search, CheckCircle, Clock } from 'lucide-react';

// Mock data based on your API structure
const mockConfirmedFtlData = [
  {
    id: 1,
    pickupCity: "Mumbai",
    deliveryCity: "Delhi",
    weightKg: 5000,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Closed Container",
    truckSize: "32ft",
    cost: 45000,
    created_at: "2026-01-20T10:30:00Z",
    Client: {
      id: 101,
      name: "Tech Solutions Pvt Ltd",
      email: "contact@techsolutions.com"
    }
  },
  {
    id: 2,
    pickupCity: "Pune",
    deliveryCity: "Bangalore",
    weightKg: 8000,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Open Flatbed",
    truckSize: "40ft",
    cost: 62000,
    created_at: "2026-01-19T14:20:00Z",
    Client: {
      id: 102,
      name: "Industrial Goods Co",
      email: "info@industrialgoods.com"
    }
  },
  {
    id: 3,
    pickupCity: "Hyderabad",
    deliveryCity: "Chennai",
    weightKg: 3000,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Refrigerated",
    truckSize: "24ft",
    cost: 38000,
    created_at: "2026-01-22T09:15:00Z",
    Client: {
      id: 103,
      name: "Fresh Farms Ltd",
      email: "orders@freshfarms.com"
    }
  },
  {
    id: 4,
    pickupCity: "Kolkata",
    deliveryCity: "Guwahati",
    weightKg: 6500,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Closed Container",
    truckSize: "32ft",
    cost: 55000,
    created_at: "2026-01-21T16:45:00Z",
    Client: {
      id: 104,
      name: "Eastern Logistics",
      email: "support@easternlogistics.com"
    }
  },
  {
    id: 5,
    pickupCity: "Ahmedabad",
    deliveryCity: "Jaipur",
    weightKg: 4200,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Open Body",
    truckSize: "24ft",
    cost: 32000,
    created_at: "2026-01-23T11:20:00Z",
    Client: {
      id: 105,
      name: "Gujarat Traders",
      email: "contact@gujarattraders.com"
    }
  },
  {
    id: 6,
    pickupCity: "Surat",
    deliveryCity: "Indore",
    weightKg: 7200,
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Closed Container",
    truckSize: "32ft",
    cost: 48000,
    created_at: "2026-01-18T08:30:00Z",
    Client: {
      id: 106,
      name: "Textile Exports Ltd",
      email: "info@textileexports.com"
    }
  }
];

const ConfirmedFTLDashboard = () => {
  const [ftlRequests, setFtlRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTransportMode, setFilterTransportMode] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'cost', 'weight'

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFtlRequests(mockConfirmedFtlData);
      setLoading(false);
    }, 800);
  }, []);

  const handleCardClick = (id) => {
    // Redirect to detail page
    console.log(`Redirecting to /ftl-confirmed/${id}`);
    // In a real app: window.location.href = `/ftl-confirmed/${id}`;
    // Or with React Router: navigate(`/ftl-confirmed/${id}`);
    alert(`Redirecting to Confirmed FTL Request #${id} detail page`);
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

  const filteredRequests = ftlRequests.filter(ftl => {
    const matchesSearch = 
      ftl.Client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ftl.pickupCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ftl.deliveryCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ftl.id.toString().includes(searchTerm);
    
    const matchesFilter = filterTransportMode === 'all' || ftl.transportMode === filterTransportMode;
    
    return matchesSearch && matchesFilter;
  });

  // Sort logic
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'cost') {
      return b.cost - a.cost;
    } else if (sortBy === 'weight') {
      return b.weightKg - a.weightKg;
    }
    return 0;
  });

  const totalRevenue = ftlRequests.reduce((sum, ftl) => sum + (ftl.cost || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmed requests...</p>
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
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-900">Confirmed Requests</h1>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Accepted shipments pending payment confirmation
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Total Confirmed</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">{sortedRequests.length}</p>
                </div>
                <Package className="w-10 h-10 text-green-600 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Expected Revenue</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-blue-600 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    {formatCurrency(totalRevenue / (sortedRequests.length || 1))}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-purple-600 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by client, city, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                value={filterTransportMode}
                onChange={(e) => setFilterTransportMode(e.target.value)}
              >
                <option value="all">All Transport Modes</option>
                <option value="Road">Road</option>
                <option value="Rail">Rail</option>
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
              </select>
            </div>

            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No confirmed requests found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRequests.map((ftl) => (
              <div
                key={ftl.id}
                onClick={() => handleCardClick(ftl.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 overflow-hidden group hover:border-green-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Request #{ftl.id}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="mt-1">
                    <span className="text-xs bg-green-700 bg-opacity-50 px-2 py-1 rounded-full">
                      Pending Payment
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Client Info */}
                  <div className="pb-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{ftl.Client.name}</p>
                    <p className="text-sm text-gray-500">{ftl.Client.email}</p>
                  </div>

                  {/* Route Info */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{ftl.pickupCity}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{ftl.deliveryCity}</span>
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
                          <p className="text-sm font-semibold text-blue-900">{ftl.truckSize || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <Weight className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-xs text-orange-700">Weight</p>
                          <p className="text-sm font-semibold text-orange-900">{ftl.weightKg} kg</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Type & Transport */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                      {ftl.bodyType}
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                      {ftl.transportMode}
                    </span>
                  </div>

                  {/* Cost Highlight */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">Order Value</span>
                      </div>
                      <span className="text-xl font-bold text-green-900">
                        {formatCurrency(ftl.cost)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Confirmed on {formatDate(ftl.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmedFTLDashboard;