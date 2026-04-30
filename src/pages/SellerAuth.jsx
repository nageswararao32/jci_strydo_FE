import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Store, ShieldCheck, ArrowRight, Mail, Lock, User, 
  MapPin, ArrowLeft, Building, Phone, FileText, Package,TrendingUp, Shield , Fingerprint 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import API from '../config/api';

const SellerAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    companyName: '',
    companyPhone: '',
    ownerName: '',
    companyAddress: '',
    productOrService: 'Product',
    location: '',
    companyImage: '',
    companyDescription: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // --- MOUSE PARALLAX LOGIC ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for parallax
  const bgX = useSpring(useTransform(mouseX, [-500, 500], [50, -50]), { stiffness: 50, damping: 30 });
  const bgY = useSpring(useTransform(mouseY, [-500, 500], [50, -50]), { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const moveX = clientX - window.innerWidth / 2;
      const moveY = clientY - window.innerHeight / 2;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- GSAP TEXT REVEAL ---
  const titleRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(".reveal-text", 
      { y: 100, rotate: 5 }, 
      { y: 0, rotate: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }
    );
  }, [isLogin]);

  // --- FORM HANDLING ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- SELLER REGISTRATION ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(API.SELLER_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Seller registered successfully! Please login.' });
        // Reset form and switch to login
        setFormData({
          userId: '',
          email: '',
          password: '',
          companyName: '',
          companyPhone: '',
          ownerName: '',
          companyAddress: '',
          productOrService: 'Product',
          location: '',
          companyImage: '',
          companyDescription: ''
        });
        setTimeout(() => {
          setIsLogin(true);
          setMessage('');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- SELLER LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(API.SELLER_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store seller data in sessionStorage
        sessionStorage.setItem('sellerLoginData', JSON.stringify(result));
        sessionStorage.setItem('sellerInfo', JSON.stringify(result.data));
        sessionStorage.setItem('userType', result.type);
        sessionStorage.setItem('isLoggedIn', 'true');

        setMessage({ type: 'success', text: '✅ Seller login successful! Redirecting...' });
        
        // Redirect based on productOrService type
        setTimeout(() => {
          if (result.data.productOrService === 'Service') {
            navigate('/service-dashboard');
          } else {
            navigate('/seller-dashboard');
          }
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = (e) => {
    if (isLogin) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-100 overflow-hidden relative flex items-center justify-center p-6">
      
      {/* 1. LAYERED LIQUID BACKDROP (Reacts to Mouse) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          style={{ x: bgX, y: bgY }}
          className="absolute top-[5%] left-[10%] w-[700px] h-[700px] bg-blue-200/30 blur-[140px] rounded-full" 
        />
        <motion.div 
          style={{ x: useTransform(bgX, (v) => v * -1.2), y: useTransform(bgY, (v) => v * -1.2) }}
          className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-200/30 blur-[140px] rounded-full" 
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      {/* 2. PREMIUM NAVIGATION */}
      <motion.button 
        whileHover={{ x: -5 }}
        onClick={() => navigate("/")}
        className="fixed top-10 left-10 z-50 flex items-center gap-4 text-slate-400 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-[0.3em]"
      >
        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
          <ArrowLeft size={16} />
        </div>
        Back to Hub
      </motion.button>

      {/* 3. THE MORPHING PORTAL */}
      <motion.div 
        layout
        className="relative z-10 w-full max-w-[1200px] bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] grid lg:grid-cols-12 overflow-hidden"
      >
        
        {/* LEFT PANEL: CONTENT REVEAL (5 Cols) */}
        <div className="lg:col-span-5 p-12 lg:p-20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-r border-white/50 flex flex-col justify-between relative">
          <div className="space-y-16">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-16 h-16 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-300 flex items-center justify-center"
            >
              <TrendingUp className="text-white" size={32} />
            </motion.div>

            <div className="space-y-8">
              <div className="overflow-hidden">
                <h2 className="text-6xl font-black tracking-tighter leading-[0.95] text-slate-900">
                  <span className="reveal-text block">Elevate</span>
                  <span className="reveal-text block text-blue-600">Your Trade.</span>
                </h2>
              </div>
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-slate-500 font-medium text-xl leading-relaxed max-w-xs"
              >
                Access India's premier B2B community for young leaders.
              </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
            className="p-8 rounded-[2.5rem] bg-white/50 border border-white shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <span className="text-sm font-black text-slate-900 tracking-tight uppercase">JCI Secured</span>
            </div>
            <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
              Every seller is verified via National JCI Chapter protocols.
            </p>
          </motion.div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE FORM (7 Cols) */}
        <div className="lg:col-span-7 p-12 lg:p-24 flex flex-col justify-center bg-white/20">
          <AnimatePresence mode="wait">
            <motion.div 
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.05, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter text-slate-900">
                  {isLogin ? "Welcome Back" : "Start Growing"}
                </h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] ml-1">
                  {isLogin ? "Authorized Personnel Only" : "Member Application Portal"}
                </p>
              </div>

              <div className="space-y-6">
                {/* Dynamic Inputs based on State */}
                {!isLogin && (
                  <>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Business Email</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="saranya@gmail.com" 
                          className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 pl-16 pr-8 font-bold text-slate-900 transition-all outline-none" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">User ID</label>
                        <input 
                          type="text" 
                          name="userId"
                          value={formData.userId}
                          onChange={handleInputChange}
                          placeholder="JCI020202" 
                          className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                        />
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Owner Name</label>
                        <input 
                          type="text" 
                          name="ownerName"
                          value={formData.ownerName}
                          onChange={handleInputChange}
                          placeholder="Saranya" 
                          className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Company Name</label>
                        <input 
                          type="text" 
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Sai Pvt Ltd" 
                          className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                        />
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Company Phone</label>
                        <input 
                          type="tel" 
                          name="companyPhone"
                          value={formData.companyPhone}
                          onChange={handleInputChange}
                          placeholder="8888888888" 
                          className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Company Address</label>
                      <input 
                        type="text" 
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleInputChange}
                        placeholder="Industrial Area" 
                        className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Location</label>
                        <input 
                          type="text" 
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Bangalore" 
                          className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                        />
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Product/Service</label>
                        <select 
                          name="productOrService"
                          value={formData.productOrService}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none"
                        >
                          <option value="Product">Product</option>
                          <option value="Service">Service</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Company Image URL</label>
                      <input 
                        type="url" 
                        name="companyImage"
                        value={formData.companyImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg" 
                        className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                      />
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Company Description</label>
                      <textarea 
                        name="companyDescription"
                        value={formData.companyDescription}
                        onChange={handleInputChange}
                        placeholder="We make delicious cakes" 
                        rows={3}
                        className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none resize-none"
                      />
                    </div>
                  </>
                )}

                {/* User ID for Login */}
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">User ID</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input 
                      type="text" 
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      placeholder="JCI020202" 
                      className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 pl-16 pr-8 font-bold text-slate-900 transition-all outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secure Key</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="123456" 
                      className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white rounded-3xl py-5 pl-16 pr-8 font-bold text-slate-900 transition-all outline-none" 
                    />
                  </div>
                </div>

                {/* Message Display */}
                {message && (
                  <div className={`p-4 rounded-2xl text-center text-xs font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {message.text}
                  </div>
                )}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xs tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 group disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : (isLogin ? "Access Dashboard" : "Create Account")} 
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>

              <div className="text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {isLogin ? "Don't have an account? " : "Already registered? "}
                  <span className="text-slate-900 underline underline-offset-8 decoration-blue-200">
                    {isLogin ? "Apply Now" : "Login Here"}
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 4. TACTILE FLOATING SUPPORT */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-12 right-12 z-50 flex items-center gap-6 bg-white/80 backdrop-blur-xl p-3 pr-8 rounded-[2rem] shadow-2xl border border-white"
      >
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Fingerprint size={24} />
        </div>
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 block">Trade Safely</span>
          <span className="text-xs font-bold text-slate-900">JCI Verified Portal</span>
        </div>
      </motion.div>

     <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #F8FAFC;
  }

  .tracking-tighter {
    letter-spacing: -0.06em;
  }

  .overflow-hidden {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  }

  ::-webkit-scrollbar {
    display: none;
  }
`}</style>
    </div>
  );
};

export default SellerAuth;