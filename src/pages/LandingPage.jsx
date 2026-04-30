import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronRight,
  ShoppingBag,
  Users,
  TrendingUp,
  Shield,
  Star,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  ArrowRight,
  Globe,
  Award,
  Target,
  Quote,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const statsRef = useRef(null);

  // Smooth Scroll Progress for Parallax
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // GSAP: Text Split Reveal Animation for Hero
    const ctx = gsap.context(() => {
      gsap.from(".hero-title-part", {
        y: 120,
        skewY: 7,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
      });

      // Stats Counting Animation
      gsap.from(".stat-number", {
        textContent: 0,
        duration: 2,
        ease: "power1.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
      });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  // Framer Motion Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* 1. MAGNETIC NAVIGATION */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="flex flex-col leading-none">
                <span
                  className={`font-black text-2xl tracking-tighter ${scrolled ? "text-slate-900" : "text-white"}`}
                >
                  JCI INDIA
                </span>
                <span
                  className={`text-[10px] font-bold tracking-[0.3em] uppercase mt-1 ${scrolled ? "text-blue-600" : "text-blue-200"}`}
                >
                  Marketplace
                </span>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center space-x-8">
              {["About", "Services",  "Contact"].map((item) => (
                <motion.a
                  whileHover={{ y: -2 }}
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-bold tracking-wide transition-colors hover:text-blue-600 ${scrolled ? "text-slate-600" : "text-white/90"}`}
                >
                  {item}
                </motion.a>
              ))}
              <div className="relative inline-block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="group relative bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black tracking-[0.2em] uppercase shadow-2xl shadow-blue-500/20 flex items-center gap-3 overflow-hidden transition-all hover:bg-blue-500"
                >
                  {/* Inner shimmer effect on button hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></div>

                  <span className="relative">Join Network</span>
                  <ChevronRight
                    className={`relative w-4 h-4 transition-transform duration-500 ${dropdownOpen ? "rotate-90" : ""}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Invisible backdrop to close dropdown when clicking outside */}
                      <div
                        className="fixed inset-0 z-[100]"
                        onClick={() => setDropdownOpen(false)}
                      ></div>

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 15,
                          scale: 0.95,
                          filter: "blur(10px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                          scale: 0.95,
                          filter: "blur(10px)",
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-4 w-72 origin-top-right overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[110]"
                      >
                        {/* Subtle Top Gradient Line */}
                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                        <div className="p-4 space-y-2">
                          {/* Buyer Option */}
                          <motion.button
                            whileHover={{
                              x: 5,
                              backgroundColor: "rgba(255,255,255,0.05)",
                            }}
                            onClick={() => {
                              navigate("/buyer-auth");
                              setDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                              <ShoppingBag size={20} />
                            </div>
                            <div className="text-left">
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-0.5">
                                Access
                              </div>
                              <div className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tighter">
                                Become a Buyer
                              </div>
                            </div>
                          </motion.button>

                          {/* Seller Option */}
                          <motion.button
                            whileHover={{
                              x: 5,
                              backgroundColor: "rgba(255,255,255,0.05)",
                            }}
                            onClick={() => {
                              navigate("/seller-auth");
                              setDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                              <TrendingUp size={20} />
                            </div>
                            <div className="text-left">
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-0.5">
                                Growth
                              </div>
                              <div className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter">
                                Register as Seller
                              </div>
                            </div>
                          </motion.button>
                        </div>

                        {/* Bottom Help Text */}
                        <div className="bg-white/[0.02] p-4 border-t border-white/5">
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest text-center leading-relaxed">
                            Verified JCI India <br /> Membership Required
                          </p>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 2. CINEMATIC HERO SECTION */}
      <section
        className="relative h-screen flex items-center bg-slate-950 overflow-hidden"
        ref={heroRef}
      >
        <motion.div
          style={{ scale: useTransform(scrollYProgress, [0, 0.3], [1, 1.2]) }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 z-10" />
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1920"
            className="w-full h-full object-cover opacity-60"
            alt="Hero"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-20">
          <div className="max-w-4xl">
            <div className="overflow-hidden mb-4">
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="inline-block px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase">
                  Leading the Future of Commerce
                </span>
              </motion.div>
            </div>

            <h1 className="text-7xl md:text-[110px] font-black text-white leading-[0.85] tracking-tighter mb-10">
              <div className="overflow-hidden h-auto">
                <span className="hero-title-part inline-block">The Next</span>
              </div>
              <div className="overflow-hidden h-auto">
                <span className="hero-title-part inline-block">
                  Frontier of
                </span>
              </div>
              <div className="overflow-hidden h-auto">
                <span className="hero-title-part inline-block text-blue-600 italic">
                  JCI Business.
                </span>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl border-l-4 border-blue-600 pl-8 mb-12"
            >
              Bridging the gap between young leaders and global commerce. Trade
              with trust, grow with purpose.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-6"
            >
              <button className="bg-white text-slate-900 px-12 py-6 rounded-[2rem] font-black text-lg hover:bg-blue-600 hover:text-white transition-all duration-500 group flex items-center gap-3 shadow-2xl">
                Start Trading{" "}
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SCROLL-DRIVEN ABOUT SECTION */}
      <section
        id="about"
        className="py-32 bg-white relative overflow-hidden"
        ref={aboutRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-10"
            >
              <motion.div variants={fadeInUp} className="space-y-6">
                <span className="text-blue-600 font-black tracking-widest text-xs uppercase">
                  Legacy of Excellence
                </span>
                <h2 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  Leaders Shaping{" "}
                  <span className="text-blue-600">Markets.</span>
                </h2>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-slate-600 leading-relaxed font-medium"
              >
                JCI India's E-Commerce Platform is a revolutionary ecosystem
                designed exclusively for our vibrant community of young leaders
                and entrepreneurs.
              </motion.p>

              <div className="grid grid-cols-2 gap-8" ref={statsRef}>
                {[
                  { label: "Active Members", val: "10000", suffix: "+" },
                  { label: "Indian Cities", val: "500", suffix: "+" },
                ].map((stat, i) => (
                  <motion.div
                    variants={fadeInUp}
                    key={i}
                    className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100"
                  >
                    <div className="flex text-4xl font-black text-slate-900 mb-2">
                      <span className="stat-number">{stat.val}</span>
                      {stat.suffix}
                    </div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://trello.com/1/cards/6957611e6217a0cc6b126c1e/attachments/695769aebd09f2b5ccf962a9/download/Bharath_1.jpg"
                  className="w-full h-[700px] object-cover"
                  alt="JCI Team"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  whileInView={{ x: "0%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute bottom-10 left-10 right-10 p-8 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                      <Award className="text-white w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white tracking-tight">
                        Verified Community
                      </div>
                      <div className="text-xs font-bold text-blue-200 uppercase tracking-widest">
                        JCI National Certified
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. BENTO GRID SERVICES (Ultra Hover Effect) */}
      <section id="services" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
              Elite Member Ecosystem
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 h-auto md:h-[600px]">
            {/* Large Bento Item */}
            <motion.div
              whileHover={{ y: -10 }}
              className="md:col-span-2 md:row-span-2 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="relative z-10">
                <ShoppingBag className="w-16 h-16 text-blue-600 mb-8 transition-transform duration-500 group-hover:rotate-12" />
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                  Verified Marketplace
                </h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  Exclusive access to trade within 800+ JCI chapters nationwide
                  with absolute security.
                </p>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />
            </motion.div>

            {/* Blue Bento Item */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 bg-blue-600 p-12 rounded-[3rem] text-white flex items-center gap-8 group"
            >
              <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center shrink-0">
                <Users size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">
                  Global Networking
                </h3>
                <p className="text-blue-100 font-medium">
                  Connect with 15k+ verified entrepreneurs instantly.
                </p>
              </div>
            </motion.div>

            {/* Dark Bento Item */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-1 bg-slate-900 p-10 rounded-[3rem] text-white"
            >
              <TrendingUp className="text-blue-500 mb-6" size={32} />
              <h3 className="text-xl font-black mb-2">Growth Tools</h3>
              <p className="text-slate-400 text-sm">
                Advanced analytics for your listings.
              </p>
            </motion.div>

            {/* Slate Bento Item */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-1 bg-slate-100 p-10 rounded-[3rem] text-slate-900 border border-slate-200"
            >
              <Shield className="text-emerald-600 mb-6" size={32} />
              <h3 className="text-xl font-black mb-2">Secure Pay</h3>
              <p className="text-slate-500 text-sm">
                Encrypted transaction protocols.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* 6. CONTACT FORM (Animated Reveal) */}
      <section id="contact" className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-24">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-12">
                Let's Build the <span className="text-blue-600">Future.</span>
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: <Mail />,
                    title: "Email Inquiry",
                    val: "info@jciindia.in",
                  },
                  {
                    icon: <Phone />,
                    title: "Direct Line",
                    val: "+91 11 4567 8900",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-6 p-6 rounded-3xl bg-white hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-slate-400 tracking-widest">
                        {item.title}
                      </div>
                      <div className="text-xl font-bold text-slate-900">
                        {item.val}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-blue-100 border border-slate-50"
            >
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Business Email
                    </label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                      placeholder="john@jci.in"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none"
                    placeholder="How can we collaborate?"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl shadow-2xl shadow-blue-200 text-lg flex items-center justify-center gap-3"
                >
                  Send Inquiry <ArrowRight />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. COMPREHENSIVE FOOTER (Added) */}
      <footer className="bg-slate-950 text-white pt-32 pb-16 relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            {/* Brand Column */}
            <div className="space-y-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20">
                  J
                </div>
                <div className="font-black text-2xl tracking-tighter">
                  JCI INDIA
                </div>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed max-w-xs">
                Empowering the next generation of business leaders through a
                unified, trusted commerce ecosystem across 800+ local chapters.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{
                      y: -5,
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                    }}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all"
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-black text-lg mb-10 tracking-tight uppercase">
                Marketplace
              </h4>
              <ul className="space-y-5 text-slate-400 font-bold">
                {[
                  "Browse Products",
                  "Become a Seller",
                  "Member Verification",
                  "Success Stories",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors flex items-center group"
                    >
                      <ChevronRight
                        size={14}
                        className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2"
                      />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organization */}
            <div>
              <h4 className="font-black text-lg mb-10 tracking-tight uppercase">
                Support
              </h4>
              <ul className="space-y-5 text-slate-400 font-bold">
                {[
                  "National HQ",
                  "Safety Guidelines",
                  "Privacy Policy",
                  "Terms of Trade",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors flex items-center group"
                    >
                      <ChevronRight
                        size={14}
                        className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2"
                      />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
              <h4 className="font-black text-xl mb-4 tracking-tight text-white">
                Weekly Insights
              </h4>
              <p className="text-sm text-slate-400 mb-8 font-medium">
                Join 5,000+ members getting exclusive trade opportunities.
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Work email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-600 transition-colors text-white font-bold"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase">
            <div className="flex items-center gap-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <p>
                © 2026 JCI India Marketplace. Developing Leaders for a Changing
                World.
              </p>
            </div>
            <div className="flex gap-6 items-center">
              <button
                onClick={() => navigate("/admin-auth")}
                className="bg-white/5 text-white py-2 px-4 rounded-xl text-xs font-black tracking-wider hover:bg-white/10 transition-colors"
              >
                Admin
              </button>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Trade Safety
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* STYLE OVERRIDES */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

        body {
          font-family: "Plus Jakarta Sans", sans-serif;
          background: #fcfcfd;
          color: #0f172a;
          scroll-behavior: smooth;
        }

        .tracking-tighter {
          letter-spacing: -0.05em;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        body {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
