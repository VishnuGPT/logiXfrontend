import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FileText,
    CheckCircle,
    XCircle,
    Ban,
    Building2,
    AlertTriangle,
} from "lucide-react";

/* -------------------- DUMMY DATA -------------------- */
const DUMMY_DOCUMENTS = [
    {
        id: "dummy",
        transporterId: "DEMO",
        status: "unverified",
        isDummy: true,
        gst: { isSubmitted: false, isVerified: "false", name: "GST Certificate", key: null },
        pan: { isSubmitted: false, isVerified: "false", name: "PAN Card", key: null },
        aadhar: { isSubmitted: false, isVerified: "false", name: "Owner Aadhar", key: null },
        cancelledCheck: { isSubmitted: false, isVerified: "false", name: "Cancelled Check", key: null },
        passBookCopy: { isSubmitted: false, isVerified: "false", name: "Passbook Copy", key: null },
    },
];

const DOC_KEYS = ["gst", "pan", "aadhar", "cancelledCheck", "passBookCopy"];

/* -------------------- HELPERS -------------------- */
const getDocStatusText = (doc) => {
    if (!doc.isSubmitted) return "Not uploaded";
    if (doc.isVerified === "true") return "Approved";
    if (doc.isVerified === "rejected") return "Rejected";
    return "Pending";
};

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
const DocumentCard = ({ doc, onApprove, onOpenReject, onStatusUpdate }) => (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <Building2 className="text-purple-600" />
                <h3 className="font-bold">Transporter #{doc.transporterId}</h3>
            </div>
            <StatusBadge status={doc.status} />
        </div>

        <div className="space-y-3">
            {DOC_KEYS.map((key) => {
                const d = doc[key];
                if (!d) return null;

                return (
                    <div key={key} className="flex justify-between items-center border rounded-lg p-3">
                        <div className="flex gap-2">
                            <FileText className="w-4 h-4 text-gray-500 mt-1" />
                            <div>
                                <p className="text-sm font-semibold">{d.name}</p>
                                <p className="text-xs text-gray-500">{getDocStatusText(d)}</p>

                                {d.isVerified === "rejected" && d.description && (
                                    <p className="text-xs text-red-600 mt-1">
                                        ❌ {d.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            {d.isSubmitted && d.isVerified === "false" && !doc.isDummy && (
                                <>
                                    <button
                                        onClick={() => onApprove(doc.transporterId, key)}
                                        className="text-green-600"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                    <button
                                        onClick={() => onOpenReject(doc.transporterId, key)}
                                        className="text-red-600"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </>
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

        {!doc.isDummy && (
            <div className="flex gap-2 mt-4">
                {doc.status !== "verified" && (
                    <ActionBtn
                        label="Verify All"
                        icon={<CheckCircle size={16} />}
                        color="green"
                        onClick={() => onStatusUpdate(doc.transporterId, "verified")}
                    />
                )}
                <ActionBtn
                    label="Suspend"
                    icon={<Ban size={16} />}
                    color="red"
                    onClick={() => onStatusUpdate(doc.transporterId, "suspended")}
                />
            </div>
        )}
    </div>
);

/* -------------------- MAIN COMPONENT -------------------- */
export default function AdminDocuments() {
    const [documents, setDocuments] = useState(DUMMY_DOCUMENTS);
    const [activeTab, setActiveTab] = useState("unverified");
    const [usingDummy, setUsingDummy] = useState(false);

    const [rejectModal, setRejectModal] = useState({ open: false, transporterId: null, docKey: null });
    const [rejectReason, setRejectReason] = useState("");

    /* -------------------- FETCH -------------------- */
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/admin/get-transporters`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!res.data?.data?.length) {
                    setUsingDummy(true);
                    setDocuments(DUMMY_DOCUMENTS);
                    return;
                }

                const realDocs = res.data.data.map((t) => ({
                    id: t.id,
                    transporterId: t.id,
                    status: t.Document?.status || "unverified",
                    isDummy: false,
                    gst: t.Document?.gst,
                    pan: t.Document?.pan,
                    aadhar: t.Document?.aadhar,
                    cancelledCheck: t.Document?.cancelledCheck,
                    passBookCopy: t.Document?.passBookCopy,
                }));

                setDocuments(realDocs);
                setUsingDummy(false);
            } catch {
                setUsingDummy(true);
                setDocuments(DUMMY_DOCUMENTS);
            }
        };

        fetchDocs();
    }, []);

    /* -------------------- ACTIONS -------------------- */
    const onApprove = async (transporterId, docKey) => {
        const token = localStorage.getItem("token");

        await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/documents/${transporterId}/${docKey}/approve`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setDocuments(prev =>
            prev.map(d =>
                d.transporterId === transporterId
                    ? { ...d, [docKey]: { ...d[docKey], isVerified: "true", isSubmitted: true, description: "" } }
                    : d
            )
        );
    };

    const onRejectConfirm = async () => {
        if (!rejectReason.trim()) return;

        const token = localStorage.getItem("token");
        const { transporterId, docKey } = rejectModal;

        await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/documents/${transporterId}/${docKey}/reject`,
            { description: rejectReason },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setDocuments(prev =>
            prev.map(d =>
                d.transporterId === transporterId
                    ? {
                        ...d,
                        [docKey]: {
                            ...d[docKey],
                            isSubmitted: false,
                            isVerified: "rejected",
                            description: rejectReason,
                            key: null,
                        },
                    }
                    : d
            )
        );

        setRejectModal({ open: false, transporterId: null, docKey: null });
        setRejectReason("");
    };

    const onStatusUpdate = async (transporterId, status) => {
        const token = localStorage.getItem("token");

        await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/admin/documents/${transporterId}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setDocuments(prev =>
            prev.map(d =>
                d.transporterId === transporterId ? { ...d, status } : d
            )
        );
    };

    const filteredDocs = documents.filter(d => d.status === activeTab);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Transporter Documents</h1>

            {usingDummy && (
                <div className="mb-4 flex items-center gap-2 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg">
                    <AlertTriangle size={18} />
                    No transporter found — showing demo documents
                </div>
            )}

            <div className="flex gap-3 mb-6">
                {["unverified", "verified", "suspended"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold capitalize ${activeTab === tab ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredDocs.map(doc => (
                    <DocumentCard
                        key={doc.id}
                        doc={doc}
                        onApprove={onApprove}
                        onOpenReject={(t, k) => setRejectModal({ open: true, transporterId: t, docKey: k })}
                        onStatusUpdate={onStatusUpdate}
                    />
                ))}
            </div>

            {/* -------------------- REJECT MODAL -------------------- */}
            {rejectModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-3">Reject Document</h2>

                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason"
                            className="w-full border rounded-lg p-2 text-sm mb-4"
                            rows={4}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setRejectModal({ open: false })}
                                className="px-4 py-2 rounded bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onRejectConfirm}
                                disabled={!rejectReason.trim()}
                                className="px-4 py-2 rounded bg-red-600 text-white"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
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


