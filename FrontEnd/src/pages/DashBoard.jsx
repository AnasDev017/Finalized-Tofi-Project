import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hash, Globe, ShoppingBag, LifeBuoy, User as UserIcon,
    Search, Filter, ChevronRight, Menu, X, CheckCircle,
    Clock, XCircle, Upload, Copy, ShieldCheck, CreditCard,
    LogOut, Edit3, ArrowLeft, Check
} from 'lucide-react';

// --- External Libraries Loader ---
const useGSAPLoader = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (window.gsap) {
            setLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        script.onload = () => setLoaded(true);
        document.head.appendChild(script);
    }, []);
    return loaded;
};

// --- Mock Data ---

const MOCK_COUNTRIES = [
    { id: 'us', name: 'United States', flagUrl: 'https://flagcdn.com/w40/us.png', available: 1240 },
    { id: 'gb', name: 'United Kingdom', flagUrl: 'https://flagcdn.com/w40/gb.png', available: 850 },
    { id: 'ca', name: 'Canada', flagUrl: 'https://flagcdn.com/w40/ca.png', available: 430 },
    { id: 'au', name: 'Australia', flagUrl: 'https://flagcdn.com/w40/au.png', available: 320 },
    { id: 'de', name: 'Germany', flagUrl: 'https://flagcdn.com/w40/de.png', available: 210 },
    { id: 'fr', name: 'France', flagUrl: 'https://flagcdn.com/w40/fr.png', available: 180 },
    { id: 'jp', name: 'Japan', flagUrl: 'https://flagcdn.com/w40/jp.png', available: 150 },
    { id: 'br', name: 'Brazil', flagUrl: 'https://flagcdn.com/w40/br.png', available: 95 },
    { id: 'in', name: 'India', flagUrl: 'https://flagcdn.com/w40/in.png', available: 500 },
    { id: 'za', name: 'South Africa', flagUrl: 'https://flagcdn.com/w40/za.png', available: 75 },
    { id: 'nl', name: 'Netherlands', flagUrl: 'https://flagcdn.com/w40/nl.png', available: 110 },
    { id: 'se', name: 'Sweden', flagUrl: 'https://flagcdn.com/w40/se.png', available: 60 },
    { id: 'ch', name: 'Switzerland', flagUrl: 'https://flagcdn.com/w40/ch.png', available: 45 },
    { id: 'sg', name: 'Singapore', flagUrl: 'https://flagcdn.com/w40/sg.png', available: 85 },
    { id: 'ae', name: 'UAE', flagUrl: 'https://flagcdn.com/w40/ae.png', available: 130 },
];

const generateMockNumbers = () => {
    const numbers = [];
    MOCK_COUNTRIES.forEach(country => {
        for (let i = 0; i < 5; i++) {
            const randomNum = Math.floor(Math.random() * 9000000) + 1000000;
            let prefix = country.id === 'us' || country.id === 'ca' ? '+1' : country.id === 'gb' ? '+44' : country.id === 'au' ? '+61' : `+${Math.floor(Math.random() * 90 + 10)}`;
            numbers.push({
                id: `${country.id}-${i}`,
                countryId: country.id,
                countryName: country.name,
                flagUrl: country.flagUrl,
                number: `${prefix} 555 ${randomNum.toString().substring(0, 4)}`,
                price: (Math.random() * 10 + 2).toFixed(2),
                status: 'Active'
            });
        }
    });
    return numbers.sort(() => Math.random() - 0.5); // Shuffle
};

const MOCK_NUMBERS = generateMockNumbers();

const MOCK_ORDERS = [
    { id: 'ORD-7782A', number: '+1 555 4921', country: 'United States', price: '$4.99', date: '2026-03-07', method: 'Easypaisa', status: 'Approved' },
    { id: 'ORD-7781B', number: '+44 555 8812', country: 'United Kingdom', price: '$6.50', date: '2026-03-05', method: 'JazzCash', status: 'Pending' },
    { id: 'ORD-7775C', number: '+1 555 1198', country: 'Canada', price: '$3.99', date: '2026-03-01', method: 'Easypaisa', status: 'Approved' },
    { id: 'ORD-7760D', number: '+61 555 3321', country: 'Australia', price: '$8.00', date: '2026-02-28', method: 'Crypto', status: 'Rejected' },
    { id: 'ORD-7751E', number: '+49 555 7744', country: 'Germany', price: '$5.50', date: '2026-02-15', method: 'JazzCash', status: 'Approved' },
];

