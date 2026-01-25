
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { StripeProvider } from '@/contexts/StripeContext';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/hooks/useCart';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

// ... other imports
import ConciergeDashboard from '@/pages/ConciergeDashboard'; // New Import
// ... imports
import MissionPage from '@/pages/MissionPage';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import HeroSection from '@/components/HeroSection';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/components/LoginPage';
import TheLotusPage from '@/pages/TheLotusPage';
import SanctuaryPage from '@/pages/SanctuaryPage';
import MembershipPage from '@/pages/MembershipPage';
import ImpactPage from '@/pages/ImpactPage';
import AdminFundingDashboard from '@/components/AdminFundingDashboard';
import StorePage from '@/pages/StorePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import LocationDetail from '@/pages/LocationDetail';
import ProfilePage from '@/pages/ProfilePage'; // NEW IMPORT

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const isHideHeaderPath = location.pathname === '/login' || (!user && location.pathname === '/');

  return (
    <div className="min-h-screen bg-[#1D5DA0] flex flex-col">
      {!isHideHeaderPath && <Header setIsCartOpen={setIsCartOpen} />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <HeroSection />} />
          <Route path="/login" element={<LoginPage />} />

          {/* INSIDER ROUTES */}
          <Route path="/hull" element={<ProtectedRoute><SanctuaryPage /></ProtectedRoute>} />
          <Route path="/sanctuary" element={<Navigate to="/hull" replace />} />
          <Route path="/lotus" element={<ProtectedRoute><TheLotusPage /></ProtectedRoute>} />
          <Route path="/impact" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />
          <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> {/* NEW ROUTE */}
          <Route path="/mission" element={<MissionPage />} />
          {/* Staff Route - Needs Founder/Admin Access */}
          <Route path="/concierge" element={<ProtectedRoute requireFounder={true}><ConciergeDashboard /></ProtectedRoute>} />
          {/* COMMERCE */}
          <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/checkout-success" element={<ProtectedRoute><CheckoutSuccessPage /></ProtectedRoute>} />
          <Route path="/locations/:slug" element={<ProtectedRoute><LocationDetail /></ProtectedRoute>} />

          {/* ADMIN */}
          <Route path="/admin" element={<ProtectedRoute requireFounder={true}><AdminFundingDashboard /></ProtectedRoute>} />

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