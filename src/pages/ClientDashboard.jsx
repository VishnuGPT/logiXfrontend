import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ClipboardList, PlusCircle, Truck, History, LogOut, Package, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShipmentCard from '../components/ShipmentCard';

const ClientDashboard = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('bidding');
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false); // 🔑 important

    const tabConfig = {
        bidding: { label: 'Open Bids', status: 'requested', icon: <ClipboardList size={20} /> },
        pending: { label: 'Pending Payment', status: 'accepted', icon: <PlusCircle size={20} /> },
        active: { label: 'Active Shipments', status: 'confirmed,ongoing', icon: <Truck size={20} /> },
        history: { label: 'History', status: 'completed', icon: <History size={20} /> },
    };

    const fetchShipments = useCallback(async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token');

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/client/shipments`,
                {
                    params: { status: tabConfig[activeTab].status },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = Array.isArray(res.data?.data)
                ? res.data.data
                : Array.isArray(res.data)
                ? res.data
                : [];

            setShipments(data);
            setAuthChecked(true); // ✅ user is real

        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
            navigate('/', { replace: true }); // 🚪 kick out
        } finally {
            setLoading(false);
        }
    }, [activeTab, navigate]);

    useEffect(() => {
        fetchShipments();
    }, [fetchShipments]);

    // ⛔ BLOCK UI UNTIL AUTH IS VERIFIED
    if (!authChecked) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Truck /> LogiXjunction
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {Object.entries(tabConfig).map(([key, item]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl ${
                                activeTab === key
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/');
                        }}
                        className="flex items-center gap-3 text-red-500"
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto p-10">
                {loading ? (
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                ) : shipments.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {shipments.map(s => (
                            <ShipmentCard key={s.id} shipment={s} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-400">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        No shipments found
                    </div>
                )}
            </main>
        </div>
    );
};

export default ClientDashboard;
