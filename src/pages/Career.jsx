// import React, { useState, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MapPin, Clock, ChevronDown, ArrowRight } from 'lucide-react';
// import { careers } from '../data/careers'; // Assuming your data is here
// import { Button } from '@/components/ui/button'; // Assuming you have this

// // --- Helper Component: Hero Section ---
// const CareersHero = () => (
//     <div className="bg-headings text-background text-center py-20 px-6">
//         <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-4xl md:text-6xl font-extrabold"
//         >
//             Build the Future of Freight
//         </motion.h1>
//         <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="max-w-2xl mx-auto mt-4 text-lg text-background/80"
//         >
//             Join us in our mission to modernize one of India's most crucial sectors with smart, scalable technology.
//         </motion.p>
//     </div>
// );

// // --- Helper Component: Job Listings Section ---
// const JobListings = () => {
//     const [activeDept, setActiveDept] = useState(careers[0]?.name || '');
//     const [selectedRole, setSelectedRole] = useState(null);

//     const activeRoles = useMemo(() => {
//         return careers.find(dept => dept.name === activeDept)?.data || [];
//     }, [activeDept]);

//     const handleDeptChange = (deptName) => {
//         setActiveDept(deptName);
//         setSelectedRole(null);
//     };

//     const selectStyles = "w-full px-4 py-3 bg-white border border-black/20 rounded-lg font-semibold text-headings focus:outline-none focus:ring-2 focus:ring-interactive appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%27http%3a//www.w3.org/2000/svg%27%20fill%3d%27none%27%20viewBox%3d%270%200%2020%2020%27%3e%3cpath%20stroke%3d%27%233e92cc%27%20stroke-linecap%3d%27round%27%20stroke-linejoin%3d%27round%27%20stroke-width%3d%271.5%27%20d%3d%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center]";

//     return (
//         <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
//             <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

//                 {/* Mobile Dropdown */}
//                 <div className="w-full md:hidden mb-4">
//                     <label className="block text-sm font-bold uppercase text-text/50 mb-2">
//                         Select Department
//                     </label>
//                     <select
//                         value={activeDept}
//                         onChange={(e) => handleDeptChange(e.target.value)}
//                         className={selectStyles}
//                     >
//                         {careers.map(dept => (
//                             <option key={dept.name} value={dept.name}>{dept.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Desktop Sidebar */}
//                 <aside className="hidden md:block w-full md:w-1/4 sticky top-24">
//                     <h3 className="text-sm font-bold uppercase text-text/50 mb-4">Departments</h3>
//                     <ul className="space-y-2">
//                         {careers.map(dept => (
//                             <li key={dept.name}>
//                                 <button
//                                     onClick={() => handleDeptChange(dept.name)}
//                                     className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${activeDept === dept.name ? 'bg-interactive text-white' : 'hover:bg-black/5 text-headings'}`}
//                                 >
//                                     {dept.name}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </aside>

//                 {/* Roles & Details */}
//                 <main className="w-full md:w-3/4 space-y-4">
//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={activeDept}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             {activeRoles.length > 0 ? (
//                                 activeRoles.map(role => (
//                                     <JobCard
//                                         key={role.name}
//                                         role={role}
//                                         isSelected={selectedRole?.name === role.name}
//                                         onSelect={() => setSelectedRole(selectedRole?.name === role.name ? null : role)}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="text-center py-12 text-text/70 border border-black/10 rounded-lg">
//                                     <p>No open roles in this department at the moment.</p>
//                                     <p className="text-sm mt-1">Please check back later.</p>
//                                 </div>
//                             )}
//                         </motion.div>
//                     </AnimatePresence>
//                 </main>
//             </div>
//         </div>
//     );
// };

// // --- Helper Component: Individual Job Card ---
// const JobCard = ({ role, isSelected, onSelect }) => (
//     <div className="border border-black/10 rounded-lg overflow-hidden">
//         <button onClick={onSelect} className="w-full p-6 text-left flex items-center justify-between hover:bg-background transition-colors">
//             <div>
//                 <h4 className="font-bold text-lg text-headings">{role.name}</h4>
//                 <div className="flex items-center gap-4 text-sm text-text/70 mt-1">
//                     <span className="flex items-center gap-1.5"><MapPin size={14} /> {role.location}</span>
//                     <span className="flex items-center gap-1.5"><Clock size={14} /> {role.type}</span>
//                 </div>
//             </div>
//             <motion.div animate={{ rotate: isSelected ? 180 : 0 }} transition={{ duration: 0.3 }}>
//                 <ChevronDown size={20} className="text-text/50" />
//             </motion.div>
//         </button>

