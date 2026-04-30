import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API } from '../config/api';
import { 
  LayoutDashboard, Search, Bell, Settings, User, CreditCard, 
  MessageSquare, Calendar, Briefcase, Star, Filter, 
  CheckCircle, Clock, ChevronRight, Send, Plus, Menu, X,
  ShoppingBag, LogOut, Mail, ArrowRight, Phone, TrendingUp
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

const Overview = ({ bookings, services, buyerSummary }) => {
  // Calculate real-time stats
  const totalBookings = bookings.length;
  const activeServices = services.length;

  // Debug: Log booking data structure
  console.log('Booking Data Structure:', bookings);
  if (bookings.length > 0) {
    console.log('First Booking:', bookings[0]);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Total Bookings', val: totalBookings.toString(), icon: Calendar, color: 'bg-blue-500' },
          { label: 'Active Services', val: activeServices.toString(), icon: Briefcase, color: 'bg-indigo-500' },
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

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Activity Timeline */}
      <Card className="lg:col-span-1">
        <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {bookings.slice(0, 3).map((booking, index) => (
            <div key={booking.orderId} className="flex gap-4 relative">
              {index !== 2 && <div className="absolute left-2.5 top-8 w-0.5 h-10 bg-slate-100" />}
              <div className={`mt-1 h-5 w-5 rounded-full border-4 border-white shadow-sm ${
                booking.status === 'COMPLETED' ? 'bg-emerald-500' : 
                booking.status === 'CONFIRMED' ? 'bg-blue-500' : 
                booking.status === 'IN_PROGRESS' ? 'bg-amber-500' :
                booking.status === 'PENDING' ? 'bg-slate-300' :
                'bg-slate-300'
              }`} />
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {booking.status === 'COMPLETED' ? 'Service Completed' : 
                   booking.status === 'CONFIRMED' ? 'Booking Confirmed' : 
                   booking.status === 'IN_PROGRESS' ? 'Service In Progress' :
                   booking.status === 'PENDING' ? 'Booking Pending' :
                   'Booking Pending'}
                </p>
                <p className="text-xs text-slate-500">{booking.serviceName}</p>
                {booking.status === 'COMPLETED' && (
                  <button
                    onClick={() => downloadReceipt(booking)}
                    className="mt-2 text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  >
                    <CreditCard size={12} />
                    Download Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Recent Activity</h3>
              <p className="text-slate-500">Your booking history will appear here</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="lg:col-span-1">
        <h3 className="text-lg font-bold mb-6">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-700">{totalBookings}</p>
            </div>
            <Calendar className="text-blue-500" size={24} />
          </div>
          <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-indigo-600">Available Services</p>
              <p className="text-2xl font-bold text-indigo-700">{activeServices}</p>
            </div>
            <Briefcase className="text-indigo-500" size={24} />
          </div>
          <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-emerald-600">Active Bookings</p>
              <p className="text-2xl font-bold text-emerald-700">
                {bookings.filter(b => b.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <TrendingUp className="text-emerald-500" size={24} />
          </div>
        </div>
      </Card>
    </div>
  </motion.div>
  );
};

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
            className="group h-[480px]"
          >
            <Card className="h-full flex flex-col border-none shadow-sm group-hover:shadow-indigo-100">
              <div className="h-56 overflow-hidden relative flex-shrink-0">
                <img src={s.imageUrl} alt={s.serviceName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                  <span className="text-indigo-600">{s.category}</span>
                </div>
              </div>
              <div className="flex-1 p-5 flex flex-col">
                <h4 className="font-bold text-slate-800 line-clamp-2 flex-shrink-0">{s.serviceName}</h4>
                <p className="text-xs text-slate-500 mt-1 flex-shrink-0">{s.sellerName}</p>
                <div className="flex flex-wrap gap-1 mt-2 mb-3 flex-shrink-0">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{s.usefulness}</span>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">{s.deliveryDurationInDays} Days</span>
                </div>
                <div className="mt-auto pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
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
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
);

const ServicesNew = ({ services, categories, selectedCategory, onBook, onViewDetail, onCategoryChange, loading, onContact }) => (
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
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
            className="group h-[500px]"
          >
            <Card className="h-full flex flex-col border-0 shadow-lg group-hover:shadow-2xl group-hover:shadow-indigo-200/30">
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <img 
                  src={service.imageUrl} 
                  alt={service.serviceName} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <motion.div 
                  initial={{ y: 100 }}
                  whileHover={{ y: 0 }}
                  className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-white/20"
                >
                  <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">{service.category}</span>
                </motion.div>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <h4 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors flex-shrink-0">{service.serviceName}</h4>
                <p className="text-sm text-slate-500 mb-4 line-clamp-1 flex-shrink-0">{service.sellerName}</p>
                <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{service.usefulness}</span>
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">{service.deliveryDurationInDays} Days</span>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">₹</span>
                      <span className="text-3xl font-bold text-indigo-600">{service.cost}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => onViewDetail(service)} 
                        variant="outline" 
                        className="px-3 py-2 text-xs"
                      >
                        View
                      </Button>
                      <Button 
                        onClick={() => onContact(service)} 
                        variant="outline" 
                        className="px-3 py-2 text-xs"
                      >
                        <Phone size={14} className="mr-1" />
                      </Button>
                      <Button 
                        onClick={() => onBook(service)} 
                        className="px-4 py-2 text-xs"
                      >
                        Book Now
                      </Button>
                    </div>
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

const Bookings = ({ bookings, services, onPayment, onCancel, onDetails, onDownloadReceipt }) => {
  // Helper to find service image from the main services list
  const getServiceImage = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service?.imageUrl || `https://picsum.photos/seed/${serviceId}/400/300`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">My Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500">No bookings found.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.orderId} className="p-0 overflow-hidden border border-slate-200">
              <div className="flex flex-col sm:flex-row">
                {/* Tracked Service Image */}
                <div className="sm:w-48 h-48 sm:h-auto overflow-hidden">
                  <img 
                    src={getServiceImage(booking.serviceId)} 
                    alt={booking.serviceName} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded uppercase">
                          Order #{booking.orderId}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">{booking.serviceName}</h3>
                      <p className="text-sm text-slate-500 mb-4">Provided by {booking.sellerName}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={14} /> {booking.sellerEmail}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {booking.status}
                      </span>
                      {/* Payment Badge */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                        booking.paymentStatus === 'PAID' ? 'border-emerald-200 text-emerald-600' : 'border-rose-200 text-rose-600'
                      }`}>
                        PAYMENT: {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <Button onClick={() => onDetails(booking)} variant="outline" className="text-xs py-2">View Details</Button>
                    <Button variant="secondary" className="text-xs py-2">Contact Seller</Button>
                    {booking.status === 'COMPLETED' && booking.paymentStatus === 'PAID' && (
                      <Button onClick={() => onDownloadReceipt(booking)} className="text-xs py-2 bg-emerald-600 text-white hover:bg-emerald-700">
                        Download Receipt
                      </Button>
                    )}
                    {booking.paymentStatus === 'PENDING' && (
                      <Button onClick={() => onPayment(booking)} className="text-xs py-2 bg-indigo-600 text-white hover:bg-indigo-700">
                        Pay Now
                      </Button>
                    )}
                    {booking.status === 'PENDING' && (
                      <Button onClick={() => onCancel(booking)} variant="secondary" className="text-xs py-2 bg-rose-600 text-white hover:bg-rose-700">
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentStep, setPaymentStep] = useState('options'); // options, netbanking, upi, processing, success
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [buyerSummary, setBuyerSummary] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userType = sessionStorage.getItem('userType');
    const storedBuyerData = sessionStorage.getItem('buyerInfo');
    
    if (isLoggedIn === 'true' && userType === 'BUYER' && storedBuyerData) {
      const parsedData = JSON.parse(storedBuyerData);
      setBuyerData(parsedData);
      fetchServices();
      fetchBookings();
      fetchBuyerSummary(parsedData.id);
    } else {
      navigate('/login');
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
    if (!buyerData || !buyerData.id) {
      console.log('Buyer data not available, skipping bookings fetch');
      return;
    }

    try {
      const res = await fetch(API.GET_BUYER_BOOKINGS(buyerData.id), {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
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

  const handlePayment = (booking) => {
    setSelectedBooking(booking);
    setPaymentStep('options');
    setShowPaymentModal(true);
  };

  const getServiceCost = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service?.cost || 'N/A';
  };

  const fetchServiceDetails = async (serviceId) => {
    try {
      const res = await fetch(API.SERVICE_BY_ID(serviceId), {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch service details:', error);
      return null;
    }
  };

  const getServiceCostWithFallback = async (serviceId) => {
    // First try to get from services list
    const service = services.find(s => s.id === serviceId);
    if (service?.cost) {
      return service.cost;
    }
    
    // If not found in services list, fetch directly
    const serviceDetails = await fetchServiceDetails(serviceId);
    return serviceDetails?.cost || 'N/A';
  };

  const fetchBuyerSummary = async (buyerId) => {
    try {
      const res = await fetch(API.GET_BUYER_SUMMARY(buyerId), {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });
      const data = await res.json();
      setBuyerSummary(data);
    } catch (error) {
      console.error('Failed to fetch buyer summary:', error);
    }
  };

  const processPayment = async () => {
    if (!selectedBooking) return;
    
    setPaymentStep('processing');
    
    try {
      const res = await fetch(API.PAY_SERVICE_ORDER(selectedBooking.orderId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: paymentStep === 'netbanking' ? 'NET_BANKING' : 'UPI',
          paymentDetails: paymentStep === 'netbanking' ? selectedBank : selectedUpiApp
        })
      });

      if (res.ok) {
        setTimeout(() => {
          setPaymentStep('success');
          // Refresh bookings after successful payment
          fetchBookings();
        }, 2000);
      } else {
        const errorText = await res.text();
        alert(`Payment failed: ${errorText || 'Unknown error'}`);
        setPaymentStep('options');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred during payment. Please try again.');
      setPaymentStep('options');
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBooking(null);
    setPaymentStep('options');
    setSelectedBank('');
    setSelectedUpiApp('');
  };

  const handleCancelBooking = async (booking) => {
    if (!window.confirm(`Are you sure you want to cancel this booking for ${booking.serviceName}?`)) {
      return;
    }

    try {
      const res = await fetch(API.UPDATE_BOOKING_STATUS(booking.orderId, 'CANCELLED'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });

      if (res.ok) {
        alert('✅ Booking cancelled successfully');
        // Refresh bookings after successful cancellation
        fetchBookings();
      } else {
        const errorText = await res.text();
        alert(`Failed to cancel booking: ${errorText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An error occurred while cancelling the booking. Please try again.');
    }
  };

  const handleBookingDetails = async (booking) => {
    try {
      const res = await fetch(API.GET_BOOKING_DETAILS(booking.orderId), {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });
      const data = await res.json();
      setBookingDetails(data);
      setShowBookingDetailsModal(true);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      alert('Failed to load booking details. Please try again.');
    }
  };

  const closeBookingDetailsModal = () => {
    setShowBookingDetailsModal(false);
    setBookingDetails(null);
  };

  const fetchPaymentDetails = async (booking) => {
    try {
      const res = await fetch(API.GET_BOOKING_DETAILS(booking.orderId), {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      return null;
    }
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

  const downloadReceipt = async (booking) => {
    try {
      const res = await fetch(`http://localhost:8080/service-orders/receipt/${booking.orderId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${booking.orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('✅ Receipt downloaded successfully!');
      } else {
        const errorText = await res.text();
        alert(`Failed to download receipt: ${errorText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('An error occurred while downloading the receipt. Please try again.');
    }
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
              {activeTab === 'Dashboard' && <Overview bookings={bookings} services={services} buyerSummary={buyerSummary} />}
              {activeTab === 'Services' && <Services services={services} categories={categories} selectedCategory={selectedCategory} onBook={handleBooking} onViewDetail={handleViewDetail} onCategoryChange={handleCategoryChange} loading={loading} onContact={handleContact} />}
              {activeTab === 'Payments' && (
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Payment History</h3>
                  <Button variant="secondary" className="text-xs">Export CSV</Button>
                </div>
                
                {!buyerSummary ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Loading Payment Details...</h3>
                    <p className="text-slate-500">Please wait while we fetch your payment information.</p>
                  </div>
                ) : buyerSummary.orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Payments Yet</h3>
                    <p className="text-slate-500">Your payment history will appear here once you make payments for your bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Payment Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <TrendingUp size={20} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-emerald-600 font-bold uppercase">Total Spent</p>
                            <p className="text-xl font-bold text-emerald-700">₹{buyerSummary.totalSpent}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingBag size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-600 font-bold uppercase">Total Orders</p>
                            <p className="text-xl font-bold text-blue-700">{buyerSummary.totalOrders}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <CheckCircle size={20} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs text-indigo-600 font-bold uppercase">Paid Orders</p>
                            <p className="text-xl font-bold text-indigo-700">{buyerSummary.paidOrders}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details Cards */}
                    <div className="space-y-4">
                      {buyerSummary.orders
                        .filter(order => order.paymentStatus === 'PAID')
                        .map((order, idx) => (
                          <Card key={idx} className="p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Payment Header */}
                              <div className="lg:w-1/3">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <CheckCircle size={20} className="text-emerald-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800">Payment Successful</h4>
                                    <p className="text-sm text-slate-500">Order #{order.orderId}</p>
                                  </div>
                                </div>

                                {/* Service Details */}
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={(() => {
                                        const service = services.find(s => s.id === order.serviceId);
                                        return service?.imageUrl || `https://picsum.photos/seed/${order.serviceId}/100/100.jpg`;
                                      })()} 
                                      alt={order.serviceName}
                                      className="w-16 h-16 rounded-xl object-cover shadow-sm"
                                    />
                                    <div>
                                      <p className="font-bold text-slate-800">{order.serviceName}</p>
                                      <p className="text-xs text-slate-500">Service ID: {order.serviceId}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Amount Paid</p>
                                      <p className="text-lg font-bold text-emerald-600">₹{(() => {
                                        const service = services.find(s => s.id === order.serviceId);
                                        return service?.cost || 'N/A';
                                      })()}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Payment Status</p>
                                      <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                                        PAID
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Provider & Transaction Details */}
                              <div className="lg:w-2/3 space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl">
                                  <h5 className="font-bold text-slate-800 mb-3">Service Provider</h5>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User size={16} className="text-slate-400" />
                                      <div>
                                        <p className="font-medium text-slate-800">{order.sellerName}</p>
                                        <p className="text-sm text-slate-500">{order.sellerEmail}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Briefcase size={16} className="text-slate-400" />
                                      <p className="text-sm text-slate-500">
                                        Service Category: {(() => {
                                          const service = services.find(s => s.id === order.serviceId);
                                          return service?.category || 'N/A';
                                        })()}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl">
                                  <h5 className="font-bold text-slate-800 mb-3">Order Details</h5>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <ShoppingBag size={16} className="text-slate-400" />
                                      <div>
                                        <p className="text-sm text-slate-500">Order Status</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                          order.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                          order.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                                          order.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                                          order.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                          order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600' :
                                          'bg-slate-50 text-slate-600'
                                        }`}>
                                          {order.status}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CreditCard size={16} className="text-slate-400" />
                                      <div>
                                        <p className="text-sm text-slate-500">Payment Method</p>
                                        <p className="font-medium text-slate-800">Online Payment</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
              {activeTab === 'Bookings' && <Bookings bookings={bookings} services={services} onPayment={handlePayment} onCancel={handleCancelBooking} onDetails={handleBookingDetails} onDownloadReceipt={downloadReceipt} />}
              
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

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={closePaymentModal} title="Complete Payment">
        {selectedBooking && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <img 
                src={(() => {
                  const service = services.find(s => s.id === selectedBooking.serviceId);
                  return service?.imageUrl || `https://picsum.photos/seed/${selectedBooking.serviceId}/400/300.jpg`;
                })()} 
                className="w-16 h-16 rounded-xl object-cover shadow-sm" 
                alt=""
              />
              <div>
                <p className="font-bold text-slate-800">{selectedBooking.serviceName}</p>
                <p className="text-sm text-slate-500">Order ID: #{selectedBooking.orderId}</p>
                <p className="text-lg font-bold text-indigo-600">₹{getServiceCost(selectedBooking.serviceId)}</p>
              </div>
            </div>

            {/* Payment Options */}
            {paymentStep === 'options' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800">Select Payment Method</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={() => setPaymentStep('netbanking')}
                    variant="outline" 
                    className="p-4 h-auto flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">NB</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-slate-800">Net Banking</p>
                        <p className="text-xs text-slate-500">Pay using your bank account</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400" />
                  </Button>
                  
                  <Button 
                    onClick={() => setPaymentStep('upi')}
                    variant="outline" 
                    className="p-4 h-auto flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">UPI</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-slate-800">UPI Apps</p>
                        <p className="text-xs text-slate-500">Pay using any UPI app</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-400" />
                  </Button>
                </div>
              </div>
            )}

            {/* Net Banking Options */}
            {paymentStep === 'netbanking' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setPaymentStep('options')} className="p-2">
                    <ChevronRight size={16} className="rotate-180" />
                  </Button>
                  <h3 className="font-bold text-slate-800">Select Your Bank</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {[
                    'State Bank of India',
                    'HDFC Bank',
                    'ICICI Bank',
                    'Axis Bank',
                    'Punjab National Bank',
                    'Bank of Baroda',
                    'Canara Bank',
                    'Union Bank of India',
                    'Indian Bank',
                    'Central Bank of India'
                  ].map((bank) => (
                    <Button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      variant={selectedBank === bank ? 'primary' : 'outline'}
                      className="p-3 h-auto text-sm"
                    >
                      {bank}
                    </Button>
                  ))}
                </div>
                {selectedBank && (
                  <Button onClick={processPayment} className="w-full">
                    Pay ₹{getServiceCost(selectedBooking.serviceId)} via {selectedBank}
                  </Button>
                )}
              </div>
            )}

            {/* UPI Options */}
            {paymentStep === 'upi' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setPaymentStep('options')} className="p-2">
                    <ChevronRight size={16} className="rotate-180" />
                  </Button>
                  <h3 className="font-bold text-slate-800">Select UPI App</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Google Pay', icon: 'G', color: 'bg-blue-500' },
                    { name: 'PhonePe', icon: 'P', color: 'bg-purple-500' },
                    { name: 'Paytm', icon: 'P', color: 'bg-blue-600' },
                    { name: 'Amazon Pay', icon: 'A', color: 'bg-orange-500' }
                  ].map((app) => (
                    <Button
                      key={app.name}
                      onClick={() => setSelectedUpiApp(app.name)}
                      variant={selectedUpiApp === app.name ? 'primary' : 'outline'}
                      className="p-4 h-auto flex items-center gap-3"
                    >
                      <div className={`w-8 h-8 ${app.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {app.icon}
                      </div>
                      <span className="text-sm">{app.name}</span>
                    </Button>
                  ))}
                </div>
                {selectedUpiApp && (
                  <Button onClick={processPayment} className="w-full">
                    Pay ₹{getServiceCost(selectedBooking.serviceId)} via {selectedUpiApp}
                  </Button>
                )}
              </div>
            )}

            {/* Processing State */}
            {paymentStep === 'processing' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Processing Payment</h3>
                <p className="text-sm text-slate-500">Please wait while we process your payment...</p>
                <p className="text-xs text-slate-400 mt-2">Amount: ₹{getServiceCost(selectedBooking.serviceId)}</p>
              </div>
            )}

            {/* Success State */}
            {paymentStep === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Payment Successful!</h3>
                <p className="text-sm text-slate-500 mb-4">Your payment has been processed successfully.</p>
                <p className="text-xs text-slate-400">Amount paid: ₹{getServiceCost(selectedBooking.serviceId)}</p>
                <Button onClick={closePaymentModal} className="w-full">
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Booking Details Modal */}
      <Modal isOpen={showBookingDetailsModal} onClose={closeBookingDetailsModal} title="Booking Details">
        {bookingDetails && (
          <div className="space-y-6">
            {/* Service Header with Image */}
            <div className="relative">
              <div className="h-48 rounded-xl overflow-hidden">
                <img 
                  src={bookingDetails.imageUrl} 
                  alt={bookingDetails.serviceName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg">
                <span className="text-indigo-600 font-bold text-sm">Order #{bookingDetails.orderId}</span>
              </div>
            </div>

            {/* Service Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{bookingDetails.serviceName}</h3>
                <p className="text-slate-600 mt-2">{bookingDetails.description}</p>
              </div>

              {/* Service Provider Info */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-800 mb-3">Service Provider</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{bookingDetails.sellerName}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail size={14} /> {bookingDetails.sellerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Service Cost</p>
                  <p className="text-2xl font-bold text-indigo-600">₹{bookingDetails.cost}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Booking Date</p>
                  <p className="font-bold text-slate-800">
                    {new Date(bookingDetails.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(bookingDetails.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Booking Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    bookingDetails.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                    bookingDetails.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                    bookingDetails.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                    bookingDetails.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                    bookingDetails.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {bookingDetails.status}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Payment Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    bookingDetails.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                    bookingDetails.paymentStatus === 'PENDING' ? 'bg-rose-50 text-rose-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {bookingDetails.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Buyer ID</p>
                  <p className="font-medium text-slate-800">#{bookingDetails.buyerId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Service ID</p>
                  <p className="font-medium text-slate-800">#{bookingDetails.serviceId}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeBookingDetailsModal} className="flex-1">
                Close
              </Button>
              {bookingDetails.paymentStatus === 'PENDING' && (
                <Button 
                  onClick={() => {
                    closeBookingDetailsModal();
                    handlePayment(bookingDetails);
                  }} 
                  className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Pay Now
                </Button>
              )}
              {bookingDetails.status === 'PENDING' && (
                <Button 
                  onClick={() => {
                    closeBookingDetailsModal();
                    handleCancelBooking(bookingDetails);
                  }} 
                  variant="secondary" 
                  className="flex-1 bg-rose-600 text-white hover:bg-rose-700"
                >
                  Cancel Booking
                </Button>
              )}
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
