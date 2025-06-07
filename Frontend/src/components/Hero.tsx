import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollPosition = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      }
      
      if (textRef.current) {
        const scrollPosition = window.scrollY;
        textRef.current.style.transform = `translateY(${scrollPosition * -0.2}px)`;
        textRef.current.style.opacity = `${1 - scrollPosition * 0.002}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-[calc(100vh-80px)] sm:h-screen overflow-hidden">
      {/* Parallax Background */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/images/Photo_background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '120%',
          top: '-10%'
        }}
      />
      
      {/* Overlay avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10"></div>
      
      {/* Content */}
      <div 
        ref={textRef} 
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            Quand Marcher Devient un plaisir 
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Découvrez notre collection de chaussures de qualité
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 text-base sm:text-lg">
              Acheter notre Collection 
            </button>
            <button 
              onClick={() => {
                document.getElementById('discover-more')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all transform hover:scale-105 text-base sm:text-lg"
            >
              Découvrir plus
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Hero;