import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../data/mockData';
import { ArrowRight, ShoppingBag, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/transitions.css';

interface FloatingProductsGridProps {
  products: Product[];
}

const FloatingProductsGrid: React.FC<FloatingProductsGridProps> = ({ products }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  useEffect(() => {
    if (!gridRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return; // Désactiver l'effet sur mobile et tablette
      
      const { clientX, clientY } = e;
      const items = gridRef.current?.querySelectorAll('.product-item');
      
      items?.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemX = rect.left + rect.width / 2;
        const itemY = rect.top + rect.height / 2;
        
        const distanceX = clientX - itemX;
        const distanceY = clientY - itemY;
        
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxDistance = 400;
        const intensity = Math.max(0, 1 - distance / maxDistance);
        
        const moveX = distanceX * 0.02 * intensity;
        const moveY = distanceY * 0.02 * intensity;
        const scale = 1 + 0.02 * intensity;
        
        (item as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
        (item as HTMLElement).style.zIndex = Math.floor(intensity * 10).toString();
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const renderRating = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
            className={`${
              index < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Produits vedettes
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Découvrez notre sélection de produits les plus populaires, choisis pour leur qualité exceptionnelle et leur design élégant.
          </p>
        </div>
        
        <div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className="product-item group relative bg-white rounded-xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 ease-out"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link to={`/products/${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                        Nouveau
                      </span>
                    )}
                    {product.isSale && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Link 
                      to={`/products/${product.id}`}
                      className="block text-lg sm:text-xl font-semibold mb-1 group-hover:text-gray-900 transition-colors hover:underline"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2.5 py-1 bg-gray-100 rounded-full text-gray-700">
                        {product.category}
                      </span>
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          {renderRating(product.rating)}
                          <span className="text-sm text-gray-500">
                            ({product.reviews || 0})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {product.isSale ? (
                      <div className="flex flex-col items-end">
                        <span className="text-lg sm:text-xl font-medium text-red-500">
                          ${(product.price * (1 - product.discount! / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg sm:text-xl font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Stock info */}
                {product.stock !== undefined && (
                  <div className="mb-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          product.stock > 5 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(100, (product.stock / 10) * 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.stock > 5 
                        ? 'En stock' 
                        : `Plus que ${product.stock} en stock`}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Link 
                    to={`/products/${product.id}`}
                    className="flex items-center text-black font-medium text-sm sm:text-base hover:underline transition-all group/link"
                  >
                    <span>Voir détails</span>
                    <ArrowRight 
                      size={16} 
                      className="ml-1 transform group-hover/link:translate-x-1 transition-transform" 
                    />
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLike(product.id)}
                      className="p-2 rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-50"
                    >
                      <Heart
                        size={18}
                        className={`transition-colors duration-200 ${
                          likedProducts.has(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                      aria-label="Ajouter au panier"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Effet de survol */}
              <div 
                className={`absolute inset-0 bg-black/5 pointer-events-none transition-opacity duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingProductsGrid; 