import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, BarChart3, 
  Settings, HelpCircle, Bell, Search, Menu, 
  ChevronRight, ArrowUpRight, Globe, User, LogOut, Plus, Edit2, X, Eye, Info, Calendar, DollarSign, Building,
  Trash2, PackageOpen // Added PackageOpen for orders
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api'; 

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Modals State
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  
  // Data State
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: '',
    productImage: '',
    price: '',
    description: '',
    expiryDate: '',
    totalQuantity: ''
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userType = sessionStorage.getItem('userType');
    const storedSellerData = sessionStorage.getItem('sellerInfo');
    
    if (isLoggedIn === 'true' && userType === 'SELLER' && storedSellerData) {
      const parsedData = JSON.parse(storedSellerData);
      setSellerData(parsedData);
      fetchProducts(parsedData.id);
    } else {
      navigate('/seller-auth');
    }
  }, [navigate]);

  const fetchProducts = async (sellerId) => {
    try {
      const response = await fetch(API.GET_SELLER_PRODUCTS(sellerId));
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async (sellerId) => {
    setOrdersLoading(true);
    try {
      const response = await fetch(API.GET_SELLER_ORDERS(sellerId));
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(API.UPDATE_ORDER_STATUS(orderId, status), {
        method: 'PUT'
      });
      
      if (response.ok) {
        // Update local state to reflect the change
        setOrders(orders.map(order => 
          order.orderId === orderId ? { ...order, status } : order
        ));
        
        // Update selected order if in modal
        if (selectedOrder?.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        
        alert(`✅ Order status updated to ${status}`);
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // --- DELETE PRODUCT LOGIC ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        const response = await fetch(API.PRODUCT_BY_ID(id), {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove from local state immediately for real-time feel
          setProducts(products.filter(product => product.id !== id));
          if (viewingProduct?.id === id) setShowDetailModal(false);
          // Optional: You can show a toast notification here
        } else {
          alert("Failed to delete the product. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleViewDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(API.PRODUCT_BY_ID(id));
      const data = await response.json();
      setViewingProduct(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/seller-auth');
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productImage: product.productImage,
      price: product.price,
      description: product.description,
      expiryDate: product.expiryDate || '',
      totalQuantity: product.totalQuantity || ''
    });
    setShowProductModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct ? API.PRODUCT_BY_ID(editingProduct.id) : API.PRODUCTS;
    const method = editingProduct ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      sellerId: sellerData.id,
      price: parseFloat(formData.price),
      totalQuantity: parseInt(formData.totalQuantity) || 0
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowProductModal(false);
        setEditingProduct(null);
        setFormData({ productName: '', productImage: '', price: '', description: '', expiryDate: '', totalQuantity: '' });
        fetchProducts(sellerData.id);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // --- UI COMPONENTS ---

  const InventoryView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Manage Inventory</h2>
        <button 
          onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
          className="bg-[#FF9900] hover:bg-[#e68a00] text-black px-4 py-2 rounded flex items-center gap-2 text-sm font-bold shadow-sm transition-colors"
        >
          <Plus size={18} /> Add a Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[11px] font-bold">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <img src={product.productImage} alt="" className="w-14 h-14 object-cover rounded border" />
                </td>
                <td className="px-6 py-4">
                  <div 
                    onClick={() => handleViewDetails(product.id)}
                    className="font-bold text-blue-600 hover:underline cursor-pointer transition-all"
                  >
                    {product.productName}
                  </div>
                  <div className="text-gray-500 text-xs truncate max-w-[250px] mt-1">{product.description}</div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`text-xs font-bold px-2 py-1 rounded ${
                      product.availableQuantity > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.availableQuantity} left
                    </div>
                    <span className="text-xs text-gray-500">/ {product.totalQuantity}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium">{product.expiryDate || 'No Expiry'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-4">
                    <button onClick={() => handleViewDetails(product.id)} className="text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => openEditModal(product)} className="text-gray-400 hover:text-orange-600 transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Manage Orders</h2>
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[11px] font-bold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Buyer ID</th>
              <th className="px-6 py-4">Order Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ordersLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900">#{order.orderId}</td>
                  <td className="px-6 py-4">{order.buyerId}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button onClick={() => handleViewOrderDetails(order)} className="text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.orderId, 'SHIPPED')} 
                          className="text-green-600 hover:text-green-700 transition-colors" 
                          title="Mark as Shipped"
                        >
                          <PackageOpen size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f3f3f3] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#232f3e] text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {isSidebarOpen && <span className="font-bold text-xl text-white tracking-tighter">JCI<span className="text-[#FF9900]">Marketplace</span></span>}
          <Menu className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setSidebarOpen(!isSidebarOpen)} />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <div onClick={() => setActiveTab('dashboard')}><SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} /></div>
          <div onClick={() => setActiveTab('inventory')}><SidebarItem icon={Package} label="Inventory" active={activeTab === 'inventory'} /></div>
          <div onClick={() => { setActiveTab('orders'); fetchOrders(sellerData.id); }}><SidebarItem icon={PackageOpen} label="Orders" active={activeTab === 'orders'} /></div>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-white text-sm font-medium w-full p-2"><LogOut size={18}/> {isSidebarOpen && 'Sign Out'}</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeTab}</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Merchant</div>
                <div className="text-xs font-black text-gray-800">{sellerData?.companyName}</div>
             </div>
             <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200 text-orange-700 font-bold text-xs uppercase">
                {sellerData?.ownerName.charAt(0)}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' ? (
             <div className="space-y-6 text-center py-20">
                <h1 className="text-3xl font-black text-gray-900">Welcome, {sellerData?.ownerName}</h1>
                <p className="text-gray-500">Select 'Inventory' to manage your products or view detailed statistics.</p>
             </div>
          ) : activeTab === 'orders' ? (
            <OrdersView />
          ) : (
            <InventoryView />
          )}
        </div>
      </main>

      {/* Modals */}
      {/* --- MODAL 1: ADD/EDIT FORM --- */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{editingProduct ? 'Update Listing' : 'New Listing'}</h3>
              <X className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => setShowProductModal(false)} />
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <InputField label="Product Title" name="productName" value={formData.productName} onChange={(e)=>setFormData({...formData, productName: e.target.value})} />
               <div className="grid grid-cols-2 gap-4">
                 <InputField label="Price (₹)" type="number" name="price" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} />
                 <InputField label="Total Quantity" type="number" name="totalQuantity" value={formData.totalQuantity} onChange={(e)=>setFormData({...formData, totalQuantity: e.target.value})} />
               </div>
               <InputField label="Expiry Date" type="date" name="expiryDate" value={formData.expiryDate} onChange={(e)=>setFormData({...formData, expiryDate: e.target.value})} />
               <InputField label="Image URL" name="productImage" value={formData.productImage} onChange={(e)=>setFormData({...formData, productImage: e.target.value})} />
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Description</label>
                  <textarea className="w-full border rounded-md p-3 text-sm h-24 focus:ring-1 focus:ring-orange-500 outline-none" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} />
               </div>
               <button className="w-full bg-[#f0c14b] border border-[#a88734] hover:bg-[#f4d078] py-2.5 rounded shadow-sm font-bold text-sm">
                  {editingProduct ? 'Save Changes' : 'Publish to Catalog'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: DETAILED VIEW --- */}
      {showDetailModal && viewingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center px-8 py-5 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Info size={20}/></div>
                   <h2 className="font-black text-gray-800 text-lg uppercase tracking-tight">Product Specifications</h2>
                </div>
                <X className="cursor-pointer text-gray-400 hover:text-black" onClick={() => setShowDetailModal(false)} />
             </div>
             
             <div className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <img src={viewingProduct.productImage} alt="" className="w-full h-64 object-cover rounded-xl border-4 border-gray-100 shadow-inner" />
                   <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-700 uppercase">Live Price</span>
                      <span className="text-2xl font-black text-gray-900">₹{viewingProduct.price.toFixed(2)}</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <h1 className="text-2xl font-black text-gray-900 leading-tight">{viewingProduct.productName}</h1>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{viewingProduct.description}</p>
                   </div>

                   <div className="grid grid-cols-1 gap-3">
                      <DetailRow icon={Calendar} label="Expiry Date" value={viewingProduct.expiryDate || 'N/A'} />
                      <DetailRow icon={Package} label="Total Stock" value={`${viewingProduct.totalQuantity || 0} units`} />
                      <DetailRow icon={ShoppingCart} label="Available" value={`${viewingProduct.availableQuantity || 0} units`} />
                      <DetailRow icon={BarChart3} label="Sold" value={`${viewingProduct.soldQuantity || 0} units`} />
                      <DetailRow icon={Building} label="Seller Entity" value={viewingProduct.sellerCompany} />
                      <DetailRow icon={User} label="Authorized User" value={viewingProduct.sellerName} />
                      <DetailRow icon={Package} label="Internal ID" value={`SKU-${viewingProduct.id}`} />
                   </div>

                   <div className="flex gap-3">
                     <button 
                      onClick={() => { setShowDetailModal(false); openEditModal(viewingProduct); }}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2"
                     >
                       <Edit2 size={16}/> Modify
                     </button>
                     <button 
                      onClick={() => handleDelete(viewingProduct.id)}
                      className="bg-red-50 text-red-600 px-4 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all"
                     >
                       <Trash2 size={18}/>
                     </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ORDER DETAILS --- */}
      {showOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-8 py-5 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><PackageOpen size={20}/></div>
                <h2 className="font-black text-gray-800 text-lg uppercase tracking-tight">Order Details</h2>
              </div>
              <X className="cursor-pointer text-gray-400 hover:text-black" onClick={() => setShowOrderDetailModal(false)} />
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-black text-gray-800 text-lg mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-bold">#{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Buyer ID:</span>
                      <span className="font-bold">{selectedOrder.buyerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Date:</span>
                      <span className="font-bold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-bold px-2 py-1 rounded text-sm ${
                        selectedOrder.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        selectedOrder.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        selectedOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className={`font-bold px-2 py-1 rounded text-sm ${
                        selectedOrder.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                        selectedOrder.paymentStatus === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-black text-gray-800 text-lg mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="text-2xl font-black text-slate-900">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-black text-gray-800 text-lg mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">Product ID: {item.productId}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-sm text-gray-500">
                            ₹{item.price.toLocaleString()} × {item.quantity}
                          </div>
                          <span className="font-bold text-slate-900">₹{item.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedOrder.status === 'PENDING' && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, 'SHIPPED')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <PackageOpen size={18} />
                  Mark as Shipped
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components...
const SidebarItem = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center space-x-3 p-3 cursor-pointer rounded-lg transition-all ${
    active ? 'bg-[#37475a] text-[#FF9900]' : 'text-gray-400 hover:bg-[#37475a] hover:text-white'
  }`}>
    <Icon size={20} />
    <span className="font-bold text-sm">{label}</span>
  </div>
);

const InputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1">{label}</label>
    <input {...props} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 outline-none transition-all" />
  </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
    <div className="text-gray-400"><Icon size={16} /></div>
    <div>
      <div className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">{label}</div>
      <div className="text-sm font-bold text-gray-800 leading-none">{value}</div>
    </div>
  </div>
);

export default SellerDashboard;
