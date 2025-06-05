import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../data/mockData';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Appliquer tous les filtres
  useEffect(() => {
    let result = [...products];
    
    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par catégorie
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Filtre par type
    if (activeType !== 'all') {
      result = result.filter(product => product.type === activeType);
    }

    // Filtre par notation
    if (selectedRatings.length > 0) {
      result = result.filter(product => 
        product.rating && selectedRatings.includes(Math.floor(product.rating))
      );
    }

    // Filtre par prix
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filtre par stock
    if (inStockOnly) {
      result = result.filter(product => product.stock && product.stock > 0);
    }

    // Tri
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return ((b.rating || 0) - (a.rating || 0));
        case 'newest':
          return b.isNew ? 1 : -1;
        default:
          return 0;
      }
    });
    
    setFilteredProducts(result);
  }, [products, activeCategory, activeType, searchTerm, selectedRatings, priceRange, sortBy, inStockOnly]);

  // Liste des catégories pour les filtres
  const categories = [
    { id: 'men', label: 'Homme' },
    { id: 'women', label: 'Femme' }
  ];

  // Liste des types de chaussures pour les filtres
  const shoeTypes = [
    { id: 'sandale', label: 'Sandales' },
    { id: 'mule', label: 'Mules' },
    { id: 'sabot', label: 'Sabots' }
  ];

  // Options de tri
  const sortOptions = [
    { value: 'featured', label: 'En vedette' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating-desc', label: 'Meilleures notes' },
    { value: 'newest', label: 'Nouveautés' }
  ];

  // Filtres de notation
  const ratings = [
    { value: 5, label: '★★★★★' },
    { value: 4, label: '★★★★☆ et plus' },
    { value: 3, label: '★★★☆☆ et plus' },
    { value: 2, label: '★★☆☆☆ et plus' },
    { value: 1, label: '★☆☆☆☆ et plus' }
  ];

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev => {
      if (prev.includes(rating)) {
        return prev.filter(r => r !== rating);
      }
      return [...prev, rating];
    });
  };

  const clearAllFilters = () => {
    setActiveCategory('all');
    setActiveType('all');
    setSearchTerm('');
    setSelectedRatings([]);
    setPriceRange([0, 1000]);
    setSortBy('featured');
    setInStockOnly(false);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
        
        {/* Barre supérieure avec recherche, tri et toggle filtres */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-grow md:flex-grow-0">
            {/* Recherche */}
            <div className="relative flex-grow md:w-80 md:flex-grow-0">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Toggle filtres mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2 rounded-lg border border-gray-200 hover:border-black transition-colors"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="p-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters */}
          <div className={`w-full md:w-1/4 md:pr-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-20 space-y-6">
              {/* En-tête des filtres */}
              <div className="flex items-center justify-between md:hidden mb-4">
                <h3 className="text-lg font-semibold">Filtres</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X size={24} />
                </button>
              </div>

              {/* Disponibilité */}
              <div>
                <h3 className="text-lg font-medium mb-3">Disponibilité</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span>En stock uniquement</span>
                </label>
              </div>

              {/* Prix */}
              <div>
                <h3 className="text-lg font-medium mb-3">Prix</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    min="0"
                    className="w-24 p-2 rounded border border-gray-200"
                  />
                  <span>à</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    min="0"
                    className="w-24 p-2 rounded border border-gray-200"
                  />
                </div>
              </div>
              
              {/* Catégories */}
              <div>
                <h3 className="text-lg font-medium mb-3">Catégories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category"
                        checked={activeCategory === category.id}
                        onChange={() => setActiveCategory(activeCategory === category.id ? 'all' : category.id)}
                        className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                      />
                      <span>{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Types */}
              <div>
                <h3 className="text-lg font-medium mb-3">Types</h3>
                <div className="space-y-2">
                  {shoeTypes.map(type => (
                    <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio"
                        name="type"
                        checked={activeType === type.id}
                        onChange={() => setActiveType(activeType === type.id ? 'all' : type.id)}
                        className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <h3 className="text-lg font-medium mb-3">Notes</h3>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedRatings.includes(rating.value)}
                        onChange={() => handleRatingChange(rating.value)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-yellow-400">{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bouton réinitialiser */}
              <button
                onClick={clearAllFilters}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="w-full md:w-3/4">
            {/* Résumé des filtres actifs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {activeCategory !== 'all' && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                    {categories.find(c => c.id === activeCategory)?.label}
                    <button onClick={() => setActiveCategory('all')}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {activeType !== 'all' && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                    {shoeTypes.find(t => t.id === activeType)?.label}
                    <button onClick={() => setActiveType('all')}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {selectedRatings.map(rating => (
                  <span key={rating} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                    {rating}+ étoiles
                    <button onClick={() => handleRatingChange(rating)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {inStockOnly && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                    En stock
                    <button onClick={() => setInStockOnly(false)}>
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <p className="text-gray-600 mb-4">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-500 mb-4">Aucun produit ne correspond à vos critères.</p>
                <button 
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;