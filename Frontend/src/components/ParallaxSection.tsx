import React, { useEffect, useRef } from 'react';

interface ParallaxSectionProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  reverse?: boolean;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  imageUrl, 
  title, 
  subtitle, 
  reverse = false 
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !imageRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = 50 * (0.5 - scrollProgress);
        
        imageRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`relative py-16 sm:py-20 lg:py-32 overflow-hidden ${
        reverse ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } items-center gap-8 lg:gap-16`}>
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl lg:max-w-none mx-auto">
              {subtitle}
            </p>
            <div className="pt-4">
              <button className="w-full sm:w-auto px-8 py-3 bg-black text-white font-medium rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 hover:shadow-lg">
                En savoir plus
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-lg overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
              <div 
                ref={imageRef}
                className="absolute inset-0 w-full h-full bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
                style={{ 
                  backgroundImage: `url(${imageUrl})`,
                  willChange: 'transform'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 ${
          reverse ? 'bg-gradient-to-br from-gray-50 to-white/80' : 'bg-gradient-to-bl from-white to-gray-50/80'
        }`}></div>
      </div>
    </section>
  );
};

export default ParallaxSection;