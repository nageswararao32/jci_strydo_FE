import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  ShoppingBag, ShieldCheck, ArrowRight, Mail, Lock, User, 
  MapPin, ArrowLeft, Sparkles, Handshake, Search, Fingerprint, Heart
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import API from '../config/api';

const BuyerAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // --- MOUSE PARALLAX (Subtle & Fluid) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const bgX = useSpring(useTransform(mouseX, [-500, 500], [30, -30]), { stiffness: 40, damping: 25 });
  const bgY = useSpring(useTransform(mouseY, [-500, 500], [30, -30]), { stiffness: 40, damping: 25 });

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

  // --- GSAP REVEAL (Staggered Entrance) ---
  useEffect(() => {
    gsap.fromTo(".reveal-text", 
      { y: 80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" }
    );
  }, [isLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(API.BUYER_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('✅ Buyer registered successfully');
        setTimeout(() => {
          setIsLogin(true);
          setMessage('');
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`❌ Registration failed: ${errorData.message || 'Please try again'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(API.BUYER_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Store login data in sessionStorage
        sessionStorage.setItem('buyerLoginData', JSON.stringify(result));
        sessionStorage.setItem('buyerInfo', JSON.stringify(result.data));
        sessionStorage.setItem('userType', result.type);
        sessionStorage.setItem('isLoggedIn', 'true');
        
        setMessage(result.message);
        setTimeout(() => {
          navigate('/gateway');
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage(`❌ Login failed: ${errorData.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFEFF] text-[#1E293B] font-sans selection:bg-indigo-100 overflow-hidden relative flex items-center justify-center p-6">
      
      {/* 1. LIQUID ATMOSPHERE (Buyer Palette: Indigo/Soft Rose) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          style={{ x: bgX, y: bgY }}
          className="absolute top-[-10%] right-[10%] w-[800px] h-[800px] bg-indigo-100/40 blur-[120px] rounded-full" 
        />
        <motion.div 
          style={{ x: useTransform(bgX, v => v * -1), y: useTransform(bgY, v => v * -1) }}
          className="absolute bottom-[0%] left-[5%] w-[700px] h-[700px] bg-rose-50/40 blur-[140px] rounded-full" 
        />
        {/* Fine Grain Texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150"></div>
      </div>

      {/* 2. BREADCRUMB NAVIGATION */}
      <motion.button 
        whileHover={{ x: -8 }}
        onClick={() => navigate("/")}
        className="fixed top-12 left-12 z-50 flex items-center gap-4 text-slate-400 hover:text-indigo-600 transition-all font-bold text-[10px] uppercase tracking-[0.4em]"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center">
          <ArrowLeft size={16} />
        </div>
        Return to Gallery
      </motion.button>

      {/* 3. THE MORPHING PORTAL */}
      <motion.div 
        layout
        className="relative z-10 w-full max-w-[1250px] bg-white/50 backdrop-blur-3xl border border-white/80 rounded-[4rem] shadow-[0_40px_120px_-40px_rgba(30,41,59,0.08)] grid lg:grid-cols-12 overflow-hidden"
      >
        
        {/* LEFT PANEL: DISCOVERY INFO (5 Cols) */}
        <div className="lg:col-span-5 p-12 lg:p-24 bg-slate-50/30 border-r border-white/60 flex flex-col justify-between">
          <div className="space-y-20">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] shadow-2xl shadow-indigo-200 flex items-center justify-center text-white"
            >
              <ShoppingBag size={30} />
            </motion.div>

            <div className="space-y-8">
              <div className="overflow-hidden">
                <h2 className="text-6xl font-black tracking-tighter leading-[0.9] text-slate-900">
                  <span className="reveal-text block">Procure.</span>
                  <span className="reveal-text block text-indigo-600">Support.</span>
                  <span className="reveal-text block">Grow.</span>
                </h2>
              </div>
              <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-xs">
                Sourcing excellence from verified JCI entrepreneurs across India.
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex items-center gap-6"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Member" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Joined by <span className="text-indigo-600">8,000+</span> Buyers
            </p>
          </motion.div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE FORM (7 Cols) */}
        <div className="lg:col-span-7 p-12 lg:p-24 bg-white/10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-12"
            >
              <div className="space-y-3">
                <h3 className="text-4xl font-black tracking-tighter text-slate-900">
                  {isLogin ? "Welcome Back" : "Join the Brotherhood"}
                </h3>
                <div className="flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-indigo-100" />
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">
                        {isLogin ? "Member Portal" : "New Account Setup"}
                    </p>
                </div>
              </div>

              <div className="space-y-6">
                {!isLogin && (
                   <>
                   <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2 group">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">User ID</label>
                     <input 
                       type="text" 
                       name="userId"
                       value={formData.userId}
                       onChange={handleInputChange}
                       placeholder="JCI010101" 
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                     />
                   </div>
                   <div className="space-y-2 group">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Username</label>
                     <input 
                       type="text" 
                       name="username"
                       value={formData.username}
                       onChange={handleInputChange}
                       placeholder="Archana" 
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                     />
                   </div>
                 </div>
                 <div className="space-y-2 group">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                   <input 
                     type="tel" 
                     name="phoneNumber"
                     value={formData.phoneNumber}
                     onChange={handleInputChange}
                     placeholder="9999999999" 
                     className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                   />
                 </div>
                 <div className="space-y-2 group">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Address</label>
                   <input 
                     type="text" 
                     name="address"
                     value={formData.address}
                     onChange={handleInputChange}
                     placeholder="Street 1" 
                     className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                   />
                 </div>
                 <div className="grid md:grid-cols-3 gap-6">
                   <div className="space-y-2 group">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">City</label>
                     <input 
                       type="text" 
                       name="city"
                       value={formData.city}
                       onChange={handleInputChange}
                       placeholder="Bangalore" 
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                     />
                   </div>
                   <div className="space-y-2 group">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">State</label>
                     <input 
                       type="text" 
                       name="state"
                       value={formData.state}
                       onChange={handleInputChange}
                       placeholder="Karnataka" 
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                     />
                   </div>
                   <div className="space-y-2 group">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Country</label>
                     <input 
                       type="text" 
                       name="country"
                       value={formData.country}
                       onChange={handleInputChange}
                       placeholder="India" 
                       className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                     />
                   </div>
                 </div>
                 </>
                )}

                {/* Show User ID field for login */}
                {isLogin && (
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">User ID</label>
                    <input 
                      type="text" 
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      placeholder="JCI010101" 
                      className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 px-8 font-bold text-slate-900 transition-all outline-none" 
                    />
                  </div>
                )}

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="archana@gmail.com" 
                      className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 pl-16 pr-8 font-bold text-slate-900 transition-all outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Personal Pin</label>
                  <div className="relative">
                    <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••" 
                      className="w-full bg-slate-50/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-3xl py-5 pl-16 pr-8 font-bold text-slate-900 transition-all outline-none" 
                    />
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-2xl text-sm font-medium ${
                    message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: "#1e1e1e" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={isLogin ? handleLogin : handleRegister}
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl shadow-indigo-100 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    <>
                      {isLogin ? "Begin Session" : "Confirm Membership"} 
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </>
                  )}
                </motion.button>

                <div className="text-center">
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors py-2 px-4 rounded-full border border-transparent hover:border-indigo-100"
                  >
                    {isLogin ? "Need a buyer account? " : "Already have an account? "}
                    <span className="text-slate-900 ml-1 underline underline-offset-8 decoration-indigo-200">
                      {isLogin ? "Apply Now" : "Sign In"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 4. AURA FLOATING TRUST BADGE */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-12 left-12 z-50 flex items-center gap-5 bg-white/80 backdrop-blur-2xl p-4 pr-10 rounded-[2.5rem] shadow-3xl border border-white"
      >
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
          <ShieldCheck size={28} />
        </div>
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5 block">Identity Secured</span>
          <span className="text-sm font-black text-slate-900 tracking-tight">Verified Jaycee Network</span>
        </div>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #FDFEFF;
        }

        .tracking-tighter {
          letter-spacing: -0.07em;
        }

        /* Prevent layout jumps during AnimatePresence morphs */
        .layout-container {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BuyerAuth;