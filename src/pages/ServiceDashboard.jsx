import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, MessageSquare, PieChart, 
  Settings, HelpCircle, Bell, Search, Menu, 
  ChevronRight, Star, Clock, User, LogOut, Plus, Edit2, X, CheckCircle, Trash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API } from '../config/api';

const ServiceDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sellerEarnings, setSellerEarnings] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    activeProjects: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    weeklyProjects: 0
  });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceName: '',
    imageUrl: '',
    description: '',
    category: '',
    usefulness: '',
    cost: '',
    deliveryDurationInDays: '',
    portfolioLink: ''
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const storedSellerData = sessionStorage.getItem('sellerInfo');
    
    if (isLoggedIn === 'true' && storedSellerData) {
      const parsedData = JSON.parse(storedSellerData);
      setSellerData(parsedData);
      fetchServices(parsedData.id);
      fetchSellerEarnings(parsedData.id);
    } else {
      navigate('/seller-auth');
    }
  }, [navigate]);

  useEffect(() => {
    if (sellerEarnings && services.length > 0) {
      calculateDashboardStats(sellerEarnings, services);
    }
  }, [sellerEarnings, services]);

  const fetchServices = async (id) => {
    try {
      const res = await fetch(API.GET_SELLER_SERVICES(id));
      const data = await res.json();
      setServices(data);
    } catch (e) { console.error("Error:", e); }
  };

  const fetchSellerEarnings = async (sellerId) => {
    try {
      const res = await fetch(API.GET_SELLER_EARNINGS(sellerId), {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });
      const data = await res.json();
      setSellerEarnings(data);
      calculateDashboardStats(data, services);
    } catch (error) {
      console.error('Failed to fetch seller earnings:', error);
    }
  };

  const calculateDashboardStats = (earnings, servicesList) => {
    if (!earnings || !servicesList) return;

    const orders = earnings.orders || [];
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Debug: Log the raw earnings data
    console.log('Raw Earnings Data:', earnings);
    console.log('Orders Array:', orders);
    console.log('Order Structure:', orders[0]);
    
    // Calculate active projects (orders that are not completed or cancelled)
    const activeProjects = orders.filter(order => 
      order.status !== 'COMPLETED' && 
      order.status !== 'CANCELLED'
    ).length;

    // Calculate weekly projects (orders due this week)
    const weeklyProjects = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate <= weekFromNow && orderDate >= today;
    }).length;

    // Calculate total and pending revenue - use backend total earnings and calculate pending from orders
    const totalRevenue = earnings.totalEarnings || 0; // Use backend total earnings directly
    
    const pendingOrders = orders.filter(order => {
      const isPending = order.paymentStatus === 'PENDING' || order.paymentStatus === 'Pending' || order.paymentStatus === 'pending';
      console.log(`Order ${order.orderId}: paymentStatus="${order.paymentStatus}", isPending=${isPending}`);
      return isPending;
    });
    
    const pendingRevenue = pendingOrders.reduce((sum, order) => {
      const orderCost = order.cost || order.amount || order.price || order.charge || order.fee || 0;
      console.log(`Pending Order ${order.orderId}: cost=${order.cost}, amount=${order.amount}, price=${order.price}, final=${orderCost}`);
      return sum + Number(orderCost);
    }, 0);

    console.log('Revenue Calculation:', {
      backendTotalEarnings: earnings.totalEarnings,
      calculatedTotalRevenue: totalRevenue,
      pendingRevenue,
      pendingOrdersCount: pendingOrders.length
    });

    console.log('Final Calculations:', {
      activeProjects,
      totalRevenue,
      pendingRevenue,
      weeklyProjects
    });

    setDashboardStats({
      activeProjects,
      totalRevenue,
      pendingRevenue,
      weeklyProjects
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(API.UPDATE_BOOKING_STATUS(orderId, newStatus), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}`,
        }
      });

      if (res.ok) {
        alert(`Order status updated to ${newStatus}`);
        // Refresh earnings data after status update
        if (sellerData) {
          fetchSellerEarnings(sellerData.id);
        }
      } else {
        const errorText = await res.text();
        alert(`Failed to update order status: ${errorText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('An error occurred while updating the order status. Please try again.');
    }
  };

  const fetchServiceDetail = async (serviceId) => {
    setLoading(true);
    try {
      const res = await fetch(API.SERVICE_BY_ID(serviceId));
      const data = await res.json();
      setSelectedServiceDetail(data);
    } catch (e) {
      console.error("Error fetching service detail:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingService ? API.SERVICE_BY_ID(editingService.id) : API.SERVICES;
    const method = editingService ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sellerId: sellerData.id })
      });
      
      if (res.ok) {
        const updatedService = await res.json();
        console.log('Service updated successfully:', updatedService);
        
        setShowModal(false);
        setEditingService(null);
        fetchServices(sellerData.id);
        
        // Show success message
        alert(editingService ? 'Service updated successfully!' : 'Service created successfully!');
        
        // Reset form
        setFormData({
          serviceName: '',
          imageUrl: '',
          description: '',
          category: '',
          usefulness: '',
          cost: '',
          deliveryDurationInDays: '',
          portfolioLink: ''
        });
      } else {
        const errorData = await res.json();
        console.error('Failed to save service:', errorData);
        alert(`Failed to ${editingService ? 'update' : 'create'} service. Please try again.`);
      }
    } catch (e) {
      console.error('Error saving service:', e);
      alert(`An error occurred while ${editingService ? 'updating' : 'creating'} the service. Please check your connection and try again.`);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        const res = await fetch(API.SERVICE_BY_ID(serviceId), {
          method: 'DELETE'
        });
        
        if (res.ok) {
          console.log('Service deleted successfully');
          alert('Service deleted successfully!');
          fetchServices(sellerData.id);
        } else {
          const errorData = await res.json();
          console.error('Failed to delete service:', errorData);
          alert('Failed to delete service. Please try again.');
        }
      } catch (e) {
        console.error('Error deleting service:', e);
        alert('An error occurred while deleting the service. Please check your connection and try again.');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/seller-auth');
  };

  // --- UI Components ---

  const ServicesListView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Active Service Gigs</h2>
          <p className="text-sm text-slate-500">Manage your professional offerings</p>
        </div>
        <button 
          onClick={() => { setEditingService(null); setShowModal(true); }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-teal-100"
        >
          <Plus size={18} /> Create New Gig
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <img src={service.imageUrl} alt="" className="w-full h-40 object-cover" />
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 line-clamp-1">{service.serviceName}</h3>
                <div className="flex gap-1">
                  <button 
                    onClick={() => fetchServiceDetail(service.id)} 
                    className="text-slate-400 hover:text-blue-600"
                    title="View Details"
                  >
                    <User size={16} />
                  </button>
                  <button 
                    onClick={() => { setEditingService(service); setFormData(service); setShowModal(true); }} 
                    className="text-slate-400 hover:text-teal-600"
                    title="Edit Service"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteService(service.id)} 
                    className="text-slate-400 hover:text-red-600"
                    title="Delete Service"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-2">{service.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{service.category}</span>
                <span className="px-2 py-1 bg-teal-50 text-teal-600 text-[10px] font-bold rounded-full">{service.usefulness}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting at</span>
                  <span className="font-black text-teal-600">₹{service.cost}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery</span>
                  <span className="text-xs font-bold flex items-center gap-1"><Clock size={12}/> {service.deliveryDurationInDays} Days</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EarningsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Earnings & Orders</h2>
          <p className="text-sm text-slate-500">Track your revenue and service orders</p>
        </div>
      </div>

      {!sellerEarnings ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Loading Earnings Data...</h3>
          <p className="text-slate-500">Please wait while we fetch your earnings information.</p>
        </div>
      ) : sellerEarnings.orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Orders Yet</h3>
          <p className="text-slate-500">Your order history will appear here once clients start booking your services.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Earnings Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <PieChart size={24} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-emerald-600 font-bold uppercase">Total Earnings</p>
                  <p className="text-2xl font-bold text-emerald-700">₹{sellerEarnings.totalEarnings}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-700">{sellerEarnings.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-xl border border-teal-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-teal-600 font-bold uppercase">Seller Name</p>
                  <p className="text-lg font-bold text-teal-700">{sellerEarnings.sellerName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Recent Orders</h3>
              <p className="text-sm text-slate-500">All your service orders in one place</p>
            </div>
            
            <div className="divide-y divide-slate-100">
              {sellerEarnings.orders.map((order, idx) => (
                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Briefcase size={20} className="text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{order.serviceName}</h4>
                        <p className="text-sm text-slate-500">Order #{order.orderId} • Buyer ID: {order.buyerId}</p>
                        <p className="text-sm text-slate-500">Service ID: {order.serviceId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Order Status</p>
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
                      
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Payment Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          order.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                          order.paymentStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Buyer Info</p>
                        <p className="text-sm font-medium text-slate-800">{order.sellerEmail}</p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Actions</p>
                        <div className="flex gap-1">
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => updateOrderStatus(order.orderId, 'IN_PROGRESS')}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                            >
                              Start Work
                            </button>
                          )}
                          {order.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => updateOrderStatus(order.orderId, 'COMPLETED')}
                              className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium hover:bg-green-100 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                          {order.status === 'COMPLETED' && (
                            <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded text-xs font-medium">
                              Finished
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800">
      {/* Sidebar - Freelance Themed (Dark Teal) */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0F172A] text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          {isSidebarOpen && <div className="font-black text-xl tracking-tighter text-teal-400">JCI <span className="text-white">Marketplace</span></div>}
          <Menu className="cursor-pointer text-slate-400" onClick={() => setSidebarOpen(!isSidebarOpen)} />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={Briefcase} label="My Gigs" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          
          <NavItem icon={PieChart} label="Earnings" active={activeTab === 'earnings'} onClick={() => setActiveTab('earnings')} />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-400 transition-colors p-2 text-sm font-bold">
            <LogOut size={18}/> {isSidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-slate-500 uppercase text-[10px] tracking-[0.2em]">Service Portal</h1>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sm font-bold text-slate-800">{sellerData?.companyName}</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-teal-600"><Bell size={20}/></button>
            <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
              {sellerData?.ownerName.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {sellerData?.ownerName}!</h1>
                  <p className="text-slate-500 font-medium">Here's what's happening with your services today.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                  <CheckCircle size={14} /> Profile Verified
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                  title="Active Projects" 
                  value={dashboardStats.activeProjects.toString()} 
                  subValue={`${dashboardStats.weeklyProjects} due this week`} 
                  trend={2} 
                />
                <StatCard 
                  title="Total Revenue" 
                  value={`₹${dashboardStats.totalRevenue.toLocaleString()}`} 
                   
                  trend={15} 
                />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold mb-4">Quick Actions</h3>
                 <div className="flex gap-4">
                    <button onClick={() => setActiveTab('services')} className="flex-1 p-4 border rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all text-left group">
                       <Briefcase className="text-teal-600 mb-2" />
                       <div className="font-bold text-sm">Create New Service</div>
                       <div className="text-xs text-slate-500">List a new skill or package</div>
                    </button>
                 </div>
              </div>
            </div>
          ) : activeTab === 'services' ? (
            <ServicesListView />
          ) : activeTab === 'earnings' ? (
            <EarningsView />
          ) : null}
        </div>
      </main>

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                {editingService ? 'Update Service Gig' : 'Create New Service Gig'}
              </h3>
              <X className="cursor-pointer text-slate-400 hover:text-rose-500" onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Service Title</label>
                <input required name="serviceName" value={formData.serviceName} onChange={(e)=>setFormData({...formData, serviceName: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500/20" placeholder="e.g. Professional Logo Design" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                  <input required name="category" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500/20" placeholder="e.g. Design" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Usefulness</label>
                  <input required name="usefulness" value={formData.usefulness} onChange={(e)=>setFormData({...formData, usefulness: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500/20" placeholder="e.g. Brand identity" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cost (₹)</label>
                  <input required type="number" name="cost" value={formData.cost} onChange={(e)=>setFormData({...formData, cost: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500/20" placeholder="2000" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Delivery (Days)</label>
                  <input required type="number" name="deliveryDurationInDays" value={formData.deliveryDurationInDays} onChange={(e)=>setFormData({...formData, deliveryDurationInDays: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500/20" placeholder="3" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Image URL</label>
                <input required name="imageUrl" value={formData.imageUrl} onChange={(e)=>setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500/20" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Portfolio Link</label>
                <input required name="portfolioLink" value={formData.portfolioLink} onChange={(e)=>setFormData({...formData, portfolioLink: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500/20" placeholder="https://portfolio.com" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Service Description</label>
                <textarea required rows={4} name="description" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500/20" placeholder="Describe what you offer in detail..." />
              </div>
              <button className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 mt-2">
                {editingService ? 'Save Changes' : 'Publish Service Gig'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Service Details</h3>
              <X className="cursor-pointer text-slate-400 hover:text-rose-500" onClick={() => setSelectedServiceDetail(null)} />
            </div>
            
            <div className="p-6 space-y-6">
              {/* Service Image */}
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img src={selectedServiceDetail.imageUrl} alt={selectedServiceDetail.serviceName} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg">
                  <span className="text-teal-600 font-bold text-sm">{selectedServiceDetail.category}</span>
                </div>
              </div>
              
              {/* Service Info */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">{selectedServiceDetail.serviceName}</h2>
                <p className="text-slate-600 mb-4">{selectedServiceDetail.description}</p>
                
                {/* Seller Info */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <User size={24} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{selectedServiceDetail.sellerName}</p>
                      <p className="text-sm text-slate-500">{selectedServiceDetail.sellerEmail}</p>
                    </div>
                  </div>
                </div>
                
                {/* Service Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">Usefulness</p>
                    <p className="font-bold text-slate-800">{selectedServiceDetail.usefulness}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">Delivery Time</p>
                    <p className="font-bold text-slate-800">{selectedServiceDetail.deliveryDurationInDays} Days</p>
                  </div>
                </div>
                
                {/* Cost and Portfolio */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-4">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">Service Cost</p>
                    <p className="text-2xl font-bold text-teal-600">₹{selectedServiceDetail.cost}</p>
                  </div>
                  <a 
                    href={selectedServiceDetail.portfolioLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm bg-white px-4 py-2 rounded-xl border border-teal-200"
                  >
                    View Portfolio <ChevronRight size={16} />
                  </a>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setEditingService(selectedServiceDetail);
                      setFormData(selectedServiceDetail);
                      setSelectedServiceDetail(null);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
                  >
                    Edit Service
                  </button>
                  <button 
                    onClick={() => setSelectedServiceDetail(null)}
                    className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <div onClick={onClick} className={`flex items-center justify-between p-3 cursor-pointer rounded-xl transition-all group ${
    active ? 'bg-teal-600/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`}>
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </div>
    {badge && <span className="bg-teal-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);

const StatCard = ({ title, value, subValue, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </div>
    </div>
    <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
    <div className="text-xs text-slate-500 font-medium">{subValue}</div>
  </div>
);

export default ServiceDashboard;