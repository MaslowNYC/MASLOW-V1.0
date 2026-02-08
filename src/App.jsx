
import MaslowPage from '@/pages/MaslowPage';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { StripeProvider } from '@/contexts/StripeContext';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/hooks/useCart';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import StaffInventory from '@/pages/StaffInventory'

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages - Core
import HeroSection from '@/components/HeroSection';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/components/LoginPage';
import StorePage from '@/pages/StorePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import LocationDetail from '@/pages/LocationDetail';
import SanctuaryPage from '@/pages/SanctuaryPage';
import TheLotusPage from '@/pages/TheLotusPage';
import MembershipPage from '@/pages/MembershipPage';
import ImpactPage from '@/pages/ImpactPage';
import HullPage from '@/pages/HullPage';
import SanctuarySuitesPage from '@/pages/SanctuarySuitesPage';
import AdminFundingDashboard from '@/components/AdminFundingDashboard';
import Dashboard from '@/pages/Dashboard';

// --- RESTORED IMPORTS (Waking them up!) ---
import ProfilePage from '@/pages/ProfilePage';
import MissionPage from '@/pages/MissionPage';
import DrMaslowPage from '@/pages/DrMaslowPage';
import ConciergeDashboard from '@/pages/ConciergeDashboard';
import CityPartnerships from '@/pages/CityPartnerships';

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const isHideHeaderPath = location.pathname === '/login' || (!user && location.pathname === '/');

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
      {!isHideHeaderPath && <Header setIsCartOpen={setIsCartOpen} />}

      <main className="flex-grow">
        <Routes>
          {/* Public & Core Routes */}
          <Route path="/" element={user ? <HomePage /> : <HeroSection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/maslow" element={<MaslowPage />} />
          <Route path="/staff/inventory" element={<StaffInventory />} />
          
          {/* Protected Routes */}
          <Route path="/hull" element={<ProtectedRoute><HullPage /></ProtectedRoute>} />
          <Route path="/suites" element={<ProtectedRoute><SanctuarySuitesPage /></ProtectedRoute>} />
          <Route path="/sanctuary" element={<Navigate to="/hull" replace />} />
          <Route path="/lotus" element={<ProtectedRoute><TheLotusPage /></ProtectedRoute>} />
          <Route path="/impact" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />
          <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
          
          {/* Commerce */}
          <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/checkout-success" element={<ProtectedRoute><CheckoutSuccessPage /></ProtectedRoute>} />
          <Route path="/locations/:slug" element={<ProtectedRoute><LocationDetail /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireFounder={true}><AdminFundingDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requireFounder={true}><Dashboard /></ProtectedRoute>} />

          {/* --- RESTORED ROUTES --- */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/partnerships" element={<CityPartnerships />} />
          <Route path="/maslow" element={<DrMaslowPage />} />
          <Route path="/concierge" element={<ProtectedRoute requireFounder={true}><ConciergeDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Analytics />
        <SpeedInsights />
      </main>

      {!isHideHeaderPath && <Footer />}
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <CartProvider>
          <Router>
            <Helmet>
              <title>Maslow NYC</title>
              <meta name="description" content="The Infrastructure of Dignity." />
            </Helmet>
            <AppContent />
          </Router>
        </CartProvider>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;