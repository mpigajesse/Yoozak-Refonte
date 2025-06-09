import React, { useState, useEffect } from 'react';
import { Heart, Share2, ChevronLeft, ChevronRight, Truck, RefreshCw, ShieldCheck, Star, MessageCircle, ThumbsUp, User, Calendar, ShoppingBag } from 'lucide-react';
import { mockProducts, Product } from '../data/mockData';
import { Link } from '../components/Link';
import { useCart } from '../context/CartContext';
import useReviewContainer, { Review } from '../containers/ReviewContainer';
import { useNavigate } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productId, setProductId] = useState<string>('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Avis fictifs initiaux pour la démonstration
  const initialReviews: Review[] = [
    {
      id: '1',
      userName: 'Amina K.',
      rating: 5,
      date: '15 déc 2024',
      comment: 'Excellente qualité ! Le cuir est vraiment de première qualité et très confortable. Je recommande vivement.',
      title: 'Qualité exceptionnelle',
      size: '39',
      verified: true,
      helpful: 12,
      recommend: true
    },
    {
      id: '2',
      userName: 'Youssef M.',
      rating: 4,
      date: '10 déc 2024',
      comment: 'Très belles chaussures, le design est élégant. Petit bémol sur la taille, je conseille de prendre une taille au-dessus.',
      title: 'Beau design mais attention à la taille',
      size: '42',
      verified: true,
      helpful: 8,
      recommend: true
    },
    {
      id: '3',
      userName: 'Fatima R.',
      rating: 5,
      date: '5 déc 2024',
      comment: 'Parfait ! Livraison rapide et le produit correspond exactement à la description. Très satisfaite de mon achat.',
      title: 'Parfait, je recommande !',
      size: '38',
      verified: true,
      helpful: 15,
      recommend: true
    },
    {
      id: '4',
      userName: 'Omar B.',
      rating: 4,
      date: '2 déc 2024',
      comment: 'Bonne qualité de fabrication, le cuir semble résistant. Un peu rigide au début mais ça s\'assouplit avec le temps.',
      title: 'Bonne qualité, un peu rigide au début',
      size: '44',
      verified: true,
      helpful: 6,
      recommend: true
    },
    {
      id: '5',
      userName: 'Aicha L.',
      rating: 5,
      date: '28 nov 2024',
      comment: 'Je suis très contente de cet achat ! Les chaussures sont magnifiques et très confortables dès le premier port.',
      title: 'Magnifiques et confortables',
      size: '40',
      verified: true,
      helpful: 9,
      recommend: true
    }
  ];

  // Fonction pour extraire l'ID du produit depuis l'URL
  const extractProductIdFromUrl = (): string => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(segment => segment.length > 0);
    
    // Si l'URL est /products/[productId], retourner le productId
    if (segments.length >= 2 && segments[0] === 'products') {
      return segments[1];
    }
    
    // Si l'URL est juste /products ou autre, retourner une chaîne vide
    return '';
  };

  // Fonction pour ajouter un nouvel avis
  const handleReviewAdded = (newReview: Review) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  // Toujours appeler le hook (respect des règles des hooks React)
  const reviewContainer = useReviewContainer({
    productId: product?.id || 'default',
    productName: product?.name || 'Produit',
    availableSizes: ['39', '40', '41', '42', '43', '44', '45'],
    reviews,
    onReviewAdded: handleReviewAdded
  });

  useEffect(() => {
    // Récupérer l'ID du produit depuis l'URL
    const urlProductId = extractProductIdFromUrl();
    setProductId(urlProductId);
    
    // Simuler un chargement asynchrone
    setTimeout(() => {
      let foundProduct: Product | null = null;
      
      if (urlProductId) {
        foundProduct = mockProducts.find(p => p.id === urlProductId) || null;
      }
      
      // Si aucun produit trouvé avec l'ID, utiliser le premier produit par défaut
      if (!foundProduct) {
        foundProduct = mockProducts[0] || null;
      }
      
      setProduct(foundProduct);
      
      // Initialiser les avis
      setReviews(initialReviews);
      setLoading(false);
    }, 300);
  }, []); // Le useEffect ne dépend d'aucune variable, il s'exécute une seule fois

  // Effet pour mettre à jour l'URL si nécessaire (pour le SEO et la navigation)
  useEffect(() => {
    if (product && productId !== product.id) {
      // Mettre à jour l'URL sans recharger la page
      const newUrl = `/products/${product.id}`;
      window.history.replaceState(null, '', newUrl);
      setProductId(product.id);
    }
  }, [product, productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] pt-24">
        <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 pt-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
        <p className="mb-8 text-gray-600">Désolé, le produit que vous recherchez n'existe pas.</p>
        <Link href="/products" className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Retour aux produits
        </Link>
      </div>
    );
  }

  // Images du produit avec quelques variations
  const productImages = [
    product.image,
    "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600"
  ];

  const availableSizes = ['39', '40', '41', '42', '43', '44', '45'];
  
  // Produits similaires
  const relatedProducts = mockProducts.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    if (product) {
      const productWithSize = {
        ...product,
        size: [selectedSize]
      };
      addToCart(productWithSize, 1);
      
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    if (product) {
      const productWithSize = {
        ...product,
        size: [selectedSize]
      };
      addToCart(productWithSize, 1);
      
      // Utiliser le hook navigate de React Router pour la redirection
      navigate('/checkout');
      
      // Log pour déboguer
      console.log('Redirection vers la page de checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} sur Yoozak`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex">
        {[1,2,3,4,5].map((star) => (
          <Star 
            key={star} 
            size={size} 
            className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="pt-24 pb-16 bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-black">Produits</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative group overflow-hidden rounded-2xl bg-gray-100">
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.name}
                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Navigation des images */}
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Boutons d'action */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                    isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-black'
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-3 bg-white/90 hover:bg-white text-black rounded-full shadow-lg transition-all duration-300"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            {/* Vignettes */}
            {productImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button 
                    key={index}
                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      currentImageIndex === index ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={img} 
                      alt={`Vue ${index+1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Informations produit */}
          <div className="space-y-8">
            {/* En-tête */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600">Chaussure premium en cuir véritable</p>
              
              {/* Évaluation */}
              <div className="flex items-center mt-3 space-x-2">
                {renderStars(Math.round(reviewContainer.averageRating))}
                <span className="text-sm text-gray-600">
                  ({reviewContainer.averageRating.toFixed(1)}) • {reviewContainer.totalReviews} avis
                </span>
              </div>
            </div>
            
            {/* Prix */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-black">{product.price.toFixed(2)} DHS</span>
              <span className="text-lg text-gray-500 line-through">{(product.price * 1.3).toFixed(2)} DHS</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                -23%
              </span>
            </div>

            {/* Avantages */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-medium">Livraison rapide</p>
                  <p className="text-sm text-gray-600">3-5 jours ouvrés • 50 DHS</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RefreshCw className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-medium">Retours gratuits</p>
                  <p className="text-sm text-gray-600">14 jours pour changer d'avis</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShieldCheck className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="font-medium">Garantie qualité</p>
                  <p className="text-sm text-gray-600">Cuir véritable certifié</p>
                </div>
              </div>
            </div>
            
            {/* Sélection de taille */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Choisir une taille</h3>
                <button className="text-sm text-gray-600 hover:text-black underline">
                  Guide des tailles
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={`h-12 border-2 rounded-lg flex items-center justify-center font-medium transition-all duration-200 ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white transform scale-105' 
                        : 'border-gray-300 hover:border-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Actions d'achat */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>{selectedSize ? 'Acheter maintenant' : 'Sélectionnez une taille'}</span>
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full py-4 bg-white border-2 border-black text-black font-semibold rounded-xl hover:bg-gray-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
              >
                Ajouter au panier
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Paiement sécurisé • Livraison 
                </p>
              </div>
            </div>
            
            {/* Description */}
            <div className="border-t pt-8">
              <h3 className="font-semibold text-lg mb-4">Description</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ces chaussures élégantes sont fabriquées à la main avec des matériaux de première qualité. 
                  Le cuir italien sélectionné offre une durabilité exceptionnelle et un confort optimal.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium mb-3">Caractéristiques :</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Cuir véritable de première qualité
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Fabrication artisanale soignée
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Doublure confortable et respirante
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      Semelle flexible et résistante
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des avis clients */}
        <section className="mt-20 border-t pt-16">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Avis clients</h2>
              <button 
                onClick={reviewContainer.openReviewForm}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <MessageCircle size={18} />
                <span>Écrire un avis</span>
              </button>
            </div>
            
            {/* Résumé des évaluations */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{reviewContainer.averageRating.toFixed(1)}</div>
                  {renderStars(Math.round(reviewContainer.averageRating), 20)}
                  <p className="text-gray-600 mt-2">Basé sur {reviewContainer.totalReviews} avis</p>
                </div>
                
                <div className="space-y-2">
                  {reviewContainer.ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Liste des avis */}
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{review.userName}</h4>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Achat vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating, 14)}
                        <span className="text-sm text-gray-500">Taille: {review.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {review.date}
                  </div>
                </div>
                
                {review.title && (
                  <h5 className="font-medium mb-2">{review.title}</h5>
                )}
                
                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    <ThumbsUp size={14} />
                    <span>Utile ({review.helpful})</span>
                  </button>
                  {review.recommend && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Recommande ce produit
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Bouton voir plus/moins */}
            {reviews.length > 3 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-black font-medium hover:underline"
                >
                  {showAllReviews ? 'Voir moins d\'avis' : `Voir les ${reviews.length - 3} autres avis`}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Produits similaires */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Vous pourriez aussi aimer</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(relProduct => (
                <Link key={relProduct.id} href={`/products/${relProduct.id}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relProduct.image} 
                        alt={relProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold mb-2 line-clamp-1">{relProduct.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{relProduct.price.toFixed(2)} DHS</span>
                        <span className="text-sm text-gray-500 line-through">
                          {(relProduct.price * 1.3).toFixed(2)} DHS
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Formulaire d'avis - Géré par le container */}
      <reviewContainer.ReviewFormComponent />
    </div>
  );
};

export default ProductDetailPage; 