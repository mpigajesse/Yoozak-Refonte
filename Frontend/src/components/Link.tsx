import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Link: React.FC<LinkProps> = ({ href, children, className = '', onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <RouterLink 
      to={href} 
      onClick={handleClick}
      className={`text-gray-800 hover:text-black font-medium transition-colors ${className}`}
    >
      {children}
    </RouterLink>
  );
};