import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Calendar, Scale, Ruler, Thermometer, Users, Info, ChevronDown, ChevronUp, DollarSign, X } from 'lucide-react';
import axios from 'axios';

const RequestedShipment = () => {
    const [requests, setRequests] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    
    // --- New States for Quotation Feature ---
    const [quotingId, setQuotingId] = useState(null);
    const [quoteData, setQuoteData] = useState({
        baseFreight: '',
        odaCharges: '',
        detentionCharges: '',
        otherCharges: '',
        additionalNotes: '',
        // New Fields
        canMeetDates: 'yes',
        expectedPickupDate: '',
        expectedDeliveryDate: '',
        canMeetLabour: 'yes',
        labourCharges: ''
    });

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transporter/available-requests`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setRequests(res.data.data);
            } catch (err) {
                console.error("Error fetching requests", err);
            }
        };
        fetchRequests();
    }, []);

    const handleQuoteChange = (e) => {
        const { name, value } = e.target;
        setQuoteData(prev => ({ ...prev, [name]: value }));
    };

    const submitQuote = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/transporter/submit-quotation`, {
                shipmentId: quotingId,
                ...quoteData
            }, {
                headers: { authorization: `Bearer ${token}` }
            });
            alert("Quotation submitted successfully!");
            setQuotingId(null); // Close form
            setQuoteData({ 
                baseFreight: '', odaCharges: '', detentionCharges: '', otherCharges: '', additionalNotes: '',
                canMeetDates: 'yes', expectedPickupDate: '', expectedDeliveryDate: '',
                canMeetLabour: 'yes', labourCharges: ''
            });
        } catch (err) {
            alert("Failed to submit quotation. Please try again.");
        }
    };

    const safeDisplay = (val, suffix = "") => (val ? `${val}${suffix}` : <span className="text-gray-300 italic">N/A</span>);

    // Find the current shipment being quoted to check labour requirements
    const activeRequest = requests.find(r => r.id === quotingId);

    return (
        <div className="grid grid-cols-1 gap-6 relative">
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
                                <button 
                                    onClick={() => setQuotingId(item.id)}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    Submit Quotation
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* QUOTATION MODAL OVERLAY */}
            {quotingId && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <DollarSign size={18} className="text-green-600"/> Submit Your Quote
                            </h3>
                            <button onClick={() => setQuotingId(null)} className="text-slate-400 hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={submitQuote} className="p-6 space-y-6 overflow-y-auto">
                            {/* Pricing Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Base Freight</label>
                                    <input required type="number" name="baseFreight" value={quoteData.baseFreight} onChange={handleQuoteChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0.00" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">ODA Charges</label>
                                    <input type="number" name="odaCharges" value={quoteData.odaCharges} onChange={handleQuoteChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0.00" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Detention</label>
                                    <input type="number" name="detentionCharges" value={quoteData.detentionCharges} onChange={handleQuoteChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0.00" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Other Charges</label>
                                    <input type="number" name="otherCharges" value={quoteData.otherCharges} onChange={handleQuoteChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0.00" />
                                </div>
                            </div>

                            {/* Date Confirmation Section */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Timeline Fulfillment</p>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="canMeetDates" value="yes" checked={quoteData.canMeetDates === 'yes'} onChange={handleQuoteChange} /> Can meet requested dates
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="canMeetDates" value="no" checked={quoteData.canMeetDates === 'no'} onChange={handleQuoteChange} /> Need different dates
                                    </label>
                                </div>
                                
                                {quoteData.canMeetDates === 'no' && (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500">Your Pickup Date</label>
                                            <input required type="date" name="expectedPickupDate" value={quoteData.expectedPickupDate} onChange={handleQuoteChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500">Your Delivery Date</label>
                                            <input required type="date" name="expectedDeliveryDate" value={quoteData.expectedDeliveryDate} onChange={handleQuoteChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Conditional Labour Section */}
                            {activeRequest?.manpower === 'yes' && (
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                                    <p className="text-[10px] font-bold text-blue-400 uppercase">Labour Request Fulfillment</p>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="radio" name="canMeetLabour" value="yes" checked={quoteData.canMeetLabour === 'yes'} onChange={handleQuoteChange} /> Can provide labour
                                        </label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="radio" name="canMeetLabour" value="no" checked={quoteData.canMeetLabour === 'no'} onChange={handleQuoteChange} /> Cannot provide labour
                                        </label>
                                    </div>
                                    
                                    {quoteData.canMeetLabour === 'yes' && (
                                        <div className="space-y-1 pt-2">
                                            <label className="text-[10px] font-bold text-blue-500">Labour Charges (Total)</label>
                                            <input required type="number" name="labourCharges" value={quoteData.labourCharges} onChange={handleQuoteChange} className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400" placeholder="0.00" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Additional Notes</label>
                                <textarea name="additionalNotes" value={quoteData.additionalNotes} onChange={handleQuoteChange} rows="2" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Mention any conditions..."></textarea>
                            </div>

                            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                                Confirm & Send Quote
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestedShipment;