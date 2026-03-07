import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const signupForm = function SignupForm({ onBack }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#0d0d0d]">

      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
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
        className="relative z-10 w-full max-w-lg bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl"
      >
        <div className="p-10">

          {/* Header */}
          <div className="text-center mb-10">
            <button
              onClick={() => navigate("/")}
              className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 mx-auto"
            >
              <ChevronRight className="rotate-180 w-4 h-4" />
              Back
            </button>

            <h2 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h2>

            <p className="text-gray-400">
              Join Tofi Studio today
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">

            {/* Name */}
            <div className="grid md:grid-cols-2 gap-4">

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"/>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#ff4da6] outline-none"
                />
              </div>

              <input
                type="text"
                placeholder="Last Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#ff4da6] outline-none"
              />

            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"/>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#ff4da6] outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"/>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:border-[#ff4da6] outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>

            {/* Button */}
            <button onClick={() => navigate("/signin")} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] font-bold flex items-center text-white justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,77,166,0.6)] active:scale-[0.97]">
              Sign Up
              {/* <ArrowRight size={18}/> */}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default signupForm;