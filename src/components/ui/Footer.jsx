import React, { useState, useEffect, useRef } from 'react';
import { Twitter, Linkedin, Instagram, ArrowRight, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/LOGO.png';

// --- Data for easy management ---
const footerLinks = [
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about-us' },
            { label: 'Careers', href: '/careers' },
            { label: 'Admin Access', href: '/admin-sign-in' }
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Contact Us', href: '/contact' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Get Started', href: '/sign-up' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
        ],
    },
];

const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: 'https://x.com/LogiXjunction' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://www.linkedin.com/company/logixjunction' },
    { icon: <Instagram className="h-5 w-5" />, href: 'https://www.instagram.com/logixjunction' },
];

export default function Footer() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showButton, setShowButton] = useState(false);

    // Show button after scrolling down 400px
    useEffect(() => {
        const checkScroll = () => {
            if (window.pageYOffset > 400) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    const handleCustomerRedirect = () => {
        const isLandingPage = location.pathname === '/' || location.pathname === '/landing';

        if (isLandingPage) {
            // Scroll to the services section ID we added to the Landing Page
            const element = document.getElementById('services-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Redirect to landing page with a hash
            navigate('/#services');
        }
    };

    return (
        <>
            <footer className="w-full bg-headings text-background/70 pt-16 pb-8 px-6 md:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                        {/* Logo & Tagline Section */}
                        <div className="lg:col-span-2">
                            <img src={Logo} alt="LogiXjunction Logo" className="h-16 w-auto mb-4" />
                            <p className="max-w-xs">India's smartest digital freight network, built for the future.</p>
                        </div>

                        {/* Links Sections */}
                        {footerLinks.map((section) => (
                            <div key={section.title}>
                                <h4 className="font-bold text-white mb-4">{section.title}</h4>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <a href={link.href} className="hover:text-interactive transition-colors">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Copyright */}
                        <p className="text-sm text-background/50 order-2 md:order-1">
                            © {new Date().getFullYear()} LogiXjunction. All rights reserved.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 order-1 md:order-2">
                            {socialLinks.map((social, index) => (
                                <a key={index} href={social.href} className="text-background/70 hover:text-white transition-colors">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* --- Floating Customer CTA Button --- */}
            <AnimatePresence>
                {showButton && (
                    <motion.button
                        onClick={() => navigate('/sign-up')}
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed bottom-14 right-6 z-50 flex items-center gap-3 bg-interactive text-white px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:bg-[#ff4d5d] transition-all group"
                    >
                        <span className="font-bold tracking-tight">Are you a Transporter?</span>
                        <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}