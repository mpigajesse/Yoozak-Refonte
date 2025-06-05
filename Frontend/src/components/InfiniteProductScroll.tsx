import React, { useRef, useEffect, useState } from 'react';
import { Product } from '../data/mockData';

interface InfiniteProductScrollProps {
  products: Product[];
  className?: string;
  speed?: number; // in seconds
  direction?: 'left' | 'right'; // Add direction prop
}

const InfiniteProductScroll: React.FC<InfiniteProductScrollProps> = ({
  products,
  className = '',
  speed = 60,
  direction = 'left' // Default to left scrolling
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerScrollerRef = useRef<HTMLDivElement>(null);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Duplicate products to create a seamless loop
    // We need at least enough products to fill the container twice
    const repeatCount = Math.max(3, Math.ceil(1000 / products.length));
    let duplicatedProducts: Product[] = [];
    
    for (let i = 0; i < repeatCount; i++) {
      duplicatedProducts = [...duplicatedProducts, ...products];
    }
    
    setDisplayProducts(duplicatedProducts);
  }, [products]);

  useEffect(() => {
    if (!scrollerRef.current || !innerScrollerRef.current || displayProducts.length === 0) {
      return;
    }
    
    const scrollerWidth = innerScrollerRef.current.scrollWidth;
    const viewWidth = scrollerRef.current.offsetWidth;
    
    // Only animate if we have enough products to scroll
    if (scrollerWidth <= viewWidth) {
      return;
    }
    
    // Calculate animation duration based on content width and desired speed
    const animationDuration = (scrollerWidth / viewWidth) * speed;
    
    // Create and apply animation with direction support
    const keyframes = `
      @keyframes scroll {
        0% { transform: translateX(${direction === 'right' ? '-' : ''}0); }
        100% { transform: translateX(${direction === 'right' ? '0' : '-'}${scrollerWidth / 2}px); }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    
    innerScrollerRef.current.style.animation = `scroll ${animationDuration}s linear infinite`;
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [displayProducts, speed, direction]);

  return (
    <div 
      className={`overflow-hidden relative ${className}`}
      ref={scrollerRef}
    >
      <div 
        ref={innerScrollerRef} 
        className="flex items-center whitespace-nowrap"
      >
        {displayProducts.map((product, index) => {
          return (
            <div 
              key={`${product.id}-${index}`} 
              className="flex-shrink-0 w-72 p-4"
            >
              <div className="rounded-lg shadow-md overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 relative overflow-hidden rounded-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-110 shadow-inner"
                    style={{
                      filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))'
                    }}
                  />
                  
                  {/* Overlay gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Price label */}
                  <div className="absolute bottom-3 right-3 bg-black px-3 py-1 rounded-full text-white text-sm font-medium shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                    {product.price.toFixed(2)} Dhs
                  </div>
                </div>
                
                {/* Product name and type - directly under the image without box */}
                <div className="pt-2 px-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-base truncate">{product.name}</h3>
                    <span className="text-xs text-gray-500">{product.type}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfiniteProductScroll; 