const MOCK_USER = {
    name: 'Alex Mercer',
    email: 'alex.mercer@example.com',
    avatar: 'AM',
    totalOrders: 12,
    activeNumbers: 3
};

// --- GSAP Page Transition Wrapper ---
const PageWrapper = ({ children, className = "" }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (window.gsap && containerRef.current) {
            const elements = containerRef.current.children;
            window.gsap.fromTo(elements,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }
            );
        }
    }, [children]);

    return (
        <div ref={containerRef} className={`w-full max-w-7xl mx-auto ${className}`}>
            {children}
        </div>
    );
};

// --- Components ---

// --- CSS keyframes injected once for card glow pulse ---
const CardGlowStyles = () => (
    <style>{`
        @keyframes cardGlowPulse {
            0%   { opacity: 0; }
            50%  { opacity: 1; }
            100% { opacity: 0; }
        }
        @keyframes cardBorderPulse {
            0%   { box-shadow: 0 0 0px rgba(255,77,166,0); border-color: rgba(255,255,255,0.1); transform: translateY(0px); }
            50%  { box-shadow: 0 0 25px rgba(255,77,166,0.18); border-color: rgba(255,77,166,0.5); transform: translateY(-4px); }
            100% { box-shadow: 0 0 0px rgba(255,77,166,0); border-color: rgba(255,255,255,0.1); transform: translateY(0px); }
        }
        .card-glow-pulse {
            animation: cardBorderPulse 6s ease-in-out infinite;
            will-change: box-shadow, border-color, transform;
        }
        .card-glow-overlay {
            animation: cardGlowPulse 6s ease-in-out infinite;
            will-change: opacity;
        }
        .btn-get-number {
            background: rgba(255,255,255,0.05);
            border-color: rgba(255,255,255,0.1);
            transition: background 0.25s ease, border-color 0.25s ease;
        }
        .btn-get-number:hover,
        .btn-get-number:active {
            background: linear-gradient(to right, #ff4da6, #9d4edd) !important;
            border-color: transparent !important;
        }
    `}</style>
);

// Number card with CSS-animated glow + mobile-friendly button
const NumberCard = ({ num, navigate }) => {
    const [btnPressed, setBtnPressed] = useState(false);

    const handleTouchStart = (e) => {
        e.preventDefault(); // stop ghost click
        setBtnPressed(true);
        setTimeout(() => {
            navigate('confirm-order', { number: num });
        }, 150); // small delay so gradient flash is visible
    };

    return (
        <div className="card-glow-pulse relative overflow-hidden bg-[#111] border rounded-2xl p-5 flex flex-col h-full shadow-lg">
            {/* CSS-animated pink glow overlay */}
            <div className="card-glow-overlay absolute inset-0 pointer-events-none rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(255,77,166,0.07) 0%, rgba(157,78,221,0.07) 100%)' }}
            />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2.5 bg-black/50 pr-3 pl-2 py-1.5 rounded-full border border-white/5 shadow-sm">
                    <img src={num.flagUrl} alt={num.countryName} className="w-5 h-auto rounded-[2px]" />
                    <span className="text-xs font-semibold text-gray-300">{num.countryName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold text-green-500 tracking-wider">Active</span>
                </div>
            </div>

            {/* Dual-layer text: white base + pink overlay cross-fades smoothly via opacity */}
            <div className="flex-grow flex items-center justify-center py-4 relative z-10">
                <div className="relative">
                    {/* Layer 1: white→gray base (always visible) */}
                    <h3 className="text-xl sm:text-2xl lg:text-[1.35rem] xl:text-2xl font-mono font-semibold tracking-widest whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {num.number}
                    </h3>
                    {/* Layer 2: pink→purple overlay — fades in/out via opacity (GPU smooth) */}
                    <h3 className="card-glow-overlay absolute inset-0 text-xl sm:text-2xl lg:text-[1.35rem] xl:text-2xl font-mono font-semibold tracking-widest whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#ff4da6] to-[#9d4edd]">
                        {num.number}
                    </h3>
                </div>
            </div>

            <div className="pt-5 mt-auto border-t border-white/5 flex items-center justify-between relative z-10">
                <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-widest mb-0.5">Price</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">${num.price}</span>
                        <span className="text-xs text-gray-500 font-medium">/mo</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('confirm-order', { number: num })}
                    onTouchStart={handleTouchStart}
                    className="btn-get-number border text-white px-5 py-2.5 rounded-xl text-sm font-bold"
                    style={btnPressed ? {
                        background: 'linear-gradient(to right, #ff4da6, #9d4edd)',
                        borderColor: 'transparent'
                    } : {}}
                >
                    Get Number
                </button>
            </div>
        </div>
    );
};

