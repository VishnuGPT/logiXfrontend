import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ClipboardList, PlusCircle, Truck, History, LogOut, Package, Loader2 } from 'lucide-react';
import ShipmentCard from '../components/ShipmentCard';

const ClientDashboard = () => {
    const [activeTab, setActiveTab] = useState('bidding');
    const [shipments, setShipments] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/client`;

    const tabConfig = {
        bidding: { label: 'Open Bids', status: 'requested', icon: <ClipboardList size={20} /> },
        pending: { label: 'Pending Payment', status: 'accepted', icon: <PlusCircle size={20} /> },
        active: { label: 'Active Shipments', status: 'confirmed,ongoing', icon: <Truck size={20} /> },
        history: { label: 'History', status: 'completed', icon: <History size={20} /> },
    };

    const fetchShipments = useCallback(async () => {
        setLoading(true);
        setError(null);
        const fullUrl = `${import.meta.env.VITE_API_URL}/api/client/shipments`;
        console.log("Fetching from:", fullUrl);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(fullUrl, {
                params: { status: tabConfig[activeTab].status },
                headers: { Authorization: `Bearer ${token}` }
            }); console.log(response.data)

            // --- THE FIX STARTS HERE ---
            // 1. Try to get the array from 'data' property (if you wrapped it in the controller)
            // 2. Otherwise, check if response.data itself is the array
            // 3. Otherwise, default to an empty array []
            let fetchedData = [];

            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                fetchedData = response.data.data;
            } else if (Array.isArray(response.data)) {
                fetchedData = response.data;
            }
            console.log(fetchedData)

            setShipments(fetchedData);
            // --- THE FIX ENDS HERE ---

        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Failed to load shipments.");
            setShipments([]); // Always reset to array on error
        } finally {
            setLoading(false);
        }
    }, [activeTab]);
    useEffect(() => {
        fetchShipments();
    }, [fetchShipments]);

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Truck /> <span>LogiXjunction</span>
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {Object.entries(tabConfig).map(([key, item]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTab === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {item.icon} <span className="font-semibold">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-6 border-t border-slate-100">
                    <button className="flex items-center gap-3 px-4 py-3 text-red-500 w-full"><LogOut size={20} /> Sign Out</button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-10 py-5 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">{tabConfig[activeTab].label}</h2>
                    <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
                        <PlusCircle size={18} /> Post New Load
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-10">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                            <p>Loading...</p>
                        </div>
                    ) : shipments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {shipments.map((shipment) => (
                                <ShipmentCard
                                    key={shipment.id}
                                    shipment={shipment}
                                    onActionComplete={fetchShipments}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 text-slate-400">
                            <Package size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">No shipments found in {tabConfig[activeTab].label}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;