//         <AnimatePresence>
//             {isSelected && (
//                 <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ ease: "easeInOut", duration: 0.3 }}
//                     className="bg-background"
//                 >
//                     <div className="p-6 border-t border-black/10 space-y-6">
//                         <div>
//                             <h5 className="font-semibold text-headings mb-2">About the Role</h5>
//                             {role.description.map((p, i) => <p key={i} className="text-text/90 mb-2">{p}</p>)}
//                         </div>
//                         <div>
//                             <h5 className="font-semibold text-headings mb-2">Requirements</h5>
//                             <ul className="list-disc list-inside space-y-1 text-text/90">
//                                 {role.requirement.map((req, i) => <li key={i}>{req}</li>)}
//                             </ul>
//                         </div>
//                         <Button variant="cta">Apply Now <ArrowRight size={16} className="ml-2" /></Button>
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     </div>
// );


// // --- Main Exported Careers Page Component ---
// export default function Careers() {
//     return (
//         <div className="bg-background">
//             <CareersHero />
//             <JobListings />
//         </div>
//     );
// }

import React, { useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";

/* ================= DATA ================= */

const tabs = [
    "View all",
    "Development",
    "Design",
    "Marketing",
    "Customer Service",
    "Operations",
    "Finance",
    "Management",
];
const whyJoinUs = [
    {
        title: "Fast growing company",
        desc: "We are at an inflection point to achieve accelerated growth.",
    },
    {
        title: "Great Colleagues",
        desc: "Closely knit and supportive team.",
    },
    {
        title: "Take Charge",
        desc: "As much as you are willing to take and show excellence.",
    },
    {
        title: "Don’t stop learning",
        desc: "An atmosphere where learning is always on the to-do list.",
    },
    {
        title: "Latest Technology stack",
        desc: "Working experience of cutting-edge technologies.",
    },
    {
        title: "Cross domain exposure",
        desc: "Highly versatile and diverse team of technology and business people.",
    },
];

const WhyJoinUs = () => {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700 mb-4">
                    Benefits
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    Why Join Us
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14 text-left">
                    {whyJoinUs.map((item, idx) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <span className="text-emerald-500">✓</span>
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
import {
    Puzzle,
    Users,
    Clock,
    Gamepad2,
    Library,
} from "lucide-react";

const perks = [
    {
        icon: Puzzle,
        title: "Challenging Problems",
    },
    {
        icon: Users,
        title: "Fantastic Team Mates",
    },
    {
        icon: Clock,
        title: "Flexible Working Hours",
    },
    {
        icon: Gamepad2,
        title: "Fun Perks",
    },
    {
        icon: Library,
        title: "Library",
    },
];

const WhyYouWillLoveIt = () => {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-6xl mx-auto text-center">
                {/* Heading */}
                <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-gray-900 uppercase">
                    Why you will love working at Porter
                </h2>

                {/* Accent line */}
                <div className="w-8 h-1 bg-indigo-600 mx-auto mt-3 rounded-full" />

                {/* Icons Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 mt-16">
                    {perks.map((perk, idx) => {
                        const Icon = perk.icon;
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-14 h-14 flex items-center justify-center rounded-lg border border-indigo-100 text-indigo-600">
                                    <Icon size={28} strokeWidth={1.8} />
                                </div>

                                <p className="text-sm font-medium text-gray-800">
                                    {perk.title}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
// const LifeAtCompany = () => {
//     return (
//         <section className="bg-[#faf9f7] py-24 px-6">
//             <div className="max-w-6xl mx-auto">
//                 {/* Heading */}
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
//                     Life at Porter
//                 </h2>

//                 {/* Image Grid */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {/* Left tall image */}
//                     <div className="row-span-2">
//                         <img
//                             src="/images/life-1.jpg"
//                             alt="Office life"
//                             className="w-full h-full object-cover rounded-lg"
//                         />
//                     </div>

//                     {/* Top middle */}
//                     <div>
//                         <img
//                             src="/images/life-2.jpg"
//                             alt="Team member"
//                             className="w-full h-full object-cover rounded-lg"
//                         />
//                     </div>

//                     {/* Big center image */}
//                     <div className="col-span-2 row-span-2">
//                         <img
//                             src="/images/life-3.jpg"
//                             alt="Working space"
//                             className="w-full h-full object-cover rounded-lg"
//                         />
//                     </div>

//                     {/* Bottom middle */}
//                     <div>
//                         <img
//                             src="/images/life-4.jpg"
//                             alt="Planning work"
//                             className="w-full h-full object-cover rounded-lg"
//                         />
//                     </div>

//                     {/* Right top */}
//                     <div>
//                         <img
//                             src="/images/life-5.jpg"
//                             alt="Happy team member"
//                             className="w-full h-full object-cover rounded-lg"
//                         />
//                     </div>

//                     {/* Right bottom */}
//                     <div>
//                         <img
//                             src="/images/life-6.jpg"
//                             alt="Creative work"
//                             className="w-full h-full object-cover rounded-lg"
//                         />
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

const CareersCTA = () => {
    return (
        <section className="bg-background py-24 px-6">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-headings">
                    Careers
                </h2>

                <p className="mt-4 text-text/70">
                    Have a zeal to contribute to the real world and create a visible
                    impact in businesses and lives of consumers? We are transforming
                    business and consumer experience everyday using technology.
                </p>

                <button className="mt-8 px-8 py-3 rounded-full bg-interactive text-white font-semibold hover:opacity-90 transition">
                    Join Us
                </button>
            </div>
        </section>
    );
};

const jobs = [
    {
        title: "Product Designer",
        desc: "We’re looking for a mid-level product designer to join our team.",
        type: "Design",
        remote: "100% remote",
        time: "Full-time",
    },
    {
        title: "Engineering Manager",
        desc: "We’re looking for an experienced engineering manager to join our team.",
        type: "Development",
        remote: "100% remote",
        time: "Full-time",
    },
    {
        title: "Customer Success Manager",
        desc: "We’re looking for a customer success manager to join our team.",
        type: "Customer Service",
        remote: "100% remote",
        time: "Full-time",
    },
    {
        title: "Account Executive",
        desc: "We’re looking for an account executive to join our team.",
        type: "Marketing",
        remote: "100% remote",
        time: "Full-time",
    },
    {
        title: "SEO Marketing Manager",
        desc: "We’re looking for an experienced SEO marketing manager to join our team.",
        type: "Marketing",
        remote: "100% remote",
        time: "Full-time",
    },
];

/* ================= PAGE ================= */

export default function Careers() {
    const [activeTab, setActiveTab] = useState("View all");

    const filteredJobs = useMemo(() => {
        if (activeTab === "View all") return jobs;
        return jobs.filter(job => job.type === activeTab);
    }, [activeTab]);
    return (
        <div className="bg-[#faf9f7] min-h-screen">

            {/* ===== MAIN CAREERS SECTION ===== */}
            <div className="px-6 py-16">
                <div className="max-w-5xl mx-auto">

                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-black text-white mb-4">
                        We’re hiring
                    </span>

                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Be part of our mission
                    </h1>

                    <p className="text-gray-600 mt-3 max-w-2xl">
                        We’re looking for passionate people to join us on our mission.
                        We value flat hierarchies, clear communication, and full ownership
                        and responsibility.
                    </p>

                    {/* ===== Tabs ===== */}
                    <div className="flex flex-wrap gap-2 mt-8">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition
                ${activeTab === tab
                                        ? "bg-black text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ===== Job List ===== */}
                    <div className="mt-10 divide-y">
                        {filteredJobs.map((job, idx) => (
                            <div key={idx} className="flex items-center justify-between py-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {job.title}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {job.desc}
                                    </p>

                                    <div className="flex gap-3 mt-3">
                                        <span className="px-3 py-1 text-xs rounded-full border">
                                            {job.remote}
                                        </span>
                                        <span className="px-3 py-1 text-xs rounded-full border">
                                            {job.time}
                                        </span>
                                    </div>
                                </div>

                                <button className="flex items-center gap-1 font-medium text-gray-900 hover:underline">
                                    Apply <ArrowUpRight size={16} />
                                </button>
                            </div>
                        ))}

                        {filteredJobs.length === 0 && (
                            <p className="text-gray-500 py-10 text-center">
                                No roles available in this category.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== CTA SECTION (NEXT PAGE LOOK) ===== */}
            <CareersCTA />
            <WhyJoinUs />
            <WhyYouWillLoveIt />
            {/* <LifeAtCompany /> */}
        </div>
    );
}