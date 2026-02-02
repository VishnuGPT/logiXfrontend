import React, { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    Building2,
    FileText,
    Calendar,
    MapPin,
    BadgeCheck,
    BadgeX,
} from "lucide-react";

/* -------------------- DUMMY DATA -------------------- */
const DUMMY_CLIENTS = [
    {
        id: 5001,
        name: "Amit Sharma",
        email: "amit@example.com",
        phoneNumber: "9876543210",
        companyName: "Sharma Logistics",
        companyAddress: "Delhi, India",
        gstNumber: "07ABCDE1234F1Z5",
        isProfileComplete: true,
        createdAt: "2024-06-10T10:30:00Z",
    },
    {
        id: 5002,
        name: "Rohit Verma",
        email: "rohit@example.com",
        phoneNumber: "8765432109",
        companyName: "Verma Traders",
        companyAddress: "Kanpur, UP",
        gstNumber: null,
        isProfileComplete: false,
        createdAt: "2024-08-21T14:20:00Z",
    },
];

/* -------------------- SMALL HELPERS -------------------- */
const InfoRow = ({ icon: Icon, label, value }) => {
    if (!value) return null;

    return (
        <div className="flex gap-2 text-sm">
            <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
};

/* -------------------- CLIENT CARD -------------------- */
const ClientCard = ({ client, onView }) => {
    return (
        <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <User className="text-purple-600" />
                    <h3 className="font-bold text-lg">
                        {client.name || "Unnamed Client"}
                    </h3>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${client.isProfileComplete
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                >
                    {client.isProfileComplete ? "Profile Complete" : "Incomplete"}
                </span>
            </div>

            <InfoRow icon={Mail} label="Email" value={client.email} />
            <InfoRow icon={Phone} label="Phone" value={client.phoneNumber} />
            <InfoRow icon={Building2} label="Company" value={client.companyName} />

            <button
                onClick={() => onView(client)}
                className="mt-4 w-full border border-purple-600 text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50"
            >
                View Full Details
            </button>
        </div>
    );
};

/* -------------------- CLIENT MODAL -------------------- */
const ClientModal = ({ client, onClose }) => {
    if (!client) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {client.name || "Client Details"}
                    </h2>
                    <button onClick={onClose} className="text-2xl">
                        ×
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InfoRow icon={Mail} label="Email" value={client.email} />
                    <InfoRow icon={Phone} label="Phone" value={client.phoneNumber} />
                    <InfoRow
                        icon={Building2}
                        label="Company"
                        value={client.companyName}
                    />
                    <InfoRow
                        icon={MapPin}
                        label="Address"
                        value={client.companyAddress}
                    />
                    <InfoRow
                        icon={FileText}
                        label="GST Number"
                        value={client.gstNumber}
                    />
                    <InfoRow
                        icon={Calendar}
                        label="Registered On"
                        value={
                            client.createdAt
                                ? new Date(client.createdAt).toDateString()
                                : null
                        }
                    />
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                    {client.isProfileComplete ? (
                        <>
                            <BadgeCheck className="text-green-600" />
                            <span className="font-semibold text-green-700">
                                Profile Complete
                            </span>
                        </>
                    ) : (
                        <>
                            <BadgeX className="text-yellow-600" />
                            <span className="font-semibold text-yellow-700">
                                Profile Incomplete
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/* -------------------- MAIN COMPONENT -------------------- */
export default function AdminClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isDummy, setIsDummy] = useState(false);

    const fetchClients = async () => {
        setLoading(true);
        setIsDummy(false);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/get-clients`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) throw new Error("API failed");

            const result = await res.json();

            console.log("RAW CLIENT API RESPONSE:", result);

            // ✅ THIS MATCHES YOUR BACKEND RESPONSE
            if (
                result?.isValid === true &&
                Array.isArray(result?.data) &&
                result.data.length > 0
            ) {
                setClients(result.data);
                setIsDummy(false);
            } else {
                setClients(DUMMY_CLIENTS);
                setIsDummy(true);
            }

        } catch (error) {
            console.error("Fetch clients error:", error.message);
            setClients(DUMMY_CLIENTS);
            setIsDummy(true);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Client Management</h1>

            {isDummy && (
                <p className="text-sm text-orange-600 mb-4">
                    Showing demo data (no clients found from backend)
                </p>
            )}

            {loading ? (
                <p>Loading clients...</p>
            ) : clients.length === 0 ? (
                <p>No clients found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onView={setSelectedClient}
                        />
                    ))}
                </div>
            )}

            {selectedClient && (
                <ClientModal
                    client={selectedClient}
                    onClose={() => setSelectedClient(null)}
                />
            )}
        </div>
    );
}

