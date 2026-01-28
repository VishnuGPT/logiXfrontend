import React, { useState, useEffect } from 'react';
import { Package, MapPin, Calendar, Truck, Weight, DollarSign, ArrowRight, Filter, Search } from 'lucide-react';

// Mock data based on your Sequelize model
const mockFtlData = [
  {
    id: 1,
    clientId: 101,
    pickupAddressLine: "123 Industrial Area",
    pickupCity: "Mumbai",
    pickupState: "Maharashtra",
    pickupPincode: "400001",
    deliveryAddressLine: "456 Warehouse District",
    deliveryCity: "Delhi",
    deliveryState: "Delhi",
    deliveryPincode: "110001",
    expectedPickupDate: "2026-02-01",
    expectedDeliveryDate: "2026-02-05",
    materialType: "Electronics",
    customMaterialType: null,
    weightKg: 5000,
    length: 20,
    width: 8,
    height: 8,
    volumetricWeightKg: 5200,
    dimensionUnit: "feet",
    materialValue: 500000,
    additionalNotes: "Handle with care - fragile items",
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Closed Container",
    truckSize: "32ft",
    coolingType: null,
    manpower: "yes",
    noOfLabours: 2,
    status: "requested",
    cost: null,
    created_at: "2026-01-24T10:30:00Z",
    Client: {
      id: 101,
      name: "Tech Solutions Pvt Ltd",
      email: "contact@techsolutions.com",
      phone: "+91-9876543210"
    }
  },
  {
    id: 2,
    clientId: 102,
    pickupAddressLine: "789 Factory Road",
    pickupCity: "Pune",
    pickupState: "Maharashtra",
    pickupPincode: "411001",
    deliveryAddressLine: "321 Business Park",
    deliveryCity: "Bangalore",
    deliveryState: "Karnataka",
    deliveryPincode: "560001",
    expectedPickupDate: "2026-02-03",
    expectedDeliveryDate: "2026-02-07",
    materialType: "Machinery",
    customMaterialType: null,
    weightKg: 8000,
    length: 25,
    width: 10,
    height: 10,
    volumetricWeightKg: 8500,
    dimensionUnit: "feet",
    materialValue: 1200000,
    additionalNotes: "Heavy machinery - requires crane",
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Open Flatbed",
    truckSize: "40ft",
    coolingType: null,
    manpower: "yes",
    noOfLabours: 4,
    status: "requested",
    cost: null,
    created_at: "2026-01-23T14:20:00Z",
    Client: {
      id: 102,
      name: "Industrial Goods Co",
      email: "info@industrialgoods.com",
      phone: "+91-9876543211"
    }
  },
  {
    id: 3,
    clientId: 103,
    pickupAddressLine: "555 Cold Storage Complex",
    pickupCity: "Hyderabad",
    pickupState: "Telangana",
    pickupPincode: "500001",
    deliveryAddressLine: "888 Distribution Center",
    deliveryCity: "Chennai",
    deliveryState: "Tamil Nadu",
    deliveryPincode: "600001",
    expectedPickupDate: "2026-01-28",
    expectedDeliveryDate: "2026-01-31",
    materialType: "Perishable Goods",
    customMaterialType: "Fresh Vegetables",
    weightKg: 3000,
    length: 18,
    width: 7,
    height: 7,
    volumetricWeightKg: 3100,
    dimensionUnit: "feet",
    materialValue: 150000,
    additionalNotes: "Maintain temperature below 5°C",
    transportMode: "Road",
    shipmentType: "Full Truck Load",
    bodyType: "Refrigerated",
    truckSize: "24ft",
    coolingType: "Refrigerated",
    manpower: "no",
    noOfLabours: 0,
    status: "requested",
    cost: null,
    created_at: "2026-01-25T09:15:00Z",
    Client: {
      id: 103,
      name: "Fresh Farms Ltd",
      email: "orders@freshfarms.com",
      phone: "+91-9876543212"
    }
  }
];

const ShipmentRequestsDashboard = () => {
  const [ftlRequests, setFtlRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTransportMode, setFilterTransportMode] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFtlRequests(mockFtlData);
      setLoading(false);
    }, 800);
  }, []);

  const handleCardClick = (id) => {
    // Redirect to detail page
    console.log(`Redirecting to /ftl-request/${id}`);
    // In a real app: window.location.href = `/ftl-request/${id}`;
    // Or with React Router: navigate(`/ftl-request/${id}`);
    alert(`Redirecting to FTL Request #${id} detail page`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FTL Shipment Requests</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and review pending shipment requests
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <span className="font-semibold text-2xl">{filteredRequests.length}</span>
              <span className="ml-2 text-sm">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by client name, city, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
          </div>
        </div>

        {/* Cards Grid */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((ftl) => (
              <div
                key={ftl.id}
                onClick={() => handleCardClick(ftl.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5" />
                      <span className="font-semibold">Request #{ftl.id}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Client Info */}
                  <div className="pb-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{ftl.Client.name}</p>
                    <p className="text-sm text-gray-500">{ftl.Client.phone}</p>
                  </div>

                  {/* Route Info */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Pickup</p>
                        <p className="text-xs text-gray-600">
                          {ftl.pickupCity}, {ftl.pickupState} - {ftl.pickupPincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Delivery</p>
                        <p className="text-xs text-gray-600">
                          {ftl.deliveryCity}, {ftl.deliveryState} - {ftl.deliveryPincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {formatDate(ftl.expectedPickupDate)} → {formatDate(ftl.expectedDeliveryDate)}
                    </span>
                  </div>

                  {/* Shipment Details */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Truck Size</p>
                        <p className="text-sm font-medium text-gray-900">{ftl.truckSize || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Weight className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="text-sm font-medium text-gray-900">{ftl.weightKg} kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Material & Body Type */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {ftl.materialType}
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {ftl.bodyType}
                    </span>
                    {ftl.coolingType && (
                      <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                        {ftl.coolingType}
                      </span>
                    )}
                  </div>

                  {/* Material Value */}
                  {ftl.materialValue && (
                    <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Material Value</p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{ftl.materialValue.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Manpower */}
                  {ftl.manpower === 'yes' && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2">
                      <p className="text-xs text-amber-800">
                        <span className="font-semibold">Manpower Required:</span> {ftl.noOfLabours} labourers
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Requested {formatDate(ftl.created_at)}
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

export default ShipmentRequestsDashboard;