const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jci-strydo.onrender.com';

export const API = {
  // Admin endpoints
  ADD_MEMBER: `${API_BASE_URL}/auth/admin/add-member`,
  GET_MEMBERS: `${API_BASE_URL}/auth/admin/JCI/members`,
  GET_SINGLE_MEMBER: (id) => `${API_BASE_URL}/auth/admin/JCI/members/${id}`,
  
  // Buyer endpoints
  BUYER_REGISTER: `${API_BASE_URL}/auth/register/buyer`,
  BUYER_LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Seller endpoints
  SELLER_REGISTER: `${API_BASE_URL}/auth/register/seller`,
  SELLER_LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Admin management endpoints
  GET_BUYERS: `${API_BASE_URL}/auth/admin/buyers`,
  GET_SINGLE_BUYER: (id) => `${API_BASE_URL}/auth/admin/buyers/${id}`,
  GET_SELLERS: `${API_BASE_URL}/auth/admin/sellers`,
  GET_SINGLE_SELLER: (id) => `${API_BASE_URL}/auth/admin/sellers/${id}`,

  // Product Endpoints
  PRODUCTS: `${API_BASE_URL}/products`,
  GET_SELLER_PRODUCTS: (sellerId) => `${API_BASE_URL}/products/seller/${sellerId}`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,

  // Service Endpoints
  SERVICES: `${API_BASE_URL}/api/services`,
  GET_SELLER_SERVICES: (sellerId) => `${API_BASE_URL}/api/services/seller/${sellerId}`,
  SERVICE_BY_ID: (id) => `${API_BASE_URL}/api/services/${id}`,
  SERVICES_BY_CATEGORY: (category) => `${API_BASE_URL}/api/services/category/${category}`,
  BOOK_SERVICE: `${API_BASE_URL}/service-orders/book`,
  GET_BUYER_BOOKINGS: (buyerId) => `${API_BASE_URL}/service-orders/buyer/${buyerId}`,
  PAY_SERVICE_ORDER: (orderId) => `${API_BASE_URL}/service-orders/pay/${orderId}`,
  UPDATE_BOOKING_STATUS: (orderId, status) => `${API_BASE_URL}/service-orders/status/${orderId}?status=${status}`,
  GET_BOOKING_DETAILS: (orderId) => `${API_BASE_URL}/service-orders/${orderId}`,
  GET_BUYER_SUMMARY: (buyerId) => `${API_BASE_URL}/service-orders/buyer/${buyerId}/summary`,
  GET_SELLER_EARNINGS: (sellerId) => `${API_BASE_URL}/service-orders/seller/${sellerId}/earnings`,
  GET_PAID_PAYMENTS: `${API_BASE_URL}/service-orders/payments/paid`,
  GET_SERVICE_RECEIPT: (orderId) => `${API_BASE_URL}/service-orders/receipt/${orderId}`,
  GET_ORDER_PAYMENTS: `${API_BASE_URL}/orders/payments`,
  GET_SINGLE_ORDER_PAYMENT: (orderId) => `${API_BASE_URL}/orders/payments/${orderId}`,
  GET_ORDER_RECEIPT: (orderId) => `${API_BASE_URL}/orders/receipt/${orderId}`,

  // Cart Endpoints
  ADD_TO_CART: `${API_BASE_URL}/cart/add`,
  GET_CART: (buyerId) => `${API_BASE_URL}/cart/${buyerId}`,
  UPDATE_CART: `${API_BASE_URL}/cart/update`,
  REMOVE_CART_ITEM: (itemId) => `${API_BASE_URL}/cart/remove/${itemId}`,
  CLEAR_CART: (buyerId) => `${API_BASE_URL}/cart/clear/${buyerId}`,

  // Order Endpoints
  PLACE_ORDER: (buyerId) => `${API_BASE_URL}/orders/place/${buyerId}`,
  GET_BUYER_ORDERS: (buyerId) => `${API_BASE_URL}/orders/buyer/${buyerId}`,
  GET_ORDER_BY_ID: (orderId) => `${API_BASE_URL}/orders/${orderId}`,
  UPDATE_ORDER_STATUS: (orderId, status) => `${API_BASE_URL}/orders/status/${orderId}?status=${status}`,
  CANCEL_ORDER: (orderId) => `${API_BASE_URL}/orders/cancel/${orderId}`,
  GET_SELLER_ORDERS: (sellerId) => `${API_BASE_URL}/orders/seller/${sellerId}`,
  GET_ALL_ORDERS: `${API_BASE_URL}/orders`,

  // Add this line
  PAY_ORDER: (orderId) => `${API_BASE_URL}/orders/pay/${orderId}`,

};

export default API;
