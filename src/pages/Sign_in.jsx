import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const [userType, setUserType] = useState('Shipper');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  /* ---------------- TRANSPORTER LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();

    // 🚫 Prevent accidental submit for Shipper
    if (userType === 'Shipper') return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/transporter/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      navigate('/transporter-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- SHIPPER SEND OTP ---------------- */
  const sendOtp = async () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/client/send-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- SHIPPER VERIFY OTP ---------------- */
  const verifyOtpAndLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/client/verify-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      if (!data.isProfileComplete) {
        navigate('/complete-profile');
      } else {
        navigate('/client-dashboard');
      }

    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- BACKGROUND ---------------- */
  const bgClass =
    userType === 'Shipper'
      ? 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
      : 'bg-gradient-to-br from-orange-50 via-white to-orange-100';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${bgClass}`}
    >
      {/* BLUR BLOBS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-interactive/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-cta/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* BRAND HEADER */}
        <div className="text-center mb-8">
          <img
            src="/LOGO_LxJ2.png"
            alt="LogiXjunction Logo"
            className="h-20 w-auto mx-auto"
          />
          <h1 className="text-3xl font-bold text-headings mt-4">
            Welcome Back
          </h1>
          <p className="text-text/70 mt-1">
            Login to continue your journey in smart logistics.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/70 backdrop-blur-xl rounded-lg p-8 border border-black/5 shadow-sm">
          {/* USER TYPE TOGGLE */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-black/5 p-1 rounded-lg">
            {['Transporter', 'Shipper'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setUserType(type);
                  setOtp('');
                  setOtpSent(false);
                  setError('');
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors
                  ${userType === type
                    ? 'bg-white text-headings shadow-sm'
                    : 'bg-transparent text-text/60 hover:text-headings'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="block mb-1.5 text-sm font-medium">Email</label>
              <Input
                value={email}
                disabled={otpSent && userType === 'Shipper'}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* PASSWORD – TRANSPORTER ONLY */}
            {userType === 'Transporter' && (
              <div>
                <label className="block mb-1.5 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP – SHIPPER ONLY */}
            {userType === 'Shipper' && otpSent && (
              <div>
                <label className="block mb-1.5 text-sm font-medium">OTP</label>
                <Input
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg">
                {error}
              </p>
            )}

            {/* ACTION BUTTON */}
            <Button
              type={userType === 'Transporter' ? 'submit' : 'button'}
              onClick={
                userType === 'Shipper'
                  ? otpSent
                    ? verifyOtpAndLogin
                    : sendOtp
                  : undefined
              }
              className="w-full font-semibold bg-accent-cta"
              disabled={isLoading}
            >
              {isLoading
                ? 'Please wait...'
                : userType === 'Shipper'
                  ? otpSent
                    ? 'Verify & Login'
                    : 'Send OTP'
                  : 'Sign In'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
