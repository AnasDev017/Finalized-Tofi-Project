import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../api/baseUrl";
import Swal from "sweetalert2";

export default function SigninForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            Swal.fire({
                title: "Missing fields",
                text: "Please enter your email and password.",
                icon: "warning",
                background: "#111",
                color: "#fff",
                customClass: { popup: 'rounded-3xl border border-white/10 shadow-2xl' }
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                // Save token and user info
                localStorage.setItem("userToken", response.data.token);
                localStorage.setItem("userData", JSON.stringify(response.data.user));

                Swal.fire({
                    title: "Welcome Back!",
                    text: response.data.message || "Login successful.",
                    icon: "success",
                    background: "#111",
                    color: "#fff",
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-3xl border border-white/10 shadow-2xl' }
                });

                setTimeout(() => navigate("/dashboard"), 1500);
            }
        } catch (error) {
            console.error("Login error:", error);
            Swal.fire({
                title: "Login Failed",
                text: error.response?.data?.message || "Invalid credentials. Please try again.",
                icon: "error",
                background: "#111",
                color: "#fff",
                customClass: { popup: 'rounded-3xl border border-white/10 shadow-2xl' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#0d0d0d] overflow-hidden">

            {/* Animated Background */}
            <div className="absolute inset-0">

                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-[15%] -left-[10%] w-[70%] h-[70%] bg-[#ff4da6]/20 blur-[130px] rounded-full"
                />

                <motion.div
                    animate={{ scale: [1.3, 1, 1.3], rotate: [0, -45, 0] }}
                    transition={{ duration: 18, repeat: Infinity }}
                    className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] bg-[#9d4edd]/20 blur-[130px] rounded-full"
                />

            </div>

            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
            >

                {/* Header */}
                <div className="text-center mb-10">

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 mx-auto"
                    >
                        <ChevronRight className="rotate-180 w-4 h-4" />
                        Back
                    </button>

                    <h2 className="text-4xl font-bold text-white mb-2">
                        Welcome Back
                    </h2>

                    <p className="text-gray-400">
                        Sign in to your account
                    </p>

                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

                        <input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#ff4da6] outline-none transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">

                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:border-[#ff4da6] outline-none transition-all"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] font-bold flex items-center text-white justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,77,166,0.6)] active:scale-[0.97] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    {/* Don't have an account */}
                    <p className="text-center text-gray-500 mt-6 text-sm">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="text-white font-semibold hover:text-[#ff4da6] transition-colors cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </p>

                </form>

            </motion.div>

        </div>
    );
}
