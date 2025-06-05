import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../styles/transitions.css';

const CartSidebar: React.FC = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    totalPrice 
  } = useCart();

  // Calcul des informations supplémentaires
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingThreshold = 1000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const estimatedShipping = totalPrice >= freeShippingThreshold ? 0 : 50;
  const subtotal = totalPrice;
  const total = subtotal + estimatedShipping;

  return (
    <>
      {/* Overlay avec effet de flou */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40
          ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div>
            <h2 className="text-xl font-semibold">Votre Panier</h2>
            <p className="text-sm text-gray-500">
              {totalItems} article{totalItems !== 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={closeCart}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress vers la livraison gratuite */}
        {remainingForFreeShipping > 0 && (
          <div className="p-4 bg-gray-50">
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progression vers la livraison gratuite</span>
                <span>{Math.round((totalPrice / freeShippingThreshold) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (totalPrice / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Plus que {remainingForFreeShipping.toFixed(2)} MAD pour la livraison gratuite !
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="h-[calc(100vh-350px)] overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <p className="text-xl font-medium mb-2">Votre panier est vide</p>
              <p className="text-gray-500 mb-6">Ajoutez des articles pour commencer vos achats</p>
              <Link
                to="/products"
                className="rounded-full bg-black px-6 py-2 text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg"
                onClick={closeCart}
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="group relative flex items-center gap-4 rounded-lg border border-gray-200 p-3 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
                >
                  {/* Image avec lien */}
                  <Link 
                    to={`/products/${item.product.id}`}
                    onClick={closeCart}
                    className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <Link
                        to={`/products/${item.product.id}`}
                        onClick={closeCart}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gray-900 font-medium">
                        {item.product.isSale ? (
                          <span className="flex flex-col items-end">
                            <span className="text-red-500">
                              ${((item.product.price * (1 - item.product.discount! / 100)) * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </span>
                        ) : (
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="mt-1 flex items-center text-sm">
                      <span className="text-gray-500 capitalize">{item.product.category}</span>
                      {item.product.color && (
                        <>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-500">{item.product.color}</span>
                        </>
                      )}
                      {item.product.size && (
                        <>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-500">Taille {item.product.size[0]}</span>
                        </>
                      )}
                    </div>

                    {/* Stock warning */}
                    {item.product.stock && item.product.stock < 5 && (
                      <div className="mt-1 flex items-center text-sm text-orange-500">
                        <AlertTriangle size={14} className="mr-1" />
                        <span>Plus que {item.product.stock} en stock</span>
                      </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.product.stock ? item.quantity >= item.product.stock : false}
                          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
            {/* Résumé */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Livraison estimée</span>
                <span>{estimatedShipping === 0 ? 'Gratuite' : `$${estimatedShipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Bouton commander */}
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full rounded-full bg-black py-3 text-center font-medium text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg"
            >
              Passer la commande
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar; 