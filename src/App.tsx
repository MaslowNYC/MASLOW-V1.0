import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { StripeProvider } from '@/contexts/StripeContext';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/hooks/useCart';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import BuyCreditsPage from '@/pages/BuyCreditsPage';


// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConciergeBubble from '@/components/ConciergeBubble';

// Pages - Core
import HeroSection from '@/components/HeroSection';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/components/LoginPage';
import StorePage from '@/pages/StorePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import LocationDetail from '@/pages/LocationDetail';
import TheLotusPage from '@/pages/TheLotusPage';
import MembershipPage from '@/pages/MembershipPage';
import ImpactPage from '@/pages/ImpactPage';
import HullPage from '@/pages/HullPage';
import SanctuarySuitesPage from '@/pages/SanctuarySuitesPage';
import EventsPage from '@/pages/EventsPage';
import AdminFundingDashboard from '@/components/AdminFundingDashboard';
import Dashboard from '@/pages/Dashboard';
import MaslowPage from '@/pages/MaslowPage';
import StaffInventory from '@/pages/StaffInventory';

// Restored imports
import ProfilePage from '@/pages/ProfilePage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import MissionPage from '@/pages/MissionPage';
import ConciergeDashboard from '@/pages/ConciergeDashboard';
import Partnerships from '@/pages/Partnerships';

// Future Innovations (public showcase)
import FuturePrototypesPage from '@/pages/FuturePrototypesPage';

// Prototypes pages (admin)
import PrototypesPage from '@/pages/prototypes/PrototypesPage';
import PrototypeSystemDetailPage from '@/pages/prototypes/SystemDetailPage';
import PrototypeDetailPage from '@/pages/prototypes/PrototypeDetailPage';
import PrototypeShoppingCartPage from '@/pages/prototypes/ShoppingCartPage';
import PrototypeBoxViewPage from '@/pages/prototypes/BoxViewPage';
import PrototypeShoppingListPage from '@/pages/prototypes/ShoppingListPage';

const AppContent: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const location = useLocation();
  const { user } = useAuth();

  const isHideHeaderPath = location.pathname === '/login' || location.pathname === '/reset-password' || (!user && location.pathname === '/');

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
      {!isHideHeaderPath && <Header setIsCartOpen={setIsCartOpen} />}

      <main className="flex-grow">
        <Routes>
          {/* Public & Core Routes */}
          <Route path="/" element={user ? <HomePage /> : <HeroSection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/maslow" element={<MaslowPage />} />
          <Route path="/staff/inventory" element={<StaffInventory />} />
          <Route path="/buy-credits" element={<ProtectedRoute><BuyCreditsPage /></ProtectedRoute>} />
          

          {/* Protected Routes */}
          <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          <Route path="/hull" element={<ProtectedRoute><HullPage /></ProtectedRoute>} />
          <Route path="/suites" element={<ProtectedRoute><SanctuarySuitesPage /></ProtectedRoute>} />
          <Route path="/sanctuary" element={<Navigate to="/hull" replace />} />
          <Route path="/lotus" element={<ProtectedRoute><TheLotusPage /></ProtectedRoute>} />
          <Route path="/impact" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />
          <Route path="/membership" element={<ProtectedRoute><MembershipPage /></ProtectedRoute>} />
          <Route path="/future" element={<ProtectedRoute><FuturePrototypesPage /></ProtectedRoute>} />

          {/* Commerce */}
          <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/checkout-success" element={<ProtectedRoute><CheckoutSuccessPage /></ProtectedRoute>} />
          <Route path="/locations/:slug" element={<ProtectedRoute><LocationDetail /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireFounder={true}><AdminFundingDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requireFounder={true}><Dashboard /></ProtectedRoute>} />

          {/* Restored Routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/concierge" element={<ProtectedRoute requireFounder={true}><ConciergeDashboard /></ProtectedRoute>} />

          {/* Prototypes - Admin Only */}
          <Route path="/prototypes" element={<ProtectedRoute requireFounder={true}><PrototypesPage /></ProtectedRoute>} />
          <Route path="/prototypes/system/:id" element={<ProtectedRoute requireFounder={true}><PrototypeSystemDetailPage /></ProtectedRoute>} />
          <Route path="/prototypes/prototype/:id" element={<ProtectedRoute requireFounder={true}><PrototypeDetailPage /></ProtectedRoute>} />
          <Route path="/prototypes/shopping-cart" element={<ProtectedRoute requireFounder={true}><PrototypeShoppingCartPage /></ProtectedRoute>} />
          <Route path="/prototypes/boxes" element={<ProtectedRoute requireFounder={true}><PrototypeBoxViewPage /></ProtectedRoute>} />
          <Route path="/prototypes/shopping" element={<ProtectedRoute requireFounder={true}><PrototypeShoppingListPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Analytics />
        <SpeedInsights />
      </main>

      {!isHideHeaderPath && <Footer />}
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      <Toaster />

      {/* AI Concierge - only show when logged in */}
      {user && <ConciergeBubble userId={user.id} />}
    </div>
  );
};

const App: React.FC = () => {
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
};

export default App;
