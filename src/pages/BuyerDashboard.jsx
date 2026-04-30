import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, ShoppingCart, User, Package, 
  LogOut, MapPin, Star, X, CreditCard, ChevronRight, 
  CheckCircle2, AlertCircle, Trash2, Plus, Minus,
  Heart, Zap, ShieldCheck, ArrowRight, Bell, Filter,
  Briefcase, Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// --- COMPONENT: STAR RATING ---
const StarRating = ({ rating = 4.8 }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={14} className={i < 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
    ))}
    <span className="text-xs font-bold text-slate-400 ml-1">{rating}</span>
  </div>
);

// --- COMPONENT: HERO SECTION ---
const HeroSection = () => (
  <div className="relative h-[350px] w-full rounded-[3rem] overflow-hidden mb-12 bg-slate-900 shadow-2xl shadow-indigo-200/50">
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070" 
        className="w-full h-full object-cover opacity-50 scale-105" 
        alt="Hero"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
    </div>
    <div className="relative h-full flex flex-col justify-center px-12 max-w-2xl space-y-6">
      <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="px-4 py-1.5 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-full w-fit">
        Summer 2024 Collection
      </motion.span>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl font-black text-white leading-[1.1]">
        Premium Quality <br /> <span className="text-indigo-400">Delivered Fast.</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-slate-300 text-lg font-medium">
        Shop verified products from JCI entrepreneurs with global standards.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-3 group">
          Explore Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
        </button>
      </motion.div>
    </div>
  </div>
);

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(JSON.parse(sessionStorage.getItem('buyerInfo')) || {});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cartItemsWithImages, setCartItemsWithImages] = useState([]);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Payment State
  const [paymentStep, setPaymentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({ deliveryType: '', paymentMethod: '', provider: '' });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userType = sessionStorage.getItem('userType');
    const storedBuyerData = sessionStorage.getItem('buyerInfo');
    
    if (isLoggedIn === 'true' && userType === 'BUYER' && storedBuyerData) {
      const parsedData = JSON.parse(storedBuyerData);
      setBuyer(parsedData);
      fetchProducts();
      fetchCart();
      fetchOrders();
    } else {
      navigate('/buyer-auth');
    }
  }, [navigate]);

  // --- LOGIC (UNTOUCHED) ---
  const fetchProducts = async () => {
    try {
      const res = await fetch(API.PRODUCTS);
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error("Failed to fetch products", err); }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(API.GET_CART(buyer.id));
      const data = await res.json();
      setCart(data);
      if (data?.items?.length > 0) {
        const itemsWithImages = await Promise.all(
          data.items.map(async (item) => {
            try {
              const productRes = await fetch(API.PRODUCT_BY_ID(item.productId));
              const productData = await productRes.json();
              return { ...item, productImage: productData.productImage };
            } catch (err) { return { ...item, productImage: null }; }
          })
        );
        setCartItemsWithImages(itemsWithImages);
      } else { setCartItemsWithImages([]); }
    } catch (err) { console.error("Failed to fetch cart", err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(API.GET_BUYER_ORDERS(buyer.id));
      const data = await res.json();
      setOrders(data.reverse());
    } catch (err) { console.error("Failed to fetch orders", err); }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const res = await fetch(API.PRODUCT_BY_ID(productId));
      const data = await res.json();
      setSelectedProduct(data);
    } catch (err) { console.error(err); }
  };

  const fetchCartItemDetails = async (cartItem) => {
    try {
      const productRes = await fetch(API.PRODUCT_BY_ID(cartItem.productId));
      const productData = await productRes.json();
      setSelectedCartItem({ ...cartItem, productDetails: productData, cartId: cart?.cartId, buyerId: cart?.buyerId });
    } catch (err) { console.error(err); }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await fetch(API.GET_ORDER_BY_ID(orderId));
      const orderData = await res.json();
      if (orderData?.items?.length > 0) {
        const itemsWithDetails = await Promise.all(
          orderData.items.map(async (item) => {
            const productRes = await fetch(API.PRODUCT_BY_ID(item.productId));
            const productData = await productRes.json();
            return { ...item, productDetails: productData };
          })
        );
        setSelectedOrder({ ...orderData, items: itemsWithDetails });
      } else {
        setSelectedOrder(orderData);
      }
    } catch (err) { console.error(err); }
  };

  const downloadReceipt = async (orderId) => {
    try {
      const res = await fetch(API.GET_ORDER_RECEIPT(orderId));
      
      // Check if the response is a PDF
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/pdf')) {
        // Handle PDF download
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Handle JSON response (fallback to HTML receipt)
        const receiptData = await res.json();
        
        // Create HTML content from receipt template
        const receiptHtml = `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body {
                      font-family: Arial;
                      padding: 20px;
                  }
                  .header {
                      display: flex;
                      justify-content: space-between;
                  }
                  .title {
                      font-size: 22px;
                      font-weight: bold;
                  }
                  .status {
                      color: green;
                      font-weight: bold;
                  }
                  .section {
                      margin-top: 20px;
                  }
                  table {
                      width: 100%;
                      border-collapse: collapse;
                      margin-top: 20px;
                  }
                  th, td {
                      border: 1px solid #ddd;
                      padding: 8px;
                  }
                  th {
                      background: #f2f2f2;
                  }
                  .total {
                      text-align: right;
                      margin-top: 20px;
                      font-size: 16px;
                  }
              </style>
          </head>
          <body>
              <div class="header">
                  <div>
                      <div class="title">JCI MarketPlace</div>
                      <div>Receipt ID: ORD-${receiptData.orderId || orderId}</div>
                  </div>
                  <div class="status">
                      ${receiptData.paymentStatus || 'PAID'}
                  </div>
              </div>
              <hr/>
              <div class="section">
                  <b>Transaction Date:</b> ${receiptData.date || new Date().toLocaleDateString()}<br/>
                  <b>Transaction ID:</b> TXN-${receiptData.orderId || orderId}
              </div>
              <div class="section">
                  <b>Customer:</b> Buyer ID ${receiptData.buyerId || buyer.id}
              </div>
              <table>
                  <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Total</th>
                  </tr>
                  ${receiptData.items?.map(item => `
                      <tr>
                          <td>${item.productName || item.name || 'Product'}</td>
                          <td>${item.quantity || item.qty || 1}</td>
                          <td>₹${item.total || item.price || 0}</td>
                      </tr>
                  `).join('') || '<tr><td colspan="3">No items found</td></tr>'}
              </table>
              <div class="total">
                  Subtotal: ₹${receiptData.subtotal || receiptData.totalAmount || 0}<br/>
                  Tax: ₹${receiptData.tax || 0}<br/>
                  <b>Total: ₹${receiptData.finalTotal || receiptData.totalAmount || 0}</b>
              </div>
              <br/><br/>
              <div>
                  Thank you for your purchase!
              </div>
          </body>
          </html>
        `;
        
        // Create a blob and download
        const blob = new Blob([receiptHtml], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${orderId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to download receipt:", err);
      alert("Failed to download receipt. Please try again.");
    }
  };

  const updateCartQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    await fetch(API.UPDATE_CART, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity: newQty })
    });
    fetchCart();
  };

  const removeFromCart = async (itemId) => {
    await fetch(API.REMOVE_CART_ITEM(itemId), { method: 'DELETE' });
    fetchCart();
  };

  const clearCart = async () => {
    await fetch(API.CLEAR_CART(buyer.id), { method: 'DELETE' });
    fetchCart();
  };

  const addToCart = async (productId) => {
    await fetch(API.ADD_TO_CART, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId: buyer.id, productId, quantity: 1 })
    });
    fetchCart();
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(API.PLACE_ORDER(buyer.id), { method: 'POST' });
      if (res.ok) {
        await fetchCart();
        await fetchOrders();
        setCartOpen(false);
        setIsCheckoutModalOpen(true);
        setPaymentStep(1);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const finalizePayment = async (orderId) => {
    setLoading(true);
    if (checkoutData.deliveryType === 'ONLINE') {
      await fetch(API.PAY_ORDER(orderId), { method: 'POST' });
    }
    await fetchOrders();
    setIsCheckoutModalOpen(false);
    setActiveTab('orders');
    setLoading(false);
  };

  const cancelOrder = async (orderId) => {
    const res = await fetch(API.UPDATE_ORDER_STATUS(orderId, 'CANCELLED'), {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) fetchOrders();
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/buyer-auth');
  };

  const handleToggleView = (view) => {
    if (view === 'service') {
      navigate('/client-dashboard');
    } else {
      // Already on product view (BuyerDashboard)
    }
  };

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-12 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('products')}>
            <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <ShoppingBag size={24} />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tighter block leading-none">JCI</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Market</span>
            </div>
          </motion.div>

          <div className="flex-1 max-w-xl hidden md:flex items-center bg-slate-100/50 border border-slate-200/60 rounded-2xl px-5 py-2.5 focus-within:bg-white focus-within:border-indigo-200 focus-within:shadow-lg focus-within:shadow-indigo-100 transition-all group">
            <Search size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search premium products..." 
              className="bg-transparent outline-none text-sm w-full font-medium ml-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Toggle Switch */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
            <button 
              onClick={() => handleToggleView('product')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all bg-indigo-600 text-white shadow-lg"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Products</span>
            </button>
            <button 
              onClick={() => handleToggleView('service')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all text-slate-600 hover:bg-slate-200"
            >
              <Briefcase size={16} />
              <span className="hidden sm:inline">Services</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden lg:flex items-center gap-2">
              <button onClick={() => setActiveTab('products')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'}`}>Products</button>
              <button onClick={() => setActiveTab('orders')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100'}`}>Orders</button>
            </nav>

            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden lg:block" />

            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setCartOpen(true)}>
                <ShoppingCart size={22} className="text-slate-700" />
                {cart?.items?.length > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cart.items.length}
                  </span>
                )}
              </div>

              <div className="group relative flex items-center gap-3 pl-2 cursor-pointer">
                <div className="text-right hidden xl:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Account</p>
                  <p className="text-sm font-bold text-slate-900">{buyer.username}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {buyer.username?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-[110]">
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors text-sm font-bold">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-10">
        {activeTab === 'products' && (
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <HeroSection />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Featured Collections</h2>
                <p className="text-slate-500 font-medium">Explore hand-picked items from top sellers</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['All Items', 'Electronics', 'Lifestyle', 'Fashion', 'Industrial'].map(cat => (
                  <button key={cat} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold whitespace-nowrap hover:border-indigo-600 hover:text-indigo-600 transition-all">{cat}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onView={() => fetchProductDetails(product.id)}
                  onAdd={() => addToCart(product.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && <OrderHistory orders={orders} onOrderClick={fetchOrderDetails} onCancelOrder={cancelOrder} onDownloadReceipt={downloadReceipt} />}
      </main>

      {/* --- SIDEBAR CART --- */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cart={cart}
        cartItemsWithImages={cartItemsWithImages}
        onUpdate={updateCartQty}
        onRemove={removeFromCart}
        onClear={clearCart}
        onCheckout={handlePlaceOrder}
        onItemClick={fetchCartItemDetails}
      />

      {/* --- MODALS --- */}
      <AnimatePresence>
        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={() => { addToCart(selectedProduct.id); setSelectedProduct(null); }} />}
        {selectedCartItem && <CartItemDetailModal cartItem={selectedCartItem} onClose={() => setSelectedCartItem(null)} onRemove={() => { removeFromCart(selectedCartItem.itemId); setSelectedCartItem(null); }} onUpdate={(qty) => { updateCartQty(selectedCartItem.itemId, qty); fetchCartItemDetails(selectedCartItem); }} />}
        {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        {isCheckoutModalOpen && <CheckoutModal step={paymentStep} setStep={setPaymentStep} data={checkoutData} setData={setCheckoutData} onFinalize={() => finalizePayment(orders[0]?.orderId)} onClose={() => setIsCheckoutModalOpen(false)} loading={loading} />}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ProductCard = ({ product, onView, onAdd }) => (
  <motion.div variants={fadeInUp} whileHover={{ y: -10 }} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group">
    <div className="relative h-72 overflow-hidden bg-slate-50">
      <img src={product.productImage} alt={product.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
        {product.availableQuantity} In Stock
      </div>
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button onClick={onView} className="p-4 bg-white rounded-2xl text-slate-900 shadow-xl hover:bg-indigo-600 hover:text-white transition-all"><Search size={20} /></button>
        <button onClick={onAdd} className="p-4 bg-white rounded-2xl text-slate-900 shadow-xl hover:bg-indigo-600 hover:text-white transition-all"><Plus size={20} /></button>
      </div>
    </div>
    <div className="p-7 space-y-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{product.sellerCompany}</p>
        <h3 className="font-bold text-lg text-slate-900 truncate">{product.productName}</h3>
        <div className="mt-2"><StarRating /></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
        <button onClick={onAdd} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors">Add</button>
      </div>
    </div>
  </motion.div>
);

const CartDrawer = ({ isOpen, onClose, cart, cartItemsWithImages, onUpdate, onRemove, onClear, onCheckout, onItemClick }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]" onClick={onClose} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[160] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black">Your Cart</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {!cart?.items?.length ? (
              <div className="text-center py-20 opacity-20"><ShoppingBag size={80} className="mx-auto mb-4" /><p className="font-black uppercase tracking-widest text-xs">Cart Empty</p></div>
            ) : cartItemsWithImages.map(item => (
              <div key={item.itemId} className="flex gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-xl transition-all" onClick={() => onItemClick(item)}>
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 shadow-sm"><img src={item.productImage} className="w-full h-full object-cover" /></div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{item.productName}</h4>
                  <p className="text-indigo-600 font-black text-sm">₹{item.totalPrice.toLocaleString()}</p>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); onUpdate(item.itemId, item.quantity - 1); }} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><Minus size={14}/></button>
                    <span className="font-bold text-xs">{item.quantity}</span>
                    <button onClick={(e) => { e.stopPropagation(); onUpdate(item.itemId, item.quantity + 1); }} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><Plus size={14}/></button>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onRemove(item.itemId); }} className="text-slate-300 hover:text-red-500 self-start p-1"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
          {cart?.items?.length > 0 && (
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-end"><span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">Total Amount</span><span className="text-3xl font-black">₹{cart.grandTotal.toLocaleString()}</span></div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={onClear} className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">Clear</button>
                <button onClick={onCheckout} className="bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100">Checkout</button>
              </div>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const ProductModal = ({ product, onClose, onAdd }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
      <div className="md:w-1/2 bg-slate-100 relative h-72 md:h-auto">
        <img src={product.productImage} className="w-full h-full object-cover" />
        <button onClick={onClose} className="absolute top-6 left-6 p-3 bg-white/90 backdrop-blur shadow-xl rounded-full hover:bg-white transition-all"><X size={20}/></button>
      </div>
      <div className="md:w-1/2 p-10 md:p-14 overflow-y-auto custom-scrollbar space-y-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">{product.sellerCompany}</p>
          <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4">{product.productName}</h2>
          <div className="flex items-center gap-4"><span className="text-4xl font-black text-slate-900">₹{product.price.toLocaleString()}</span><StarRating /></div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Description</h3>
          <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-100">
          <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Seller</p><p className="font-bold text-slate-900">{product.sellerName}</p></div>
          <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Availability</p><p className="font-bold text-slate-900">{product.availableQuantity} units</p></div>
        </div>
        <button 
          onClick={onAdd} 
          disabled={product.availableQuantity === 0} 
          className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 disabled:bg-slate-200"
        >
          {product.availableQuantity === 0 ? 'Out of Stock' : 'Add to Bag'}
        </button>
      </div>
    </motion.div>
  </div>
);

const OrderHistory = ({ orders, onOrderClick, onCancelOrder, onDownloadReceipt }) => {
  const activeOrders = orders.filter(order => order.status !== 'CANCELLED');
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED');

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black">My Orders</h2>
        <div className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">{activeOrders.length} Active</div>
      </div>
      
      <div className="grid gap-6">
        {activeOrders.map(order => (
          <motion.div layout key={order.orderId} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 h-full w-2 ${order.status === 'PENDING' ? 'bg-amber-400' : 'bg-green-500'}`} />
            <div className="space-y-2 shrink-0 w-full md:w-auto">
              <span className="text-[10px] font-black uppercase text-slate-400">#{order.orderId}</span>
              <h4 className="text-2xl font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{new Date(order.createdAt).toDateString()}</p>
            </div>
            <div className="flex flex-wrap gap-2 flex-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase">Product {item.productId} × {item.quantity}</div>
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button onClick={() => onOrderClick(order.orderId)} className="flex-1 md:flex-none px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors">Details</button>
              {order.status === 'DELIVERED' && (
                <button 
                  onClick={() => onDownloadReceipt(order.orderId)} 
                  className="flex-1 md:flex-none px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={14} />
                  Receipt
                </button>
              )}
              <button onClick={() => onCancelOrder(order.orderId)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><X size={18}/></button>
            </div>
          </motion.div>
        ))}
      </div>

      {cancelledOrders.length > 0 && (
        <div className="pt-12 space-y-6 opacity-60 grayscale">
          <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Cancelled</h3>
          {cancelledOrders.map(order => (
            <div key={order.orderId} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div><span className="text-[10px] font-bold text-slate-400">#{order.orderId}</span><p className="font-bold text-slate-900">₹{order.totalAmount}</p></div>
              <button onClick={() => onOrderClick(order.orderId)} className="px-5 py-2 bg-slate-100 rounded-lg text-[10px] font-black uppercase">View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CartItemDetailModal = ({ cartItem, onClose, onRemove, onUpdate }) => {
  if (!cartItem) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 space-y-8 shadow-2xl">
        <h2 className="text-2xl font-black">Cart Item Details</h2>
        <div className="flex gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <img src={cartItem.productDetails.productImage} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
          <div className="space-y-2">
            <h4 className="font-black text-slate-900">{cartItem.productName}</h4>
            <p className="text-indigo-600 font-black">₹{cartItem.price}</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl">
          <span className="font-bold">Quantity</span>
          <div className="flex items-center gap-4">
            <button onClick={() => onUpdate(cartItem.quantity - 1)} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><Minus size={16}/></button>
            <span className="font-black">{cartItem.quantity}</span>
            <button onClick={() => onUpdate(cartItem.quantity + 1)} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><Plus size={16}/></button>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onRemove} className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest">Remove</button>
          <button onClick={onClose} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Done</button>
        </div>
      </motion.div>
    </div>
  );
};

const OrderDetailModal = ({ order, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto space-y-8">
      <div className="flex justify-between items-start">
        <div><h2 className="text-3xl font-black">Order Manifest</h2><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Reference #{order.orderId}</p></div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button>
      </div>
      <div className="space-y-4">
        {order.items?.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-xl bg-white overflow-hidden border border-slate-200"><img src={item.productDetails?.productImage} className="w-full h-full object-cover" /></div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">{item.productDetails?.productName || 'Product item'}</p>
              <p className="text-xs font-bold text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
            </div>
            <p className="font-black text-indigo-600 text-sm">₹{item.totalPrice.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
        <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Status</p><p className="font-black text-green-600 tracking-[0.2em] uppercase text-xs">{order.status}</p></div>
        <div className="text-right"><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Amount Paid</p><p className="text-3xl font-black">₹{order.totalAmount.toLocaleString()}</p></div>
      </div>
      <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Close Receipt</button>
    </motion.div>
  </div>
);

const CheckoutModal = ({ step, setStep, data, setData, onFinalize, onClose, loading }) => {
  const providers = data.paymentMethod === 'UPI' ? ["GPay", "PhonePe", "Paytm"] : ["SBI", "HDFC", "ICICI"];
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={onClose} />
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl overflow-hidden">
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 'CONFIRM'].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${step === s ? 'bg-indigo-600' : 'bg-slate-100'}`} />
          ))}
        </div>
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-3xl font-black tracking-tight">How should we deliver?</h3>
            <div className="grid gap-3">
              {[ {id:'COD', t:'Cash on Delivery'}, {id:'ONLINE', t:'Pay Online Now'} ].map(opt => (
                <button key={opt.id} onClick={() => { setData({...data, deliveryType: opt.id}); setStep(opt.id === 'COD' ? 'CONFIRM' : 2); }} className="w-full p-6 text-left border-2 border-slate-100 rounded-3xl font-bold hover:border-indigo-600 transition-all flex justify-between items-center group">
                  {opt.t} <ChevronRight className="text-slate-300 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-3xl font-black tracking-tight">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              {['UPI', 'NETBANKING'].map(m => (
                <button key={m} onClick={() => { setData({...data, paymentMethod: m}); setStep(3); }} className="p-8 border-2 border-slate-100 rounded-3xl font-black text-xs tracking-widest hover:border-indigo-600 transition-all">{m}</button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6">
             <h3 className="text-3xl font-black tracking-tight">Choose Provider</h3>
             <div className="grid gap-2">
               {providers.map(p => (
                 <button key={p} onClick={() => { setData({...data, provider: p}); setStep('CONFIRM'); }} className="p-5 bg-slate-50 rounded-2xl font-bold hover:bg-indigo-50 transition-all">{p}</button>
               ))}
             </div>
          </div>
        )}
        {step === 'CONFIRM' && (
          <div className="text-center space-y-8 py-6">
             <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><CheckCircle2 size={48}/></div>
             <h3 className="text-3xl font-black">Final Confirmation</h3>
             <p className="text-slate-500 font-medium">Ready to complete your premium purchase? <br /> Method: <span className="text-slate-900 font-bold">{data.deliveryType}</span></p>
             <button onClick={onFinalize} disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs tracking-widest uppercase shadow-2xl shadow-indigo-200">
               {loading ? 'Processing...' : 'Place Secure Order'}
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BuyerDashboard;