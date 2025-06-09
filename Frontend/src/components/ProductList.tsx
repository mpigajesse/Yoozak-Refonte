import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/mockData';

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
          className="border-b border-gray-200 pb-6"
        >
          <div className="flex flex-col sm:flex-row">
            <Link to={`/products/${product.id}`} className="sm:w-48 h-48 flex-shrink-0 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <Link to={`/products/${product.id}`} className="block mb-1">
                  <h3 className="text-lg font-medium hover:underline">{product.name}</h3>
                </Link>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                    {product.category === 'men' ? 'men' : 'women'}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                    {product.type}
                  </span>
                  {product.color && (
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">{product.color}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <span className="text-xl font-bold">{product.price.toFixed(2)} Dhs</span>
                  {product.isSale && product.discount && (
                    <span className="ml-2 line-through text-gray-400 text-sm">
                      {(product.price / (1 - product.discount / 100)).toFixed(2)} Dhs
                    </span>
                  )}
                </div>
                
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
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 