// 1. Virtual Numbers Page
const VirtualNumbers = ({ navigate, preSelectedCountry }) => {
    const [search, setSearch] = useState('');
    const [filterCountry, setFilterCountry] = useState(preSelectedCountry || 'all');
    const [sortBy, setSortBy] = useState('price-asc');

    const filteredNumbers = useMemo(() => {
        let result = MOCK_NUMBERS;
        if (filterCountry !== 'all') result = result.filter(n => n.countryId === filterCountry);
        if (search) result = result.filter(n => n.number.includes(search) || n.countryName.toLowerCase().includes(search.toLowerCase()));

        return result.sort((a, b) => {
            if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
            if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
            return 0;
        });
    }, [search, filterCountry, sortBy]);

    return (
        <PageWrapper>
            <CardGlowStyles />
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Available Virtual Numbers</h1>
                <p className="text-gray-400">Select a country and choose a virtual number to activate instantly.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 relative z-20">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by number or country..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff4da6]/50 focus:bg-white/[0.08] transition-all"
                    />
                </div>
                <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all appearance-none cursor-pointer md:w-56"
                >
                    <option value="all">All Countries</option>
                    {MOCK_COUNTRIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all appearance-none cursor-pointer md:w-48"
                >
                    <option value="price-asc">Lowest Price</option>
                    <option value="price-desc">Highest Price</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredNumbers.map((num) => (
                    <NumberCard key={num.id} num={num} navigate={navigate} />
                ))}
            </div>
            {filteredNumbers.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No numbers found matching your criteria.</p>
                </div>
            )}
        </PageWrapper>
    );
};

// 2. Countries Page
const Countries = ({ navigate }) => {
    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Available Countries</h1>
                <p className="text-gray-400">Browse all countries where virtual numbers are available.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {MOCK_COUNTRIES.map((country) => (
                    <motion.div
                        key={country.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('numbers', { countryId: country.id })}
                        className="cursor-pointer bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-[#9d4edd]/50 hover:bg-[#161616] transition-all flex items-center justify-between group shadow-lg hover:shadow-[0_0_20px_rgba(157,78,221,0.15)] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9d4edd]/0 to-[#9d4edd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-black/50 border border-white/5 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300 p-2.5">
                                <img src={country.flagUrl} alt={country.name} className="w-full h-auto object-contain rounded-sm" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-[1.05rem]">{country.name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{country.available} numbers available</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#9d4edd] transition-colors relative z-10" />
                    </motion.div>
                ))}
            </div>
        </PageWrapper>
    );
};

