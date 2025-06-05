import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingBag, Search, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProducts, Product } from '../data/mockData';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState<string | null>(null);
  const [showHommeMenu, setShowHommeMenu] = useState(false);
  const [showFemmeMenu, setShowFemmeMenu] = useState(false);
  
  const hommeMenuRef = useRef<HTMLDivElement>(null);
  const femmeMenuRef = useRef<HTMLDivElement>(null);
  const { toggleCart, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fermer les menus quand on clique ailleurs
    const handleClickOutside = (event: MouseEvent) => {
      if (hommeMenuRef.current && !hommeMenuRef.current.contains(event.target as Node)) {
        setShowHommeMenu(false);
      }
      if (femmeMenuRef.current && !femmeMenuRef.current.contains(event.target as Node)) {
        setShowFemmeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setShowSearchResults(false);
    }
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
  };

  const toggleMobileSubMenu = (category: string) => {
    if (activeMobileSubMenu === category) {
      setActiveMobileSubMenu(null);
    } else {
      setActiveMobileSubMenu(category);
    }
  };

  return (
    <nav 
      className={`fixed left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled 
          ? 'bg-white/80 shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
      style={{ top: '36px' }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo avec animation au hover */}
          <Link 
            to="/" 
            className="text-2xl font-bold relative group"
          >
            <span className="relative z-10">YOOZAK</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Desktop Menu avec animations améliorées */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="relative group">
              <span>Accueil</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {/* Menu Homme avec animation améliorée */}
            <div className="relative group" ref={hommeMenuRef}>
              <button 
                className="flex items-center space-x-1 focus:outline-none relative"
                onClick={() => {
                  setShowHommeMenu(!showHommeMenu);
                  setShowFemmeMenu(false);
                }}
              >
                <span>Homme</span>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform duration-300 ${showHommeMenu ? 'rotate-180' : ''}`} 
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {/* Dropdown du menu Homme avec animation */}
              <div 
                className={`absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-md shadow-lg rounded-lg py-2 z-50 transition-all duration-300 transform origin-top
                  ${showHommeMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <Link 
                  to="/products?category=men&type=sandale" 
                  className="block px-4 py-2 hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Sandales
                </Link>
              </div>
            </div>
            
            {/* Menu Femme avec animation améliorée */}
            <div className="relative group" ref={femmeMenuRef}>
              <button 
                className="flex items-center space-x-1 focus:outline-none relative"
                onClick={() => {
                  setShowFemmeMenu(!showFemmeMenu);
                  setShowHommeMenu(false);
                }}
              >
                <span>Femme</span>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform duration-300 ${showFemmeMenu ? 'rotate-180' : ''}`} 
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {/* Dropdown du menu Femme avec animation */}
              <div 
                className={`absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-md shadow-lg rounded-lg py-2 z-50 transition-all duration-300 transform origin-top
                  ${showFemmeMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                {['Mules', 'Sabots', 'Chaussures', 'Sandales', 'Sacs'].map((item) => (
                  <Link 
                    key={item}
                    to={`/products?category=women&type=${item.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-black hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link to="/products" className="relative group">
              <span>Notre Boutique</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="relative group">
              <span>A propos de nous</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Icons avec animations améliorées */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="p-2 pr-10 rounded-full bg-gray-100/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 text-sm w-40 transition-all duration-300 focus:w-60"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:scale-110 transition-transform duration-200">
                  <Search size={18} />
                </button>
              </form>
              
              {/* Search Results Dropdown avec animation */}
              {showSearchResults && (
                <div className="absolute mt-2 right-0 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto animate-fadeIn">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{searchResults.length} Results</h3>
                      <button onClick={closeSearchResults} className="p-1">
                        <X size={16} />
                      </button>
                    </div>
                    
                    {searchResults.length > 0 ? (
                      <div className="space-y-4">
                        {searchResults.map(product => (
                          <Link 
                            to={`/products/${product.id}`} 
                            key={product.id}
                            onClick={closeSearchResults}
                            className="flex items-center hover:bg-gray-50 p-2 rounded-lg"
                          >
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md mr-3"
                            />
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No products found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              to="/auth" 
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
            >
              <User size={20} />
            </Link>
            
            <div className="relative group">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 relative"
                onClick={toggleCart}
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>
              <div className="absolute top-10 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <Link 
                  to="/cart" 
                  className="bg-white/95 backdrop-blur-md shadow-md py-2 px-4 rounded text-sm whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Voir le panier
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button avec animation */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu avec animation */}
      <div 
        className={`md:hidden fixed inset-0 bg-white shadow-lg z-40 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '80px' }}
      >
        <div className="container mx-auto px-4 py-4 h-[calc(100vh-80px)] overflow-y-auto bg-white">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full p-3 pl-12 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 text-base"
              />
              <Search size={20} className="absolute left-4 text-gray-400" />
              <button 
                type="submit" 
                className="absolute right-3 bg-black text-white px-4 py-1.5 rounded-lg text-sm hover:bg-gray-800 transition-colors"
              >
                Rechercher
              </button>
            </div>
          </form>
          
          {/* Mobile Search Results */}
          {showSearchResults && (
            <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">{searchResults.length} Résultats</h3>
                <button 
                  onClick={closeSearchResults}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {searchResults.map(product => (
                    <Link 
                      to={`/products/${product.id}`} 
                      key={product.id}
                      onClick={() => {
                        closeSearchResults();
                        setIsOpen(false);
                      }}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h4 className="font-medium text-base">{product.name}</h4>
                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Aucun produit trouvé</p>
              )}
            </div>
          )}
          
          {/* Mobile Navigation Links */}
          <div className="flex flex-col divide-y divide-gray-100">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="py-4 text-lg hover:pl-2 transition-all duration-200"
            >
              Accueil
            </Link>
            
            {/* Homme mobile */}
            <div className="py-4">
              <button 
                className="flex items-center justify-between w-full text-lg group"
                onClick={() => toggleMobileSubMenu('homme')}
              >
                <span className="group-hover:pl-2 transition-all duration-200">Homme</span>
                <ChevronDown 
                  size={20} 
                  className={`transform transition-transform duration-300 ${
                    activeMobileSubMenu === 'homme' ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <div className={`mt-2 space-y-1 transition-all duration-300 ${
                activeMobileSubMenu === 'homme' ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'
              }`}>
                <Link 
                  to="/products?category=men&type=sandale" 
                  className="block py-3 pl-6 hover:pl-8 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Sandales
                </Link>
              </div>
            </div>
            
            {/* Femme mobile */}
            <div className="py-4">
              <button 
                className="flex items-center justify-between w-full text-lg group"
                onClick={() => toggleMobileSubMenu('femme')}
              >
                <span className="group-hover:pl-2 transition-all duration-200">Femme</span>
                <ChevronDown 
                  size={20} 
                  className={`transform transition-transform duration-300 ${
                    activeMobileSubMenu === 'femme' ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <div className={`mt-2 space-y-1 transition-all duration-300 ${
                activeMobileSubMenu === 'femme' ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'
              }`}>
                {['Mules', 'Sabots', 'Chaussures', 'Sandales', 'Sacs'].map((item) => (
                  <Link 
                    key={item}
                    to={`/products?category=women&type=${item.toLowerCase()}`}
                    className="block py-3 pl-6 hover:pl-8 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link 
              to="/products" 
              onClick={() => setIsOpen(false)}
              className="py-4 text-lg hover:pl-2 transition-all duration-200"
            >
              Notre Boutique
            </Link>
            
            <Link 
              to="/about" 
              onClick={() => setIsOpen(false)}
              className="py-4 text-lg hover:pl-2 transition-all duration-200"
            >
              À propos de nous
            </Link>
            
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="py-4 text-lg hover:pl-2 transition-all duration-200"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Footer Actions */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/auth" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <User size={20} />
                <span>Mon Compte</span>
              </Link>
              
              <button 
                onClick={() => {
                  toggleCart();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 bg-white border border-black py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors relative"
              >
                <ShoppingBag size={20} />
                <span>Mon Panier</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;