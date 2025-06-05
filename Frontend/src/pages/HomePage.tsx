import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ParallaxSection from '../components/ParallaxSection';
import Testimonials from '../components/Testimonials';
import InfiniteProductScroll from '../components/InfiniteProductScroll';
import AnimatedFeatures from '../components/AnimatedFeatures';
import DiscoverMore from '../components/DiscoverMore';
import FloatingProductsGrid from '../components/FloatingProductsGrid';
import { mockProducts } from '../data/mockData';

const HomePage: React.FC = () => {
  const topProducts = mockProducts.slice(0, 3);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Hero />
      
      {/* Collections Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Nos collections
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre collection de produits de luxe fabriqués à la main par nos artisans expérimentés.
            </p>
          </div>
        </div>
        
        {/* Défilement infini des produits */}
        <div className="mb-12 sm:mb-16">
          <InfiniteProductScroll 
            products={mockProducts} 
            speed={30}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <a 
              href="/products" 
              className="w-full sm:w-auto px-8 py-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors duration-300 text-center sm:min-w-[200px]"
            >
              Voir tous les produits
            </a>
          </div>
        </div>
      </section>
      
      {/* First Parallax Section */}
      <ParallaxSection 
        imageUrl="https://images.pexels.com/photos/1456733/pexels-photo-1456733.jpeg?auto=compress&cs=tinysrgb&w=1600"
        title="Crafted with Passion"
        subtitle="Each pair of Yoozak loafers is handcrafted by skilled artisans using traditional techniques and the finest Italian leather."
      />
      
      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingProductsGrid products={topProducts} />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <AnimatedFeatures />
      </section>
      
      {/* Discover More Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <DiscoverMore />
      </section>
      
      {/* Second Parallax Section */}
      <ParallaxSection 
        imageUrl="https://images.pexels.com/photos/6540927/pexels-photo-6540927.jpeg?auto=compress&cs=tinysrgb&w=1600"
        title="Élégance intemporelle"
        subtitle="Nos chaussures allient sophistication classique et confort moderne, créant des chaussures qui résistent à l'épreuve du temps."
        reverse={true}
      />
      
      {/* Trending Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Tendances du moment
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Les styles les plus populaires de notre collection actuelle.
            </p>
          </div>
        </div>
        
        <div className="mb-12 sm:mb-16">
          <InfiniteProductScroll 
            products={mockProducts.slice().reverse()} 
            speed={40}
            direction="right"
          />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <Testimonials />
      </section>
    </div>
  );
};

export default HomePage;