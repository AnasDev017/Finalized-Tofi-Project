import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Hash, Globe, ShoppingBag, CreditCard, Ticket,
    Menu, X, Trash2, CheckCircle, Plus, Search,
    Settings, LogOut, MessageSquare, Loader2, KeyRound, Send
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../api/baseUrl.js';
import Swal from 'sweetalert2';

// --- Initial Mock Data ---
const INITIAL_NUMBERS = [
    { id: 1, number: '+1 202 555 0182', country: 'United States', price: 3.00, status: 'Available' },
    { id: 2, number: '+44 7700 900111', country: 'United Kingdom', price: 5.50, status: 'Sold' },
    { id: 3, number: '+1 416 555 0198', country: 'Canada', price: 2.50, status: 'Available' },
    { id: 4, number: '+61 491 570 156', country: 'Australia', price: 4.00, status: 'Available' },
];

const INITIAL_COUNTRIES = [
    { id: 1, name: 'United States', code: 'US', activeNumbers: 120, price: 3.00, status: 'Active' },
    { id: 2, name: 'United Kingdom', code: 'GB', activeNumbers: 80, price: 5.50, status: 'Active' },
    { id: 3, name: 'Canada', code: 'CA', activeNumbers: 65, price: 2.50, status: 'Active' },
];

const INITIAL_ORDERS = [
    { id: 'ORD-1042', name: 'John Smith', email: 'john@example.com', number: '+1 202 555 0182', country: 'United States', price: 3.00, method: 'Easypaisa', date: '2026-03-10', status: 'Pending' },
    { id: 'ORD-1041', name: 'Sarah Lee', email: 'sarah@example.com', number: '+44 7700 900111', country: 'United Kingdom', price: 5.50, method: 'Crypto', date: '2026-03-09', status: 'Approved' },
    { id: 'ORD-1040', name: 'Ali Khan', email: 'ali@example.com', number: '+1 416 555 0198', country: 'Canada', price: 2.50, method: 'JazzCash', date: '2026-03-08', status: 'Rejected' },
];

const INITIAL_PAYMENTS = [
    { id: 'TXN-90213', name: 'Ahmed Khan', method: 'Easypaisa', amount: 3.00, number: '+44 7700 900123', orderId: 'ORD-1042', status: 'Pending' },
    { id: 'TXN-90212', name: 'Sarah Lee', method: 'Crypto', amount: 5.50, number: '+44 7700 900111', orderId: 'ORD-1041', status: 'Verified' },
    { id: 'TXN-90211', name: 'Ali Khan', method: 'JazzCash', amount: 2.50, number: '+1 416 555 0198', orderId: 'ORD-1040', status: 'Rejected' },
];

const INITIAL_TICKETS = [
    { id: 1, name: 'David Lee', whatsapp: '+44 7400 123456', query: 'My number has not been activated yet.', status: 'Open' },
    { id: 2, name: 'Maria Garcia', whatsapp: '+1 305 555 0199', query: 'How do I renew my current virtual number?', status: 'Open' },
];

// --- Page Transition Wrapper ---
const PageWrapper = ({ children, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-7xl mx-auto"
    >
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{title}</h1>
            <p className="text-gray-400">{description}</p>
        </div>
        {children}
    </motion.div>
);

// --- Sub-components (Views) ---

const ProductsView = ({ numbers, setNumbers, countries }) => {
    const [formData, setFormData] = useState({ number: '', country: '', price: '' });
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!formData.number || !formData.country || !formData.price) {
            Swal.fire({
                title: 'Missing Fields',
                text: 'Please fill all required fields.',
                icon: 'warning',
                background: '#111',
                color: '#fff',
                customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/numbers/addNumber`, {
                number: formData.number.trim(),
                countryName: formData.country,
                price: parseFloat(formData.price),
                status: 'available'
            });

            if (response.data.success) {
                const newNum = response.data.newNumber;
                // Add to local state with populated country for immediate UI sync
                const countryObj = countries.find(c => c.name === formData.country);
                const numberToStore = {
                    ...newNum,
                    country: countryObj || { name: formData.country }
                };

                setNumbers([numberToStore, ...numbers]);
                setFormData({ number: '', country: '', price: '' });
                Swal.fire({
                    title: 'Number Added!',
                    text: 'Virtual number is now available.',
                    icon: 'success',
                    background: '#111',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
                });
            }
        } catch (error) {
            console.error("Error adding number:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to add number',
                icon: 'error',
                background: '#111',
                color: '#fff',
                customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Remove Number?',
            text: "This virtual number will be deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff4da6',
            cancelButtonColor: '#333',
            confirmButtonText: 'Yes, delete',
            background: '#111',
            color: '#fff',
            customClass: {
                popup: 'rounded-2xl border border-white/10 shadow-2xl',
                confirmButton: 'rounded-xl px-6 py-2',
                cancelButton: 'rounded-xl px-6 py-2'
            }
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/numbers/deleteNumber/${id}`);
                if (response.data.success) {
                    setNumbers(numbers.filter(n => (n._id || n.id) !== id));
                    Swal.fire({
                        title: 'Deleted!',
                        icon: 'success',
                        background: '#111',
                        color: '#fff',
                        timer: 1000,
                        showConfirmButton: false,
                        customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
                    });
                }
            } catch (error) {
                console.error("Error deleting number:", error);
                Swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'Failed to delete number',
                    icon: 'error',
                    background: '#111',
                    color: '#fff',
                    customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
                });
            }
        }
    };

    return (
        <PageWrapper title="Virtual Numbers Management" description="Add and manage all available virtual numbers.">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-[#ff4da6]" /> Add New Number</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                                <input type="text" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} placeholder="+1 202 555 0000" className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Country</label>
                                <select value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all appearance-none cursor-pointer">
                                    <option value="">Select Country</option>
                                    {countries.map(c => <option key={c._id || c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (Rs)</label>
                                <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="3.00" className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all" />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#ff4da6] hover:bg-[#ff4da6]/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#ff4da6]/20 mt-2 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Number"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-black/40 border-b border-white/10">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Number</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Country</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {numbers.map(num => (
                                    <tr key={num._id || num.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-5 font-mono text-sm font-bold text-white">{num.number}</td>
                                        <td className="p-5 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                {num.country?.flag && <img src={num.country.flag} alt="" className="w-5 h-3 object-cover rounded-sm" />}
                                                {num.country?.name || num.country || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-gray-300">Rs{num.price?.toFixed(2)}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${num.status === 'available' || num.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {num.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button onClick={() => handleDelete(num._id || num.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {numbers.length === 0 && (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No numbers available.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};


const CountriesView = ({ countries, setCountries }) => {
    const [formData, setFormData] = useState({ name: '', code: '', activeNumbers: '', price: '' });
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.code || !formData.activeNumbers || !formData.price) return;

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/countries/addCountry`, {
                name: formData.name.trim(),
                code: formData.code.trim(),
                activeNumbers: parseInt(formData.activeNumbers),
                price: parseFloat(formData.price)
            });

            if (response.data.success) {
                setCountries([response.data.country, ...countries]);
                setFormData({ name: '', code: '', activeNumbers: '', price: '' });
                Swal.fire({
                    title: 'Success!',
                    text: 'Country added successfully.',
                    icon: 'success',
                    background: '#111',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
                });
            }
        } catch (error) {
            console.error("Error adding country:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || "Failed to add country",
                icon: 'error',
                background: '#111',
                color: '#fff',
                customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#9d4edd',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            background: '#111',
            color: '#fff',
            customClass: {
                popup: 'rounded-2xl border border-white/10 shadow-2xl',
                title: 'text-white font-bold',
                htmlContainer: 'text-gray-400',
                confirmButton: 'rounded-xl px-6 py-2',
                cancelButton: 'rounded-xl px-6 py-2'
            }
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/countries/deleteCountry/${id}`);
                if (response.data.success) {
                    setCountries(countries.filter(c => (c._id || c.id) !== id));
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Country has been removed.',
                        icon: 'success',
                        background: '#111',
                        color: '#fff',
                        timer: 1500,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'rounded-2xl border border-white/10 shadow-2xl'
                        }
                    });
                }
            } catch (error) {
                console.error("Error deleting country:", error);
                Swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'Failed to delete country',
                    icon: 'error',
                    background: '#111',
                    color: '#fff',
                    customClass: {
                        popup: 'rounded-2xl border border-white/10 shadow-2xl'
                    }
                });
            }
        }
    };

    return (
        <PageWrapper title="Countries Management" description="Manage all countries where numbers are available.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Globe className="w-5 h-5 text-[#9d4edd]" /> Add Country</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Country Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Germany" className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#9d4edd]/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Country Code</label>
                                <input type="text" maxLength={3} value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. +1" className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#9d4edd]/50 transition-all uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Active Numbers Quantity</label>
                                <input type="number" value={formData.activeNumbers} onChange={e => setFormData({ ...formData, activeNumbers: e.target.value })} placeholder="0" className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#9d4edd]/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (Rs)</label>
                                <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="3.00" className="w-full bg-[#161616] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#9d4edd]/50 transition-all" />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#9d4edd] hover:bg-[#9d4edd]/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#9d4edd]/20 mt-2 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Country"}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="md:col-span-2 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px]">
                            <thead className="bg-black/40 border-b border-white/10">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Country</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Code</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Active Numbers</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {countries.map((country, index) => (
                                    <tr key={country._id || index} className="hover:bg-white/5 transition-colors">
                                        <td className="p-5 text-sm font-bold text-white">
                                            <div className="flex items-center gap-3">
                                                {country.flag && <img src={country.flag} alt={country.name} className="w-6 h-4 rounded-sm object-cover" />}
                                                {country.name}
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-mono font-bold text-[#9d4edd]">{country.code ?? '—'}</td>
                                        <td className="p-5 text-sm text-gray-400">{country.activeNumbers} numbers</td>
                                        <td className="p-5 text-sm text-gray-300">Rs{country.price?.toFixed(2) ?? '—'}</td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {country.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button onClick={() => handleDelete(country._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {countries.length === 0 && (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No countries found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/orders/getAllOrders`);
                if (res.data.success) setOrders(res.data.orders);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setOrdersLoading(false);
            }
        };
        fetchOrders();
    }, []);



    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        }
    };

    return (
        <PageWrapper title="Customer Orders" description="Manage all incoming number purchase orders.">
            {ordersLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff4da6]" />
                </div>
            ) : (
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead className="bg-black/40 border-b border-white/10">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Purchased Number</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.length === 0 && (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No orders yet.</td></tr>
                                )}
                                {orders.map(order => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-5 text-sm font-bold text-white">{order.orderId}</td>
                                        <td className="p-5">
                                            <div className="text-sm font-bold text-white">{order.customer?.name}</div>
                                            <div className="text-xs text-gray-500">{order.customer?.email}</div>
                                            {order.customer?.whatsapp && (
                                                <div className="text-xs text-green-400 mt-0.5">WA: {order.customer.whatsapp}</div>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm font-mono text-gray-300">{order.purchasedNumber}</div>
                                            <div className="text-xs text-gray-500">{order.country?.name}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm font-bold text-white">Rs{order.amount}</div>
                                            <div className="text-[10px] text-gray-500 uppercase">{order.payment?.method}</div>
                                        </td>
                                        <td className="p-5 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

const PaymentsView = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/transactions/admin/all`);
            if (res.data.success) setTransactions(res.data.transactions);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await axios.patch(`${API_BASE_URL}/transactions/admin/update/${id}`, { status });
            if (res.data.success) {
                setTransactions(transactions.map(t => t._id === id ? { ...t, status } : t));
                Swal.fire({
                    title: 'Updated!',
                    text: `Transaction has been ${status}.`,
                    icon: 'success',
                    background: '#111',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            console.error('Error updating transaction:', err);
            Swal.fire({
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to update transaction',
                icon: 'error',
                background: '#111',
                color: '#fff',
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        }
    };

    return (
        <PageWrapper title="Wallet Transactions" description="Approve or reject wallet deposit requests.">
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff4da6]" />
                </div>
            ) : (
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead className="bg-black/40 border-b border-white/10">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.length === 0 && (
                                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">No transactions yet.</td></tr>
                                )}
                                {transactions.map(tx => (
                                    <tr key={tx._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-5 text-sm font-mono font-bold text-gray-300">
                                            {tx.transactionId}
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm text-white font-medium">{tx.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{tx.user?.email || 'N/A'}</div>
                                        </td>
                                        <td className="p-5 text-sm text-gray-400 capitalize">{tx.method}</td>
                                        <td className="p-5 text-sm font-bold text-white">Rs{tx.amount}</td>
                                        <td className="p-5 text-sm text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full border inline-block ${getStatusColor(tx.status)}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            {tx.status === 'pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx._id, 'approved')}
                                                        className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold hover:bg-green-500/20 transition-all"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx._id, 'rejected')}
                                                        className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-600 italic">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

const TicketsView = ({ tickets, setTickets }) => {
    const handleResolve = (id) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
        Swal.fire({
            title: 'Resolved!',
            text: 'Ticket has been marked as resolved.',
            icon: 'success',
            background: '#111',
            color: '#fff',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Ticket?',
            text: "This ticket will be permanently removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff4da6',
            cancelButtonColor: '#333',
            confirmButtonText: 'Yes, delete',
            background: '#111',
            color: '#fff',
            customClass: {
                popup: 'rounded-2xl border border-white/10 shadow-2xl',
                confirmButton: 'rounded-xl px-6 py-2',
                cancelButton: 'rounded-xl px-6 py-2'
            }
        });

        if (result.isConfirmed) {
            setTickets(tickets.filter(t => t.id !== id));
            Swal.fire({
                title: 'Removed!',
                icon: 'success',
                background: '#111',
                color: '#fff',
                timer: 1000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-2xl border border-white/10 shadow-2xl' }
            });
        }
    };

    return (
        <PageWrapper title="Customer Support Tickets" description="Manage user queries and support requests.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {tickets.map(ticket => (
                        <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ y: -5 }}
                            className={`bg-[#111] border rounded-2xl p-6 flex flex-col shadow-xl transition-colors ${ticket.status === 'Resolved' ? 'border-green-500/30 bg-green-900/10' : 'border-white/10'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-white">{ticket.name}</h3>
                                    <div className="text-xs font-mono text-gray-400 mt-1">{ticket.whatsapp}</div>
                                </div>
                                <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded border ${ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                    {ticket.status}
                                </span>
                            </div>

                            <div className="flex-1 bg-black/40 rounded-xl p-4 mb-6 border border-white/5 relative">
                                <MessageSquare className="w-4 h-4 text-gray-600 absolute top-4 left-4" />
                                <p className="text-sm text-gray-300 pl-6 italic">"{ticket.query}"</p>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                {ticket.status !== 'Resolved' && (
                                    <button onClick={() => handleResolve(ticket.id)} className="flex-1 flex justify-center items-center gap-2 bg-white/5 hover:bg-green-500/20 hover:text-green-400 text-gray-300 border border-white/10 hover:border-green-500/30 py-2.5 rounded-xl text-sm font-bold transition-all">
                                        <CheckCircle className="w-4 h-4" /> Resolve
                                    </button>
                                )}
                                <button onClick={() => handleDelete(ticket.id)} className={`${ticket.status === 'Resolved' ? 'w-full' : 'w-12'} flex justify-center items-center bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 py-2.5 rounded-xl transition-all`}>
                                    <Trash2 className="w-4 h-4" />
                                    {ticket.status === 'Resolved' && <span className="ml-2 text-sm font-bold">Delete Ticket</span>}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {tickets.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 font-medium">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500/50" />
                        No active support tickets. All caught up!
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

// --- Manage OTPs View ---
const ManageOTPsView = () => {
    const [soldNumbers, setSoldNumbers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [otpInputs, setOtpInputs] = React.useState({});
    const [sending, setSending] = React.useState({});

    React.useEffect(() => {
        const fetchSoldNumbers = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/numbers/sold`);
                if (res.data.success) {
                    setSoldNumbers(res.data.numbers);
                    const initOtps = {};
                    res.data.numbers.forEach(n => { initOtps[n._id] = n.otp?.code || ''; });
                    setOtpInputs(initOtps);
                }
            } catch (err) {
                console.error('Error fetching sold numbers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSoldNumbers();
    }, []);

    const handleSendOtp = async (numberId) => {
        const otp = otpInputs[numberId]?.trim();
        if (!otp) {
            Swal.fire({ title: 'Enter OTP', text: 'Please type an OTP code first.', icon: 'warning', background: '#111', color: '#fff', customClass: { popup: 'rounded-2xl border border-white/10' } });
            return;
        }
        setSending(prev => ({ ...prev, [numberId]: true }));
        try {
            const res = await axios.post(`${API_BASE_URL}/admin/numbers/send-otp`, { numberId, otp });
            if (res.data.success) {
                setSoldNumbers(prev => prev.map(n => n._id === numberId ? { ...n, otp: res.data.otp } : n));
                Swal.fire({ title: 'OTP Sent!', text: 'OTP has been saved to the number.', icon: 'success', background: '#111', color: '#fff', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl border border-white/10' } });
            }
        } catch (err) {
            Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Failed to send OTP', icon: 'error', background: '#111', color: '#fff', customClass: { popup: 'rounded-2xl border border-white/10' } });
        } finally {
            setSending(prev => ({ ...prev, [numberId]: false }));
        }
    };

    return (
        <PageWrapper title="Manage OTPs" description="Send OTP codes to users with purchased virtual numbers.">
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff4da6]" />
                </div>
            ) : soldNumbers.length === 0 ? (
                <div className="py-20 text-center text-gray-500 font-medium">
                    <KeyRound className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    No sold numbers found. Numbers purchased by users will appear here.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {soldNumbers.map(num => (
                        <motion.div
                            key={num._id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4"
                        >
                            {/* Number & Country */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-mono text-lg font-bold text-white">{num.number}</p>
                                    <p className="text-xs text-gray-500 mt-1">{num.country?.name || '—'}</p>
                                </div>
                                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Sold</span>
                            </div>

                            {/* Buyer info */}
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Buyer</p>
                                <p className="text-sm font-semibold text-white">{num.user?.name || 'Unknown'}</p>
                                <p className="text-xs text-gray-400">{num.user?.email || 'N/A'}</p>
                            </div>

                            {/* Current OTP */}
                            {num.otp?.code && (
                                <div className="bg-[#ff4da6]/5 border border-[#ff4da6]/20 rounded-xl p-3 flex items-center gap-3">
                                    <KeyRound className="w-4 h-4 text-[#ff4da6] flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Current OTP</p>
                                        <p className="font-mono font-bold text-[#ff4da6] text-lg tracking-widest">{num.otp.code}</p>
                                    </div>
                                </div>
                            )}

                            {/* OTP Input + Send Button */}
                            <div className="flex gap-2 mt-auto">
                                <input
                                    type="text"
                                    maxLength={10}
                                    placeholder="Enter OTP code"
                                    value={otpInputs[num._id] || ''}
                                    onChange={e => setOtpInputs(prev => ({ ...prev, [num._id]: e.target.value }))}
                                    className="flex-1 bg-[#161616] border border-white/10 rounded-xl py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ff4da6]/50 transition-all"
                                />
                                <button
                                    onClick={() => handleSendOtp(num._id)}
                                    disabled={sending[num._id]}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#ff4da6] hover:bg-[#ff4da6]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#ff4da6]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {sending[num._id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Send
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
};

// --- Main Admin App Layout ---
export default function Admin() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isAdmin") === "true");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [currentPath, setCurrentPath] = useState('numbers');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Dynamic state
    const [numbers, setNumbers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [tickets, setTickets] = useState(INITIAL_TICKETS);
    const [loading, setLoading] = useState(true);

    // Initial check & data fetching
    React.useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            setIsLoggedIn(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [countriesRes, numbersRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/countries/getAllCountries`),
                    axios.get(`${API_BASE_URL}/numbers/getAllNumbers`)
                ]);

                if (countriesRes.data.success) {
                    setCountries(countriesRes.data.countries);
                }
                if (numbersRes.data.success) {
                    setNumbers(numbersRes.data.numbers);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({
                    title: 'Fetch Error',
                    text: 'Unable to load data from server.',
                    icon: 'error',
                    background: '#111',
                    color: '#fff',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isLoggedIn]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'tofiwork2@gmail.com' && password === 'Tofi289') {
            localStorage.setItem("isAdmin", "true");
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid email or password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        setIsLoggedIn(false);
    };

    const navigate = (path) => {
        setCurrentPath(path);
        setMobileMenuOpen(false);
    };

    const navItems = [
        { id: 'numbers', label: 'Numbers', icon: Hash },
        { id: 'countries', label: 'Countries', icon: Globe },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'tickets', label: 'Tickets', icon: Ticket },
        { id: 'otps', label: 'Manage OTPs', icon: KeyRound },
    ];

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center p-6 selection:bg-[#ff4da6]/30">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff4da6]/5 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9d4edd]/5 blur-[150px] rounded-full" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
                >
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center shadow-xl shadow-[#ff4da6]/20 mb-4 text-2xl font-bold">T</div>
                        <h1 className="text-3xl font-bold tracking-tight">Tofi Admin</h1>
                        <p className="text-gray-500 mt-2">Enter credentials to access dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">Admin Email</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tofiwork2@gmail.com"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">Password</label>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ff4da6]/50 transition-all font-medium"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-sm font-bold bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-xl"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(255,77,166,0.3)] transform hover:scale-[1.01] transition-all mt-4"
                        >
                            Sign In
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#0d0d0d] text-white flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-[#ff4da6]/30">

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-[260px] bg-[#080808] border-r border-white/5 flex-shrink-0 z-10">
                <div className="p-8 font-bold text-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center shadow-lg shadow-[#ff4da6]/20">T</div>
                    <span className="tracking-tight">Tofi Admin</span>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 py-4 overflow-y-auto scrollbar-hide">
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Management</div>
                    {navItems.map(item => {
                        const isActive = currentPath === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 relative group ${isActive ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && <motion.div layoutId="active-nav" className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff4da6] rounded-r-full shadow-[0_0_10px_#ff4da6]" />}
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#ff4da6]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Container */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                {/* Mobile Header */}
                <header className="lg:hidden p-4 bg-black/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center sticky top-0 z-[100]">
                    <div className="font-bold text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center text-sm">T</div>
                        Tofi Admin
                    </div>
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-white/5 rounded-lg"><Menu /></button>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-12 scroll-smooth">
                    <AnimatePresence mode="wait">
                        {currentPath === 'numbers' && <ProductsView key="numbers" numbers={numbers} setNumbers={setNumbers} countries={countries} />}
                        {currentPath === 'countries' && <CountriesView key="countries" countries={countries} setCountries={setCountries} />}
                        {currentPath === 'orders' && <OrdersView key="orders" />}
                        {currentPath === 'payments' && <PaymentsView key="payments" />}
                        {currentPath === 'tickets' && <TicketsView key="tickets" tickets={tickets} setTickets={setTickets} />}
                        {currentPath === 'otps' && <ManageOTPsView key="otps" />}
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[260px] max-w-sm bg-[#080808] z-[120] p-6 lg:hidden flex flex-col shadow-2xl border-r border-white/10"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3 font-bold text-xl">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center text-sm">T</div>
                                    Admin
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-2 flex-1 overflow-y-auto">
                                {navItems.map(item => {
                                    const isActive = currentPath === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => navigate(item.id)}
                                            className={`w-full text-left p-4 rounded-2xl font-bold flex items-center gap-4 transition-all ${isActive ? 'bg-[#ff4da6]/10 text-[#ff4da6] border border-[#ff4da6]/20' : 'hover:bg-white/5 text-gray-400'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" /> {item.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
