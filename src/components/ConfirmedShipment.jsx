import React, { useState, useEffect } from 'react';
import {
    MapPin, Truck, Calendar, Scale, Ruler,
    Thermometer, Users, Info, ChevronDown,
    ChevronUp, DollarSign, X, AlertCircle, Loader2
} from 'lucide-react';
import axios from 'axios';

const ConfirmedShipment = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/transporter/confirmed-requests`, {
                headers: { authorization: `Bearer ${token}` }
            });
            console.log(res)
            setRequests(res.data.data);


        } catch (err) {
            console.error("Error fetching requests", err);
        } finally {
            setLoading(false);
        }
    };



    const safeDisplay = (val, suffix = "") => (val ? `${val}${suffix}` : <span className="text-gray-300 italic">N/A</span>);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>Loading confirmed shipments...</p>
            </div>
        );
    }
    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
            {requests.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Truck className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">No Confirmed Shipments</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {requests.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            {/* Header Card */}
                            <div className="p-5 flex justify-between items-center bg-white cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                                <div className="flex gap-4 items-center">
                                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-800 uppercase tracking-tight">
                                                {item.materialType === 'other' ? item.customMaterialType : item.materialType}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Active</span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium">{item.pickupCity} → {item.deliveryCity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:block text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Weight</p>
                                        <p className="text-sm font-semibold">{item.weightKg} kg</p>
                                    </div>
                                    {expandedId === item.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </div>

                            {/* Details Drawer */}
                            {expandedId === item.id && (
                                <div className="p-6 border-t border-slate-50 bg-slate-50/30 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Route Section */}
                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                    <div className="w-0.5 h-10 bg-slate-200" />
                                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup</p>
                                                        <p className="text-sm font-medium leading-tight">{item.pickupAddressLine}, {item.pickupState} ({item.pickupPincode})</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery</p>
                                                        <p className="text-sm font-medium leading-tight">{item.deliveryAddressLine}, {item.deliveryState} ({item.deliveryPincode})</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cargo Section */}
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-x px-0 md:px-8 border-slate-200">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Scale size={12} /> Weight</p>
                                                <p className="text-sm font-semibold">{safeDisplay(item.weightKg, " kg")}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Thermometer size={12} /> Cooling</p>
                                                <p className="text-sm font-semibold capitalize">{safeDisplay(item.coolingType)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Truck size={12} /> Vehicle</p>
                                                <p className="text-sm font-semibold text-blue-600">{item.truckSize} <span className="text-slate-400 font-normal">({item.bodyType})</span></p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Ruler size={12} /> Dimensions</p>
                                                <p className="text-sm font-semibold">
                                                    {item.length ? `${item.length}x${item.width}x${item.height} ${item.dimensionUnit}` : "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Meta Section */}
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar size={12} /> Expected Pickup</p>
                                                <p className="text-sm font-semibold">{new Date(item.expectedPickupDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Users size={12} /> Manpower</p>
                                                <p className="text-sm font-semibold">
                                                    {item.manpower === 'yes' ? `${item.noOfLabours} helpers required` : 'Not required'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {item.additionalNotes && (
                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1"><Info size={12} /> Special Instructions</p>
                                            <p className="text-sm text-amber-800">{item.additionalNotes}</p>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ConfirmedShipment;