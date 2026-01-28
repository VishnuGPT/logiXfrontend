
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