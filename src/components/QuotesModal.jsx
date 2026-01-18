import React from 'react';
import { X, Clock, CheckCircle2, Truck, Calendar, Info, AlertTriangle, Phone } from 'lucide-react';
import axios from 'axios';

const QuotationsModal = ({ shipment, onClose, onRefresh }) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/api/client`;

    const handleAcceptQuote = async (quoteId) => {
        if (!window.confirm("Are you sure you want to accept this quote? This will reject all other bids.")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}/accept-quote`,
                { shipmentId: shipment.id, quoteId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onRefresh(); 
            onClose();
        } catch (err) {
            console.error("Error accepting quote:", err);
            alert("Failed to accept quote. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl h-[95vh] bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

                {/* --- Modal Header --- */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Review All Quotes</h2>
                        <p className="text-sm text-slate-500 font-medium">Shipment ID: #FTL-{shipment.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* --- Quotes List --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {shipment.quotes && shipment.quotes.length > 0 ? (
                        shipment.quotes.map((quote) => (
                            <div key={quote.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">

                                {/* 1. Transporter Identity */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
                                            <Truck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 text-lg leading-tight">
                                                {quote.companyName || "Premium Transporter"}
                                            </h4>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                Verified Carrier
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-blue-600">₹{Number(quote.baseFreight) + Number(quote.odaCharges) + Number(quote.otherCharges) + Number(quote.labourCharges)}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Total Landed Cost</p>
                                    </div>
                                </div>

                                {/* 2. Verification Badges & Adjusted Dates */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-2">
                                        {quote.canMeetDates === 'yes' ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100">
                                                <Calendar size={12} /> Date Match
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold border border-amber-100">
                                                <AlertTriangle size={12} /> Date Adjusted
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[11px] font-bold border border-slate-100">
                                            <Phone size={12} /> Contact Ready
                                        </div>
                                    </div>

                                    {/* Proposed Schedule (Shown if dates are adjusted) */}
                                    {quote.canMeetDates !== 'yes' && (
                                        <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/30 border border-amber-100 rounded-2xl">
                                            <div>
                                                <p className="text-[10px] uppercase text-amber-600 font-bold mb-1">Proposed Pickup</p>
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Calendar size={14} className="text-amber-500" />
                                                    <span className="text-sm font-bold">
                                                        {new Date(quote.expectedPickupDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="border-l border-amber-100 pl-3">
                                                <p className="text-[10px] uppercase text-amber-600 font-bold mb-1">Proposed Delivery</p>
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Truck size={14} className="text-amber-500" />
                                                    <span className="text-sm font-bold">
                                                        {new Date(quote.expectedDeliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* 3. Detailed Financial Breakdown (The "Crystal Clear" Part) */}
                                <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Base Freight</span>
                                        <span className="font-bold text-slate-700 tracking-tight">₹{Number(quote.baseFreight).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">ODA</span>
                                        <span className="font-bold text-slate-700 tracking-tight">₹{Number((quote.odaCharges))}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Detention</span>
                                        <span className="font-bold text-slate-700 tracking-tight">₹{Number((quote.detentionCharges)).toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Labour Charges</span>
                                        <span className="font-bold text-slate-700 tracking-tight">₹{Number(quote.labourCharges).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Other Charges</span>
                                        <span className="font-bold text-slate-700 tracking-tight">₹{Number(quote.otherCharges).toLocaleString()}</span>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200 flex justify-between">
                                        <span className="text-xs font-black text-slate-400 uppercase">Total Inclusive</span>
                                        <span className="font-black text-blue-600">₹{Number(quote.baseFreight) + Number(quote.odaCharges) + Number(quote.otherCharges) + Number(quote.labourCharges)}</span>
                                    </div>
                                </div>

                                {/* 4. Notes if any */}
                                {quote.additionalNotes && (
                                    <div className="mb-6 p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3 italic">
                                        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-slate-600">{quote.additionalNotes}</p>
                                    </div>
                                )}

                                {/* 5. Final Action */}
                                <button
                                    onClick={() => handleAcceptQuote(quote.id)}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-[0.98]"
                                >
                                    <CheckCircle2 size={18} /> Accept Transporter & Pay
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 px-10">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Clock className="text-slate-300 animate-pulse" size={32} />
                            </div>
                            <h3 className="text-slate-700 font-bold text-lg">Waiting for Bids</h3>
                            <p className="text-slate-400 text-sm mt-2 font-medium">
                                Transporters are reviewing your load details. You'll receive a notification as soon as the first quote arrives.
                            </p>
                        </div>
                    )}
                </div>

                {/* --- Modal Footer --- */}
                <div className="p-6 border-t border-slate-100 bg-white">
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                        All prices are inclusive of taxes unless specified by carrier
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuotationsModal;