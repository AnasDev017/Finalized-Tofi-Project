import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hash, Globe, ShoppingBag, LifeBuoy, User as UserIcon,
    Search, Filter, ChevronRight, Menu, X, CheckCircle,
    Clock, XCircle, Upload, Copy, ShieldCheck, CreditCard,
    LogOut, Edit3, ArrowLeft, Check, Smartphone, Zap, Loader2,
    Wallet, History, PlusCircle
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../api/baseUrl';
import Swal from 'sweetalert2';
import { io } from "socket.io-client";

const socket = io(API_BASE_URL);


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
const MOCK_OTP_SERVICES = [
    { id: 1, name: 'Instagram', slug: 'instagram', bgGradient: 'radial-gradient(circle at 30% 110%, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', number: '+44 755 482 991', price: 320 },
    { id: 2, name: 'Facebook', slug: 'facebook', bgGradient: 'linear-gradient(135deg, #1877F2, #0a5dc2)', number: '+1 202 555 0182', price: 280 },
    { id: 3, name: 'TikTok', slug: 'tiktok', bgGradient: 'linear-gradient(135deg, #010101, #69C9D0)', number: '+44 755 991 221', price: 350 },
    { id: 4, name: 'Gmail', slug: 'gmail', bgGradient: 'linear-gradient(135deg, #EA4335, #c1392b)', number: '+1 202 555 6612', price: 300 },
    { id: 5, name: 'Telegram', slug: 'telegram', bgGradient: 'linear-gradient(135deg, #2AABEE, #229ED9)', number: '+61 555 7741', price: 260 },
    { id: 6, name: 'WhatsApp', slug: 'whatsapp', bgGradient: 'linear-gradient(135deg, #25D366, #128C7E)', number: '+49 555 3871', price: 290 },
    { id: 7, name: 'VK', slug: 'vk', bgGradient: 'linear-gradient(135deg, #4C75A3, #2a5080)', number: '+7 999 555 1234', price: 240 },
    { id: 8, name: 'Discord', slug: 'discord', bgGradient: 'linear-gradient(135deg, #5865F2, #3c4dc9)', number: '+1 202 555 9988', price: 240 },
    { id: 9, name: 'Amazon', slug: 'amazon', bgGradient: 'linear-gradient(135deg, #232F3E, #FF9900)', number: '+44 755 441 129', price: 390 },
    { id: 10, name: 'Netflix', slug: 'netflix', bgGradient: 'linear-gradient(135deg, #E50914, #8b0000)', number: '+1 202 555 3391', price: 420 },
    { id: 11, name: 'Uber', slug: 'uber', bgGradient: 'linear-gradient(135deg, #1a1a1a, #000000)', number: '+44 755 882 341', price: 310 },
    { id: 12, name: 'Foodpanda', slug: 'foodpanda', bgGradient: 'linear-gradient(135deg, #D70F64, #a00a49)', number: '+92 321 555 7744', price: 200 },
    { id: 13, name: 'Daraz', slug: 'daraz', bgGradient: 'linear-gradient(135deg, #F57224, #c75600)', number: '+92 300 555 2219', price: 210 },
    { id: 14, name: 'Twitter/X', slug: 'x', bgGradient: 'linear-gradient(135deg, #14171A, #333)', number: '+1 202 555 5521', price: 330 },
];

const MOCK_ACTIVE_NUMBERS = [
    { id: 1, number: '+44 755 482 991', country: 'United Kingdom', flagUrl: 'https://flagcdn.com/w40/gb.png', service: 'Telegram', orderId: 'ORD-7821', status: 'Active', otp: null },
    { id: 2, number: '+1 202 555 0182', country: 'United States', flagUrl: 'https://flagcdn.com/w40/us.png', service: 'Instagram', orderId: 'ORD-7810', status: 'Active', otp: '948271' },
    { id: 3, number: '+61 555 7741', country: 'Australia', flagUrl: 'https://flagcdn.com/w40/au.png', service: 'WhatsApp', orderId: 'ORD-7798', status: 'Active', otp: null },
];

const MOCK_ORDERS = [
    { id: 'ORD-7782A', number: '+1 555 4921', country: 'United States', price: 'Rs4.99', date: '2026-03-07', method: 'Easypaisa', status: 'Approved' },
    { id: 'ORD-7781B', number: '+44 555 8812', country: 'United Kingdom', price: 'Rs6.50', date: '2026-03-05', method: 'JazzCash', status: 'Pending' },
    { id: 'ORD-7775C', number: '+1 555 1198', country: 'Canada', price: 'Rs3.99', date: '2026-03-01', method: 'Easypaisa', status: 'Approved' },
    { id: 'ORD-7760D', number: '+61 555 3321', country: 'Australia', price: 'Rs8.00', date: '2026-02-28', method: 'Crypto', status: 'Rejected' },
    { id: 'ORD-7751E', number: '+49 555 7744', country: 'Germany', price: 'Rs5.50', date: '2026-02-15', method: 'JazzCash', status: 'Approved' },
];

const MOCK_USER = {
    name: 'Alex Mercer',
    email: 'alex.mercer@example.com',
    avatar: 'AM',
    totalOrders: 12,
    activeNumbers: 3,
    walletBalance: 1250
};

const MOCK_TRANSACTIONS = [
    { id: 'TXN-1023', method: 'Easypaisa', amount: 1000, date: '2026-03-18', status: 'pending' },
    { id: 'TXN-1022', method: 'JazzCash', amount: 500, date: '2026-03-17', status: 'approved' },
    { id: 'TXN-1021', method: 'Crypto', amount: 2000, date: '2026-03-16', status: 'rejected' },
];

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
    }, []); // ← empty dep array: animate only on mount, not on every keystroke

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
const NumberCard = ({ num, onBuy }) => {
    const [btnPressed, setBtnPressed] = useState(false);
    const [buying, setBuying] = useState(false);

    // Backend data mapping: num.country might be an object or string depending on population
    const countryName = num.country?.name || num.countryName || 'N/A';
    const flagUrl = num.country?.flag || num.flagUrl;

    const handleInternalBuy = async () => {
        setBuying(true);
        await onBuy(num._id || num.id);
        setBuying(false);
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        setBtnPressed(true);
        setTimeout(() => {
            onBuy(num._id || num.id);
        }, 150);
    };

    return (
        <div className="card-glow-pulse relative overflow-hidden bg-[#111] border rounded-2xl p-5 flex flex-col h-full shadow-lg">
            <div className="card-glow-overlay absolute inset-0 pointer-events-none rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(255,77,166,0.07) 0%, rgba(157,78,221,0.07) 100%)' }}
            />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2.5 bg-black/50 pr-3 pl-2 py-1.5 rounded-full border border-white/5 shadow-sm">
                    {flagUrl && <img src={flagUrl} alt={countryName} className="w-5 h-auto rounded-[2px]" />}
                    <span className="text-xs font-semibold text-gray-300">{countryName}</span>
                </div>
                {/* Dynamic status badge */}
                {num.status === 'sold' ? (
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                        <span className="text-[10px] uppercase font-extrabold text-red-400 tracking-wider">Sold</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        <span className="text-[10px] uppercase font-extrabold text-green-500 tracking-wider">Available</span>
                    </div>
                )}
            </div>

            <div className="flex-grow flex flex-col items-center justify-center py-4 relative z-10 text-center">
                <div className="relative mb-2">
                    <h3 className="text-xl sm:text-2xl lg:text-[1.35rem] xl:text-2xl font-mono font-semibold tracking-widest whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {num.number}
                    </h3>
                    <h3 className="card-glow-overlay absolute inset-0 text-xl sm:text-2xl lg:text-[1.35rem] xl:text-2xl font-mono font-semibold tracking-widest whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#ff4da6] to-[#9d4edd]">
                        {num.number}
                    </h3>
                </div>
                {num.description && (
                    <p className="text-xs text-gray-400 max-w-[220px] mx-auto px-2 italic leading-relaxed">
                        {num.description}
                    </p>
                )}
            </div>

            <div className="pt-5 mt-auto border-t border-white/5 flex items-center justify-between relative z-10">
                <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-widest mb-0.5">Price</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">Rs{num.price}</span>
                    </div>
                </div>
                <button
                    onClick={handleInternalBuy}
                    onTouchStart={handleTouchStart}
                    disabled={buying || num.status === 'sold' || num.status === 'Sold'}
                    className="btn-get-number border text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={btnPressed ? {
                        background: 'linear-gradient(to right, #ff4da6, #9d4edd)',
                        borderColor: 'transparent'
                    } : {}}
                >
                    {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : (num.status === 'sold' || num.status === 'Sold' ? 'Sold' : 'Buy Now')}
                </button>
            </div>
        </div>
    );
};

// 1. Virtual Numbers Page
const VirtualNumbers = ({ onBuy, preSelectedCountry, numbers, countries }) => {
    const [search, setSearch] = useState('');
    const [filterCountry, setFilterCountry] = useState(preSelectedCountry || 'all');
    const [sortBy, setSortBy] = useState('price-asc');

    const filteredNumbers = useMemo(() => {
        // Only show numbers that are available (not sold)
        let result = numbers.filter(n => (n.status || '').toLowerCase() === 'available');
        if (filterCountry !== 'all') {
            result = result.filter(n => (n.country?.name || n.countryName) === filterCountry);
        }
        if (search) {
            const s = search.toLowerCase();
            result = result.filter(n =>
                n.number.includes(search) ||
                (n.country?.name || n.countryName || '').toLowerCase().includes(s)
            );
        }

        return result.sort((a, b) => {
            if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
            if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
            return 0;
        });
    }, [search, filterCountry, sortBy, numbers]);

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
                    {countries.map(c => (
                        <option key={c._id || c.id} value={c.name}>{c.name}</option>
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
                    <NumberCard key={num._id || num.id} num={num} onBuy={onBuy} />
                ))}
            </div>
            {filteredNumbers.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No numbers found matching your criteria.
                        <br />
                        (You can request your number through our WhatsApp support!)
                    </p>
                </div>
            )}
        </PageWrapper>
    );
};

// Starting prices for the first 2 countries
const COUNTRY_STARTING_PRICES = { us: 300, gb: 350 };

// 2. Countries Page
const Countries = ({ navigate, countries }) => {
    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Available Countries</h1>
                <p className="text-gray-400">Browse all countries where virtual numbers are available.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {countries.map((country) => (
                    <motion.div
                        key={country._id || country.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('numbers', { countryId: country.name })}
                        className="cursor-pointer bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-[#9d4edd]/50 hover:bg-[#161616] transition-all flex items-center justify-between group shadow-lg hover:shadow-[0_0_20px_rgba(157,78,221,0.15)] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9d4edd]/0 to-[#9d4edd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-black/50 border border-white/5 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300 p-2.5">
                                {country.flag && <img src={country.flag} alt={country.name} className="w-full h-auto object-contain rounded-sm" />}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-[1.05rem]">{country.name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{country.activeNumbers || 0} numbers available</p>
                                {country.price && (
                                    <p className="text-[10px] text-[#9d4edd] mt-0.5 font-semibold">
                                        Starting from Rs {country.price}
                                    </p>
                                )}
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#9d4edd] transition-colors relative z-10" />
                    </motion.div>
                ))}
            </div>
            {countries.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p>No countries available yet.</p>
                </div>
            )}
        </PageWrapper>
    );
};

// 3. Orders Page
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const res = await axios.get(`${API_BASE_URL}/orders/getMyOrders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.success) setOrders(res.data.orders);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setOrdersLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved': return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle };
            case 'pending': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: Clock };
            case 'rejected': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle };
            default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: Clock };
        }
    };

    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Orders</h1>
                <p className="text-gray-400">Track all your purchased numbers and order status.</p>
            </div>

            {ordersLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff4da6]" />
                </div>
            ) : (
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-black/40 border-b border-white/10">
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Number</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Location</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Price</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Method</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.length === 0 && (
                                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">No orders yet.</td></tr>
                                )}
                                {orders.map((order) => {
                                    const statusConfig = getStatusConfig(order.status);
                                    const StatusIcon = statusConfig.icon;
                                    return (
                                        <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-5 text-sm font-medium text-gray-300 whitespace-nowrap">{order.orderId}</td>
                                            <td className="p-5 text-sm font-mono text-white group-hover:text-[#ff4da6] transition-colors whitespace-nowrap">{order.purchasedNumber}</td>
                                            <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{order.country?.name || '—'}</td>
                                            <td className="p-5 text-sm text-white font-medium whitespace-nowrap">Rs{order.amount}</td>
                                            <td className="p-5 text-sm text-gray-400 whitespace-nowrap capitalize">{order.payment?.method || '—'}</td>
                                            <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
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
            )}
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



// 7. Get OTP's Page
// const GetOTPs = ({ onBuy }) => {
//     return (
//         <PageWrapper>
//             <CardGlowStyles />
//             <div className="mb-8">
//                 <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Get OTP's</h1>
//                 <p className="text-gray-400">Purchase OTP verification numbers for your favourite platforms — instant activation.</p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                 {MOCK_OTP_SERVICES.map((service) => (
//                     <div
//                         key={service.id}
//                         className="card-glow-pulse relative overflow-hidden bg-[#111] border rounded-2xl flex flex-col shadow-lg"
//                     >
//                         {/* CSS-animated pink glow overlay */}
//                         <div
//                             className="card-glow-overlay absolute inset-0 pointer-events-none rounded-2xl"
//                             style={{ background: 'linear-gradient(135deg, rgba(255,77,166,0.07) 0%, rgba(157,78,221,0.07) 100%)' }}
//                         />

//                         {/* ── TOP ROW: logo left / badge right ── */}
//                         <div className="p-5 pb-3 flex items-start justify-between relative z-10">
//                             <div
//                                 className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 overflow-hidden"
//                                 style={{ background: service.bgGradient }}
//                             >
//                                 <img
//                                     src={`https://cdn.simpleicons.org/${service.slug}/ffffff`}
//                                     alt={service.name}
//                                     className="w-6 h-6 object-contain"
//                                     onError={(e) => {
//                                         e.target.style.display = 'none';
//                                         e.target.parentNode.querySelector('span').style.display = 'block';
//                                     }}
//                                 />
//                                 <span className="text-white font-extrabold text-base hidden">{service.name[0]}</span>
//                             </div>
//                             <div className="bg-white/[0.06] border border-white/[0.09] rounded-lg px-3 py-1">
//                                 <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{service.name}</span>
//                             </div>
//                         </div>

//                         {/* ── CENTER: dual-layer number (same as NumberCard) ── */}
//                         <div className="px-5 pt-4 pb-4 text-center flex-1 flex flex-col items-center justify-center relative z-10">
//                             <div className="relative">
//                                 {/* Layer 1: white base (always visible) */}
//                                 <p className="text-[1.35rem] font-mono font-semibold tracking-widest whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
//                                     {service.number}
//                                 </p>
//                                 {/* Layer 2: pink overlay — fades in/out */}
//                                 <p className="card-glow-overlay absolute inset-0 text-[1.35rem] font-mono font-semibold tracking-widest whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#ff4da6] to-[#9d4edd]">
//                                     {service.number}
//                                 </p>
//                             </div>
//                             <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600 font-bold mt-2">Virtual Number</p>
//                         </div>

//                         {/* ── DIVIDER ── */}
//                         <div className="mx-5 h-px bg-white/[0.05] relative z-10" />

//                         {/* ── BOTTOM: price + CTA ── */}
//                         <div className="p-5 flex items-center justify-between relative z-10">
//                             <div>
//                                 <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Price</p>
//                                 <p className="text-xl font-extrabold text-white">PKR {service.price}</p>
//                             </div>
//                             <button
//                                 onClick={() => onBuy('mock-otp-' + service.id)}
//                                 className="btn-get-number border text-white px-5 py-2.5 rounded-xl text-sm font-bold"
//                             >
//                                 Get OTP
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </PageWrapper>
//     );
// };

// 8. My Active Numbers Page
const MyActiveNumbers = ({ navigate }) => {
    const [myNumbers, setMyNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedOtp, setCopiedOtp] = useState(null);

    useEffect(() => {
        const fetchActiveNumbers = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const res = await axios.get(`${API_BASE_URL}/user/my-numbers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setMyNumbers(res.data.numbers);
                }
            } catch (err) {
                console.error('Error fetching my numbers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveNumbers();

        // Socket listener for real-time OTP
        socket.on("otpReceived", (data) => {
            setMyNumbers(prev =>
                prev.map(n =>
                    n._id === data.numberId
                        ? { ...n, otp: { code: data.otp } }
                        : n
                )
            );
            Swal.fire({
                title: 'OTP Received!',
                text: `New OTP for number ${data.numberId} has arrived.`,
                icon: 'info',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#111',
                color: '#fff'
            });
        });

        return () => {
            socket.off("otpReceived");
        };
    }, []);

    const handleCopyOtp = (id, otp) => {
        if (!otp) return;
        navigator.clipboard.writeText(otp);
        setCopiedOtp(id);
        setTimeout(() => setCopiedOtp(null), 2000);
    };

    return (
        <PageWrapper>
            <CardGlowStyles />
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Active Numbers</h1>
                <p className="text-gray-400">Your purchased numbers — OTP codes sent by admin will appear here automatically.</p>
            </div>

            {/* Support Alert */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            >
                <LifeBuoy className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                    If your OTP does not arrive here, please try refreshing the page or <button onClick={() => navigate('support')} className="underline font-bold hover:text-blue-300">contact our support team</button>.
                </p>
            </motion.div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff4da6]" />
                </div>
            ) : myNumbers.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p>No active numbers yet. Purchase a number to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myNumbers.map((item, idx) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="card-glow-pulse relative overflow-hidden bg-[#111] border rounded-2xl p-6 shadow-lg flex flex-col"
                        >
                            {/* CSS-animated pink glow overlay */}
                            <div
                                className="card-glow-overlay absolute inset-0 pointer-events-none rounded-2xl"
                                style={{ background: 'linear-gradient(135deg, rgba(255,77,166,0.07) 0%, rgba(157,78,221,0.07) 100%)' }}
                            />

                            {/* ── ROW 1: Country pill + ACTIVE badge ── */}
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="flex items-center gap-2 bg-white/[0.09] border border-white/[0.09] rounded-full pl-1.5 pr-3 py-1.5">
                                    {item.country?.flag && (
                                        <img src={item.country.flag} alt={item.country.name} className="w-5 h-3 rounded-[2px] object-cover shrink-0" />
                                    )}
                                    <span className="text-white font-bold text-sm">{item.country?.name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </div>
                                    <span className="text-xs font-extrabold text-green-400 uppercase tracking-widest">Active</span>
                                </div>
                            </div>

                            {/* ── ROW 2: NUMBER ── */}
                            <div className="mb-5 relative z-10">
                                <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500 font-bold mb-2">Number</p>
                                <div className="relative">
                                    <p className="text-[1.45rem] font-mono font-semibold tracking-widest whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                        {item.number}
                                    </p>
                                    <p className="card-glow-overlay absolute inset-0 text-[1.45rem] font-mono font-semibold tracking-widest whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#ff4da6] to-[#9d4edd]">
                                        {item.number}
                                    </p>
                                </div>
                            </div>

                            {/* ── ROW 3: SERVICE | PRICE ── */}
                            <div className="grid grid-cols-2 gap-5 mb-6 relative z-10">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-bold mb-1.5">Service</p>
                                    <p className="text-white font-bold text-sm">{item.service || 'Virtual Number'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-bold mb-1.5">Price</p>
                                    <p className="text-gray-300 font-mono text-sm">Rs{item.price}</p>
                                </div>
                            </div>

                            {/* ── ROW 4: OTP CODE ── */}
                            <div className="relative z-10 mt-auto">
                                <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500 font-bold mb-2">OTP Code</p>
                                <AnimatePresence mode="wait">
                                    {item.otp?.code ? (
                                        <motion.div
                                            key="otp-received"
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-between bg-[#2a0a14] border border-[#ff4da6]/25 rounded-xl px-4 py-3.5"
                                        >
                                            <span className="text-[1.5rem] font-mono font-bold text-white tracking-[0.4em]">
                                                {item.otp.code.split('').join(' ')}
                                            </span>
                                            <button
                                                onClick={() => handleCopyOtp(item._id, item.otp.code)}
                                                className="ml-3 p-2 text-[#ff4da6]/70 hover:text-[#ff4da6] hover:bg-[#ff4da6]/10 rounded-lg transition-all shrink-0"
                                            >
                                                {copiedOtp === item._id
                                                    ? <Check className="w-4 h-4 text-green-400" />
                                                    : <Copy className="w-4 h-4" />}
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="otp-waiting"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2.5 bg-black/50 border border-white/5 rounded-xl px-4 py-3.5"
                                        >
                                            <Clock className="w-4 h-4 text-gray-600 shrink-0" />
                                            <p className="text-gray-600 text-sm font-medium">Waiting for OTP...</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
};

// 9. Add Funds Page

const AddFunds = ({ walletBalance, setWalletBalance, setTransactions, navigate }) => {
    const [method, setMethod] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [amount, setAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        Swal.fire({
            title: "Payment Info",
            text: "If your payment is not added within 20 minutes, please contact support via WhatsApp at 780789279.",
            icon: "info",
            background: "#111",
            color: "#fff",
            confirmButtonColor: "#ff4da6",
        });
    }, []);

    const paymentMethods = [
        { id: 'easypaisa', name: 'Easypaisa', account: '0300 1234567', title: 'Tofi Studio', icon: 'https://icon2.cleanpng.com/lnd/20250110/er/acded9d6362d497965c18a071cb9fd.webp' },
        { id: 'jazzcash', name: 'JazzCash', account: '0301 7654321', title: 'Tofi Studio Pvt', icon: 'https://play-lh.googleusercontent.com/uG93WUUyYVhe-B-5hBqKhr1X--UvgiICOFgD9rK4dbYG3TdqXKjq_TsJU7Pg034dOA=w240-h480-rw' },
        { id: 'nayapay', name: 'NayaPay', account: '0310 9876543', title: 'Alex Mercer', icon: 'https://play-lh.googleusercontent.com/OaLId--7-ubuipOHiNGR4N-EpFVg9wIGYIw6trOt5tOFKcjvcxdpsuEDfYcWLWJTUx4' },
        { id: 'crypto', name: 'Crypto (USDT)', account: '0x1234...abcd', title: 'ERC20 / TRC20', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2cQbJSNv4fI-SWqstYLsPgh8LrkNycKw6xA&s' },
    ];

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!method) return;
        setSubmitting(true);

        try {
            const token = localStorage.getItem("userToken");
            const res = await axios.post(`${API_BASE_URL}/transactions/deposit`, {
                method,
                amount: parseFloat(amount),
                transactionId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setTransactions(prev => [res.data.txn, ...prev]);
                setTransactionId('');
                setAmount('');
                setMethod('');
                Swal.fire({
                    title: 'Submitted!',
                    text: 'Deposit request submitted successfully! Admin will approve it after verification.',
                    icon: 'success',
                    background: '#111',
                    color: '#fff',
                });
            }
        } catch (error) {
            console.error("Deposit error:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to submit deposit',
                icon: 'error',
                background: '#111',
                color: '#fff',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Add Funds</h1>
                <p className="text-gray-400">Select a payment method and submit your transaction details.</p>
            </div>

            {/* Support Alert */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 rounded-2xl bg-[#ff4da6]/10 border border-[#ff4da6]/20 flex items-center gap-3 text-[#ff4da6] shadow-[0_0_20px_rgba(255,77,166,0.1)]"
            >
                <LifeBuoy className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                    If your funds are not updated within 15 to 20 minutes, please try refreshing the page or <button onClick={() => navigate('support')} className="underline font-bold hover:text-[#ff4da6]/80">contact our support team</button>.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Payment Methods Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#ff4da6]" /> Available Methods
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {paymentMethods.map((pm) => (
                            <div key={pm.id} className="bg-[#111] border border-white/5 hover:border-[#ff4da6]/30 rounded-2xl p-5 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff4da6]/5 blur-2xl rounded-full pointer-events-none" />
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center p-2">
                                        <img src={pm.icon} alt={pm.name} className="w-full h-full object-contain" />
                                    </div>
                                    <h3 className="text-white font-bold">{pm.name}</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 uppercase font-bold tracking-wider">Account</span>
                                        <button onClick={() => handleCopy(pm.account, pm.id)} className="text-[#ff4da6] hover:text-[#9d4edd] transition-colors">
                                            {copiedId === pm.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    <p className="text-white font-mono text-sm truncate">{pm.account}</p>
                                    <div className="flex justify-between items-center text-xs pt-1">
                                        <span className="text-gray-500 uppercase font-bold tracking-wider">Title</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{pm.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deposit Form Section */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#ff4da6]/5 to-[#9d4edd]/5 rounded-full blur-3xl pointer-events-none" />
                    <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Submit Deposit</h2>
                    <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                            <select
                                required
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select Method</option>
                                <option value="easypaisa">Easypaisa</option>
                                <option value="jazzcash">JazzCash</option>
                                <option value="nayapay">NayaPay</option>
                                <option value="crypto">Crypto</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Transaction ID</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter Transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Amount (PKR)</label>
                            <input
                                required
                                type="number"
                                placeholder="Less then 50 will be Rejected for Approval"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,77,166,0.3)] transform hover:scale-[1.01] transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><PlusCircle className="w-5 h-5" /> Add Funds</>}
                        </button>
                    </form>
                </div>
            </div>
        </PageWrapper>
    );
};

// 10. Payment History Page
const PaymentHistory = ({ transactions }) => {
    const getStatusConfig = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle };
            case 'pending': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: Clock };
            case 'rejected': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle };
            default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: Clock };
        }
    };

    return (
        <PageWrapper>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Payment History</h1>
                <p className="text-gray-400">View all your deposit requests and their statuses.</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/10">
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Transaction ID</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Method</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.length === 0 && (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No transactions found.</td></tr>
                            )}
                            {transactions.map((tx) => {
                                const statusConfig = getStatusConfig(tx.status);
                                const StatusIcon = statusConfig.icon;
                                return (
                                    <tr key={tx._id || tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 text-sm font-medium text-gray-300 whitespace-nowrap">{tx.transactionId || tx.id}</td>
                                        <td className="p-5 text-sm text-white group-hover:text-[#ff4da6] transition-colors whitespace-nowrap capitalize">{tx.method}</td>
                                        <td className="p-5 text-sm text-white font-medium whitespace-nowrap">Rs {tx.amount}</td>
                                        <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{new Date(tx.createdAt || tx.date).toLocaleDateString()}</td>
                                        <td className="p-5 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                                <StatusIcon className="w-3.5 h-3.5" /> {tx.status}
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

// --- Layout & Main App ---

export default function App() {
    const isReady = useGSAPLoader();
    const [currentPath, setCurrentPath] = useState('numbers');
    const [routeData, setRouteData] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Dynamic State
    const [numbers, setNumbers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    // Wallet State (Mock/Real)
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);

    // Fetch Data from Backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("userToken");
                const [countriesRes, numbersRes, balanceRes, transactionsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/countries/getAllCountries`),
                    axios.get(`${API_BASE_URL}/numbers/getAllNumbers`),
                    axios.get(`${API_BASE_URL}/transactions/balance`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/transactions/my-transactions`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (countriesRes.data.success) {
                    setCountries(countriesRes.data.countries);
                }
                if (numbersRes.data.success) {
                    setNumbers(numbersRes.data.numbers);
                }
                if (balanceRes.data.success) {
                    setWalletBalance(balanceRes.data.balance);
                }
                if (transactionsRes.data.success) {
                    setTransactions(transactionsRes.data.transactions);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Socket: Join room and listen for wallet updates
    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            const user = JSON.parse(userData);
            if (user.id) {
                socket.emit("join", user.id);
                console.log("Socket: Joined room", user.id);
            }
        }

        socket.on("walletUpdated", (data) => {
            setWalletBalance(data.balance);
            Swal.fire({
                title: 'Wallet Updated!',
                text: `Your new balance is Rs ${data.balance}`,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
                background: '#111',
                color: '#fff'
            });
        });

        return () => {
            socket.off("walletUpdated");
        };
    }, []);

    const handleBuy = async (numberId) => {
        const result = await Swal.fire({
            title: "Confirm Purchase",
            text: "Are you sure you want to buy this number? This action is non-refundable.",
            icon: "warning",
            background: "#111",
            color: "#fff",
            showCancelButton: true,
            confirmButtonColor: "#ff4da6",
            cancelButtonColor: "#555",
            confirmButtonText: "Yes, Buy Now",
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem("userToken");
            const res = await axios.post(`${API_BASE_URL}/orders/buy`, { numberId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                // Update local balance
                if (res.data.newBalance !== undefined) {
                    setWalletBalance(res.data.newBalance);
                }

                // Mark number as sold in local state
                setNumbers(prev => prev.map(n => (n._id === numberId || n.id === numberId) ? { ...n, status: 'sold' } : n));

                Swal.fire({
                    title: "Success!",
                    text: "Number purchased successfully.",
                    icon: "success",
                    background: "#111",
                    color: "#fff",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error("Purchase error:", error);
            Swal.fire({
                title: 'Purchase Failed',
                text: error.response?.data?.message || 'Error occurred during purchase.',
                icon: 'error',
                background: '#111',
                color: '#fff',
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("userToken");
        window.location.href = "/signin";
    };

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
        { id: 'add-funds', label: 'Add Funds', icon: Wallet },
        { id: 'history', label: 'Payment History', icon: History },
        { id: 'active', label: 'My Numbers', icon: Smartphone },
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
                        const isActive = currentPath === item.id;
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

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-asll duration-300 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Sign Out</span>
                    </button>
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
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-[#ff4da6]/10 to-[#9d4edd]/10 border border-[#ff4da6]/20 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-[0_0_15px_rgba(255,77,166,0.1)]">
                            <Wallet className="w-3.5 h-3.5 text-[#ff4da6]" />
                            <span className="text-xs font-bold text-white">Rs {walletBalance}</span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(true)} className="p-1 text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Desktop Top Navbar (Wallet Balance Only) */}
                <header className="hidden lg:flex items-center justify-end p-6 bg-transparent sticky top-0 z-40">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-2.5 flex items-center gap-4 shadow-2xl">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Total Balance</span>
                            <span className="text-lg font-bold text-white leading-none">Rs {walletBalance}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10 mx-1" />
                        <button
                            onClick={() => navigate('add-funds')}
                            className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,77,166,0.4)] hover:scale-105 transition-transform"
                        >
                            <PlusCircle className="w-6 h-6" />
                        </button>
                    </div>
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
                                        const isActive = currentPath === item.id;
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
                                <div className="p-6 border-t border-white/10">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-base font-bold text-red-400 hover:bg-red-400/5 transition-all"
                                    >
                                        <LogOut className="w-6 h-6" /> Sign Out
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Content Wrapper */}
                <div className="p-6 md:p-10 pb-24">
                    {loading ? (
                        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
                            <Loader2 className="w-10 h-10 animate-spin text-[#ff4da6]" />
                            <p className="animate-pulse">Loading dashboard data...</p>
                        </div>
                    ) : (
                        <>
                            {currentPath === 'numbers' && <VirtualNumbers onBuy={handleBuy} preSelectedCountry={routeData?.countryId} numbers={numbers} countries={countries} />}
                            {currentPath === 'countries' && <Countries navigate={navigate} countries={countries} />}
                            {currentPath === 'orders' && <Orders />}
                            {currentPath === 'support' && <Support />}
                            {currentPath === 'account' && <Account />}
                            {currentPath === 'active' && <MyActiveNumbers navigate={navigate} />}
                            {currentPath === 'add-funds' && <AddFunds walletBalance={walletBalance} setWalletBalance={setWalletBalance} setTransactions={setTransactions} navigate={navigate} />}
                            {currentPath === 'history' && <PaymentHistory transactions={transactions} />}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}