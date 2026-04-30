import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BarChart3, ShieldCheck, Bell, Search,
  XCircle, LogOut, Globe, MoreHorizontal, Zap,
  Activity, Mail, Building, UserCheck, Clock, ShieldAlert
} from "lucide-react";
import { API } from "../config/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  // Member State
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null); // For /members/{id} endpoint

  // Buyers State
  const [buyers, setBuyers] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // Sellers State
  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Stats Data (Dynamically calculated from API data)
  const stats = [
    {
      label: "Total Members",
      val: members.length.toString(),
      grow: "Live",
      icon: <Users />
    },
    {
      label: "Registered",
      val: members.filter(m => m.registered).length.toString(),
      grow: "Verified",
      icon: <ShieldCheck />
    },
    {
      label: "Pending Reg.",
      val: members.filter(m => !m.registered).length.toString(),
      grow: "Action Required",
      icon: <Clock />
    },
    { label: "Organization", val: "JCI", grow: "Primary", icon: <Building /> },
  ];

  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollForm, setEnrollForm] = useState({ userId: "", email: "", organizationName: "JCI" });
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState(null);

  // --- 1. FETCH ALL MEMBERS ---
  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
      const res = await fetch(API.GET_MEMBERS);
      const data = await res.json();
      // Since your API returns [{}, {}] directly:
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setMembersLoading(false);
    }
  };

  // --- 2. FETCH SINGLE MEMBER (Detail View) ---
  const viewMemberDetails = async (id) => {
    try {
      const res = await fetch(API.GET_SINGLE_MEMBER(id));
      const data = await res.json();
      setSelectedMember(data);
    } catch (err) {
      console.error("Error fetching member details:", err);
    }
  };

  // --- 3. FETCH BUYERS ---
  const fetchBuyers = async () => {
    setBuyersLoading(true);
    try {
      const res = await fetch(API.GET_BUYERS);
      const data = await res.json();
      setBuyers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch buyers:", err);
    } finally {
      setBuyersLoading(false);
    }
  };

  // --- 4. FETCH SELLERS ---
  const fetchSellers = async () => {
    setSellersLoading(true);
    try {
      const res = await fetch(API.GET_SELLERS);
      const data = await res.json();
      setSellers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch sellers:", err);
    } finally {
      setSellersLoading(false);
    }
  };

  // --- 5. FETCH SINGLE BUYER (Detail View) ---
  const viewBuyerDetails = async (id) => {
    try {
      const res = await fetch(API.GET_SINGLE_BUYER(id));
      const data = await res.json();
      setSelectedBuyer(data);
    } catch (err) {
      console.error("Error fetching buyer details:", err);
    }
  };

  // --- 6. FETCH SINGLE SELLER (Detail View) ---
  const viewSellerDetails = async (id) => {
    try {
      const res = await fetch(API.GET_SINGLE_SELLER(id));
      const data = await res.json();
      setSelectedSeller(data);
    } catch (err) {
      console.error("Error fetching seller details:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchBuyers();
    fetchSellers();
  }, []);

  const handleEnrollSubmit = async () => {
    setEnrollMessage(null);
    if (!enrollForm.userId || !enrollForm.email) {
      setEnrollMessage({ type: 'error', text: 'User ID and Email are required.' });
      return;
    }
    setEnrollLoading(true);
    try {
      const res = await fetch(API.ADD_MEMBER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollForm),
      });
      if (res.ok) {
        setEnrollMessage({ type: 'success', text: 'Member enrolled successfully!' });
        fetchMembers(); // Refresh list
        setTimeout(() => setShowEnroll(false), 1500);
      } else {
        setEnrollMessage({ type: 'error', text: 'Enrollment failed.' });
      }
    } catch (err) {
      setEnrollMessage({ type: 'error', text: 'Network error.' });
    } finally {
      setEnrollLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-100 p-12 flex flex-col justify-between fixed h-full z-50">
        <div className="space-y-16">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-200 group-hover:rotate-6 transition-transform">
              <Zap size={24} fill="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter leading-none">CORE</span>
              <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mt-1">Administrator</span>
            </div>
          </div>
          <nav className="space-y-2">
            {['Overview', 'Members', 'Buyers', 'Sellers', 'Settings'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <button className="flex items-center gap-4 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
          <LogOut size={18} /> Exit System
        </button>
      </aside>

      <main className="flex-1 ml-80 p-16">
        <header className="flex justify-between items-center mb-20">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase">{activeTab}</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Connected to JCI Node
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input type="text" placeholder="Search by User ID..." className="bg-white border-2 border-transparent focus:border-blue-600/10 rounded-[2rem] py-5 pl-16 pr-8 w-[400px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none" />
            </div>
            <button onClick={() => { setShowEnroll(true); setEnrollMessage(null); }} className="px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Enroll Member</button>
          </div>
        </header>

        {/* BENTO STATS */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 transition-all group">
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  {React.cloneElement(stat.icon, { size: 28 })}
                </div>
                <div className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${stat.label === "Pending Reg." ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                  {stat.grow}
                </div>
              </div>
              <div className="text-4xl font-black tracking-tighter mb-2 text-slate-900">{stat.val}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ORGANIZATION DIRECTORY */}
        <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-xl font-black uppercase tracking-widest">Organization Directory</h3>
            <button onClick={fetchMembers} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group">
              Refresh <Activity size={14} className="group-hover:rotate-180 transition-transform duration-700" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  <th className="px-8 pb-4">ID & Email</th>
                  <th className="px-8 pb-4">Affiliation</th>
                  <th className="px-8 pb-4">Registration</th>
                  <th className="px-8 pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {membersLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="bg-slate-50 h-24 rounded-[2rem]"></td>
                    </tr>
                  ))
                ) : (
                  members.map((m, i) => (
                    <motion.tr
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      key={m.id} className="group"
                    >
                      <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-l-[2rem] px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {m.userId?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 tracking-tight">{m.userId}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail size={10} /> {m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                        <div className="text-slate-600 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                          <Building size={14} className="text-slate-300" /> {m.organizationName}
                        </div>
                      </td>
                      <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                        {m.registered ? (
                          <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full uppercase tracking-widest inline-flex items-center gap-2">
                            <UserCheck size={12} /> Registered
                          </span>
                        ) : (
                          <span className="px-4 py-2 bg-amber-50 text-amber-600 text-[9px] font-black rounded-full uppercase tracking-widest inline-flex items-center gap-2">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-r-[2rem] px-8 py-6 text-right">
                        <button
                          onClick={() => viewMemberDetails(m.id)}
                          className="p-3 text-slate-300 hover:text-blue-600 transition-colors"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      

      
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[450px] rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={32} weight="fill" />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Avatar Icon based on UserID */}
                <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl mb-6 shadow-xl shadow-blue-200">
                  {selectedMember.userId?.charAt(0)}
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
                  {selectedMember.userId}
                </h2>
                <p className="text-blue-600 font-bold text-xs mb-8 tracking-widest uppercase">
                  {selectedMember.organizationName} Official Node
                </p>

                <div className="w-full space-y-3">
                  {/* Email Card */}
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</span>
                    <span className="text-sm font-bold text-slate-700">{selectedMember.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* System ID Card */}
                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Database ID</span>
                      <span className="text-sm font-black text-slate-900">#{selectedMember.id}</span>
                    </div>

                    {/* Status Card */}
                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Status</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md mt-1 ${selectedMember.registered ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {selectedMember.registered ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ENROLL MODAL */}
      <AnimatePresence>
        {showEnroll && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="w-[500px] bg-white rounded-[3rem] p-12 shadow-2xl">
              <h2 className="font-black text-2xl uppercase tracking-tighter mb-8">Enroll New Node</h2>
              <div className="space-y-6">
                <input value={enrollForm.userId} onChange={e => setEnrollForm({ ...enrollForm, userId: e.target.value })} placeholder="User ID" className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600/10 rounded-3xl font-bold outline-none" />
                <input value={enrollForm.email} onChange={e => setEnrollForm({ ...enrollForm, email: e.target.value })} placeholder="Email" className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600/10 rounded-3xl font-bold outline-none" />
                <div className="pt-6 flex justify-between items-center">
                  <button onClick={() => setShowEnroll(false)} className="text-[10px] font-black uppercase text-slate-400">Cancel</button>
                  <button onClick={handleEnrollSubmit} disabled={enrollLoading} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50">
                    {enrollLoading ? 'Syncing...' : 'Authorize Member'}
                  </button>
                </div>
                {enrollMessage && <div className={`p-4 rounded-2xl text-center text-xs font-bold ${enrollMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{enrollMessage.text}</div>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; margin: 0; }
          ::-webkit-scrollbar { display: none; }
          .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;