// 3. Orders Page
const Orders = () => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Approved': return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle };
            case 'Pending': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: Clock };
            case 'Rejected': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle };
            default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: Clock };
        }
    };

    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Orders</h1>
                <p className="text-gray-400">Track all your purchased numbers and order status.</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/10">
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Number</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Location</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Price</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_ORDERS.map((order) => {
                                const statusConfig = getStatusConfig(order.status);
                                const StatusIcon = statusConfig.icon;
                                return (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 text-sm font-medium text-gray-300 whitespace-nowrap">{order.id}</td>
                                        <td className="p-5 text-sm font-mono text-white group-hover:text-[#ff4da6] transition-colors whitespace-nowrap">{order.number}</td>
                                        <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{order.country}</td>
                                        <td className="p-5 text-sm text-white font-medium whitespace-nowrap">{order.price}</td>
                                        <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{order.date}</td>
                                        <td className="p-5 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                                <StatusIcon className="w-3.5 h-3.5" /> {order.status}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageWrapper>
    );
};

// 4. Support Page
const Support = () => {
    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Customer Support</h1>
                <p className="text-gray-400">Our support team is available 24/7 to help with any issues.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ff4da6]/5 to-[#9d4edd]/5 rounded-full blur-3xl pointer-events-none" />
                    <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Send us a message</h2>
                    <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                                <input type="text" placeholder="John Doe" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input type="email" placeholder="john@example.com" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                            <textarea rows={5} placeholder="How can we help you today?" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all resize-none"></textarea>
                        </div>
                        <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] text-white font-bold hover:shadow-[0_0_20px_rgba(255,77,166,0.3)] transform hover:-translate-y-0.5 transition-all">
                            Send Message
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <motion.div whileHover={{ y: -5 }} className="bg-[#111] border border-white/10 hover:border-[#ff4da6]/30 rounded-3xl p-6 shadow-lg group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4da6]/5 rounded-full blur-2xl group-hover:bg-[#ff4da6]/10 transition-colors pointer-events-none" />
                        <div className="w-12 h-12 rounded-full bg-[#ff4da6]/10 flex items-center justify-center mb-4 border border-[#ff4da6]/20">
                            <LifeBuoy className="text-[#ff4da6] w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Live Chat Support</h3>
                        <p className="text-sm text-gray-400 mb-4">Get instant help from our support agents.</p>
                        <button className="text-[#ff4da6] text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Start Chat <ChevronRight className="w-4 h-4" />
                        </button>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-[#111] border border-white/10 hover:border-[#9d4edd]/30 rounded-3xl p-6 shadow-lg group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#9d4edd]/5 rounded-full blur-2xl group-hover:bg-[#9d4edd]/10 transition-colors pointer-events-none" />
                        <div className="w-12 h-12 rounded-full bg-[#9d4edd]/10 flex items-center justify-center mb-4 border border-[#9d4edd]/20">
                            <ShieldCheck className="text-[#9d4edd] w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Help Center</h3>
                        <p className="text-sm text-gray-400 mb-4">Browse FAQs and detailed guides.</p>
                        <button className="text-[#9d4edd] text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Visit Help Center <ChevronRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};

// 5. Account Page
const Account = () => {
    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Account</h1>
                <p className="text-gray-400">Manage your profile and dashboard settings.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#ff4da6]/10 to-[#9d4edd]/10 blur-2xl pointer-events-none" />
                        <div className="relative">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] p-[2px] mb-4 shadow-[0_0_20px_rgba(255,77,166,0.2)]">
                                <div className="w-full h-full bg-[#0d0d0d] rounded-full flex items-center justify-center text-3xl font-bold text-white">
                                    {MOCK_USER.avatar}
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white">{MOCK_USER.name}</h2>
                            <p className="text-gray-400 text-sm mb-6">{MOCK_USER.email}</p>

                            <div className="space-y-3 mb-8">
                                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Total Orders</span>
                                    <span className="text-xl font-bold text-white">{MOCK_USER.totalOrders}</span>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Active Numbers</span>
                                    <span className="text-xl font-bold text-[#ff4da6]">{MOCK_USER.activeNumbers}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors flex items-center justify-center gap-2 text-sm">
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                                <button className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-bold transition-colors flex items-center justify-center gap-2 text-sm">
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                        <div className="space-y-6">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-4 items-start relative pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 rounded-full bg-[#ff4da6]/10 flex items-center justify-center shrink-0 border border-[#ff4da6]/20">
                                        <CheckCircle className="w-5 h-5 text-[#ff4da6]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Order Approved</h4>
                                        <p className="text-sm text-gray-400">Your order for virtual number <span className="text-[#9d4edd]">+1 555 4921</span> was successfully approved.</p>
                                        <span className="text-xs text-gray-600 mt-2 block">2 days ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

// 6. Confirm Order Page
const ConfirmOrder = ({ navigate, selectedData }) => {
    const number = selectedData?.number;
    const [copiedName, setCopiedName] = useState(false);
    const [copiedNumber, setCopiedNumber] = useState(false);
    const [fileName, setFileName] = useState("");

    if (!number) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl text-white font-bold mb-4">No number selected</h2>
                <button onClick={() => navigate('numbers')} className="text-[#ff4da6] hover:underline">Go back to numbers</button>
            </div>
        );
    }

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'name') { setCopiedName(true); setTimeout(() => setCopiedName(false), 2000); }
        if (type === 'number') { setCopiedNumber(true); setTimeout(() => setCopiedNumber(false), 2000); }
    };

    return (
        <PageWrapper>
            <button
                onClick={() => navigate('numbers')}
                className="mb-8 text-gray-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group w-fit"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Numbers
            </button>

            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Confirm Your Order</h1>
                <p className="text-gray-400">Complete payment and upload your slip to activate <span className="text-[#ff4da6] font-mono">{number.number}</span>.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left: Form */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#ff4da6]/5 to-[#9d4edd]/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <img src={number.flagUrl} alt={number.countryName} className="w-8 h-auto rounded-sm shadow-sm" />
                            <div>
                                <div className="text-sm text-gray-400">{number.countryName}</div>
                                <div className="text-lg font-mono text-white font-bold">{number.number}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total</div>
                            <div className="text-xl text-[#ff4da6] font-bold">${number.price}</div>
                        </div>
                    </div>

                    <form className="space-y-5 relative z-10" onSubmit={(e) => { e.preventDefault(); navigate('orders'); }}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input required type="text" placeholder="John Doe" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input required type="email" placeholder="john@example.com" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                            <input type="tel" placeholder="+1 234 567 890" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all" />
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Upload Payment Slip</label>
                            <div className="relative border-2 border-dashed border-white/20 bg-black/20 rounded-2xl p-8 text-center hover:border-[#ff4da6]/50 hover:bg-[#ff4da6]/5 transition-all duration-300 group cursor-pointer">
                                <input
                                    required
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setFileName(e.target.files[0]?.name)}
                                />
                                <div className="pointer-events-none">
                                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3 group-hover:text-[#ff4da6] transition-colors" />
                                    <p className="text-sm text-gray-300 font-medium mb-1">
                                        {fileName ? <span className="text-[#ff4da6]">{fileName}</span> : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG or PDF (Max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,77,166,0.3)] transform hover:scale-[1.01] transition-all mt-4">
                            Submit Order
                        </button>
                    </form>
                </div>

                {/* Right: Payment Instructions */}
                <div className="space-y-6">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff4da6]/5 blur-3xl rounded-full pointer-events-none" />

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-[#ff4da6]/10 flex items-center justify-center border border-[#ff4da6]/20">
                                <CreditCard className="w-5 h-5 text-[#ff4da6]" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Complete Your Payment</h2>
                        </div>

                        <p className="text-sm text-gray-400 mb-8 leading-relaxed relative z-10">
                            Send the payment of <strong className="text-white">${number.price}</strong> using one of the methods below. Upload your payment slip to confirm your order.
                        </p>

                        <div className="space-y-5 relative z-10">
                            {/* Payment Method 1 */}
                            <div className="bg-black/40 rounded-2xl p-5 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#10b981]" /> Easypaisa
                                    </h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center bg-black/60 p-3 rounded-lg border border-white/5">
                                        <div>
                                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Account Name</span>
                                            <span className="text-white font-medium">Tofi Studio</span>
                                        </div>
                                        <button onClick={() => copyToClipboard('Tofi Studio', 'name')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all">
                                            {copiedName ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/60 p-3 rounded-lg border border-white/5">
                                        <div>
                                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Account Number</span>
                                            <span className="text-white font-medium font-mono">0300 1234567</span>
                                        </div>
                                        <button onClick={() => copyToClipboard('03001234567', 'number')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all">
                                            {copiedNumber ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method 2 */}
                            <div className="bg-black/40 rounded-2xl p-5 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#ef4444]" /> JazzCash
                                    </h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center bg-black/60 p-3 rounded-lg border border-white/5">
                                        <div>
                                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Account Name</span>
                                            <span className="text-white font-medium">Tofi Studio Pvt</span>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/60 p-3 rounded-lg border border-white/5">
                                        <div>
                                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Account Number</span>
                                            <span className="text-white font-medium font-mono">0301 7654321</span>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 text-sm relative z-10">
                            <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>Your order will be marked as <strong className="text-yellow-500">Pending</strong> immediately after submission. Admin will approve it after payment verification.</p>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

// --- Layout & Main App ---

export default function App() {
    const isReady = useGSAPLoader();
    const [currentPath, setCurrentPath] = useState('numbers');
    const [routeData, setRouteData] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Router logic
    const navigate = (path, data = null) => {
        setCurrentPath(path);
        setRouteData(data);
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navItems = [
        { id: 'numbers', label: 'Virtual Numbers', icon: Hash },
        { id: 'countries', label: 'Countries', icon: Globe },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'support', label: 'Support', icon: LifeBuoy },
        { id: 'account', label: 'Account', icon: UserIcon },
    ];

    if (!isReady) return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-[#ff4da6]">Welcome to Tofi Studio</div>;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white flex overflow-hidden selection:bg-[#ff4da6] selection:text-white font-sans">

            {/* Background ambient glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff4da6]/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9d4edd]/5 blur-[150px] rounded-full" />
            </div>

            {/* --- Sidebar (Desktop) --- */}
            <aside className="hidden lg:flex flex-col w-[260px] h-screen bg-black/40 backdrop-blur-2xl border-r border-white/5 relative z-20 shrink-0">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center shadow-[0_0_15px_rgba(255,77,166,0.3)]">
                        <span className="text-white font-bold text-lg leading-none">T</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">Tofi Studio</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.id || (currentPath === 'confirm-order' && item.id === 'numbers');
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden
                  ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-[#ff4da6]/10 to-transparent border-l-2 border-[#ff4da6] rounded-xl"
                                    />
                                )}
                                <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-[#ff4da6]' : 'group-hover:text-gray-300'}`} />
                                <span className="relative z-10">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center font-bold">
                            {MOCK_USER.avatar}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{MOCK_USER.name}</p>
                            <p className="text-xs text-gray-500 truncate">Pro Member</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto scroll-smooth relative z-10">

                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-black/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center">
                            <span className="text-white font-bold">T</span>
                        </div>
                        <span className="text-lg font-bold">Tofi Studio</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                            />
                            <motion.aside
                                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0d0d0d] border-r border-white/10 z-50 flex flex-col"
                            >
                                <div className="p-6 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center">
                                            <span className="text-white font-bold">T</span>
                                        </div>
                                        <span className="text-xl font-bold">Tofi Studio</span>
                                    </div>
                                    <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                                </div>
                                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = currentPath === item.id || (currentPath === 'confirm-order' && item.id === 'numbers');
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => navigate(item.id)}
                                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all ${isActive ? 'bg-[#ff4da6]/10 text-white border border-[#ff4da6]/20' : 'text-gray-400'}`}
                                            >
                                                <Icon className={`w-5 h-5 ${isActive ? 'text-[#ff4da6]' : ''}`} />
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Content Wrapper */}
                <div className="p-6 md:p-10 pb-24">
                    {currentPath === 'numbers' && <VirtualNumbers navigate={navigate} preSelectedCountry={routeData?.countryId} />}
                    {currentPath === 'countries' && <Countries navigate={navigate} />}
                    {currentPath === 'orders' && <Orders />}
                    {currentPath === 'support' && <Support />}
                    {currentPath === 'account' && <Account />}
                    {currentPath === 'confirm-order' && <ConfirmOrder navigate={navigate} selectedData={routeData} />}
                </div>
            </main>
        </div>
    );
}