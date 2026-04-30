import React from 'react'
import {Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SellerAuth from './pages/SellerAuth'
import BuyerAuth from './pages/BuyerAuth'
import AdminAuth from './pages/AdminAuth'
import AdminDashboard from './pages/AdminDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import Gateway from './pages/Gateway'
import SellerDashboard from './pages/SellerDashboard'
import ServiceDashboard from './pages/ServiceDashboard'
import ClientDashboard from './pages/ClientDashboard'


function App() {
  return (
    <Routes>  
      <Route path='/' element={<LandingPage />} />
      <Route path='/seller-auth' element={<SellerAuth />} />
      <Route path='/buyer-auth' element={<BuyerAuth />} />
      <Route path='/admin-auth' element={<AdminAuth />} />
      <Route path='/admin-dashboard' element={<AdminDashboard />} />
      <Route path='/buyer-dashboard' element={<BuyerDashboard />} />
      <Route path='/gateway' element={<Gateway />} />
      <Route path='/seller-dashboard' element={<SellerDashboard />} />
      <Route path='/service-dashboard' element={<ServiceDashboard />} />
      <Route path='/client-dashboard' element={<ClientDashboard />} />
    </Routes>
  )
}

export default App