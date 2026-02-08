import React, { useState, useEffect } from 'react';
import { 
    MapPin, Truck, Calendar, Scale, Ruler, 
    Thermometer, Users, Info, ChevronDown, 
    ChevronUp, DollarSign, X, AlertCircle, Loader2 
} from 'lucide-react';
import axios from 'axios';

const RequestedShipment = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [quotingId, setQuotingId] = useState(null);
    const[verified, setVerified]= useState(false);

    const [quoteData, setQuoteData] = useState({
        baseFreight: '',
        odaCharges: '',
        detentionCharges: '',
        otherCharges: '',
        additionalNotes: '',
        canMeetDates: 'yes',
        expectedPickupDate: '',
        expectedDeliveryDate: '',
        canMeetLabour: 'yes',
        labourCharges: ''
    });

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/transporter/available-requests`, {
                headers: { authorization: `Bearer ${token}` }
            });
            console.log(res,"hello")
            if(res.data.message=="Transporter not verified"){
                setRequests([])
            }else{
                setVerified(true)
                setRequests(res.data.data);
            }
            
        } catch (err) {
            console.error("Error fetching requests", err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuoteChange = (e) => {
        const { name, value } = e.target;
        setQuoteData(prev => ({ ...prev, [name]: value }));
    };

    const submitQuote = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        const token = localStorage.getItem('token');

        try {
            const payload = {
                FtlId: quotingId, // Matches backend requirement
                baseFreight: parseFloat(quoteData.baseFreight),
                odaCharges: parseFloat(quoteData.odaCharges || 0),
                detentionCharges: parseFloat(quoteData.detentionCharges || 0),
                otherCharges: parseFloat(quoteData.otherCharges || 0),
                additionalNotes: quoteData.additionalNotes,
                canMeetDates: quoteData.canMeetDates,
                expectedPickupDate: quoteData.canMeetDates === 'no' ? quoteData.expectedPickupDate : null,
                expectedDeliveryDate: quoteData.canMeetDates === 'no' ? quoteData.expectedDeliveryDate : null,
                canMeetLabour: quoteData.canMeetLabour,
                labourCharges: quoteData.canMeetLabour === 'yes' ? parseFloat(quoteData.labourCharges || 0) : 0
            };

            const res = await axios.post(`${API_URL}/api/quotation/submit`, payload, {
                headers: { authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                alert("Quotation submitted successfully!");
                setRequests(prev => prev.filter(req => req.id !== quotingId));
                setQuotingId(null);
                resetForm();
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to submit quotation.";
            alert(msg);
        } finally {
            setSubmitLoading(false);
        }
    };

    const resetForm = () => {
        setQuoteData({
            baseFreight: '', odaCharges: '', detentionCharges: '', otherCharges: '', 
            additionalNotes: '', canMeetDates: 'yes', expectedPickupDate: '', 
            expectedDeliveryDate: '', canMeetLabour: 'yes', labourCharges: ''
        });
    };

    const safeDisplay = (val, suffix = "") => (val ? `${val}${suffix}` : <span className="text-gray-300 italic">N/A</span>);

    const activeRequest = requests.find(r => r.id === quotingId);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>Loading available shipments...</p>
            </div>
        );
    }
    if(!verified){
        return(
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <p>You are not verified by our Team</p>
            </div>

        )
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
            <header className="mb-8">
                <p className="text-slate-500 text-sm">Review and submit quotations for active logistics requests.</p>
            </header>

            {requests.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Truck className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">No shipment requests available at the moment.</p>
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
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Scale size={12}/> Weight</p>
                                                <p className="text-sm font-semibold">{safeDisplay(item.weightKg, " kg")}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Thermometer size={12}/> Cooling</p>
                                                <p className="text-sm font-semibold capitalize">{safeDisplay(item.coolingType)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Truck size={12}/> Vehicle</p>
                                                <p className="text-sm font-semibold text-blue-600">{item.truckSize} <span className="text-slate-400 font-normal">({item.bodyType})</span></p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Ruler size={12}/> Dimensions</p>
                                                <p className="text-sm font-semibold">
                                                    {item.length ? `${item.length}x${item.width}x${item.height} ${item.dimensionUnit}` : "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Meta Section */}
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> Expected Pickup</p>
                                                <p className="text-sm font-semibold">{new Date(item.expectedPickupDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Users size={12}/> Manpower</p>
                                                <p className="text-sm font-semibold">
                                                    {item.manpower === 'yes' ? `${item.noOfLabours} helpers required` : 'Not required'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {item.additionalNotes && (
                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1"><Info size={12}/> Special Instructions</p>
                                            <p className="text-sm text-amber-800">{item.additionalNotes}</p>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => setQuotingId(item.id)}
                                        className="w-full md:w-auto px-8 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                    >
                                        <DollarSign size={18}/> Submit Quotation
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* QUOTATION MODAL */}
            {quotingId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <DollarSign size={20} className="text-green-600"/> Submit Your Quote
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                                    {activeRequest?.pickupCity} to {activeRequest?.deliveryCity}
                                </p>
                            </div>
                            <button onClick={() => setQuotingId(null)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={submitQuote} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            {/* Pricing Grid */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Base Freight</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                        <input required type="number" name="baseFreight" value={quoteData.baseFreight} onChange={handleQuoteChange} className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">ODA Charges</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                        <input type="number" name="odaCharges" value={quoteData.odaCharges} onChange={handleQuoteChange} className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Detention / Day</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                        <input type="number" name="detentionCharges" value={quoteData.detentionCharges} onChange={handleQuoteChange} className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Miscellaneous</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                        <input type="number" name="otherCharges" value={quoteData.otherCharges} onChange={handleQuoteChange} className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>

                            {/* Date Overrides */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-500"/>
                                    <p className="text-[11px] font-bold text-slate-600 uppercase">Schedule Confirmation</p>
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                        <input type="radio" name="canMeetDates" value="yes" checked={quoteData.canMeetDates === 'yes'} onChange={handleQuoteChange} className="text-blue-600 focus:ring-blue-500" /> Yes, on time
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                        <input type="radio" name="canMeetDates" value="no" checked={quoteData.canMeetDates === 'no'} onChange={handleQuoteChange} className="text-blue-600 focus:ring-blue-500" /> Need adjustment
                                    </label>
                                </div>
                                
                                {quoteData.canMeetDates === 'no' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 ml-1">New Pickup</label>
                                            <input required type="date" name="expectedPickupDate" value={quoteData.expectedPickupDate} onChange={handleQuoteChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 ml-1">New Delivery</label>
                                            <input required type="date" name="expectedDeliveryDate" value={quoteData.expectedDeliveryDate} onChange={handleQuoteChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Labour Toggle */}
                            {activeRequest?.manpower === 'yes' && (
                                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-blue-600"/>
                                        <p className="text-[11px] font-bold text-blue-600 uppercase">Labour Provision</p>
                                    </div>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                            <input type="radio" name="canMeetLabour" value="yes" checked={quoteData.canMeetLabour === 'yes'} onChange={handleQuoteChange} className="text-blue-600" /> Providing {activeRequest.noOfLabours} persons
                                        </label>
                                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                            <input type="radio" name="canMeetLabour" value="no" checked={quoteData.canMeetLabour === 'no'} onChange={handleQuoteChange} className="text-blue-600" /> Cannot provide
                                        </label>
                                    </div>
                                    
                                    {quoteData.canMeetLabour === 'yes' && (
                                        <div className="space-y-1 pt-2 animate-in fade-in slide-in-from-top-2">
                                            <label className="text-[10px] font-bold text-blue-500 ml-1">Total Labour Charges</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm">₹</span>
                                                <input required type="number" name="labourCharges" value={quoteData.labourCharges} onChange={handleQuoteChange} className="w-full pl-7 pr-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-400" placeholder="0.00" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Additional Terms / Notes</label>
                                <textarea name="additionalNotes" value={quoteData.additionalNotes} onChange={handleQuoteChange} rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Price valid for 24 hours, includes toll..."></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitLoading}
                                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 ${submitLoading ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'}`}
                            >
                                {submitLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm & Submit Quote'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestedShipment;