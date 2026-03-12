import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { StripeProvider } from '@/contexts/StripeContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { CartProvider } from '@/hooks/useCart';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
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
// HeroSection removed - homepage now loads directly
import HomePage from '@/pages/HomePage';
import LoginPage from '@/components/LoginPage';
import StorePage from '@/pages/StorePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import LocationDetail from '@/pages/LocationDetail';
import MembershipPage from '@/pages/MembershipPage';
import ImpactPage from '@/pages/ImpactPage';
import HullPage from '@/pages/HullPage';
import SanctuarySuitesPage from '@/pages/SanctuarySuitesPage';
import EventsPage from '@/pages/EventsPage';
import AdminFundingDashboard from '@/components/AdminFundingDashboard';
import Dashboard from '@/pages/Dashboard';
import MaslowPage from '@/pages/MaslowPage';
import StaffInventory from '@/pages/StaffInventory';
import RevenueModelPage from '@/pages/RevenueModelPage';

// Restored imports
import ProfilePage from '@/pages/ProfilePage';
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import MissionPage from '@/pages/MissionPage';
import ConciergeDashboard from '@/pages/ConciergeDashboard';
import Partnerships from '@/pages/Partnerships';
import FieldResearchPage from '@/pages/FieldResearchPage';
import FieldResearchResultsPage from '@/pages/FieldResearchResultsPage';
import FieldNotesIndex from '@/pages/FieldNotesIndex';
import FieldNotePost from '@/pages/FieldNotePost';

// Future Innovations (public showcase)
import FuturePrototypesPage from '@/pages/FuturePrototypesPage';

// Legal
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import DisclaimerPage from '@/pages/DisclaimerPage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';
import FAQPage from '@/pages/FAQPage';

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
  const navigate = useNavigate();
  // Detect password recovery links and redirect to reset-password page
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      // Preserve the hash params and redirect to reset-password
      navigate('/reset-password' + hash, { replace: true });
    }
  }, [navigate]);

  const isHideHeaderPath = location.pathname === '/login' || location.pathname === '/reset-password' || location.pathname === '/model';

  return (
    <div className="min-h-screen bg-[#FAF4ED] flex flex-col overflow-x-hidden w-full max-w-full">
      {!isHideHeaderPath && <Header setIsCartOpen={setIsCartOpen} />}

      <main className="flex-grow">
        <Routes>
          {/* Public & Core Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/maslow" element={<MaslowPage />} />
          <Route path="/model" element={<RevenueModelPage />} />
          <Route path="/staff/inventory" element={<ProtectedRoute requireFounder={true}><StaffInventory /></ProtectedRoute>} />
          <Route path="/buy-credits" element={<ProtectedRoute><BuyCreditsPage /></ProtectedRoute>} />
          

          {/* Protected Routes */}
          <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          <Route path="/hull" element={<HullPage />} />
          <Route path="/suites" element={<ProtectedRoute><SanctuarySuitesPage /></ProtectedRoute>} />
          <Route path="/sanctuary" element={<Navigate to="/hull" replace />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/membership" element={<MembershipPage />} />
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
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/field-notes" element={<FieldNotesIndex />} />
          <Route path="/field-notes/:slug" element={<FieldNotePost />} />
          <Route path="/concierge" element={<ProtectedRoute requireFounder={true}><ConciergeDashboard /></ProtectedRoute>} />

          {/* Field Research - Admin Only */}
          <Route path="/admin/field-research" element={<ProtectedRoute requireFounder={true}><FieldResearchPage /></ProtectedRoute>} />
          <Route path="/admin/research-results" element={<ProtectedRoute requireFounder={true}><FieldResearchResultsPage /></ProtectedRoute>} />

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

      {/* DISABLED UNTIL LAUNCH
      {user && <ConciergeBubble userId={user.id} />}
      */}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <StripeProvider>
          <CartProvider>
            <Router>
              <Helmet>
                <title>Maslow NYC — Premium Private Restroom Suites in SoHo</title>
                <meta name="description" content="Private, app-controlled restroom suites in SoHo, New York City. Book by the session. Walk up or reserve in advance. Premium is the floor, not an upgrade." />
              </Helmet>
              <AppContent />
            </Router>
          </CartProvider>
        </StripeProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
};

export default App;
