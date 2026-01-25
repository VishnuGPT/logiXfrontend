import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminSignIn from './pages/AdminSigin';
import { Toaster } from 'react-hot-toast';
// --- UI Components ---
import Navbar from './components/ui/NavBar';
import Footer from './components/ui/Footer';
import ScrollToTop from './components/ScrollToTop';
// --- Page Components ---
import LandingPage from './pages/Landing_page';
import AboutUs from './pages/About_us';
import Careers from './pages/Career';
import SignInPage from './pages/Sign_in';
import SignupFormPage from './pages/Signup_otp';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/signup/CookiePolicy';
import TermsOfService from './pages/TermsOfService';
import CreateShipment from './components/CreateShipment'

import CarrierRegistration from './pages/signup/transporter_registration';

import TransporterDashboard from './pages/TransporterDashboard';
import Consignment from './pages/dashboard/Consignment';
import AvailableTransporters from './pages/Transporter_list';
import VehicleRegistration from './pages/Vehicle_registration';
import DriverRegistration from './pages/Driver_registration';

//applications
import PackersMoversForm from './pages/PackersMoversForm';
import TransporterDetails from './pages/TransporterDetails';

// --- Layouts ---
const MainLayout = () => (
  <>
    <Navbar />
    <div className="h-[72px]" /> {/* Spacer so navbar doesn’t overlap */}
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

const FullPageLayout = () => (
  <main>
    <Outlet />
  </main>
);

// --- App Component ---
function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* --- Public-facing pages (with Navbar + Footer) --- */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/join-us" element={<Careers />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Route>

          {/* --- Full-screen pages (no Navbar/Footer) --- */}
          <Route element={<FullPageLayout />}>
            <Route path="/services/ftl" element={<CreateShipment />} />
            <Route path="/services/packers-movers" element={<PackersMoversForm />} />

            {/* Auth Routes */}
            <Route path="/admin-sign-in" element={<AdminSignIn />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignupFormPage />} />

            {/* Registration Routes */}
            <Route path="/carrier-registration" element={<CarrierRegistration />} />
            <Route path="/vehicle-registration" element={<VehicleRegistration />} />
            <Route path="/driver-registration" element={<DriverRegistration />} />

            {/* Dashboard Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/transporter-dashboard" element={<TransporterDashboard />} />
            <Route path="/consignment" element={<Consignment />} />
            <Route path="/available-transporter" element={<AvailableTransporters />} />
            <Route path="/admin/transporters/:id" element={<TransporterDetails />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
