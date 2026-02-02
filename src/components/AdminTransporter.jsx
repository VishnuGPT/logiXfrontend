import React, { useEffect, useState } from "react";
import { Building2, Mail, Phone, Calendar, FileText, Shield, User, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const map = {
    verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    unverified: "bg-amber-50 text-amber-700 border-amber-200",
    suspended: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    verified: "✓",
    unverified: "⏳",
    suspended: "⊗",
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${map[status]} inline-flex items-center gap-1.5`}>
      <span>{icons[status]}</span>
      {status.toUpperCase()}
    </span>
  );
};

const ProfileStatusBadge = ({ status }) => {
  const isCompleted = status === 'completed';
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${isCompleted ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
      {isCompleted ? '✓ Complete' : '⋯ Pending'}
    </span>
  );
};

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


const TransporterCard = ({ transporter, onVerify, onSuspend, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (e) => {
    e.stopPropagation(); // Card click ko trigger nahi hone dega
    setExpanded(!expanded);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              {transporter.companyName}
            </h3>
            <p className="text-xs text-gray-500 font-mono">ID: {transporter.id}</p>
          </div>
          <StatusBadge status={transporter.status} />
        </div>

        <div className="flex gap-2">
          <ProfileStatusBadge status={transporter.profileStatus} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5">
        <div className="space-y-3 mb-4">
          <InfoRow icon={Mail} label="Email" value={transporter.email} />
          <InfoRow icon={Phone} label="Phone" value={transporter.phoneNumber} />
          <InfoRow icon={User} label="Designation" value={transporter.designation} />

          {expanded && (
            <>
              <div className="border-t border-gray-100 my-3 pt-3">
                {transporter.ownerName && (
                  <InfoRow icon={User} label="Owner Name" value={transporter.ownerName} />
                )}
                {transporter.ownerPhoneNumber && (
                  <InfoRow icon={Phone} label="Owner Phone" value={transporter.ownerPhoneNumber} className="mt-3" />
                )}
                {transporter.customerServiceNumber && (
                  <InfoRow icon={Phone} label="Customer Service" value={transporter.customerServiceNumber} className="mt-3" />
                )}
              </div>

              <div className="border-t border-gray-100 my-3 pt-3">
                <InfoRow icon={MapPin} label="Address" value={transporter.companyAddress} />
                <InfoRow icon={FileText} label="GST Number" value={transporter.gstNumber} className="mt-3" />
                {transporter.cinNumber && (
                  <InfoRow icon={FileText} label="CIN Number" value={transporter.cinNumber} className="mt-3" />
                )}
              </div>

              <div className="border-t border-gray-100 my-3 pt-3">
                <InfoRow
                  icon={Calendar}
                  label="Created"
                  value={new Date(transporter.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleExpandClick} // Updated to use handleExpandClick
          className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-1"
        >
          {expanded ? '← Show Less' : 'Show More →'}
        </button>

        {/* Actions */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onVerify(transporter.id)}
            disabled={transporter.status === 'verified'}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Verify
          </button>
          <button
            onClick={() => onSuspend(transporter.id)}
            disabled={transporter.status === 'suspended'}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
};

// Dummy data for demonstration
const DUMMY_TRANSPORTERS = [
  {
    id: 1001,
    ownerName: "Rajesh Kumar",
    ownerPhoneNumber: "+91 98765 43210",
    phoneNumber: "+91 98765 43211",
    designation: "Managing Director",
    companyName: "Swift Logistics Pvt Ltd",
    companyAddress: "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana 122015",
    email: "contact@swiftlogistics.com",
    gstNumber: "06AAAAA0000A1Z5",
    customerServiceNumber: "1800-123-4567",
    profileStatus: "completed",
    cinNumber: "U63000HR2015PTC053421",
    status: "verified",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-12-20T14:45:00Z"
  },
  {
    id: 1002,
    ownerName: "Priya Sharma",
    ownerPhoneNumber: "+91 87654 32109",
    phoneNumber: "+91 87654 32110",
    designation: "CEO",
    companyName: "Express Transport Solutions",
    companyAddress: "B-23, Transport Nagar, Delhi Road, Panipat, Haryana 132103",
    email: "info@expresstransport.in",
    gstNumber: "06BBBBB1111B2Z6",
    customerServiceNumber: "1800-234-5678",
    profileStatus: "completed",
    cinNumber: "U63000HR2018PTC067890",
    status: "verified",
    createdAt: "2024-02-22T09:15:00Z",
    updatedAt: "2025-01-05T11:20:00Z"
  },
  {
    id: 1003,
    ownerName: "Amit Patel",
    phoneNumber: "+91 76543 21098",
    designation: "Director",
    companyName: "FastMove Cargo Services",
    companyAddress: "Unit 12, Logistics Hub, NH-48, Ambala, Haryana 134003",
    email: "support@fastmovecargo.com",
    gstNumber: "06CCCCC2222C3Z7",
    profileStatus: "pending",
    status: "unverified",
    createdAt: "2024-11-10T16:45:00Z",
    updatedAt: "2024-11-10T16:45:00Z"
  },
  {
    id: 1004,
    ownerName: "Sunita Verma",
    ownerPhoneNumber: "+91 65432 10987",
    phoneNumber: "+91 65432 10988",
    designation: "Partner",
    companyName: "Northern Freight Carriers",
    companyAddress: "Warehouse 7, HSIIDC Estate, Bahadurgarh, Haryana 124507",
    email: "operations@northernfreight.co.in",
    gstNumber: "06DDDDD3333D4Z8",
    customerServiceNumber: "1800-345-6789",
    profileStatus: "completed",
    cinNumber: "U63000HR2020PTC078901",
    status: "suspended",
    createdAt: "2024-03-30T12:00:00Z",
    updatedAt: "2024-12-15T08:30:00Z"
  },
  {
    id: 1005,
    ownerName: "Mohammad Ali",
    phoneNumber: "+91 54321 09876",
    designation: "Proprietor",
    companyName: "Reliable Roadways",
    companyAddress: "Shop No. 8, Transport Market, Hisar, Haryana 125001",
    email: "reliableroadways@gmail.com",
    gstNumber: "06EEEEE4444E5Z9",
    profileStatus: "pending",
    status: "unverified",
    createdAt: "2025-01-02T14:20:00Z",
    updatedAt: "2025-01-02T14:20:00Z"
  },
  {
    id: 1006,
    ownerName: "Neha Singh",
    ownerPhoneNumber: "+91 43210 98765",
    phoneNumber: "+91 43210 98766",
    designation: "General Manager",
    companyName: "Prime Movers India Ltd",
    companyAddress: "Corporate Office, Sector 32, Faridabad, Haryana 121003",
    email: "contact@primemoversindia.com",
    gstNumber: "06FFFFF5555F6Z1",
    customerServiceNumber: "1800-456-7890",
    profileStatus: "completed",
    cinNumber: "U63000HR2019PTC071234",
    status: "verified",
    createdAt: "2024-05-18T11:30:00Z",
    updatedAt: "2024-12-28T15:10:00Z"
  }
];

const AdminTransporters = () => {
  const [transporters, setTransporters] = useState([]);
  const [isDummy, setIsDummy] = useState(false);

  const [searchType, setSearchType] = useState("company");
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);
  const navigate = useNavigate();
  const handleCardClick = (transporterId) => {
    navigate(`/admin/transporters/${transporterId}`);
  };
  const fetchTransporters = async () => {
    setLoading(true);
    setIsDummy(false);

    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        searchType,
        searchValue,
        status,
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/get-transporters?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("API failed");

      const result = await res.json();

      console.log("RAW TRANSPORTER API RESPONSE:", result);

      // ✅ BACKEND → REAL DATA
      if (
        result?.isValid === true &&
        Array.isArray(result?.data) &&
        result.data.length > 0
      ) {
        setTransporters(result.data);
        setIsDummy(false);
      }
      // ⚠️ BACKEND EMPTY → DUMMY
      else {
        setTransporters(DUMMY_TRANSPORTERS);
        setIsDummy(true);
      }

    } catch (error) {
      console.error("Error fetching transporters:", error);
      setTransporters(DUMMY_TRANSPORTERS);
      setIsDummy(true);
    } finally {
      setLoading(false);
    }
  };


  const handleVerify = async (id) => {
    console.log("Verify transporter:", id);
    // Add your verify API call here
  };

  const handleSuspend = async (id) => {
    console.log("Suspend transporter:", id);
    // Add your suspend API call here
  };

  useEffect(() => {
    fetchTransporters();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transporter Management</h1>
          <p className="text-gray-500">Manage and monitor all registered transporters</p>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex gap-4 flex-wrap items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search By
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="id">Transporter ID</option>
                <option value="company">Company Name</option>
              </select>
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Term
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter search term..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="verified">✓ Verified</option>
                <option value="unverified">⏳ Unverified</option>
                <option value="suspended">⊗ Suspended</option>
              </select>
            </div>

            <button
              onClick={fetchTransporters}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 px-2">
          <span className="font-medium">
            {transporters.length} {transporters.length === 1 ? 'transporter' : 'transporters'} found
          </span>
        </div>
        {
          isDummy && (
            <p className="text-sm text-orange-600 px-2">
              Showing demo transporters (no transporter found in database)
            </p>
          )
        }
        {/* Transporter Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading transporters...</p>
          </div>
        ) : transporters.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transporters found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transporters.map((t) => (
              <TransporterCard
                key={t.id}
                transporter={t}
                onVerify={handleVerify}
                onSuspend={handleSuspend}
                onClick={() => handleCardClick(t.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransporters;