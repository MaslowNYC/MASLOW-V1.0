
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import FloatingMembershipButton from '@/components/FloatingMembershipButton';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminFundingDashboard from '@/components/AdminFundingDashboard'; // Money (Private)

// Pages
import HomePage from '@/pages/HomePage';
// FIX: LoginPage is in /components, not /pages
import LoginPage from '@/components/LoginPage'; 
import ImpactPage from '@/pages/ImpactPage';
import SanctuaryPage from '@/pages/SanctuaryPage';
import MembershipPage from '@/pages/MembershipPage';
import LocationDetail from '@/pages/LocationDetail';
import StorePage from '@/pages/StorePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import TheLotusPage from '@/pages/TheLotusPage'; // Design (Public)

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <StripeProvider>
        <CartProvider>
          <Router>
            <Helmet>
              <title>Maslow NYC - The Infrastructure of Dignity</title>
              <meta name="description" content="New York City has 8 million people and only 1,100 public restrooms. Maslow is the sanctuary the city deserves." />
            </Helmet>

            <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
              <Header setIsCartOpen={setIsCartOpen} />

              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/impact" element={<ImpactPage />} />
                  <Route path="/sanctuary" element={<SanctuaryPage />} />
                  <Route path="/membership" element={<MembershipPage />} />
                  <Route path="/locations/:slug" element={<LocationDetail />} />
                  
                  {/* The Lotus Design (Public) */}
                  <Route path="/lotus" element={<TheLotusPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/store"
                    element={
                      <ProtectedRoute>
                        <StorePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <ProtectedRoute>
                        <ProductDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/checkout-success" element={<CheckoutSuccessPage />} />

                  {/* Admin Dashboard (Private - Founder Only) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireFounder={true}>
                        <AdminFundingDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                
                {/* Vercel Tools */}
                <Analytics />
                <SpeedInsights />
              </main>

              <Footer />
              <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
              <FloatingMembershipButton />
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;
