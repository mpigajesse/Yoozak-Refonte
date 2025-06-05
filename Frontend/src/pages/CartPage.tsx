import React, { useState } from 'react';
import { Link } from '../components/Link';
import { Trash2, Plus, Minus, ArrowRight, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalPrice 
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  
  // Frais de livraison en fonction du total
  const shippingFee = totalPrice > 800 ? 0 : 50;

  const handleApplyPromo = () => {
    // Simuler l'application d'un code promo
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
      setPromoDiscount(totalPrice * 0.1); // 10% de réduction
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoDiscount(0);
      setPromoError('Code promo invalide');
    }
  };

  // Total final après application du code promo et des frais de livraison
  const finalTotal = totalPrice - promoDiscount + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="mb-8">
              <svg width="220" height="220" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                <path d="M340 160C340 160 350 150 370 150C390 150 400 160 400 160" stroke="black" strokeWidth="4" strokeLinecap="round"/>
                <path d="M340 160C340 160 330 110 320 80C310 50 240 40 210 50C180 60 160 90 150 110C140 130 120 160 120 160" stroke="black" strokeWidth="4" strokeLinecap="round"/>
                <path d="M445 210H415C415 210 410 175 400 160H120C110 175 105 210 105 210H75C65 210 60 220 60 230V240C60 250 65 260 75 260H105L145 420H355L395 260H425C435 260 440 250 440 240V230C440 220 435 210 425 210H445Z" fill="#F2F2F2" stroke="black" strokeWidth="4"/>
                <path d="M145 420L105 260H395L355 420H145Z" stroke="black" strokeWidth="4"/>
                <circle cx="240" cy="320" r="8" fill="black"/>
                <circle cx="320" cy="320" r="8" fill="black"/>
                <path d="M280 370C280 370 265 350 240 350C215 350 200 370 200 370" stroke="black" strokeWidth="4" strokeLinecap="round"/>
                <rect x="225" y="430" width="30" height="50" fill="black"/>
                <rect x="305" y="430" width="30" height="50" fill="black"/>
                <ellipse cx="280" cy="485" rx="110" ry="10" fill="#F8E3D5"/>
                <path d="M340 350H400C410 350 420 365 420 370C420 375 415 380 410 380H340" stroke="black" strokeWidth="4" strokeLinecap="round"/>
                <path d="M160 350H100C90 350 80 365 80 370C80 375 85 380 90 380H160" stroke="black" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Votre panier est actuellement vide.</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Vous pouvez consulter tous les produits disponibles et acheter dans le magasin.
            </p>
            
            <Link 
              href="/products" 
              className="bg-black text-white px-8 py-3 rounded-none hover:bg-gray-800 transition-colors uppercase font-medium tracking-wider"
            >
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne principale - Liste des articles */}
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="mb-4 pb-2 border-b">
                <h2 className="text-xl font-semibold">Articles ({cartItems.length})</h2>
              </div>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex flex-col sm:flex-row border-b pb-6">
                    <div className="sm:w-32 sm:h-32 mb-4 sm:mb-0 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow sm:ml-6">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                          <Link 
                            href={`/products/${item.product.id}`} 
                            className="font-semibold text-lg hover:underline"
                          >
                            {item.product.name}
                          </Link>
                          
                          {item.product.color && (
                            <p className="text-gray-600 text-sm mt-1">Couleur: {item.product.color}</p>
                          )}
                          
                          {item.product.size && (
                            <p className="text-gray-600 text-sm">Taille: {item.product.size}</p>
                          )}
                        </div>
                        
                        <div className="mt-3 sm:mt-0 text-lg font-medium">
                          {(item.product.price * item.quantity).toFixed(2)} MAD
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 min-w-[40px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <button 
                  onClick={clearCart}
                  className="text-gray-600 hover:text-black transition-colors font-medium"
                >
                  Vider le panier
                </button>
                
                <Link 
                  href="/products" 
                  className="flex items-center text-black hover:text-gray-700 transition-colors font-medium"
                >
                  <span>Continuer mes achats</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Code promo */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Code promo</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrez votre code promo"
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Appliquer
                </button>
              </div>
              {promoError && (
                <p className="text-red-600 text-sm mt-2">{promoError}</p>
              )}
              {promoApplied && (
                <p className="text-green-600 text-sm mt-2">Code promo appliqué avec succès !</p>
              )}
              <p className="text-gray-600 text-sm mt-2">
                Essayez le code "WELCOME10" pour obtenir 10% de réduction sur votre première commande.
              </p>
            </div>
          </div>
          
          {/* Colonne de droite - Résumé de la commande */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Résumé de la commande</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{totalPrice.toFixed(2)} MAD</span>
                </div>
                
                {promoApplied && promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span>-{promoDiscount.toFixed(2)} MAD</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span>{shippingFee === 0 ? 'Gratuite' : `${shippingFee.toFixed(2)} MAD`}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)} MAD</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">TTC</p>
                </div>
              </div>
              
              <button 
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium mb-4"
              >
                Procéder au paiement
              </button>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Truck size={16} className="mr-2" />
                  <span>Livraison offerte à partir de 800 MAD d'achat</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck size={16} className="mr-2" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center">
                  <ShoppingBag size={16} className="mr-2" />
                  <span>Retours gratuits sous 14 jours</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Nous acceptons :</p>
                <div className="flex gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 