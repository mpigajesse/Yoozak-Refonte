import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/mockData';

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
        <div key={product.id} className="product-card group">
          <Link to={`/products/${product.id}`} className="block relative">
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Badges */}
              {product.isNew && (
                <div className="new-badge">Nouveau</div>
              )}
              
              {product.isSale && (
                <div className="promo-badge">
                  {product.discount ? `-${product.discount}%` : 'Promo'}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-xs text-gray-500">{product.category === 'men' ? 'men' : 'women'}</span>
                <span className="text-xs text-gray-500">{product.type}</span>
                {product.color && <span className="text-xs text-gray-500">{product.color}</span>}
              </div>
              
              <h3 className="font-medium text-lg mb-1 group-hover:underline">{product.name}</h3>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <span className="font-bold text-lg">{product.price.toFixed(2)} Dhs</span>
                  
                  {product.isSale && product.discount && (
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      {(product.price / (1 - product.discount / 100)).toFixed(2)} Dhs
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
                    {product.reviews && (
                      <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;