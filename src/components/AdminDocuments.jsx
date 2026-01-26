import React, { useEffect, useState } from "react";
import {
    FileText,
    CheckCircle,
    XCircle,
    Ban,
    Building2,
} from "lucide-react";

/* -------------------- DUMMY DATA -------------------- */
const DUMMY_DOCUMENTS = [
    {
        id: 1,
        transporterId: 1001,
        status: "unverified",
        gst: { isSubmitted: true, isVerified: "false", name: "GST Certificate", key: "/docs/gst.pdf" },
        pan: { isSubmitted: true, isVerified: "true", name: "PAN Card", key: "/docs/pan.pdf" },
        aadhar: { isSubmitted: false, isVerified: "false", name: "Owner Aadhar", key: null },
        cancelledCheck: { isSubmitted: true, isVerified: "false", name: "Cancelled Check", key: "/docs/check.pdf" },
        passBookCopy: { isSubmitted: false, isVerified: "false", name: "Passbook Copy", key: null },
    },
];

/* -------------------- HELPERS -------------------- */
const DOC_KEYS = ["gst", "pan", "aadhar", "cancelledCheck", "passBookCopy"];

const StatusBadge = ({ status }) => {
    const map = {
        verified: "bg-green-100 text-green-700",
        unverified: "bg-yellow-100 text-yellow-700",
        suspended: "bg-red-100 text-red-700",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
            {status}
        </span>
    );
};

/* -------------------- DOCUMENT CARD -------------------- */
const DocumentCard = ({ doc, onDocUpdate, onStatusUpdate }) => {
    return (
        <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Building2 className="text-purple-600" />
                    <h3 className="font-bold">Transporter #{doc.transporterId}</h3>
                </div>
                <StatusBadge status={doc.status} />
            </div>

            {/* Individual Documents */}
            <div className="space-y-3">
                {DOC_KEYS.map((key) => {
                    const d = doc[key];
                    if (!d) return null;

                    return (
                        <div
                            key={key}
                            className="flex items-center justify-between border rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-semibold">{d.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {d.isSubmitted ? "Submitted" : "Not Submitted"} ·{" "}
                                        {d.isVerified === "true" ? "Verified" : "Unverified"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {d.isSubmitted && d.isVerified !== "true" && (
                                    <button
                                        onClick={() => onDocUpdate(doc.id, key, "true")}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                                {d.isVerified === "true" && (
                                    <button
                                        onClick={() => onDocUpdate(doc.id, key, "false")}
                                        className="text-orange-600 hover:text-orange-700"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                )}
                                {d.key && (
                                    <a
                                        href={d.key}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 text-sm"
                                    >
                                        View
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Overall Actions */}
            <div className="flex gap-2 mt-4">
                {doc.status !== "verified" && (
                    <ActionBtn
                        label="Verify All"
                        icon={<CheckCircle size={16} />}
                        color="green"
                        onClick={() => onStatusUpdate(doc.id, "verified")}
                    />
                )}
                {doc.status === "verified" && (
                    <ActionBtn
                        label="Unverify"
                        icon={<XCircle size={16} />}
                        color="orange"
                        onClick={() => onStatusUpdate(doc.id, "unverified")}
                    />
                )}
                <ActionBtn
                    label="Suspend"
                    icon={<Ban size={16} />}
                    color="red"
                    onClick={() => onStatusUpdate(doc.id, "suspended")}
                />
            </div>
        </div>
    );
};

/* -------------------- MAIN COMPONENT -------------------- */
export default function AdminDocuments() {
    const [documents, setDocuments] = useState(DUMMY_DOCUMENTS);
    const [activeTab, setActiveTab] = useState("unverified");

    /* -------- Fetch -------- */
    useEffect(() => {
        // backend hook can be added safely
    }, []);

    /* -------- Update Single Doc -------- */
    const updateDocument = (docId, docKey, isVerified) => {
        setDocuments((prev) =>
            prev.map((d) =>
                d.id === docId
                    ? {
                        ...d,
                        [docKey]: {
                            ...d[docKey],
                            isVerified,
                        },
                    }
                    : d
            )
        );
    };

    /* -------- Update Overall Status -------- */
    const updateStatus = (docId, status) => {
        setDocuments((prev) =>
            prev.map((d) => (d.id === docId ? { ...d, status } : d))
        );
    };

    const filteredDocs = documents.filter(
        (d) => d.status === activeTab
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Transporter Documents</h1>

            {/* Tabs */}
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

            {filteredDocs.length === 0 ? (
                <p className="text-gray-500">No documents found</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDocs.map((doc) => (
                        <DocumentCard
                            key={doc.id}
                            doc={doc}
                            onDocUpdate={updateDocument}
                            onStatusUpdate={updateStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* -------------------- BUTTON -------------------- */
const ActionBtn = ({ label, icon, onClick, color }) => {
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

