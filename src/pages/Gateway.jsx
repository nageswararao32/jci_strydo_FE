import React, { useEffect } from 'react';
import { ShoppingBag, Wrench, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Gateway = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/buyer-auth');
    }
  }, [navigate]);

  const handleSelection = (selection) => {
    if (selection === 'product') {
      navigate('/buyer-dashboard');
    } else if (selection === 'service') {
      navigate('/client-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 text-xs font-medium mb-6">
            <Sparkles size={14} className="text-amber-400" />
            <span>EXCELLENCE IN EVERY SELECTION</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            What’s your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">mission</span> today?
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Select your destination to experience world-class commerce and professional expertise.
          </p>
        </motion.div>

        {/* Path Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          
          {/* Product Path Card */}
          <PathCard 
            title="I want to Buy"
            description="Explore millions of products with lightning-fast delivery and secure payments."
            icon={<ShoppingBag size={32} />}
            image="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80"
            color="amber"
            onClick={() => handleSelection('product')}
            delay={0.2}
          />

          {/* Service Path Card */}
          <PathCard 
            title="I need a Service"
            description="Book world-class professionals for your home, tech, or business needs."
            icon={<Wrench size={32} />}
            image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"
            color="blue"
            onClick={() => handleSelection('service')}
            delay={0.4}
          />

        </div>

        {/* Footer Info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-slate-500 text-sm"
        >
          Not sure what to pick? <span className="text-slate-300 cursor-pointer hover:underline">Contact Support</span>
        </motion.p>
      </div>
    </div>
  );
};

const PathCard = ({ title, description, icon, image, color, onClick, delay }) => {
  const isAmber = color === 'amber';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isAmber ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-white/5 bg-slate-900/40 backdrop-blur-sm"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${isAmber ? 'from-amber-950/90 via-slate-900/40' : 'from-blue-950/90 via-slate-900/40'} to-transparent`} />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
        <div className={`mb-4 p-4 rounded-2xl ${isAmber ? 'bg-amber-500' : 'bg-blue-600'} text-white shadow-xl group-hover:rotate-12 transition-transform`}>
          {icon}
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-3 group-hover:translate-x-2 transition-transform">
          {title}
        </h2>
        
        <p className="text-slate-200 text-lg mb-8 max-w-xs opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          {description}
        </p>

        <div className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${
          isAmber ? 'bg-amber-500 text-amber-950 group-hover:bg-amber-400' : 'bg-blue-600 text-white group-hover:bg-blue-500'
        }`}>
          <span>Get Started</span>
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </div>

      {/* Border Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border-2 ${
        isAmber ? 'border-amber-500/50' : 'border-blue-500/50'
      } rounded-3xl shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]`} />
    </motion.div>
  );
};

export default Gateway;