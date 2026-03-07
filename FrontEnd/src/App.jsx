import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, CheckCircle, Globe, Headset, ShieldCheck,
  Zap, Briefcase, Clock, Star, Mail, Instagram, Twitter,
  Linkedin, ChevronRight, Quote, User, ExternalLink
} from 'lucide-react';
import { useNavigate, Routes, Route } from "react-router-dom";
import SignupForm from './auth/SignUpFrom.jsx';
import SigninForm from "./auth/SignInFrom.jsx";
import DashBoard from "./pages/DashBoard.jsx";
// --- Components ---

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Support', href: '#support' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d0d0d]/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            TOFI STUDIO
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-300 hover:text-[#ff4da6] transition-colors text-sm font-medium">
              {link.name}
            </a>
          ))}
          <button
            onClick={() => navigate("/SignupForm")}
            className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#ff4da6] hover:text-white transition-all duration-300">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#0d0d0d] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-xl text-gray-300">
                {link.name}
              </a>
            ))}
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] text-white font-bold">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Using window.gsap loaded via script tag to avoid build errors
    if (window.gsap) {
      window.gsap.from(".hero-text-item", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden flex items-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#ff4da6]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#9d4edd]/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff4da6] animate-pulse" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Instant Activation Available</span>
          </motion.div>

          <h1 className="hero-text-item text-5xl md:text-7xl font-bold leading-tight mb-6">
            Buy Virtual Numbers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4da6] to-[#9d4edd]">
              Instantly
            </span>
          </h1>

          <p className="hero-text-item text-gray-400 text-lg md:text-xl mb-8 max-w-lg">
            Get secure, reliable, and instant virtual numbers for SMS verification, business accounts, and online platforms. 100+ countries supported.
          </p>

          <div className="hero-text-item space-y-4 mb-10">
            {[
              "Instant activation",
              "Works with major platforms",
              "Affordable pricing",
              "24/7 Customer Support"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="text-[#ff4da6] w-5 h-5" />
                <span className="text-gray-300 font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="hero-text-item flex flex-wrap gap-4">
            <button onClick={() => navigate("/SignupForm")} className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] text-white font-bold hover:shadow-[0_0_20px_rgba(255,77,166,0.4)] transition-all transform hover:-translate-y-1">
              Get Your Number
            </button>
            <button onClick={() => navigate("/SignupForm")} className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
              View Pricing
            </button>
          </div>
        </div>

        {/* Hero Right: Mockup */}
        <div className="relative z-10 flex justify-center">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-[400px]"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <div className="h-2 w-12 bg-white/20 rounded" />
                  <div className="h-2 w-8 bg-white/10 rounded" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Globe className="text-[#ff4da6] w-5 h-5" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Select Country</label>
                  <div className="w-full p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-4 bg-blue-600 rounded-sm" />
                      <span className="text-white font-medium">United States</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Preview Number</label>
                  <div className="w-full p-6 bg-black/40 border border-white/5 rounded-2xl text-center">
                    <span className="text-2xl font-mono tracking-wider text-[#ff4da6]">+1 555-012-4492</span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-500 font-bold uppercase">Status: Active</span>
                  </div>
                  <span className="text-xs text-gray-400">$2.99/mo</span>
                </div>

                <button onClick={() => navigate("/SignupForm")} className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[#ff4da6] hover:text-white transition-colors">
                  Buy Now
                </button>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#9d4edd] blur-[60px] opacity-40" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#ff4da6] blur-[80px] opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const services = [
    { title: "100+ Countries", desc: "Access virtual numbers from over 100 countries worldwide.", icon: Globe },
    { title: "24/7 Support", desc: "Our support team is available anytime you need help.", icon: Headset },
    { title: "Lifetime Access", desc: "Use your purchased numbers without unexpected expiry.", icon: Clock },
    { title: "Instant Delivery", desc: "Get your number immediately after payment.", icon: Zap },
    { title: "Secure & Private", desc: "We protect your identity and transaction data.", icon: ShieldCheck },
    { title: "Business Ready", desc: "Perfect for startups, marketers, and online businesses.", icon: Briefcase },
  ];

  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.from(".service-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });
    }
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Tofi Studio?</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#ff4da6] to-[#9d4edd] mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="service-card group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#ff4da6]/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4da6]/0 to-[#9d4edd]/0 group-hover:from-[#ff4da6]/5 group-hover:to-[#9d4edd]/5 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#ff4da6]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <s.icon className="text-[#ff4da6] w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marcus Thorne",
      role: "CEO, TechSphere",
      content: "Tofi Studio has completely streamlined our international communication. We secured 50+ virtual numbers in minutes. The activation speed is unmatched in the industry.",
      avatar: "MT",
      rating: 5,
      date: "2 days ago",
      verified: true
    },
    {
      name: "Elena Rodriguez",
      role: "Digital Nomad",
      content: "As someone who travels constantly, having reliable SMS verification for my banking and social accounts is critical. Tofi Studio works every single time without fail.",
      avatar: "ER",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "David Chen",
      role: "E-commerce Founder",
      content: "The API integration was seamless. We now automate our customer support numbers globally. Their pricing is transparent and very competitive for the level of service provided.",
      avatar: "DC",
      rating: 5,
      date: "3 days ago",
      verified: true
    }
  ];

  return (
    <section id="reviews" className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff4da6]/5 blur-[100px] rounded-full -mr-48 -mt-48" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4da6]/10 border border-[#ff4da6]/20 mb-4">
              <Star className="w-3 h-3 fill-[#ff4da6] text-[#ff4da6]" />
              <span className="text-[10px] font-bold text-[#ff4da6] uppercase tracking-widest">Global Trust</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Trusted by 10k+ Professionals
            </h2>
            <p className="text-gray-400 text-lg">
              Don't just take our word for it. Join thousands of users who rely on Tofi Studio for their secure communication needs.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="text-center border-r border-white/10 pr-4">
              <div className="text-2xl font-bold text-white">4.9/5</div>
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Average Rating</div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#ff4da6] text-[#ff4da6]" />
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="flex flex-col bg-[#111] border border-white/5 rounded-[2rem] p-8 relative group"
            >
              <Quote className="absolute top-8 right-8 text-white/5 w-12 h-12 group-hover:text-[#ff4da6]/10 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#ff4da6] text-[#ff4da6]" />
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-grow">
                "{t.content}"
              </p>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff4da6] to-[#9d4edd] flex items-center justify-center text-white font-bold shadow-lg shadow-[#ff4da6]/20">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold leading-none mb-1">{t.name}</h4>
                    <span className="text-xs text-gray-500">{t.role}</span>
                  </div>
                </div>
                {t.verified && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Verified</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder logos for visual depth/social proof */}
          <div className="text-xl font-black tracking-tighter text-white flex items-center gap-2"><Globe className="w-5 h-5" /> FORBES</div>
          <div className="text-xl font-black tracking-tighter text-white flex items-center gap-2"><Zap className="w-5 h-5" /> TECHCRUNCH</div>
          <div className="text-xl font-black tracking-tighter text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> WIRED</div>
          <div className="text-xl font-black tracking-tighter text-white flex items-center gap-2"><Star className="w-5 h-5" /> TRUSTPILOT</div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto relative group overflow-hidden rounded-[3rem] p-12 md:p-24 text-center">
        <div className="absolute inset-0 bg-[#0d0d0d] z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff4da6]/20 to-[#9d4edd]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#9d4edd]/20 blur-[120px] z-0" />

        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Need a Virtual Number?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            Sign up now and get instant access to our worldwide network of secure numbers.
          </p>
          <button onClick={() => navigate("/SignupForm")} className="px-12 py-5 rounded-full bg-white text-black font-black text-lg hover:scale-105 transition-transform">
            Create Account
          </button>
        </div>

        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 right-10 w-20 h-20 bg-[#ff4da6]/10 blur-xl rounded-full"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-10 left-10 w-32 h-32 bg-[#9d4edd]/10 blur-2xl rounded-full"
        />
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#ff4da6] to-[#9d4edd]" />
              <span className="text-xl font-bold">TOFI STUDIO</span>
            </div>
            <p className="text-gray-500 mb-6">
              Providing secure, global virtual numbers for individuals and businesses since 2021.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#ff4da6] hover:border-[#ff4da6] transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-[#ff4da6] transition-colors">Virtual Numbers</a></li>
              <li><a href="#" className="hover:text-[#ff4da6] transition-colors">Business Numbers</a></li>
              <li><a href="#" className="hover:text-[#ff4da6] transition-colors">SMS Verification</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-[#ff4da6] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#ff4da6] transition-colors">Live Chat</a></li>
              <li><a href="#" className="hover:text-[#ff4da6] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <div className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors cursor-pointer">
              <Mail size={18} />
              <span>support@tofistudio.com</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© 2024 Tofi Studio. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [libsReady, setLibsReady] = useState(false);

  useEffect(() => {
    // Add GSAP via CDN to avoid build resolution errors
    const gsapScript = document.createElement('script');
    gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";

    const triggerScript = document.createElement('script');
    triggerScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";

    gsapScript.onload = () => {
      document.head.appendChild(triggerScript);
      triggerScript.onload = () => {
        window.gsap.registerPlugin(window.ScrollTrigger);
        setLibsReady(true);
      };
    };

    document.head.appendChild(gsapScript);
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      // Clean up scripts if necessary (optional for this context)
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-[#ff4da6] selection:text-white">
          <Navbar />
          <Hero />
          <Services />
          <Testimonials />
          <CTA />
          <Footer />
        </div>
      } />
      <Route path="/SignupForm" element={<SignupForm />} />
      <Route path="/signin" element={<SigninForm />} />
      <Route path="/dashboard" element={<DashBoard />} />
    </Routes>
  );
}