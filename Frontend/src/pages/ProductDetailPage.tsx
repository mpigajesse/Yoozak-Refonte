import React, { useState, useEffect } from 'react';
import { Share2, Plus } from 'lucide-react';
import { mockProducts, Product } from '../data/mockData';
import { Link } from '../components/Link';
import { useCart } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    // Récupérer l'ID du produit depuis l'URL
    const productId = window.location.pathname.split('/').pop() || '';
    
    // Dans une application réelle, vous feriez une requête API ici
    // Simuler un chargement asynchrone
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Si aucun ID n'est trouvé ou URL est juste /products/, afficher le premier produit
        setProduct(mockProducts[0]);
      }
      setLoading(false);
    }, 300);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
        <p className="mb-8">Désolé, le produit que vous recherchez n'existe pas.</p>
        <Link href="/products" className="px-6 py-3 bg-black text-white inline-block">
          Retour aux produits
        </Link>
      </div>
    );
  }

  // Générer des images supplémentaires pour la démonstration
  const productImages = [
    product.image,
    "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600"
  ];

  // Simuler des tailles disponibles
  const availableSizes = ['39', '40', '41', '42', '43', '44'];
  
  // Trouver des produits similaires
  const relatedProducts = mockProducts.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize && availableSizes.length > 0) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    if (product) {
      // Créer une copie du produit avec la taille sélectionnée
      const productWithSize = {
        ...product,
        size: selectedSize || undefined
      };
      
      addToCart(productWithSize, 1);
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Bonjour, je souhaite commander le produit ${product.name} (ID: ${product.id}) en taille ${selectedSize || '?'}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+33600000000?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="pb-16">
      {/* Bannière promo en haut */}
      <div className="bg-red-600 text-white py-3 text-center">
        Free delivery from 800 Dhs
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne gauche - Images */}
          <div className="lg:w-1/2">
            <div className="mb-4 overflow-hidden">
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            
            {/* Vignettes des images */}
            <div className="flex space-x-2">
              {productImages.map((img, index) => (
                <button 
                  key={index}
                  className={`border p-1 rounded ${currentImageIndex === index ? 'border-black' : 'border-gray-300'}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={img} 
                    alt={`Vue ${index+1}`}
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Colonne droite - Infos produit */}
          <div className="lg:w-1/2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{`YOOZAK ${product.id.slice(0, 4)} ${product.name}`}</h1>
                <p className="text-gray-600">Chaussure en cuir Demaskable</p>
              </div>
              <button className="p-2" aria-label="Partager">
                <Share2 size={20} />
              </button>
            </div>
            
            {/* Prix */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-xl font-bold text-red-600 mr-2">Dh {product.price.toFixed(2)} MAD</span>
                <span className="text-gray-500 line-through">Dh {(product.price * 1.2).toFixed(2)} MAD</span>
              </div>
            </div>
            
            {/* Sélection de taille */}
            <div className="mb-8">
              <p className="font-medium mb-2">Taille:</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={`w-12 h-12 border flex items-center justify-center ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Bouton Ajouter au panier */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-black text-white font-medium text-center mb-4 hover:bg-black/80"
            >
              Add to cart
            </button>
            
            {/* Commander via WhatsApp */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3 border border-gray-300 flex items-center justify-center gap-2 mb-4"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/767px-WhatsApp.svg.png" 
                alt="WhatsApp" 
                className="w-5 h-5"
              />
              Commandez via WhatsApp
            </button>
            
            <p className="text-sm text-gray-500 text-center">Réponse dans les meilleurs délais</p>
            
            {/* Description */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Description</h3>
                <button>
                  <Plus size={20} />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">
                  {product.description}
                </p>
                <p className="text-gray-600 mt-2">
                  Ces chaussures élégantes sont fabriquées à la main en utilisant les meilleurs cuirs italiens.
                  Elles présentent une finition soignée et sont conçues pour offrir un confort exceptionnel tout au long de la journée.
                  La semelle en cuir et le talon bas offrent un style raffiné qui convient parfaitement pour les occasions formelles et décontractées.
                </p>
                <ul className="list-disc pl-5 mt-4 text-gray-600">
                  <li>Cuir véritable de première qualité</li>
                  <li>Fabrication artisanale</li>
                  <li>Doublure en cuir pour un confort optimal</li>
                  <li>Semelle robuste et flexible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Produits similaires */}
      <section className="mt-16 pb-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Produits similaires</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relProduct => (
              <div key={relProduct.id} className="group">
                <Link href={`/products/${relProduct.id}`} className="block">
                  <div className="mb-3 overflow-hidden rounded-lg">
                    <img 
                      src={relProduct.image} 
                      alt={relProduct.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium">{`YOOZAK ${relProduct.id.slice(0, 4)} ${relProduct.name}`}</h3>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {['40', '41', '42', '43', '44'].map((size, idx) => (
                      <span key={idx} className="inline-block border border-gray-300 px-2 text-sm">
                        {size}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-red-600 font-medium">Dh {relProduct.price.toFixed(2)} MAD</span>
                    {Math.random() > 0.5 && (
                      <span className="text-gray-500 line-through ml-2">
                        Dh {(relProduct.price * 1.2).toFixed(2)} MAD
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage; 