import React from 'react';

const showcaseProducts = [
  {
    name: 'Chaussures rouges (Haut)',
    imageUrl: '/assets/images/Cercle/Chauss_2.png',
    shape: 'rounded-lg ',
    size: 'w-44 h-40'
  },
  {
    name: 'Chaussures vertes (Gauche)',
    imageUrl: '/assets/images/Cercle/Chauss_3.png',
    shape: 'rounded-lg',
    size: 'w-44 h-40'
  },
  {
    name: 'Chaussures bleues (Droite)',
    imageUrl: '/assets/images/Cercle/Chauss_femme.png',
    shape: 'rounded-lg',
    size: 'w-44 h-40'
  },
  {
    name: 'Chaussures grises (Centre)',
    imageUrl: '/assets/images/Cercle/Passion.png',
    shape: 'rounded-full',
    size: 'w-48 h-48'
  },
  {
    name: 'Chaussures marron (Bas)',
    imageUrl: '/assets/images/Cercle/Chauss_5.png',
    shape: 'rounded-lg ',
    size: 'w-44 h-40'
  }
];

// Style pour l'animation de rotation
const rotateStyle: React.CSSProperties = {
  animation: 'rotate-slow 30s linear infinite',
};

// Style pour chaque position des images en rotation
const positionStyles = {
  top: { top: '0', left: '50%', transform: 'translateX(-50%) translateY(-70%)' },
  left: { top: '50%', left: '0', transform: 'translateX(-70%) translateY(-50%)' },
  right: { top: '50%', right: '0', transform: 'translateX(70%) translateY(-50%)' },
  bottom: { bottom: '0', left: '50%', transform: 'translateX(-50%) translateY(70%)' },
};

const PassionShowcase: React.FC = () => {
  // Définir les keyframes pour l'animation de rotation
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes rotate-slow {
        from {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="bg-gray-100 py-20 overflow-hidden relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 relative">
        
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left side - Text content */}
          <div className="col-span-6 text-left pr-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800 mb-8">
              Sur nos Chaussures
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed max-w-xl">
            Chez Yoozak, nous comprenons l’importance d’avoir des chaussures de qualité pour votre bien-être et votre style de vie. 
            C’est pourquoi nous nous efforçons de vous offrir des produits exceptionnels, avec une attention méticuleuse aux détails.
            </p>
            <a 
              href="/products" 
              className="inline-block px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Voir tous les produits
            </a>
          </div>

          {/* Right side - Rotating images */}
          <div className="col-span-6 relative h-[600px]">
            
            {/* Centre - Image circulaire fixe */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform duration-300">
              <img 
                src={showcaseProducts[3].imageUrl} 
                alt={showcaseProducts[3].name}
                className={`${showcaseProducts[3].size} ${showcaseProducts[3].shape} object-cover shadow-lg`}
              />
            </div>
            
            {/* Rotating container */}
            <div 
              className="absolute top-1/2 left-1/2 w-[450px] h-[450px]" 
              style={rotateStyle}
            >
              {/* Haut - Chaussures rouges */}
              <div className="absolute hover:scale-110 transition-transform duration-300" style={positionStyles.top}>
                <img 
                  src={showcaseProducts[0].imageUrl} 
                  alt={showcaseProducts[0].name}
                  className={`${showcaseProducts[0].size} ${showcaseProducts[0].shape} object-cover shadow-lg`}
                />
              </div>
              
              {/* Gauche - Chaussures vertes */}
              <div className="absolute hover:scale-110 transition-transform duration-300" style={positionStyles.left}>
                <img 
                  src={showcaseProducts[1].imageUrl} 
                  alt={showcaseProducts[1].name}
                  className={`${showcaseProducts[1].size} ${showcaseProducts[1].shape} object-cover shadow-lg`}
                />
              </div>
              
              {/* Droite - Chaussures bleues */}
              <div className="absolute hover:scale-110 transition-transform duration-300" style={positionStyles.right}>
                <img 
                  src={showcaseProducts[2].imageUrl} 
                  alt={showcaseProducts[2].name}
                  className={`${showcaseProducts[2].size} ${showcaseProducts[2].shape} object-cover shadow-lg`}
                />
              </div>
              
              {/* Bas - Chaussures marron */}
              <div className="absolute hover:scale-110 transition-transform duration-300" style={positionStyles.bottom}>
                <img 
                  src={showcaseProducts[4].imageUrl} 
                  alt={showcaseProducts[4].name}
                  className={`${showcaseProducts[4].size} ${showcaseProducts[4].shape} object-cover shadow-lg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassionShowcase; 