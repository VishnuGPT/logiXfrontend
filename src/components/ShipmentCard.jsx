import React, { useState } from 'react';
import axios from 'axios';
import { 
  MapPin, Package, Truck, Calendar, 
  MessageCircle, CreditCard, ChevronRight, 
  Clock, CheckCircle2 
} from 'lucide-react';
import QuotesModal from './QuotesModal';

const ShipmentCard = ({ shipment, onActionComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BASE_URL = `${import.meta.env.VITE_API_URL}/api/client`;

  // Status Badge Logic
  const getStatusConfig = (status) => {
    const configs = {
      requested: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock size={12}/> },
      accepted: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <CheckCircle2 size={12}/> },
      confirmed: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: <Package size={12}/> },
      ongoing: { color: "bg-green-50 text-green-700 border-green-200", icon: <Truck size={12}/> },
      completed: { color: "bg-slate-100 text-slate-600 border-slate-200", icon: <CheckCircle2 size={12}/> },
    };
    return configs[status] || configs.requested;
  };

  const config = getStatusConfig(shipment.status);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group flex flex-col h-full">
        
        {/* 1. Header: ID & Status */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
            FTL-{shipment.id}
          </span>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${config.color}`}>
            {config.icon}
            {shipment.status}
          </div>
        </div>

        {/* 2. Cargo details */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Package size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{shipment.materialType}</h3>
            <p className="text-xs text-slate-500 font-medium">{shipment.truckSize} • {shipment.bodyType}</p>
          </div>
        </div>

        {/* 3. Route Section */}
        <div className="space-y-4 mb-6 relative flex-1">
          {/* Timeline Line */}
          <div className="absolute left-[9px] top-6 bottom-6 w-[2px] bg-slate-100 group-hover:bg-blue-100 transition-colors"></div>
          
          <div className="flex gap-4 relative">
            <div className="mt-1 bg-white ring-4 ring-white">
              <MapPin size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Pickup</p>
              <p className="text-sm font-bold text-slate-700 leading-tight">{shipment.pickupCity}</p>
              <p className="text-[10px] text-slate-400">{shipment.pickupState}</p>
            </div>
          </div>

          <div className="flex gap-4 relative">
            <div className="mt-1 bg-white ring-4 ring-white">
              <MapPin size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Drop-off</p>
              <p className="text-sm font-bold text-slate-700 leading-tight">{shipment.deliveryCity}</p>
              <p className="text-[10px] text-slate-400">{shipment.deliveryState}</p>
            </div>
          </div>
        </div>

        {/* 4. Footer Info Grid */}
        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">{shipment.expectedPickupDate}</span>
          </div>
          {shipment.status === 'requested' && (
            <div className="flex items-center gap-2 justify-end">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-600">{shipment.quotes?.length || 0} Quotes</span>
            </div>
          )}
        </div>

        {/* 5. Contextual Action Button */}
        <div className="mt-auto">
          {shipment.status === 'requested' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-95"
            >
              Review Quotes <ChevronRight size={18} />
            </button>
          )}

          {shipment.status === 'accepted' && (
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
              <CreditCard size={18} /> Complete Payment (₹{shipment.cost})
            </button>
          )}

          {(shipment.status === 'confirmed' || shipment.status === 'ongoing') && (
            <div className="flex gap-2">
              <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                <MessageCircle size={18} className="text-blue-500" /> Chat
              </button>
              <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all">
                Track
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Integration */}
      {isModalOpen && (
        <QuotesModal 
          shipment={shipment} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={onActionComplete} 
        />
      )}
    </>
  );
};

export default ShipmentCard;