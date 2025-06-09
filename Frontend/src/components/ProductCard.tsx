import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, StarHalf } from 'lucide-react';
import { Product } from '../data/mockData';
import { useCart } from '../context/CartContext';
import '../styles/transitions.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = React.useState(false);

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-star-${i}`}
          size={16}
          className="text-gray-300"
        />
      );
    }

    return stars;
  };
  
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden">
        <div className="relative h-full w-full">
          <img 
            src={product.image} 
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNew && (
              <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white shadow-md">
                Nouveau
              </span>
            )}
            {product.isSale && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white shadow-md">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="rounded-full bg-white p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-50"
        >
          <Heart
            size={20}
            className={`transition-colors duration-200 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link 
          to={`/products/${product.id}`}
          className="group/title"
        >
          <h3 className="mb-1 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover/title:text-black">
            {product.name}
          </h3>
          <p className="mb-2 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </Link>
          
        {/* Prix et notation */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {product.price.toFixed(2)} DHS
              </span>
              {product.isSale && (
                <span className="text-sm text-gray-500 line-through">
                  {(product.price * (1 + product.discount! / 100)).toFixed(2)} DHS
                </span>
              )}
            </div>
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {renderRatingStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviews})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stock et catégorie */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500 capitalize">
            {product.category}
          </span>
          {product.stock !== undefined && (
            <span className={`text-sm font-medium ${
              product.stock > 10 
                ? 'text-green-600' 
                : product.stock > 0 
                  ? 'text-orange-500' 
                  : 'text-red-500'
            }`}>
              {product.stock > 10 
                ? 'En stock' 
                : product.stock > 0 
                  ? `Plus que ${product.stock} en stock`
                  : 'Rupture de stock'}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {/* Tailles disponibles */}
          <div className="flex flex-wrap gap-1">
            {product.size?.slice(0, 3).map((size) => (
              <span 
                key={size}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
              >
                {size}
              </span>
            ))}
            {product.size && product.size.length > 3 && (
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                +{product.size.length - 3}
              </span>
            )}
          </div>
          
          {/* Bouton panier */}
          <button 
            onClick={() => addToCart(product)}
            disabled={!product.stock}
            className={`rounded-full p-2 text-white shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
              product.stock 
                ? 'bg-black hover:bg-gray-800' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            aria-label="Ajouter au panier"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;