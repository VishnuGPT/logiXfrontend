import React, { useEffect, useState } from "react";
import { Truck, CheckCircle, XCircle, Ban, FileText, Calendar } from "lucide-react";

/* -------------------- DUMMY DATA -------------------- */
const DUMMY_VEHICLES = [
    {
        id: 1,
        vehicleName: "Tata Ace",
        vehicleNumber: "UP32 AB 1234",
        dimension: "7x4x4 ft",
        capacity: "1.5 Ton",
        bodyType: "open",
        isRefrigerated: false,
        transporterId: 101,
        status: "unverified",
        rcUrl: "/uploads/rc_1.pdf",
        roadPermitUrl: "/uploads/permit_1.pdf",
        pollutionCertificateUrl: "/uploads/puc_1.pdf",
        createdAt: "2024-06-20T10:30:00Z",
    },
    {
        id: 2,
        vehicleName: "Ashok Leyland Dost",
        vehicleNumber: "DL01 CD 5678",
        dimension: "8x5x5 ft",
        capacity: "2 Ton",
        bodyType: "closed",
        isRefrigerated: true,
        transporterId: 102,
        status: "verified",
        rcUrl: "/uploads/rc_2.pdf",
        roadPermitUrl: "/uploads/permit_2.pdf",
        pollutionCertificateUrl: "/uploads/puc_2.pdf",
        createdAt: "2024-08-12T14:15:00Z",
    },
];

/* -------------------- HELPERS -------------------- */
const InfoRow = ({ label, value }) =>
    value ? (
        <div className="text-sm">
            <span className="text-gray-500 block">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    ) : null;

const DocLink = ({ label, url }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
    >
        <FileText size={16} /> {label} ↗
    </a>
);

/* -------------------- VEHICLE CARD -------------------- */
const VehicleCard = ({ vehicle, onView, onAction }) => {
    return (
        <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <Truck className="text-purple-600" />
                <h3 className="font-bold text-lg">{vehicle.vehicleName}</h3>
            </div>

            <InfoRow label="Vehicle No" value={vehicle.vehicleNumber} />
            <InfoRow label="Capacity" value={vehicle.capacity} />
            <InfoRow label="Body Type" value={vehicle.bodyType} />
            <InfoRow label="Status" value={vehicle.status} />

            {/* -------- ACTION BUTTONS -------- */}
            <div className="flex gap-2 mt-4">
                {vehicle.status === "unverified" && (
                    <>
                        <ActionButton
                            label="Verify"
                            icon={<CheckCircle size={16} />}
                            color="green"
                            onClick={() => onAction(vehicle.id, "verified")}
                        />
                        <ActionButton
                            label="Suspend"
                            icon={<Ban size={16} />}
                            color="red"
                            onClick={() => onAction(vehicle.id, "suspended")}
                        />
                    </>
                )}

                {vehicle.status === "verified" && (
                    <>
                        <ActionButton
                            label="Unverify"
                            icon={<XCircle size={16} />}
                            color="orange"
                            onClick={() => onAction(vehicle.id, "unverified")}
                        />
                        <ActionButton
                            label="Suspend"
                            icon={<Ban size={16} />}
                            color="red"
                            onClick={() => onAction(vehicle.id, "suspended")}
                        />
                    </>
                )}

                {vehicle.status === "suspended" && (
                    <ActionButton
                        label="Verify"
                        icon={<CheckCircle size={16} />}
                        color="green"
                        onClick={() => onAction(vehicle.id, "verified")}
                    />
                )}
            </div>

            <button
                onClick={() => onView(vehicle)}
                className="mt-3 w-full border border-purple-600 text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50"
            >
                View Full Details
            </button>
        </div>
    );
};

/* -------------------- VEHICLE MODAL -------------------- */
const VehicleModal = ({ vehicle, onClose }) => {
    if (!vehicle) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{vehicle.vehicleName}</h2>
                    <button onClick={onClose} className="text-2xl">×</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InfoRow label="Vehicle No" value={vehicle.vehicleNumber} />
                    <InfoRow label="Capacity" value={vehicle.capacity} />
                    <InfoRow label="Dimension" value={vehicle.dimension} />
                    <InfoRow label="Body Type" value={vehicle.bodyType} />
                    <InfoRow
                        label="Refrigerated"
                        value={vehicle.isRefrigerated ? "Yes" : "No"}
                    />
                    <InfoRow label="Transporter ID" value={`#${vehicle.transporterId}`} />
                    <InfoRow
                        label="Registered On"
                        value={new Date(vehicle.createdAt).toDateString()}
                    />
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <DocLink label="RC Document" url={vehicle.rcUrl} />
                    <DocLink label="Road Permit" url={vehicle.roadPermitUrl} />
                    <DocLink
                        label="Pollution Certificate"
                        url={vehicle.pollutionCertificateUrl}
                    />
                </div>
            </div>
        </div>
    );
};

/* -------------------- MAIN COMPONENT -------------------- */
export default function AdminVehicles() {
    const [vehicles, setVehicles] = useState(DUMMY_VEHICLES);
    const [activeTab, setActiveTab] = useState("unverified");
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    /* -------- FETCH -------- */
    useEffect(() => {
        // same logic as before (safe fallback)
    }, []);

    /* -------- STATUS UPDATE -------- */
    const updateStatus = async (vehicleId, status) => {
        // Optimistic UI
        setVehicles((prev) =>
            prev.map((v) =>
                v.id === vehicleId ? { ...v, status } : v
            )
        );

        // Backend hook
        try {
            const token = localStorage.getItem("token");
            await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/update-vehicle-status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ vehicleId, status }),
                }
            );
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const filteredVehicles = vehicles.filter(
        (v) => v.status === activeTab
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Vehicle Management</h1>

            {/* -------- TABS -------- */}
            <div className="flex gap-3 mb-6">
                {["unverified", "verified", "suspended"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold capitalize ${activeTab === tab
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* -------- LIST -------- */}
            {filteredVehicles.length === 0 ? (
                <p className="text-gray-500">No vehicles found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((v) => (
                        <VehicleCard
                            key={v.id}
                            vehicle={v}
                            onView={setSelectedVehicle}
                            onAction={updateStatus}
                        />
                    ))}
                </div>
            )}

            {selectedVehicle && (
                <VehicleModal
                    vehicle={selectedVehicle}
                    onClose={() => setSelectedVehicle(null)}
                />
            )}
        </div>
    );
}

/* -------------------- BUTTON -------------------- */
const ActionButton = ({ label, icon, onClick, color }) => {
    const colors = {
        green: "bg-green-600 hover:bg-green-700",
        red: "bg-red-600 hover:bg-red-700",
        orange: "bg-orange-500 hover:bg-orange-600",
    };

    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-1 text-sm text-white px-3 py-2 rounded-lg ${colors[color]}`}
        >
            {icon}
            {label}
        </button>
    );
};


