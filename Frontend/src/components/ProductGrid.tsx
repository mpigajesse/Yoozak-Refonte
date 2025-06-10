import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types/index';
import { getProductImage } from '../utils/productUtils';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="product-card group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
          <Link to={`/products/${product.slug}`} className="block relative">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Badges */}
              {product.isNew && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">Nouveau</div>
              )}
              
              {product.isSale && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {product.discount ? `-${product.discount}%` : 'Promo'}
                </div>
              )}
            </div>
          </Link>
            
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs text-gray-500">{product.gender === 'men' ? 'Homme' : 'Femme'}</span>
              <span className="text-xs text-gray-500">{product.category.name}</span>
            </div>
            
            <Link to={`/products/${product.slug}`}>
              <h3 className="font-medium text-lg mb-1 hover:underline">{product.name}</h3>
            </Link>
            
            <div className="flex items-center justify-between mt-2 mb-4">
              <div className="flex items-center">
                <span className="font-bold text-lg">{parseFloat(product.price).toFixed(2)} Dhs</span>
                
                {product.isSale && product.discount && (
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    {(parseFloat(product.price) / (1 - product.discount / 100)).toFixed(2)} Dhs
                  </span>
                )}
              </div>
              
              {product.rating && (
                <div className="flex items-center">
                  <div className="text-yellow-400 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(product.rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  {product.reviewsCount && (
                    <span className="text-xs text-gray-500 ml-1">({product.reviewsCount})</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Bouton Voir détails */}
            <Link 
              to={`/products/${product.slug}`} 
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center group/btn"
            >
              <span>Voir détails</span>
              <ArrowRight size={16} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;