import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from '../components/Link';
import { CheckCircle, Package, Truck, Phone, Mail, ArrowLeft, Share2 } from 'lucide-react';
import { orderService, Order, TrackingStep } from '../services/orderService';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Récupérer les données depuis l'état de navigation
  const { orderNumber, total, estimatedDelivery, orderDetails: initialOrderDetails } = location.state || {};

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderNumber) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        
        if (initialOrderDetails) {
          // Utiliser les détails initiaux si disponibles
          setOrderDetails(initialOrderDetails);
        }
        
        // Charger les détails complets et le suivi
        const response = await orderService.trackOrder(orderNumber);
        if (response.success) {
          setOrderDetails(response.order);
          setTrackingSteps(response.tracking_steps);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderNumber, initialOrderDetails, navigate]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Commande ${orderNumber}`,
          text: `Ma commande Yoozak ${orderNumber} pour ${total?.toFixed(2)} DHS`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback: copier dans le presse-papiers
      navigator.clipboard.writeText(`Commande ${orderNumber} - ${total?.toFixed(2)} DHS - ${window.location.href}`);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  if (!orderNumber) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
            <p className="text-gray-600 mb-8">Aucune commande n'a été trouvée.</p>
            <Link href="/" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header de confirmation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-lg text-gray-600">
            Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
          </p>
        </div>

        {/* Détails de la commande */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Commande {orderNumber}</h2>
              <p className="text-sm text-gray-600">
                Passée le {orderDetails?.creation_date ? new Date(orderDetails.creation_date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Maintenant'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Share2 size={16} className="mr-2" />
                Partager
              </button>
            </div>
          </div>

          {/* Articles commandés */}
          {orderDetails?.articles && orderDetails.articles.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Articles commandés</h3>
              <div className="space-y-3">
                {orderDetails.articles.map((article) => (
                  <div key={article.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {article.product_image && (
                      <img 
                        src={article.product_image} 
                        alt={article.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{article.product_name}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                        {article.size && <span>Taille: {article.size}</span>}
                        {article.color_fr && <span>Couleur: {article.color_fr}</span>}
                        <span>Quantité: {article.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{article.total_price.toFixed(2)} DHS</p>
                      <p className="text-xs text-gray-600">{article.price.toFixed(2)} DHS × {article.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Résumé financier */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Sous-total</span>
              <span>{((total || 0) - 50).toFixed(2)} DHS</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Livraison</span>
              <span>50.00 DHS</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{(total || 0).toFixed(2)} DHS</span>
            </div>
          </div>
        </div>

        {/* Informations de livraison */}
        {orderDetails && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Truck className="mr-2" size={20} />
              Informations de livraison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Destinataire</p>
                <p className="font-medium">{orderDetails.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                <p className="font-medium">{orderDetails.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Adresse</p>
                <p className="font-medium">{orderDetails.address}, {orderDetails.city}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <Package className="inline w-4 h-4 mr-1" />
                Livraison estimée : {estimatedDelivery || '3-5 jours ouvrés'}
              </p>
            </div>
          </div>
        )}

        {/* Suivi de commande */}
        {trackingSteps.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-semibold mb-4">Suivi de commande</h3>
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={step.step} className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.completed 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? <CheckCircle size={16} /> : step.step}
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-600'}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    {step.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(step.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={`absolute ml-4 mt-8 w-0.5 h-8 ${
                      step.completed ? 'bg-green-200' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations de contact */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold mb-4">Besoin d'aide ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium">Appelez-nous</p>
                <p className="text-sm text-gray-600">+212 6 12 34 56 78</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium">Écrivez-nous</p>
                <p className="text-sm text-gray-600">support@yoozak.ma</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 Gardez votre numéro de commande <strong>{orderNumber}</strong> pour tout contact
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continuer vos achats
          </Link>
          <Link 
            href={`/track-order?order=${orderNumber}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Package size={16} className="mr-2" />
            Suivre ma commande
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 