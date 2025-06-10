import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types/index';
import { getProductImage } from '../utils/productUtils';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            <Link to={`/products/${product.slug}`} className="sm:w-48 h-48 flex-shrink-0 overflow-hidden">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <Link to={`/products/${product.slug}`} className="block mb-2">
                  <h3 className="text-lg font-medium hover:underline">{product.name}</h3>
                </Link>
                <p className="text-gray-600 text-sm mb-3">
                  {(product as any).description || 'Article de qualité premium fabriqué avec soin et attention aux détails.'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                    {product.gender === 'men' ? 'Homme' : 'Femme'}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                    {product.category.name}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl font-bold">{parseFloat(product.price).toFixed(2)} Dhs</span>
                  {product.isSale && product.discount && (
                    <span className="ml-2 line-through text-gray-400 text-sm">
                      {(parseFloat(product.price) / (1 - product.discount / 100)).toFixed(2)} Dhs
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {product.isNew && (
                      <span className="bg-black text-white text-xs px-2 py-1 rounded-full">Nouveau</span>
                    )}
                    {product.isSale && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Promo {product.discount}%
                      </span>
                    )}
                  </div>
                  
                  {/* Bouton Voir détails */}
                  <Link 
                    to={`/products/${product.slug}`} 
                    className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center group/btn"
                  >
                    <span>Voir détails</span>
                    <ArrowRight size={16} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 