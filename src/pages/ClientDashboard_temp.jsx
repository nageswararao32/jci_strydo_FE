import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API } from '../config/api';
import { 
  LayoutDashboard, Search, Bell, Settings, User, CreditCard, 
  MessageSquare, Calendar, Briefcase, Star, Filter, 
  CheckCircle, Clock, ChevronRight, Send, Plus, Menu, X,
  ShoppingBag, LogOut, Mail, ArrowRight, Phone
} from 'lucide-react';

// --- DUMMY DATA ---
const PAYMENTS = [
  { id: '#PY-9021', service: 'Deep Home Cleaning', amount: 85.00, status: 'Paid', date: 'Oct 12, 2023' },
  { id: '#PY-8842', service: 'Yoga Session', amount: 45.00, status: 'Pending', date: 'Oct 14, 2023' },
  { id: '#PY-7721', service: 'Electrical Repair', amount: 110.00, status: 'Failed', date: 'Oct 10, 2023' },
];

// --- REUSABLE COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50'
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- MAIN DASHBOARD SECTIONS ---

const Overview = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Total Bookings', val: '12', icon: Calendar, color: 'bg-blue-500' },
        { label: 'Active Services', val: '03', icon: Briefcase, color: 'bg-indigo-500' },
        { label: 'Pending Payments', val: '$145', icon: CreditCard, color: 'bg-amber-500' },
        { label: 'Service Reviews', val: '4.9', icon: Star, color: 'bg-emerald-500' },
      ].map((stat, idx) => (
        <Card key={idx} className="flex items-center gap-4">
          <div className={`${stat.color} p-3 rounded-xl text-white`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">{stat.val}</p>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Activity Timeline */}
      <Card className="lg:col-span-1">
        <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {[
            { t: 'Booking Confirmed', d: 'Deep Cleaning with Elite Shine', time: '2h ago', status: 'done' },
            { t: 'Payment Successful', d: 'Invoice #PY-9021 settled', time: '5h ago', status: 'done' },
            { t: 'Message Received', d: 'New message from FitFocus', time: 'Yesterday', status: 'pending' },
          ].map((act, i) => (
            <div key={i} className="flex gap-4 relative">
              {i !== 2 && <div className="absolute left-2.5 top-8 w-0.5 h-10 bg-slate-100" />}
              <div className={`mt-1 h-5 w-5 rounded-full border-4 border-white shadow-sm ${act.status === 'done' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
              <div>
                <p className="text-sm font-bold text-slate-800">{act.t}</p>
                <p className="text-xs text-slate-500">{act.d}</p>
                <p className="text-[10px] text-indigo-500 mt-1 font-semibold uppercase">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Real-time Tracking (Uber Style) */}
      <Card className="lg:col-span-2">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold">Active Service Tracker</h3>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">In Progress</span>
        </div>
        <div className="relative pt-8 pb-4 px-4">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }} animate={{ width: "66%" }} transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-indigo-600" 
            />
          </div>
          <div className="relative flex justify-between">
            {['Requested', 'Accepted', 'In Progress', 'Completed'].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`z-10 h-6 w-6 rounded-full border-4 border-white shadow-md ${i <= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  {i < 2 && <CheckCircle className="text-white w-full h-full p-0.5" />}
                </div>
                <span className={`mt-3 text-xs font-bold ${i <= 2 ? 'text-slate-800' : 'text-slate-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-300 overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=tech" alt="avatar" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">David Miller</p>
              <p className="text-xs text-slate-500">Service Provider • 4.9 ★</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="p-2 h-10 w-10 flex items-center justify-center"><MessageSquare size={18}/></Button>
            <Button className="h-10 text-xs">Call Support</Button>
          </div>
        </div>
      </Card>
    </div>
  </motion.div>
);

const Services = ({ services, categories, selectedCategory, onBook, onViewDetail, onCategoryChange, loading, onContact }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">Find Services</h2>
      <div className="flex gap-3">
        <div className="relative hidden sm:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search services..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64 bg-white/50 backdrop-blur-sm" />
        </div>
        <Button variant="outline" className="flex items-center gap-2"><Filter size={18} /> Filters</Button>
      </div>
    </div>

    {/* Category Filter */}
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onCategoryChange('All')}
        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
          selectedCategory === 'All' 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        All Services
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            selectedCategory === category 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
    
    {loading ? (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((s, idx) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <Card className="p-0 overflow-hidden border-none shadow-sm group-hover:shadow-indigo-100">
              <div className="h-48 overflow-hidden relative">
                <img src={s.imageUrl} alt={s.serviceName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                  <span className="text-indigo-600">{s.category}</span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-800 line-clamp-1">{s.serviceName}</h4>
                <p className="text-xs text-slate-500 mt-1">{s.sellerName}</p>
                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{s.usefulness}</span>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">{s.deliveryDurationInDays} Days</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-black text-indigo-600">₹{s.cost}<span className="text-xs text-slate-400 font-normal"></span></p>
                  <div className="flex gap-2">
                    <Button onClick={() => onViewDetail(s)} variant="outline" className="text-xs px-2 py-1.5">View</Button>
                    <Button onClick={() => onContact(s)} variant="secondary" className="text-xs px-2 py-1.5 flex items-center gap-1">
                      <Phone size={12} /> Call Us
                    </Button>
                    <Button onClick={() => onBook(s)} className="text-xs px-3 py-1.5">Book Now</Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
);

const Bookings = ({ bookings }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">My Bookings</h2>
      <div className="flex gap-3">
        <Button variant="outline" className="flex items-center gap-2"><Filter size={18} /> Filter</Button>
      </div>
    </div>

    {bookings.length === 0 ? (
      <Card className="p-12 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">No bookings yet</h3>
        <p className="text-slate-500 mb-6">You haven't booked any services yet. Browse our services and book your first service!</p>
        <Button onClick={() => setActiveTab('Services')}>Browse Services</Button>
      </Card>
    ) : (
      <div className="space-y-4">
        {bookings.map((booking, idx) => (
          <motion.div
            key={booking.orderId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Briefcase size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{booking.serviceName}</h3>
                      <p className="text-sm text-slate-500">Order ID: #{booking.orderId}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Service Provider</p>
                      <p className="font-medium text-slate-800">{booking.sellerName}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Mail size={12} /> {booking.sellerEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Booking Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                        booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                        booking.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                        booking.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Payment Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        booking.paymentStatus === 'PENDING' ? 'bg-rose-50 text-rose-600' :
                        booking.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-slate-50 text-slate-600'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" className="text-xs px-3 py-2">
                    <MessageSquare size={14} className="mr-1" /> Contact
                  </Button>
                  <Button variant="outline" className="text-xs px-3 py-2">
                    <Phone size={14} className="mr-1" /> Call
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
);

// --- MAIN APPLICATION COMPONENT ---

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [buyerData, setBuyerData] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userType = sessionStorage.getItem('userType');
    const storedBuyerData = sessionStorage.getItem('buyerInfo');
    
    if (isLoggedIn === 'true' && userType === 'BUYER' && storedBuyerData) {
      const parsedData = JSON.parse(storedBuyerData);
      setBuyerData(parsedData);
      fetchServices();
    } else {
      navigate('/buyer-auth');
    }
  }, [navigate]);

  useEffect(() => {
    if (buyerData) {
      fetchBookings();
    }
  }, [buyerData]);

  const fetchServices = async () => {
    try {
      const res = await fetch(API.SERVICES);
      const data = await res.json();
      setServices(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(service => service.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  const fetchServicesByCategory = async (category) => {
    setLoading(true);
    try {
      if (category === 'All') {
        const res = await fetch(API.SERVICES);
        const data = await res.json();
        setServices(data);
      } else {
        const res = await fetch(API.SERVICES_BY_CATEGORY(category));
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Failed to fetch services by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceDetail = async (serviceId) => {
    setLoading(true);
    try {
      const res = await fetch(API.SERVICE_BY_ID(serviceId));
      const data = await res.json();
      setSelectedServiceDetail(data);
    } catch (err) {
      console.error('Failed to fetch service detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(API.GET_BUYER_BOOKINGS(buyerData.id), {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const handleBooking = (service) => {
    setSelectedService(service);
  };

  const handleViewDetail = (service) => {
    fetchServiceDetail(service.id);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchServicesByCategory(category);
  };

  const handleContact = (service) => {
    setSelectedService(service);
    setShowContactModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedService || !buyerData) {
      alert('Please log in to book a service');
      return;
    }

    try {
      // Integration using the requested query parameter format
      // http://localhost:8080/service-orders/book?buyerId=X&serviceId=Y
      const url = `${API.BOOK_SERVICE}?buyerId=${buyerData.id}&serviceId=${selectedService.id}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
          // Content-Type is not strictly required here as we are using query params
        }
      });

      if (res.ok) {
        // Requested Success Message
        alert('✅ Service booked successfully');
        
        setSelectedService(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        // Refresh bookings after successful booking
        fetchBookings();
      } else {
        const errorText = await res.text();
        alert(`Failed to book service: ${errorText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error booking service:', error);
      alert('An error occurred while booking the service. Please check your connection.');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/buyer-auth');
  };

  const handleToggleView = (view) => {
    if (view === 'product') {
      navigate('/buyer-dashboard');
    } else {
      // Already on service view (ClientDashboard)
    }
  };

  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Services', icon: Briefcase },
    { id: 'Bookings', icon: Calendar },
    { id: 'Payments', icon: CreditCard },
    { id: 'Messages', icon: MessageSquare },
    { id: 'Profile', icon: User },
    { id: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* --- Sidebar --- */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">JCI Marketplace</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {item.id}
              </button>
            ))}
          </nav>

          <div className="mt-auto p-4 bg-indigo-600 rounded-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold opacity-80 uppercase">Free Plan</p>
              <p className="text-sm font-bold mt-1">Upgrade to Pro</p>
              <button className="mt-3 text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold">Learn More</button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'pl-0'}`}>
        
        {/* Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 hidden sm:block">{activeTab}</h2>
              <p className="text-sm text-slate-500 font-medium">Welcome back, {buyerData?.username || 'User'}!</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
            <button 
              onClick={() => handleToggleView('product')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all text-slate-600 hover:bg-slate-200"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Products</span>
            </button>
            <button 
              onClick={() => handleToggleView('service')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all bg-indigo-600 text-white shadow-lg"
            >
              <Briefcase size={16} />
              <span className="hidden sm:inline">Services</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="group relative flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden xl:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Account</p>
                <p className="text-sm font-bold text-slate-900">{buyerData?.username || 'User'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {buyerData?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-[110]">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors text-sm font-bold">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'Dashboard' && <Overview />}
              {activeTab === 'Services' && <Services services={services} categories={categories} selectedCategory={selectedCategory} onBook={handleBooking} onViewDetail={handleViewDetail} onCategoryChange={handleCategoryChange} loading={loading} onContact={handleContact} />}
              {activeTab === 'Payments' && (
                <Card>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Transaction History</h3>
                    <Button variant="secondary" className="text-xs">Export CSV</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                          <th className="pb-4">Transaction ID</th>
                          <th className="pb-4">Service</th>
                          <th className="pb-4">Amount</th>
                          <th className="pb-4">Date</th>
                          <th className="pb-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {PAYMENTS.map((p, i) => (
                          <tr key={i} className="border-b border-slate-50 last:border-none group">
                            <td className="py-4 font-medium text-slate-500">{p.id}</td>
                            <td className="py-4 font-bold text-slate-800">{p.service}</td>
                            <td className="py-4 font-bold">${p.amount.toFixed(2)}</td>
                            <td className="py-4 text-slate-500">{p.date}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                p.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                                p.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
              {activeTab === 'Bookings' && <Bookings bookings={bookings} />}
              {['Messages', 'Profile', 'Settings'].map(tab => activeTab === tab && (
                <div key={tab} className="flex items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 italic">
                  {tab} content is being integrated...
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- Modals & Overlays --- */}
      
      {/* Service Detail Modal */}
      <Modal isOpen={!!selectedServiceDetail} onClose={() => setSelectedServiceDetail(null)} title="Service Details">
        {selectedServiceDetail && (
          <div className="space-y-6">
            <div className="relative h-48 rounded-xl overflow-hidden">
              <img src={selectedServiceDetail.imageUrl} alt={selectedServiceDetail.serviceName} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg">
                <span className="text-indigo-600 font-bold text-sm">{selectedServiceDetail.category}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedServiceDetail.serviceName}</h3>
              <p className="text-slate-600 mb-4">{selectedServiceDetail.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{selectedServiceDetail.sellerName}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail size={12} /> {selectedServiceDetail.sellerEmail}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-bold rounded-full">
                    {selectedServiceDetail.usefulness}
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-full">
                    {selectedServiceDetail.deliveryDurationInDays} Days Delivery
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm text-slate-500">Service Cost</p>
                    <p className="text-2xl font-bold text-indigo-600">₹{selectedServiceDetail.cost}</p>
                  </div>
                  <a 
                    href={selectedServiceDetail.portfolioLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    View Portfolio <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setSelectedService(selectedServiceDetail);
                  setSelectedServiceDetail(null);
                }} 
                className="flex-1"
              >
                Book Now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedServiceDetail(null)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Booking Modal */}
      <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title="Complete Your Booking">
        {selectedService && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <img src={selectedService.imageUrl} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt=""/>
              <div>
                <p className="font-bold text-slate-800">{selectedService.serviceName}</p>
                <p className="text-xs text-slate-500">{selectedService.sellerName}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl">
                <p className="text-slate-500 text-sm">Service Fee</p>
                <p className="font-bold text-slate-800">₹{selectedService.cost}</p>
              </div>
            </div>
            <Button onClick={confirmBooking} className="w-full py-4 text-lg">Confirm & Pay</Button>
          </div>
        )}
      </Modal>

      {/* Contact Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Contact Service Provider">
        {selectedService && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <img src={selectedService.imageUrl} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt=""/>
              <div>
                <p className="font-bold text-slate-800">{selectedService.serviceName}</p>
                <p className="text-xs text-slate-500">{selectedService.sellerName}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={20} className="text-indigo-600" />
                  <h4 className="font-bold text-slate-800">Phone Number</h4>
                </div>
                <p className="text-slate-700 font-medium">+91 98765 43210</p>
                <p className="text-xs text-slate-500 mt-1">Available 9:00 AM - 6:00 PM</p>
                <button 
                  onClick={() => window.open('tel:+919876543210')}
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={16} /> Call Now
                </button>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-emerald-600" />
                  <h4 className="font-bold text-slate-800">Email Address</h4>
                </div>
                <p className="text-slate-700 font-medium">{selectedService.sellerEmail}</p>
                <p className="text-xs text-slate-500 mt-1">We'll respond within 24 hours</p>
                <button 
                  onClick={() => window.open(`mailto:${selectedService.sellerEmail}`)}
                  className="mt-3 w-full bg-emerald-600 text-white py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail size={16} /> Send Email
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-slate-500">
                Have questions about this service? Feel free to reach out directly!
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle size={24} /> Booking Confirmed Successfully!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
