import React, { useState, useEffect } from 'react';
import { Link } from '../components/Link';
import { ArrowLeft, Truck, Shield, MapPin, User, Mail, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { currentUser, isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Maroc'
  });
  
  const shippingCost = 50;
  const finalTotal = totalPrice + shippingCost;

  // Pré-remplir le formulaire avec les données de l'utilisateur connecté
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Utiliser l'adresse par défaut si elle existe
      const defaultAddress = currentUser.addresses?.find(addr => addr.isDefault);
      
      setShippingInfo({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || defaultAddress?.phone || '',
        address: defaultAddress?.address || '',
        city: defaultAddress?.city || '',
        postalCode: defaultAddress?.postalCode || '',
        country: defaultAddress?.country || 'Maroc'
      });
    }
  }, [isAuthenticated, currentUser]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isShippingValid()) {
      setCurrentStep(2);
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    
    // Simuler l'envoi de la commande
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Vider le panier
      clearCart();
      
      // Rediriger vers une page de confirmation
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: `YZ-${Date.now()}`,
          total: finalTotal,
          estimatedDelivery: '3-5 jours ouvrés'
        }
      });
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isShippingValid = () => {
    return shippingInfo.firstName && 
           shippingInfo.lastName && 
           shippingInfo.email && 
           shippingInfo.phone && 
           shippingInfo.address && 
           shippingInfo.city && 
           shippingInfo.postalCode;
  };

  // Rediriger si le panier est vide
  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">Ajoutez des articles à votre panier pour procéder à la commande.</p>
            <Link href="/products" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Continuer vos achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Retour au panier
          </Link>
          
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Finaliser ma commande</h1>
            {isAuthenticated && currentUser && (
              <div className="text-sm text-gray-600">
                Connecté en tant que <span className="font-medium">{currentUser.firstName} {currentUser.lastName}</span>
              </div>
            )}
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-4">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 2 && (
                  <div className={`flex-1 h-0.5 ${
                    currentStep > step ? 'bg-black' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Informations de livraison</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Info */}
            {currentStep === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Truck className="mr-2" size={24} />
                  Informations de livraison
                </h2>
                
                {/* User status info */}
                {!isAuthenticated && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">💡</span>
                      <div>
                        <h3 className="font-medium text-yellow-900">Vous n'êtes pas connecté</h3>
                        <p className="text-sm text-yellow-700">
                          <Link href="/login" className="underline hover:no-underline">Connectez-vous</Link> pour pré-remplir automatiquement vos informations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Multiple addresses selection for authenticated users */}
                {isAuthenticated && currentUser?.addresses && currentUser.addresses.length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Choisir une adresse existante</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentUser.addresses.map((address) => (
                        <div
                          key={address.id}
                          className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-black transition-colors"
                          onClick={() => {
                            setShippingInfo({
                              firstName: address.firstName,
                              lastName: address.lastName,
                              email: currentUser.email,
                              phone: address.phone || currentUser.phone || '',
                              address: address.address,
                              city: address.city,
                              postalCode: address.postalCode,
                              country: address.country
                            });
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{address.title}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Par défaut</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {address.address}, {address.city} {address.postalCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Payment Method Info */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💰</span>
                    <div>
                      <h3 className="font-medium text-blue-900">Paiement à la livraison</h3>
                      <p className="text-sm text-blue-700">
                        Vous paierez votre commande lors de la réception par notre livreur.
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Votre prénom"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="+212 6 12 34 56 78"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <textarea
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Votre adresse complète"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Votre ville"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="12345"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="Maroc">Maroc</option>
                        <option value="France">France</option>
                        <option value="Espagne">Espagne</option>
                        <option value="Belgique">Belgique</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!isShippingValid()}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                  >
                    Continuer vers la confirmation
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Confirmation */}
            {currentStep === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Shield className="mr-2" size={24} />
                  Confirmation de commande
                </h2>
                
                <div className="space-y-6">
                  {/* Shipping Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Adresse de livraison</h3>
                    <p className="text-sm text-gray-600">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.postalCode}<br />
                      {shippingInfo.country}<br />
                      {shippingInfo.phone}
                    </p>
                  </div>
                  
                  {/* Payment Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Méthode de paiement</h3>
                    <div className="flex items-center">
                      <span className="text-xl mr-2">💰</span>
                      <span className="text-sm text-gray-600">Paiement à la livraison</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Modifier
                    </button>
                    
                    <button
                      onClick={handleFinalSubmit}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Traitement...' : 'Confirmer la commande'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Résumé de la commande</h3>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      {(item.product.price * item.quantity).toFixed(2)} DHS
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)} DHS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>{shippingCost.toFixed(2)} DHS</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} DHS</span>
                </div>
              </div>
              
              {/* Security badges */}
              <div className="mt-6 pt-4 border-t space-y-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <Shield size={14} className="mr-2" />
                  <span>Commande 100% sécurisée</span>
                </div>
                <div className="flex items-center">
                  <Truck size={14} className="mr-2" />
                  <span>Livraison sous 3-5 jours</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-2">💰</span>
                  <span>Paiement à la livraison</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 