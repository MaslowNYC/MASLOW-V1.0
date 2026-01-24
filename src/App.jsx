
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { StripeProvider } from '@/contexts/StripeContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
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
import LoginPage from '@/components/LoginPage';
import TheLotusPage from '@/pages/TheLotusPage';
import SanctuaryPage from '@/pages/SanctuaryPage';
import MembershipPage from '@/pages/MembershipPage';
import ImpactPage from '@/pages/ImpactPage';
import AdminFundingDashboard from '@/components/AdminFundingDashboard';

// Helper component to conditionally hide header/footer
const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  
  // Define pages where the menu should be HIDDEN
  const isLockScreen = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#1D5DA0] flex flex-col">
      {/* Only show Header if we are NOT on the lock screen */}
      {!isLockScreen && <Header setIsCartOpen={setIsCartOpen} />}

      <main className="flex-grow">
        <Routes>
          {/* --- PUBLIC LOCK SCREEN --- */}
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<LoginPage />} />

          {/* --- INSIDER ROUTES (LOCKED) --- */}
          <Route path="/lotus" element={<ProtectedRoute><TheLotusPage /></ProtectedRoute>} />
          <Route path="/sanctuary" element={<ProtectedRoute><SanctuaryPage /></ProtectedRoute>} />
          <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
          <Route path="/impact" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />

          {/* --- FOUNDER ROUTE --- */}
          <Route path="/admin" element={<ProtectedRoute requireFounder={true}><AdminFundingDashboard /></ProtectedRoute>} />

          {/* Redirect lost people to the Lock Screen */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Analytics />
        <SpeedInsights />
      </main>

      {/* Only show Footer if we are NOT on the lock screen */}
      {!isLockScreen && <Footer />}
      
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