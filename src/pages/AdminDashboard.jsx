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
  const [selectedMember, setSelectedMember] = useState(null);

  // Buyers State
  const [buyers, setBuyers] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // Sellers State
  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Services State
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  // Payments State
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [buyerDetails, setBuyerDetails] = useState({});

  // Order Payments State
  const [orderPayments, setOrderPayments] = useState([]);
  const [orderPaymentsLoading, setOrderPaymentsLoading] = useState(true);
  const [selectedOrderPayment, setSelectedOrderPayment] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Stats Data (Dynamically calculated from API data)
  const stats = [
    {
      label: "Total Members",
      val: members.length.toString(),
      grow: "Live",
      icon: <Users />
    },
    {
      label: "Total Buyers",
      val: buyers.length.toString(),
      grow: "Active",
      icon: <UserCheck />
    },
    {
      label: "Total Sellers",
      val: sellers.length.toString(),
      grow: "Verified",
      icon: <Building />
    },
    {
      label: "Total Products",
      val: products.length.toString(),
      grow: "Listed",
      icon: <BarChart3 />
    },
    {
      label: "Total Services",
      val: services.length.toString(),
      grow: "Available",
      icon: <ShieldCheck />
    },
    {
      label: "Total Payments",
      val: payments.length.toString(),
      grow: "Processed",
      icon: <ShieldAlert />
    },
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

  // --- 7. FETCH PRODUCTS ---
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(API.PRODUCTS);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  // --- 8. FETCH SINGLE PRODUCT (Detail View) ---
  const viewProductDetails = async (id) => {
    try {
      const res = await fetch(API.PRODUCT_BY_ID(id));
      const data = await res.json();
      setSelectedProduct(data);
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  // --- 9. FETCH SERVICES ---
  const fetchServices = async () => {
    setServicesLoading(true);
    try {
      const res = await fetch(API.SERVICES);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setServicesLoading(false);
    }
  };

  // --- 10. FETCH SINGLE SERVICE (Detail View) ---
  const viewServiceDetails = async (id) => {
    try {
      const res = await fetch(API.SERVICE_BY_ID(id));
      const data = await res.json();
      setSelectedService(data);
    } catch (err) {
      console.error("Error fetching service details:", err);
    }
  };

  // --- 11. FETCH PAYMENTS ---
  const fetchPayments = async () => {
    setPaymentsLoading(true);
    try {
      const res = await fetch(API.GET_PAID_PAYMENTS);
      const data = await res.json();
      const paymentsArray = Array.isArray(data) ? data : [];
      
      // Fetch buyer details for each payment to get userId
      const paymentsWithBuyerDetails = await Promise.all(
        paymentsArray.map(async (payment) => {
          const buyerDetail = await fetchBuyerDetails(payment.buyerId);
          return {
            ...payment,
            buyerUserId: buyerDetail?.userId || `ID: ${payment.buyerId}`
          };
        })
      );
      
      setPayments(paymentsWithBuyerDetails);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // --- 12. FETCH SINGLE PAYMENT (Detail View) ---
  const viewPaymentDetails = async (id) => {
    try {
      // Find payment from the payments array by orderId
      const payment = payments.find(p => p.orderId === id);
      setSelectedPayment(payment);
    } catch (err) {
      console.error("Error fetching payment details:", err);
    }
  };

  // --- 13. FETCH BUYER DETAILS (for getting userId) ---
  const fetchBuyerDetails = async (buyerId) => {
    try {
      const res = await fetch(API.GET_SINGLE_BUYER(buyerId));
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching buyer details:", err);
      return null;
    }
  };

  // --- 14. GET BUYER USER ID FROM PAYMENTS ---
  const getBuyerUserId = async (buyerId) => {
    const buyerDetails = await fetchBuyerDetails(buyerId);
    return buyerDetails?.userId || `ID: ${buyerId}`;
  };

  // --- 15. FETCH ORDER PAYMENTS ---
  const fetchOrderPayments = async () => {
    setOrderPaymentsLoading(true);
    try {
      const res = await fetch(API.GET_ORDER_PAYMENTS);
      const data = await res.json();
      const orderPaymentsArray = Array.isArray(data) ? data : [];
      
      // Fetch buyer details for each order payment to get userId and filter only paid ones
      const orderPaymentsWithBuyerDetails = await Promise.all(
        orderPaymentsArray.map(async (orderPayment) => {
          if (orderPayment.paymentStatus === 'PAID') {
            const buyerDetail = await fetchBuyerDetails(orderPayment.buyerId);
            return {
              ...orderPayment,
              buyerUserId: buyerDetail?.userId || `ID: ${orderPayment.buyerId}`
            };
          }
          return null; // Skip non-paid payments
        })
      );
      
      // Filter out null values (non-paid payments) and set the data
      const paidOrderPayments = orderPaymentsWithBuyerDetails.filter(payment => payment !== null);
      setOrderPayments(paidOrderPayments);
    } catch (err) {
      console.error("Failed to fetch order payments:", err);
    } finally {
      setOrderPaymentsLoading(false);
    }
  };

  // --- 16. VIEW ORDER PAYMENT DETAILS ---
  const viewOrderPaymentDetails = async (orderId) => {
    try {
      const res = await fetch(API.GET_SINGLE_ORDER_PAYMENT(orderId));
      const data = await res.json();
      
      // Fetch buyer details to get userId
      const buyerDetail = await fetchBuyerDetails(data.buyerId);
      
      setSelectedOrderPayment({
        ...data,
        buyerUserId: buyerDetail?.userId || `ID: ${data.buyerId}`
      });
    } catch (err) {
      console.error("Error fetching order payment details:", err);
    }
  };

  // --- 17. SEARCH USER BY ID ---
  const searchUserById = async (userId) => {
    if (!userId.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = {
        members: members.filter(member => 
          member.userId?.toLowerCase().includes(userId.toLowerCase()) ||
          member.id.toString().includes(userId)
        ),
        buyers: buyers.filter(buyer => 
          buyer.userId?.toLowerCase().includes(userId.toLowerCase()) ||
          buyer.id.toString().includes(userId)
        ),
        sellers: sellers.filter(seller => 
          seller.userId?.toLowerCase().includes(userId.toLowerCase()) ||
          seller.id.toString().includes(userId)
        ),
        products: products.filter(product => 
          product.sellerId?.toString().includes(userId)
        ),
        services: services.filter(service => 
          service.sellerId?.toString().includes(userId)
        ),
        payments: payments.filter(payment => 
          payment.buyerUserId?.toLowerCase().includes(userId.toLowerCase()) ||
          payment.buyerId?.toString().includes(userId)
        ),
        orderPayments: orderPayments.filter(payment => 
          payment.buyerUserId?.toLowerCase().includes(userId.toLowerCase()) ||
          payment.buyerId?.toString().includes(userId)
        )
      };

      setSearchResults(results);
    } catch (err) {
      console.error("Error searching user:", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchBuyers();
    fetchSellers();
    fetchProducts();
    fetchServices();
    fetchPayments();
    fetchOrderPayments();
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
            {['Overview', 'Members', 'Buyers', 'Sellers', 'Products', 'Services', 'Payments', 'Order Payments', 'Settings'].map(tab => (
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
              <input 
                type="text" 
                placeholder="Search by User ID..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUserById(e.target.value);
                }}
                className="bg-white border-2 border-transparent focus:border-blue-600/10 rounded-[2rem] py-5 pl-16 pr-8 w-[400px] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none" 
              />
              {isSearching && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
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
                <div className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${stat.label === "Total Buyers" ? "bg-blue-50 text-blue-600" : stat.label === "Total Sellers" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}>
                  {stat.grow}
                </div>
              </div>
              <div className="text-4xl font-black tracking-tighter mb-2 text-slate-900">{stat.val}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* SEARCH RESULTS */}
        {searchResults && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] p-8 shadow-2xl text-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">Search Results for "{searchQuery}"</h2>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults(null);
                  }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-bold hover:bg-white/30 transition-all"
                >
                  Clear Search
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black">{searchResults.members.length}</div>
                  <div className="text-sm opacity-80">Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black">{searchResults.buyers.length}</div>
                  <div className="text-sm opacity-80">Buyers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black">{searchResults.sellers.length}</div>
                  <div className="text-sm opacity-80">Sellers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black">{searchResults.products.length + searchResults.services.length}</div>
                  <div className="text-sm opacity-80">Items</div>
                </div>
              </div>
            </div>

            {/* DETAILED RESULTS */}
            <div className="space-y-8 mt-8">
              {/* Members Results */}
              {searchResults.members.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-blue-600 mb-4">Members ({searchResults.members.length})</h3>
                  <div className="space-y-3">
                    {searchResults.members.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                            {member.userId?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{member.userId}</div>
                            <div className="text-sm text-slate-500">{member.email}</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">ID: #{member.id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buyers Results */}
              {searchResults.buyers.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-green-600 mb-4">Buyers ({searchResults.buyers.length})</h3>
                  <div className="space-y-3">
                    {searchResults.buyers.map(buyer => (
                      <div key={buyer.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold">
                            {buyer.userId?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{buyer.userId}</div>
                            <div className="text-sm text-slate-500">{buyer.email}</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">ID: #{buyer.id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sellers Results */}
              {searchResults.sellers.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-orange-600 mb-4">Sellers ({searchResults.sellers.length})</h3>
                  <div className="space-y-3">
                    {searchResults.sellers.map(seller => (
                      <div key={seller.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold">
                            {seller.userId?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{seller.userId}</div>
                            <div className="text-sm text-slate-500">{seller.email}</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">ID: #{seller.id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Results */}
              {searchResults.products.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-purple-600 mb-4">Products ({searchResults.products.length})</h3>
                  <div className="space-y-3">
                    {searchResults.products.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-bold">
                            P
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{product.productName}</div>
                            <div className="text-sm text-slate-500">Seller ID: #{product.sellerId}</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">₹{product.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Results */}
              {searchResults.services.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-teal-600 mb-4">Services ({searchResults.services.length})</h3>
                  <div className="space-y-3">
                    {searchResults.services.map(service => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 font-bold">
                            S
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{service.serviceName}</div>
                            <div className="text-sm text-slate-500">Seller ID: #{service.sellerId}</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">₹{service.cost}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments Results */}
              {searchResults.payments.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-emerald-600 mb-4">Service Payments ({searchResults.payments.length})</h3>
                  <div className="space-y-3">
                    {searchResults.payments.map(payment => (
                      <div key={payment.orderId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                            $
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">Order #{payment.orderId}</div>
                            <div className="text-sm text-slate-500">Buyer: {payment.buyerUserId}</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">₹{payment.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Payments Results */}
              {searchResults.orderPayments.length > 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-indigo-600 mb-4">Order Payments ({searchResults.orderPayments.length})</h3>
                  <div className="space-y-3">
                    {searchResults.orderPayments.map(payment => (
                      <div key={payment.orderId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                            $
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">Order #{payment.orderId}</div>
                            <div className="text-sm text-slate-500">Buyer: {payment.buyerUserId}</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-500">₹{payment.totalAmount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchResults.members.length === 0 && 
               searchResults.buyers.length === 0 && 
               searchResults.sellers.length === 0 && 
               searchResults.products.length === 0 && 
               searchResults.services.length === 0 && 
               searchResults.payments.length === 0 && 
               searchResults.orderPayments.length === 0 && (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm text-center">
                  <div className="text-slate-400 font-bold">No results found for "{searchQuery}"</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* MEMBERS DIRECTORY */}
        {activeTab === 'Members' && (
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
        )}

        {/* BUYERS DIRECTORY */}
        {activeTab === 'Buyers' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-sm">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-black uppercase tracking-widest">Buyers Directory</h3>
              <button onClick={fetchBuyers} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                Refresh <Activity size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <th className="px-8 pb-4">User ID & Email</th>
                    <th className="px-8 pb-4">Username</th>
                    <th className="px-8 pb-4">Location</th>
                    <th className="px-8 pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buyersLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="bg-slate-50 h-24 rounded-[2rem]"></td>
                      </tr>
                    ))
                  ) : (
                    buyers.map((buyer, i) => (
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={buyer.id} className="group"
                      >
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-l-[2rem] px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-600 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              {buyer.userId?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-slate-900 tracking-tight">{buyer.userId}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail size={10} /> {buyer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="font-black text-slate-900 tracking-tight">{buyer.username}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="text-slate-600 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                            <Globe size={14} className="text-slate-300" /> {buyer.city}, {buyer.state}
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-r-[2rem] px-8 py-6 text-right">
                          <button
                            onClick={() => viewBuyerDetails(buyer.id)}
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
        )}

        {/* SELLERS DIRECTORY */}
        {activeTab === 'Sellers' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-sm">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-black uppercase tracking-widest">Sellers Directory</h3>
              <button onClick={fetchSellers} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                Refresh <Activity size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <th className="px-8 pb-4">User ID & Email</th>
                    <th className="px-8 pb-4">Company Name</th>
                    <th className="px-8 pb-4">Owner Name</th>
                    <th className="px-8 pb-4">Location</th>
                    <th className="px-8 pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellersLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="bg-slate-50 h-24 rounded-[2rem]"></td>
                      </tr>
                    ))
                  ) : (
                    sellers.map((seller, i) => (
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={seller.id} className="group"
                      >
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-l-[2rem] px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center font-black text-orange-600 border border-slate-100 group-hover:bg-orange-600 group-hover:text-white transition-all">
                              {seller.userId?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-slate-900 tracking-tight">{seller.userId}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail size={10} /> {seller.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="font-black text-slate-900 tracking-tight">{seller.companyName}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="font-black text-slate-900 tracking-tight">{seller.ownerName}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="text-slate-600 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                            <Globe size={14} className="text-slate-300" /> {seller.location}
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-r-[2rem] px-8 py-6 text-right">
                          <button
                            onClick={() => viewSellerDetails(seller.id)}
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
        )}

        {/* PRODUCTS DIRECTORY */}
        {activeTab === 'Products' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-sm">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-black uppercase tracking-widest">Products Directory</h3>
              <button onClick={fetchProducts} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                Refresh <Activity size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <th className="px-8 pb-4">Product Image</th>
                    <th className="px-8 pb-4">Product Name</th>
                    <th className="px-8 pb-4">Seller Info</th>
                    <th className="px-8 pb-4">Price</th>
                    <th className="px-8 pb-4">Stock</th>
                    <th className="px-8 pb-4">Expiry</th>
                    <th className="px-8 pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={7} className="bg-slate-50 h-24 rounded-[2rem]"></td>
                      </tr>
                    ))
                  ) : (
                    products.map((product, i) => (
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={product.id} className="group"
                      >
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-l-[2rem] px-8 py-6">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                            <img 
                              src={product.productImage} 
                              alt={product.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="font-black text-slate-900 tracking-tight">{product.productName}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{product.description}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="space-y-1">
                            <div className="font-black text-slate-900 tracking-tight">{product.sellerName}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{product.sellerCompany}</div>
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="text-xl font-black text-green-600">₹{product.price}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-slate-900">{product.availableQuantity} available</div>
                            <div className="text-[10px] font-bold text-slate-400">{product.soldQuantity} sold</div>
                            <div className="text-[10px] font-bold text-slate-400">Total: {product.totalQuantity}</div>
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className={`text-[10px] font-black px-2 py-1 rounded-md ${
                            new Date(product.expiryDate) > new Date() ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                          }`}>
                            {new Date(product.expiryDate) > new Date() ? 'Valid' : 'Expired'}
                          </div>
                          <div className="text-[9px] font-bold text-slate-400 mt-1">
                            {new Date(product.expiryDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-r-[2rem] px-8 py-6 text-right">
                          <button
                            onClick={() => viewProductDetails(product.id)}
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
        )}

        {/* SERVICES DIRECTORY */}
        {activeTab === 'Services' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-sm">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-black uppercase tracking-widest">Services Directory</h3>
              <button onClick={fetchServices} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                Refresh <Activity size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <th className="px-8 pb-4">Service Image</th>
                    <th className="px-8 pb-4">Service Name</th>
                    <th className="px-8 pb-4">Provider Info</th>
                    <th className="px-8 pb-4">Category</th>
                    <th className="px-8 pb-4">Cost</th>
                    <th className="px-8 pb-4">Delivery</th>
                    <th className="px-8 pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={7} className="bg-slate-50 h-24 rounded-[2rem]"></td>
                      </tr>
                    ))
                  ) : (
                    services.map((service, i) => (
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={service.id} className="group"
                      >
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-l-[2rem] px-8 py-6">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                            <img 
                              src={service.imageUrl} 
                              alt={service.serviceName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="font-black text-slate-900 tracking-tight">{service.serviceName}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{service.description}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="space-y-1">
                            <div className="font-black text-slate-900 tracking-tight">{service.sellerName}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{service.sellerEmail}</div>
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="text-[10px] font-black px-2 py-1 rounded-md bg-blue-50 text-blue-600">
                            {service.category}
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="text-xl font-black text-green-600">₹{service.cost}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-900">{service.deliveryDurationInDays} days</span>
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-r-[2rem] px-8 py-6 text-right">
                          <button
                            onClick={() => viewServiceDetails(service.id)}
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
        )}

        {/* PAYMENTS DIRECTORY */}
        {activeTab === 'Payments' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-sm">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-black uppercase tracking-widest">Payments Directory</h3>
              <button onClick={fetchPayments} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                Refresh <Activity size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <th className="px-8 pb-4">Order ID</th>
                    <th className="px-8 pb-4">Buyer User ID</th>
                    <th className="px-8 pb-4">Service Name</th>
                    <th className="px-8 pb-4">Provider Info</th>
                    <th className="px-8 pb-4">Amount</th>
                    <th className="px-8 pb-4">Order Status</th>
                    <th className="px-8 pb-4">Payment Status</th>
                    <th className="px-8 pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={8} className="bg-slate-50 h-24 rounded-[2rem]"></td>
                      </tr>
                    ))
                  ) : (
                    payments.map((payment, i) => (
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={payment.orderId} className="group"
                      >
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-l-[2rem] px-8 py-6">
                          <div className="font-black text-slate-900 tracking-tight">#{payment.orderId}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="font-black text-slate-900 tracking-tight">{payment.buyerUserId}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="font-black text-slate-900 tracking-tight">{payment.serviceName}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="space-y-1">
                            <div className="font-black text-slate-900 tracking-tight">{payment.sellerName}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{payment.sellerEmail}</div>
                          </div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <div className="text-xl font-black text-green-600">₹{payment.amount}</div>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                            payment.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                            payment.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                            payment.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                            payment.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                            payment.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600' :
                            'bg-slate-50 text-slate-600'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-8 py-6">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                            payment.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                            payment.paymentStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {payment.paymentStatus}
                          </span>
                        </td>
                        <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-r-[2rem] px-8 py-6 text-right">
                          <button
                            onClick={() => viewPaymentDetails(payment.orderId)}
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
        )}

        {/* ORDER PAYMENTS DIRECTORY */}
        {activeTab === 'Order Payments' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 p-6 lg:p-12 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h3 className="text-xl font-black uppercase tracking-widest">Paid Order Payments</h3>
              <button onClick={fetchOrderPayments} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group whitespace-nowrap">
                Refresh <Activity size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <div className="min-w-[800px] lg:min-w-full">
                <table className="w-full text-left border-separate border-spacing-y-2 lg:border-spacing-y-4">
                  <thead>
                    <tr className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4">Order ID</th>
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4">Buyer User ID</th>
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4">Product Name</th>
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4">Seller Info</th>
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4">Quantity</th>
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4">Total Amount</th>
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4">Order Status</th>
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4">Payment Status</th>
                      <th className="px-4 lg:px-6 pb-2 lg:pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderPaymentsLoading ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8 lg:py-16">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-blue-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : orderPayments.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8 lg:py-16">
                          <p className="text-slate-400 font-bold text-sm lg:text-base">No paid order payments found</p>
                        </td>
                      </tr>
                    ) : (
                      orderPayments.map((orderPayment, i) => (
                        <motion.tr
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          key={orderPayment.orderId} className="group"
                        >
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-l-[1rem] lg:rounded-l-[2rem] px-4 lg:px-6 py-3 lg:py-6">
                            <div className="font-black text-slate-900 tracking-tight text-sm lg:text-base">#{orderPayment.orderId}</div>
                          </td>
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-4 lg:px-6 py-3 lg:py-6">
                            <div className="font-black text-slate-900 tracking-tight text-sm lg:text-base">{orderPayment.buyerUserId}</div>
                          </td>
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-4 lg:px-6 py-3 lg:py-6">
                            <div className="font-black text-slate-900 tracking-tight text-sm lg:text-base truncate max-w-[120px] lg:max-w-none" title={orderPayment.productName}>{orderPayment.productName}</div>
                          </td>
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-4 lg:px-6 py-3 lg:py-6">
                            <div className="space-y-1">
                              <div className="font-black text-slate-900 tracking-tight text-sm lg:text-base truncate max-w-[120px] lg:max-w-none" title={orderPayment.sellerName}>{orderPayment.sellerName}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[120px] lg:max-w-none" title={orderPayment.sellerEmail}>{orderPayment.sellerEmail}</div>
                            </div>
                          </td>
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-4 lg:px-6 py-3 lg:py-6">
                            <div className="font-black text-slate-900 tracking-tight text-sm lg:text-base">{orderPayment.quantity}</div>
                          </td>
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-4 lg:px-6 py-3 lg:py-6">
                            <div className="font-black text-emerald-600 tracking-tight text-sm lg:text-base">₹{orderPayment.totalAmount}</div>
                          </td>
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-4 lg:px-6 py-3 lg:py-6">
                            <span className={`inline-block px-2 py-1 rounded-full text-[10px] lg:text-xs font-black ${
                              orderPayment.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                              orderPayment.orderStatus === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
                              orderPayment.orderStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                              orderPayment.orderStatus === 'CANCELLED' ? 'bg-rose-50 text-rose-600' :
                              'bg-slate-50 text-slate-600'
                            }`}>
                              {orderPayment.orderStatus}
                            </span>
                          </td>
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all px-4 lg:px-6 py-3 lg:py-6">
                            <span className={`inline-block px-2 py-1 rounded-full text-[10px] lg:text-xs font-black ${
                              orderPayment.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                              orderPayment.paymentStatus === 'PENDING' ? 'bg-rose-50 text-rose-600' :
                              'bg-slate-50 text-slate-600'
                            }`}>
                              {orderPayment.paymentStatus}
                            </span>
                          </td>
                          <td className="bg-slate-50 group-hover:bg-white group-hover:shadow-xl transition-all rounded-r-[1rem] lg:rounded-r-[2rem] px-4 lg:px-6 py-3 lg:py-6">
                            <button
                              onClick={() => viewOrderPaymentDetails(orderPayment.orderId)}
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group"
                            >
                              <MoreHorizontal size={2} className="lg:size-6" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-sm">
            <h3 className="text-xl font-black uppercase tracking-widest mb-8">System Overview</h3>
            <div className="grid grid-cols-6 gap-6">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-black text-lg mb-4">Members</h4>
                <p className="text-3xl font-bold text-blue-600">{members.length}</p>
              </div>
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                <h4 className="font-black text-lg mb-4">Buyers</h4>
                <p className="text-3xl font-bold text-green-600">{buyers.length}</p>
              </div>
              <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <h4 className="font-black text-lg mb-4">Sellers</h4>
                <p className="text-3xl font-bold text-orange-600">{sellers.length}</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <h4 className="font-black text-lg mb-4">Products</h4>
                <p className="text-3xl font-bold text-purple-600">{products.length}</p>
              </div>
              <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100">
                <h4 className="font-black text-lg mb-4">Services</h4>
                <p className="text-3xl font-bold text-teal-600">{services.length}</p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <h4 className="font-black text-lg mb-4">Payments</h4>
                <p className="text-3xl font-bold text-emerald-600">{payments.length}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MEMBER DETAIL MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[450px] rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={32} weight="fill" />
              </button>

              <div className="flex flex-col items-center text-center">
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
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</span>
                    <span className="text-sm font-bold text-slate-700">{selectedMember.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Database ID</span>
                      <span className="text-sm font-black text-slate-900">#{selectedMember.id}</span>
                    </div>

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

      {/* BUYER DETAIL MODAL */}
      <AnimatePresence>
        {selectedBuyer && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[500px] rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              <button
                onClick={() => setSelectedBuyer(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={32} weight="fill" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl mb-6 shadow-xl shadow-blue-200">
                  {selectedBuyer.userId?.charAt(0)}
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                  {selectedBuyer.userId}
                </h2>
                <p className="text-blue-600 font-bold text-xs mb-8 tracking-widest uppercase">
                  Buyer Account
                </p>

                <div className="w-full space-y-3">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</span>
                    <span className="text-sm font-bold text-slate-700">{selectedBuyer.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Username</span>
                      <span className="text-sm font-black text-slate-900">{selectedBuyer.username}</span>
                    </div>

                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Database ID</span>
                      <span className="text-sm font-black text-slate-900">#{selectedBuyer.id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">City</span>
                      <span className="text-sm font-black text-slate-900">{selectedBuyer.city}</span>
                    </div>

                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">State</span>
                      <span className="text-sm font-black text-slate-900">{selectedBuyer.state}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</span>
                    <span className="text-sm font-black text-slate-900">{selectedBuyer.address}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBuyer(null)}
                  className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SELLER DETAIL MODAL */}
      <AnimatePresence>
        {selectedSeller && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[550px] rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              <button
                onClick={() => setSelectedSeller(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={32} weight="fill" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl mb-6 shadow-xl shadow-orange-200">
                  {selectedSeller.userId?.charAt(0)}
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                  {selectedSeller.userId}
                </h2>
                <p className="text-orange-600 font-bold text-xs mb-8 tracking-widest uppercase">
                  Seller Account
                </p>

                <div className="w-full space-y-3">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</span>
                    <span className="text-sm font-bold text-slate-700">{selectedSeller.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Name</span>
                      <span className="text-sm font-black text-slate-900">{selectedSeller.companyName}</span>
                    </div>

                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Database ID</span>
                      <span className="text-sm font-black text-slate-900">#{selectedSeller.id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Owner Name</span>
                      <span className="text-sm font-black text-slate-900">{selectedSeller.ownerName}</span>
                    </div>

                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</span>
                      <span className="text-sm font-black text-slate-900">{selectedSeller.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Address</span>
                    <span className="text-sm font-black text-slate-900">{selectedSeller.companyAddress}</span>
                  </div>

                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Product/Service</span>
                    <span className="text-sm font-black text-slate-900">{selectedSeller.productOrService}</span>
                  </div>

                  {selectedSeller.companyImage && (
                    <div className="flex flex-col items-center p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Company Image</span>
                      <img src={selectedSeller.companyImage} alt="Company" className="w-32 h-32 object-cover rounded-xl" />
                    </div>
                  )}

                  {selectedSeller.companyDescription && (
                    <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Description</span>
                      <span className="text-sm font-black text-slate-700">{selectedSeller.companyDescription}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedSeller(null)}
                  className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[600px] rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={32} weight="fill" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-slate-100">
                  <img 
                    src={selectedProduct.productImage} 
                    alt={selectedProduct.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                    {selectedProduct.productName}
                  </h2>
                  <p className="text-purple-600 font-bold text-xs mb-4 tracking-widest uppercase">
                    Product ID: #{selectedProduct.id}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">{selectedProduct.description}</p>
                  <div className="text-3xl font-black text-green-600">₹{selectedProduct.price}</div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Seller Name</span>
                    <span className="text-sm font-black text-slate-900">{selectedProduct.sellerName}</span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Company</span>
                    <span className="text-sm font-black text-slate-900">{selectedProduct.sellerCompany}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Stock</span>
                    <span className="text-lg font-black text-emerald-600">{selectedProduct.availableQuantity}</span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sold Quantity</span>
                    <span className="text-lg font-black text-orange-600">{selectedProduct.soldQuantity}</span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Stock</span>
                    <span className="text-lg font-black text-slate-900">{selectedProduct.totalQuantity}</span>
                  </div>
                </div>

                <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiry Date</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">
                      {new Date(selectedProduct.expiryDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-md ${
                      new Date(selectedProduct.expiryDate) > new Date() ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {new Date(selectedProduct.expiryDate) > new Date() ? 'VALID' : 'EXPIRED'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-lg"
              >
                Close Product Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SERVICE DETAIL MODAL */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[650px] rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={32} weight="fill" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-slate-100">
                  <img 
                    src={selectedService.imageUrl} 
                    alt={selectedService.serviceName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                    {selectedService.serviceName}
                  </h2>
                  <p className="text-teal-600 font-bold text-xs mb-4 tracking-widest uppercase">
                    Service ID: #{selectedService.id}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">{selectedService.description}</p>
                  <div className="text-3xl font-black text-green-600">₹{selectedService.cost}</div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider Name</span>
                    <span className="text-sm font-black text-slate-900">{selectedService.sellerName}</span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider Email</span>
                    <span className="text-sm font-black text-slate-900">{selectedService.sellerEmail}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</span>
                    <div className="text-[10px] font-black px-2 py-1 rounded-md bg-blue-50 text-blue-600">
                      {selectedService.category}
                    </div>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Usefulness</span>
                    <span className="text-sm font-black text-slate-900">{selectedService.usefulness}</span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Time</span>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-sm font-black text-slate-900">{selectedService.deliveryDurationInDays} days</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio Link</span>
                  <a 
                    href={selectedService.portfolioLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-black text-blue-600 hover:text-blue-700 underline"
                  >
                    {selectedService.portfolioLink}
                  </a>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-600 transition-all shadow-lg"
              >
                Close Service Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAYMENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedPayment && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[600px] rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              <button
                onClick={() => setSelectedPayment(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={32} weight="fill" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-3xl mb-6 shadow-xl shadow-emerald-200">
                  <span>₹</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                    Payment Details
                  </h2>
                  <p className="text-emerald-600 font-bold text-xs mb-4 tracking-widest uppercase">
                    Order ID: #{selectedPayment.orderId}
                  </p>
                  <div className="text-3xl font-black text-emerald-600">₹{selectedPayment.amount}</div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Buyer User ID</span>
                    <span className="text-sm font-black text-slate-900">{selectedPayment.buyerUserId}</span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Service ID</span>
                    <span className="text-sm font-black text-slate-900">#{selectedPayment.serviceId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Name</span>
                    <span className="text-sm font-black text-slate-900">{selectedPayment.serviceName}</span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider Name</span>
                    <span className="text-sm font-black text-slate-900">{selectedPayment.sellerName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Status</span>
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${
                      selectedPayment.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                      selectedPayment.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                      selectedPayment.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                      selectedPayment.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                      selectedPayment.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Status</span>
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${
                      selectedPayment.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                      selectedPayment.paymentStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {selectedPayment.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider Email</span>
                  <span className="text-sm font-black text-slate-900">{selectedPayment.sellerEmail}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg"
              >
                Close Order Payment Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER PAYMENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedOrderPayment && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[700px] max-w-[90vw] max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 shadow-2xl relative border border-white/20"
            >
              <button
                onClick={() => setSelectedOrderPayment(null)}
                className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={32} weight="fill" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-3xl mb-6 shadow-xl shadow-indigo-200">
                  <span>₹</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                    Order Payment Details
                  </h2>
                  <p className="text-indigo-600 font-bold text-xs mb-4 tracking-widest uppercase">
                    Order ID: #{selectedOrderPayment.orderId}
                  </p>
                  <div className="text-3xl font-black text-indigo-600">₹{selectedOrderPayment.totalAmount}</div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Buyer User ID</span>
                    <span className="text-sm font-black text-slate-900">{selectedOrderPayment.buyerUserId}</span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Created Date</span>
                    <span className="text-sm font-black text-slate-900">{new Date(selectedOrderPayment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                      selectedOrderPayment.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                      selectedOrderPayment.orderStatus === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
                      selectedOrderPayment.orderStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                      selectedOrderPayment.orderStatus === 'CANCELLED' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {selectedOrderPayment.orderStatus}
                    </span>
                  </div>
                  <div className="flex flex-col items-start p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                      selectedOrderPayment.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                      selectedOrderPayment.paymentStatus === 'PENDING' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {selectedOrderPayment.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Items</span>
                  <div className="space-y-3">
                    {selectedOrderPayment.items?.map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Product Name</p>
                            <p className="font-medium text-slate-800">{item.productName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Quantity</p>
                            <p className="font-medium text-slate-800">{item.quantity}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Price per Unit</p>
                            <p className="font-medium text-slate-800">₹{item.price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Item Total</p>
                            <p className="font-medium text-slate-800">₹{item.total}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Seller Information</p>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-800">{item.sellerName}</p>
                            <p className="text-xs text-slate-500">{item.sellerEmail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderPayment(null)}
                className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg"
              >
                Close Order Payment Details
              </button>
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
