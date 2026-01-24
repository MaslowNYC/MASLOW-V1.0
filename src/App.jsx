
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import HeroSection from '@/components/HeroSection'; // The Lock Screen
import LoginPage from '@/components/LoginPage';
import TheLotusPage from '@/pages/TheLotusPage';
import SanctuaryPage from '@/pages/SanctuaryPage'; // The Hull (Rewritten)
import MembershipPage from '@/pages/MembershipPage';
import ImpactPage from '@/pages/ImpactPage';
import AdminFundingDashboard from '@/components/AdminFundingDashboard';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <StripeProvider>
        <CartProvider>
          <Router>
            <Helmet>
              <title>Maslow NYC</title>
              <meta name="description" content="The Infrastructure of Dignity." />
            </Helmet>

            <div className="min-h-screen bg-[#1D5DA0] flex flex-col">
              {/* Header is ONLY visible if logged in (Handled inside Header component usually, or we can condition it here) */}
              <Header setIsCartOpen={setIsCartOpen} />

              <main className="flex-grow">
                <Routes>
                  {/* --- PUBLIC ROUTE: THE LOCK SCREEN --- */}
                  <Route path="/" element={<HeroSection />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* --- INSIDER ROUTES (LOCKED) --- */}
                  <Route path="/lotus" element={<ProtectedRoute><TheLotusPage /></ProtectedRoute>} />
                  <Route path="/sanctuary" element={<ProtectedRoute><SanctuaryPage /></ProtectedRoute>} />
                  <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
                  <Route path="/impact" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />

                  {/* --- FOUNDER ROUTE (DOUBLE LOCKED) --- */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireFounder={true}>
                        <AdminFundingDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all: Send lost people back to the Lock Screen */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                <Analytics />
                <SpeedInsights />
              </main>

              {/* Footer can be minimal on lock screen, full on inside. For now, we keep it simple. */}
              <Footer />
              <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;