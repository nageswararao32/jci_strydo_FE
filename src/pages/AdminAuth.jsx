import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ShieldCheck, Lock, Mail, Fingerprint, Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminAuth = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");

  useEffect(() => {
    gsap.to(".aura-1", { x: '10vw', y: '15vh', duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".aura-2", { x: '-10vw', y: '-15vh', duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });

    gsap.fromTo(".admin-title",
      { y: 100, rotate: 5 },
      { y: 0, rotate: 0, duration: 1.5, ease: "expo.out" }
    );
  }, []);

  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "123") {
      navigate("/admin-dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex items-center justify-center p-6 overflow-hidden relative">

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="aura-1 absolute top-[10%] left-[20%] w-[700px] h-[700px] bg-blue-100/60 blur-[140px] rounded-full"></div>
        <div className="aura-2 absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-indigo-50/60 blur-[120px] rounded-full"></div>
      </div>

      {/* Back Button */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => navigate("/")}
        className="fixed top-12 left-12 z-50 flex items-center gap-4 text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-[0.4em]"
      >
        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border flex items-center justify-center">
          <ArrowLeft size={16} />
        </div>
        Exit To Hub
      </motion.button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-3xl rounded-[3.5rem] p-16 shadow-xl"
      >
        <div className="flex flex-col items-center text-center space-y-12">

          <div className="w-20 h-20 bg-blue-600 rounded-[2.2rem] flex items-center justify-center">
            <ShieldCheck size={36} className="text-white" />
          </div>

          <div>
            <h2 className="admin-title text-4xl font-black uppercase">System Root</h2>
            <div className="flex justify-center gap-2 text-blue-600 text-[10px] uppercase">
              <Activity size={12} className="animate-pulse" /> Command Access Alpha
            </div>
          </div>

          {/* Email */}
          <div className="w-full space-y-6 text-left">
            <div>
              <label className="text-[10px] uppercase text-slate-400">Identity</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 rounded-3xl py-5 pl-16 pr-6 font-bold outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] uppercase text-slate-400">Security Pin</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 rounded-3xl py-5 pl-16 pr-6 font-bold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs font-bold">{error}</p>
          )}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xs uppercase flex items-center justify-center gap-3"
          >
            Authorize <Fingerprint size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;