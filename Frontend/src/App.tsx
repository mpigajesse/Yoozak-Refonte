import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ScrollingBanner from './components/ScrollingBanner';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import BlogPage from './pages/BlogPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

// Composant Splash Screen
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // 4 secondes pour voir l'animation complète

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center relative">
        {/* Titre avec Y dessiné à la main et ajout progressif */}
        <div className="mb-2 relative">
          <h1 className="text-4xl font-normal text-gray-900 mb-4 tracking-wider relative">
            {/* Container pour le Y avec SVG superposé */}
            <div className="inline-block relative">
              {/* Y invisible pour réserver l'espace */}
              <span className="text-transparent select-none">Y</span>
              
              {/* SVG du Y dessiné à la main, positionné au-dessus */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  width="50" 
                  height="60" 
                  viewBox="0 0 60 70" 
                  className="absolute"
                  style={{ top: '-12px' }}
                >
                  {/* Trait gauche du Y */}
                  <motion.path
                    d="M 15 15 L 30 35"
                    stroke="#1f2937"
                    strokeWidth="4"
                    strokeLinecap="butt"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  {/* Trait droit du Y */}
                  <motion.path
                    d="M 45 15 L 30 35"
                    stroke="#1f2937"
                    strokeWidth="4"
                    strokeLinecap="butt"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                  />
                  {/* Trait vertical du Y */}
                  <motion.path
                    d="M 30 35 L 30 55"
                    stroke="#1f2937"
                    strokeWidth="4"
                    strokeLinecap="butt"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.6, ease: "easeInOut" }}
                  />
                </svg>
              </div>
            </div>
            
            {/* Lettres "oozak" qui apparaissent progressivement */}
            {['o', 'o', 'z', 'a', 'k'].map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 2.8 + index * 0.15,
                  type: "spring",
                  stiffness: 150
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Slogan qui apparaît en fondu */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.5 }}
          className="text-lg text-gray-600 mb-8 font-light tracking-wide"
        >
          Quand marcher devient un plaisir 
        </motion.p>

        {/* Petit indicateur de fin */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 3.8, type: "spring" }}
          className="w-2 h-2 bg-gray-400 rounded-full mx-auto"
        />
      </div>
    </motion.div>
  );
};

// Nouveau composant pour contenir la logique d'affichage et utiliser useLocation
function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollingBanner
        text="offre Spéciale : Livraison Gratuite et paiement à la livraison"
        backgroundColor="#8a553b"
        textColor="#ffffff"
        speed={90}
      />
      <main className="flex-grow pt-24">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <HomePage />
              </motion.div>
            } />
            <Route path="/products" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductsPage />
              </motion.div>
            } />
            <Route path="/products/:id" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductDetailPage />
              </motion.div>
            } />
            <Route path="/about" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AboutPage />
              </motion.div>
            } />
            <Route path="/contact" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ContactPage />
              </motion.div>
            } />
            <Route path="/login" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AuthPage />
              </motion.div>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AccountPage />
                </motion.div>
              </ProtectedRoute>
            } />
            <Route path="/privacy" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PrivacyPolicyPage />
              </motion.div>
            } />
            <Route path="/terms" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TermsOfUsePage />
              </motion.div>
            } />
            <Route path="/refund-policy" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RefundPolicyPage />
              </motion.div>
            } />
            <Route path="/blog" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BlogPage />
              </motion.div>
            } />
            <Route path="/cart" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CartPage />
              </motion.div>
            } />
            <Route path="/checkout" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CheckoutPage />
              </motion.div>
            } />
            <Route path="/order-confirmation" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OrderConfirmationPage />
              </motion.div>
            } />

            {/* Redirection pour les anciennes URL */}
            <Route path="/auth" element={<Navigate to="/login" replace />} />

            {/* Redirection pour les routes non trouvées */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}

// Le composant App principal rend maintenant Router et les Providers
function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <AnimatePresence mode="wait">
            {showSplash ? (
              <SplashScreen key="splash" onComplete={handleSplashComplete} />
            ) : (
              <motion.div
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AppContent />
              </motion.div>
            )}
          </AnimatePresence>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;