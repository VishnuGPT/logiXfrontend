import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Phone, Building, FileText, MapPin, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    companyName: '',
    companyAddress: '',
    gstNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/client/complete-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        navigate('/client-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Final Step</h2>
          <p className="text-slate-500 text-sm">Just a few details to get you started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* REQUIRED SECTION */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-blue-600 ml-1 tracking-wider">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input name="name" required onChange={handleChange} className="pl-10" placeholder="Enter your name" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-blue-600 ml-1 tracking-wider">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input name="phoneNumber" type="tel" required onChange={handleChange} className="pl-10" placeholder="10-digit mobile number" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* OPTIONAL SECTION */}
          <div className="space-y-4">
            <p className="text-[11px] font-medium text-slate-400 text-center uppercase">Optional Business Info</p>
            
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <Input name="companyName" onChange={handleChange} className="pl-10 bg-slate-50/50" placeholder="Company Name" />
            </div>

            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <Input name="gstNumber" onChange={handleChange} className="pl-10 bg-slate-50/50" placeholder="GST Number" />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-300" size={18} />
              <textarea 
                name="companyAddress" 
                placeholder="Company Address"
                className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm min-h-[80px] outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center border border-red-100">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all" disabled={isLoading}>
            {isLoading ? 'Setting up...' : 'Create Account'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}