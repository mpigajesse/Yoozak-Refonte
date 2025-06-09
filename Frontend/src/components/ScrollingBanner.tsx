import React, { useEffect, useRef } from 'react';
import { Tag, Percent, Gift, AlertCircle } from 'lucide-react';

interface ScrollingBannerProps {
  text: string;
  speed?: number;
  backgroundColor?: string;
  textColor?: string;
}

const ScrollingBanner: React.FC<ScrollingBannerProps> = ({
  text,
  speed = 5, // Vitesse de défilement (secondes pour compléter un cycle)
  backgroundColor = '#edf2f7',
  textColor = '#1a202c'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    
    // Calculer combien de fois nous devons dupliquer le contenu pour remplir l'écran
    const containerWidth = container.offsetWidth;
    const contentWidth = content.offsetWidth;
    const duplicatesNeeded = Math.ceil((containerWidth * 3) / contentWidth) + 1;
    
    // Dupliquer les éléments
    const textElement = content.firstElementChild;
    if (textElement) {
      for (let i = 0; i < duplicatesNeeded; i++) {
        const clone = textElement.cloneNode(true);
        content.appendChild(clone);
      }
    }
    
    // Mettre à jour la largeur du contenu après duplication
    const totalContentWidth = content.offsetWidth;
    const singleItemWidth = totalContentWidth / (duplicatesNeeded + 1);
    
    // Appliquer l'animation CSS
    content.style.animationDuration = `${speed}s`;
    content.style.animationName = 'scrolling-banner';
    content.style.animationTimingFunction = 'linear';
    content.style.animationIterationCount = 'infinite';
    
    // Créer la keyframe CSS pour l'animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scrolling-banner {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${singleItemWidth}px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [text, speed]);

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full z-50 overflow-hidden py-1.5 font-medium border-b border-gray-200"
      style={{ backgroundColor }}
    >
      <div 
        ref={contentRef}
        className="inline-block whitespace-nowrap"
        style={{ color: textColor }}
      >
        <div className="mx-12 inline-flex items-center">
          <Tag size={16} className="mr-2" />
          <span>{text}</span>
          <Percent size={16} className="mx-2" />
          <Gift size={16} className="mx-2" />
          <AlertCircle size={16} className="ml-2" />
        </div>
      </div>
    </div>
  );
};

export default ScrollingBanner; 