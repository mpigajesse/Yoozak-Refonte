import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from '../components/Link';
import { Search, Package, CheckCircle, Clock, Truck, AlertCircle, ArrowLeft } from 'lucide-react';
import { orderService, Order, TrackingStep } from '../services/orderService';

const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Veuillez entrer un numéro de commande');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrderDetails(null);
    setTrackingSteps([]);

    try {
      const response = await orderService.trackOrder(orderNumber.trim());
      if (response.success) {
        setOrderDetails(response.order);
        setTrackingSteps(response.tracking_steps);
      } else {
        setError(response.message || 'Commande introuvable');
      }
    } catch (error: any) {
      setError('Erreur lors de la recherche de la commande');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger automatiquement si un numéro est fourni dans l'URL
  useEffect(() => {
    if (orderNumber) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmee':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'en_cours_confirmation':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'affectee':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'erronnee':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmee':
        return 'bg-green-100 text-green-800';
      case 'en_cours_confirmation':
        return 'bg-yellow-100 text-yellow-800';
      case 'affectee':
        return 'bg-blue-100 text-blue-800';
      case 'erronnee':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Retour à l'accueil
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi de commande</h1>
          <p className="text-gray-600">Entrez votre numéro de commande pour suivre l'état de votre livraison</p>
        </div>

        {/* Formulaire de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de commande
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Ex: YZ-CMD-0001"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Recherche...
                </div>
              ) : (
                'Suivre ma commande'
              )}
            </button>
          </form>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <h3 className="font-medium text-red-900">Erreur</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Détails de la commande */}
        {orderDetails && (
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Commande {orderDetails.order_number}</h2>
                  <p className="text-sm text-gray-600">
                    Passée le {new Date(orderDetails.creation_date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
                    {getStatusIcon(orderDetails.status)}
                    <span className="ml-2">{orderDetails.status_display}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="font-semibold text-lg">{orderDetails.price.toFixed(2)} DHS</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Paiement</p>
                  <p className="font-medium">{orderDetails.payment_status_display}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Livraison</p>
                  <p className="font-medium">{orderDetails.delivery_status_display}</p>
                </div>
              </div>
            </div>

            {/* Suivi détaillé */}
            {trackingSteps.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-6">Suivi détaillé</h3>
                <div className="space-y-6">
                  {trackingSteps.map((step, index) => (
                    <div key={step.step} className="relative">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                          step.completed 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step.completed ? <CheckCircle size={20} /> : step.step}
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-600'}`}>
                              {step.title}
                            </h4>
                            {step.date && (
                              <span className="text-sm text-gray-500">
                                {new Date(step.date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div className={`absolute ml-5 mt-2 w-0.5 h-12 ${
                          step.completed ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles de la commande */}
            {orderDetails.articles && orderDetails.articles.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Articles commandés</h3>
                <div className="space-y-4">
                  {orderDetails.articles.map((article) => (
                    <div key={article.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      {article.product_image && (
                        <img 
                          src={article.product_image} 
                          alt={article.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-grow">
                        <h4 className="font-medium">{article.product_name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          {article.size && <span>Taille: {article.size}</span>}
                          {article.color_fr && <span>Couleur: {article.color_fr}</span>}
                          <span>Quantité: {article.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{article.total_price.toFixed(2)} DHS</p>
                        <p className="text-sm text-gray-600">{article.price.toFixed(2)} DHS × {article.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informations de livraison */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="mr-2" size={20} />
                Adresse de livraison
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{orderDetails.client_name}</p>
                <p className="text-gray-600">{orderDetails.phone}</p>
                <p className="text-gray-600">{orderDetails.address}</p>
                <p className="text-gray-600">{orderDetails.city}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!orderDetails && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-2">Comment trouver votre numéro de commande ?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Consultez l'email de confirmation que vous avez reçu</li>
              <li>• Le numéro commence par "YZ-CMD-" suivi de chiffres</li>
              <li>• Vous pouvez aussi consulter vos commandes dans votre compte</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage; 