
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { StripeProvider } from '@/contexts/StripeContext';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/hooks/useCart';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import HeroSection from '@/components/HeroSection';
import HomePage from '@/pages/HomePage'; // Import the restored HomePage
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

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  
  // Define Lock Screen paths
  // Note: '/' is no longer a "Lock Screen" for members, so we remove it from this check
  // ONLY the Login page should hide the header now.
  const isHideHeaderPath = location.pathname === '/login' || (!user && location.pathname === '/');

  return (
    <div className="min-h-screen bg-[#1D5DA0] flex flex-col">
      {/* Show Header unless we are on the public lock screen or login */}
      {!isHideHeaderPath && <Header setIsCartOpen={setIsCartOpen} />}

      <main className="flex-grow">
        <Routes>
          {/* --- THE HYBRID HOMEPAGE --- */}
          {/* If Logged In: Show Full HomePage. If Public: Show Velvet Rope (HeroSection) */}
          <Route path="/" element={user ? <HomePage /> : <HeroSection />} />
          
          <Route path="/login" element={<LoginPage />} />

          {/* --- INSIDER ROUTES (LOCKED) --- */}
          <Route path="/hull" element={<ProtectedRoute><SanctuaryPage /></ProtectedRoute>} />
          <Route path="/lotus" element={<ProtectedRoute><TheLotusPage /></ProtectedRoute>} />
          <Route path="/impact" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />
          <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
          
          {/* --- COMMERCE ROUTES --- */}
          <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/checkout-success" element={<ProtectedRoute><CheckoutSuccessPage /></ProtectedRoute>} />
          <Route path="/locations/:slug" element={<ProtectedRoute><LocationDetail /></ProtectedRoute>} />

          {/* --- FOUNDER ROUTE --- */}
          <Route path="/admin" element={<ProtectedRoute requireFounder={true}><AdminFundingDashboard /></ProtectedRoute>} />

          {/* Catch-all: Send lost people back Home */}
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