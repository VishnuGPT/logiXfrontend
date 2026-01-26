import React from 'react';
import { motion } from 'framer-motion';

const SellerSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // 1. Fixed data with specific positioning relative to the container
  const iconConfig = [
    { label: 'Products', img: '/static/img/ani_four.jpg', pos: 'top-[10%] left-[45%]' },
    { label: 'Inventory', img: '/static/img/ani_third.jpg', pos: 'top-[30%] right-[25%]' },
    { label: 'Orders', img: '/static/img/ani_two.jpg', pos: 'top-[50%] left-[45%]' },
    { label: 'Payment', img: '/static/img/ani_one.jpg', pos: 'top-[50%] right-[25%]' },
    { label: 'Customers', img: '/static/img/ani_six.jpg', pos: 'top-[65%] left-[45%]' },
    { label: 'Loyalty', img: '/static/img/ani_five.jpg', pos: 'top-[75%] right-[25%]' },
    { label: 'Orders', img: '/static/img/ani_two.jpg', pos: 'top-[85%] left-[45%]' },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-12 min-h-screen">
      {/* Heading */}
      <div id="for-sellers" className="pt-10 mb-10">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          className="text-center text-3xl md:text-5xl font-bold px-4"
        >
          Home-based, Small Businesses and Artists ka apna 
          <span className="text-blue-600 ml-2 italic">Logistics Platform</span>
        </motion.h2>
      </div>

      {/* 2. Unified Animation Stage */}
      <div className="relative max-w-6xl mx-auto h-[700px]">
        
        {/* Central Illustration (The Woman & Mobile) */}
        <div className="absolute inset-0 flex justify-center items-center z-10">
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              src="/static/img/animation-women2.png" 
              className="h-[80%] w-auto object-contain"
            />
            {/* Background Mobile Frame */}
            <img 
              src="/static/img/background-mobile3.png" 
              className="absolute h-full w-auto opacity-20 -z-10"
              alt=""
            />
        </div>

        {/* Store Creation (Left Side) */}
        <motion.div 
          className="absolute left-[5%] top-[30%] bg-white shadow-xl p-4 rounded-2xl z-30 border border-gray-100 flex flex-col items-center"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
        >
          <img src="/static/img/animate_verify.JPG" alt="Verified" className="h-16 w-16 rounded shadow-inner" />
          <p className="text-sm font-bold mt-2 text-gray-700">Store Creation</p>
        </motion.div>

        {/* Your Dashboard (Right Side) */}
        <div className="absolute right-[5%] top-[35%] z-30 flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm">
          <p className="font-bold text-gray-800">Your Dashboard</p>
          <img src="/static/img/ani-dashboard-arrow.png" alt="arrow" className="h-6 animate-bounce-x" />
        </div>

        {/* 3. Icons mapped to specific coordinates */}
        {iconConfig.map((icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`absolute z-20 flex flex-col items-center bg-white p-3 rounded-2xl shadow-lg border border-gray-50 ${icon.pos}`}
          >
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={icon.img} alt={icon.label} className="w-full h-full object-cover" />
            </div>
            <p className="text-[11px] mt-2 font-bold text-gray-600 uppercase tracking-tight">{icon.label}</p>
          </motion.div>
        ))}

        {/* 4. The Path (Connecting Store Creation to Dashboard) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <motion.path
            d="M 150 250 C 300 100, 600 100, 850 300" 
            fill="transparent"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="10 5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Mobile Image (Hidden on Desktop) */}
      <div className="md:hidden px-6">
        <img src="/static/img/animation_mobile_img.png" alt="Mobile View" className="w-full rounded-3xl shadow-2xl" />
      </div>
    </section>
  );
};

export default SellerSection;