import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { StripeProvider } from '@/contexts/StripeContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/hooks/useCart';
import ShoppingCart from '@/components/ShoppingCart';
import FloatingMembershipButton from '@/components/FloatingMembershipButton';

// Components
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoginPage from '@/components/LoginPage';
import AdminFundingDashboard from '@/components/AdminFundingDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import HomePage from '@/pages/HomePage';
import StorePage from '@/pages/StorePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import ImpactPage from '@/pages/ImpactPage';
import SanctuaryPage from '@/pages/SanctuaryPage';
import MembershipPage from '@/pages/MembershipPage';
import LocationDetail from '@/pages/LocationDetail';
import ReactorCorePage from '@/pages/ReactorCorePage';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <StripeProvider>
        <CartProvider>
          <Router>
            <Helmet>
              <title>Maslow NYC - The Infrastructure of Dignity</title>
              <meta
                name="description"
                content="New York City has 8 million people and only 1,100 public restrooms. Maslow is the sanctuary the city deserves. Join the movement for dignified sanitation access."
              />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap"
                rel="stylesheet"
              />
            </Helmet>

            <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
              {/* Header visibility is handled internally by the component based on auth state */}
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
                  <Route
                    path="/reactor-core"
                    element={
                      <ProtectedRoute requireFounder={true}>
                        <ReactorCorePage />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminFundingDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                {/* CORRECTED: Analytics is now outside Routes, but inside Main */}
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