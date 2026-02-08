import React, { useState, useEffect } from 'react';
import { 
    FileText, Tag, Calendar, DollarSign, 
    ChevronDown, ChevronUp, Loader2, Filter, 
    CheckCircle2, Clock, XCircle, MessageSquare 
} from 'lucide-react';
import axios from 'axios';

const QuotationManagement = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/transporter/all-quotes`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setQuotes(res.data.data);
        } catch (err) {
            console.error("Error fetching quotes", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredQuotes = filterStatus === 'all' 
        ? quotes 
        : quotes.filter(q => q.status === filterStatus);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(val || 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>Fetching your quotations...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Quotations</h1>
                    <p className="text-slate-500 text-sm">Track and manage your submitted bids</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                                filterStatus === status 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {filteredQuotes.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">No {filterStatus !== 'all' ? filterStatus : ''} quotations found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredQuotes.map((quote) => (
                        <div key={quote.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Main Card Header */}
                            <div 
                                className="p-5 flex justify-between items-center cursor-pointer"
                                onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
                            >
                                <div className="flex gap-4 items-center">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${getStatusStyle(quote.status)}`}>
                                        {quote.status === 'accepted' ? <CheckCircle2 size={24} /> : 
                                         quote.status === 'rejected' ? <XCircle size={24} /> : <Clock size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-800 tracking-tight">
                                                Quote #{quote.id} <span className="text-slate-400 font-normal ml-1">for FTL #{quote.FtlId}</span>
                                            </h3>
                                            <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-full uppercase ${getStatusStyle(quote.status)}`}>
                                                {quote.status}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-blue-600">{formatCurrency(quote.baseFreight)} <span className="text-slate-400 font-normal">(Base Freight)</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:block text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Submitted On</p>
                                        <p className="text-sm font-medium">{new Date(quote.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {expandedId === quote.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </div>

                            {/* Details Section */}
                            {expandedId === quote.id && (
                                <div className="p-6 border-t border-slate-50 bg-slate-50/30 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* Financial Breakdown */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pricing Breakdown</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">ODA Charges:</span>
                                                    <span className="font-semibold">{formatCurrency(quote.odaCharges)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Detention:</span>
                                                    <span className="font-semibold">{formatCurrency(quote.detentionCharges)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Other:</span>
                                                    <span className="font-semibold">{formatCurrency(quote.otherCharges)}</span>
                                                </div>
                                                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-800">
                                                    <span>Total:</span>
                                                    <span>{formatCurrency(Number(quote.baseFreight) + Number(quote.odaCharges) + Number(quote.detentionCharges) + Number(quote.otherCharges))}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline & Logistics */}
                                        <div className="space-y-4 border-x px-0 md:px-8 border-slate-200">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar size={12} /> Expected Dates</p>
                                                <p className="text-sm font-medium mt-1">
                                                    {quote.expectedPickupDate} <span className="text-slate-400 mx-1">→</span> {quote.expectedDeliveryDate}
                                                </p>
                                                <p className={`text-[10px] mt-1 font-bold ${quote.canMeetDates === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {quote.canMeetDates === 'yes' ? '● Can meet requested dates' : '○ Adjusted schedule'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Tag size={12} /> Labour</p>
                                                <p className="text-sm font-medium">{quote.canMeetLabour === 'yes' ? `Labour provided (${formatCurrency(quote.labourCharges)})` : 'No labour provided'}</p>
                                            </div>
                                        </div>

                                        {/* Company Info */}
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">Transporter</p>
                                                <p className="text-sm font-semibold text-slate-800 uppercase">{quote.companyName || "Your Company"}</p>
                                            </div>
                                            {quote.additionalNotes && (
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><MessageSquare size={12} /> Notes</p>
                                                    <p className="text-xs text-slate-600 italic">"{quote.additionalNotes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuotationManagement;