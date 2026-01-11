import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Calendar, Scale, Ruler, Thermometer, Users, Info, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const RequestedShipment = () => {
    const [requests, setRequests] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transporter/available-requests`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setRequests(res.data.data);
        };
        fetchRequests();
    }, []);

    const safeDisplay = (val, suffix = "") => (val ? `${val}${suffix}` : <span className="text-gray-300 italic">N/A</span>);

    return (
        <div className="grid grid-cols-1 gap-6">
            {requests.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* TOP SECTION */}
                    <div className="p-5 flex justify-between items-center bg-white">
                        <div className="flex gap-4 items-center">
                            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">
                                    {item.materialType === 'other' ? item.customMaterialType : item.materialType}
                                </h3>
                                <p className="text-sm text-slate-500">{item.pickupCity} → {item.deliveryCity}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                            {expandedId === item.id ? <ChevronUp /> : <ChevronDown />}
                        </button>
                    </div>

                    {/* EXPANDED DETAILS */}
                    {expandedId === item.id && (
                        <div className="p-6 border-t border-slate-50 bg-slate-50/30 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Pickup/Drop */}
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <MapPin size={16} className="text-blue-500 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup Address</p>
                                            <p className="text-sm">{item.pickupAddressLine}, {item.pickupState} ({item.pickupPincode})</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <MapPin size={16} className="text-red-500 mt-1" />
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Address</p>
                                            <p className="text-sm">{item.deliveryAddressLine}, {item.deliveryState} ({item.deliveryPincode})</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cargo/Vehicle */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Scale size={12}/> Weight</p>
                                        <p className="text-sm font-semibold">{safeDisplay(item.weightKg, " kg")}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Thermometer size={12}/> Cooling</p>
                                        <p className="text-sm font-semibold capitalize">{safeDisplay(item.coolingType)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Truck size={12}/> Vehicle</p>
                                        <p className="text-sm font-semibold">{item.truckSize} ({item.bodyType})</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Ruler size={12}/> Dimensions</p>
                                        <p className="text-sm font-semibold">
                                            {item.length ? `${item.length}x${item.width}x${item.height} ${item.dimensionUnit}` : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Dates & Labour */}
                                <div className="space-y-3">
                                    <div className="flex gap-2 items-center">
                                        <Calendar size={16} className="text-slate-400" />
                                        <p className="text-sm"><strong>Pickup:</strong> {item.expectedPickupDate}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Users size={16} className="text-slate-400" />
                                        <p className="text-sm"><strong>Labour:</strong> {item.manpower === 'yes' ? `${item.noOfLabours} persons` : 'None required'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="p-4 bg-white rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Info size={12}/> Notes</p>
                                <p className="text-sm text-slate-600 italic">{item.additionalNotes || "No additional instructions provided."}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                    Submit Quotation
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RequestedShipment;