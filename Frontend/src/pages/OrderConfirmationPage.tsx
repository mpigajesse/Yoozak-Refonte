import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from '../components/Link';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';

interface OrderConfirmationState {
  orderNumber: string;
  total: number;
  estimatedDelivery: string;
}

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderConfirmationState;

  // Rediriger vers la page d'accueil si pas de données de commande
  useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          
          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Commande confirmée !
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Merci pour votre achat. Votre commande a été traitée avec succès.
          </p>
          
          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-left max-w-2xl mx-auto">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Détails de votre commande</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Numéro de commande</p>
                  <p className="font-medium text-lg">{state.orderNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Total payé</p>
                  <p className="font-medium text-lg">{state.total.toFixed(2)} DHS</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Date de commande</p>
                  <p className="font-medium">{new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Livraison estimée</p>
                  <p className="font-medium">{state.estimatedDelivery}</p>
                </div>
              </div>
            </div>
            
            {/* What's Next */}
            <div>
              <h3 className="font-semibold mb-4">Prochaines étapes</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Confirmation par email</p>
                    <p className="text-sm text-gray-600">
                      Vous recevrez un email de confirmation avec tous les détails de votre commande.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full flex-shrink-0">
                    <Package size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Préparation de la commande</p>
                    <p className="text-sm text-gray-600">
                      Nos équipes préparent soigneusement vos articles pour l'expédition.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full flex-shrink-0">
                    <Truck size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Expédition et livraison</p>
                    <p className="text-sm text-gray-600">
                      Vous recevrez un numéro de suivi dès l'expédition de votre commande.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="/products"
              className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <span>Continuer mes achats</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
            
            <Link
              href="/account"
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Voir mes commandes
            </Link>
          </div>
          
          {/* Customer Service */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Notre équipe de service client est disponible pour répondre à toutes vos questions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Nous contacter
              </Link>
              
              <a
                href="tel:+212600000000"
                className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
              >
                Appeler le service client
              </a>
            </div>
          </div>
          
          {/* Social Sharing */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Suivez-nous sur les réseaux sociaux pour ne rien manquer de nos nouveautés !
            </p>
            
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.901 8.251 7.052 7.76 8.449 7.76s2.448.49 3.323 1.297c.806.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.298-3.323 1.298z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 