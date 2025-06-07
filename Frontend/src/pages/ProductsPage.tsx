import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import ProductList from '../components/ProductList';
import { mockProducts } from '../data/mockData';
import { List, LayoutGrid, Search } from 'lucide-react';
import useProductFilters from '../hooks/useProductFilters';

// Définir les types associés à chaque catégorie - CORRIGÉ
const categoryTypes = {
  men: [
    { id: 'sandale', label: 'Sandales' },
    { id: 'chaussure', label: 'Chaussures' },
    { id: 'espadrille', label: 'Espadrilles' }
  ],
  women: [
    { id: 'sandale', label: 'Sandales' },
    { id: 'mule', label: 'Mules' },
    { id: 'sabot', label: 'Sabots' },
    { id: 'chaussure', label: 'Chaussures' },
    { id: 'espadrille', label: 'Espadrilles' },
    { id: 'escarpin', label: 'Escarpins' },
    { id: 'sac', label: 'Sacs' }
  ]
};

// Fonctions de validation
const isValidCategory = (category: string): category is keyof typeof categoryTypes => {
  return ['men', 'women'].includes(category);
};

const isValidType = (type: string, category: keyof typeof categoryTypes): boolean => {
  return categoryTypes[category]?.some(t => t.id === type) || false;
};

const ProductsPage: React.FC = () => {
  // Utiliser le hook personnalisé pour les filtres
  const { filters, updateFilter, resetFilters } = useProductFilters();
  
  // États locaux pour l'UI
  const [categoryTitle, setCategoryTitle] = useState('Nos Articles');
  const [categoryDescription, setCategoryDescription] = useState('Découvrez notre collection de chaussures de qualité');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // États locaux pour éviter la navigation à chaque changement
  const [localSearchQuery, setLocalSearchQuery] = useState(filters.search);
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

  // Synchroniser les états locaux avec les filtres
  useEffect(() => {
    setLocalSearchQuery(filters.search);
    setLocalPriceRange(filters.priceRange);
  }, [filters.search, filters.priceRange]);

  // Fonction de recherche avancée optimisée
  const performAdvancedSearch = useCallback((products: typeof mockProducts, query: string) => {
    if (!query.trim()) return products;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return products.filter(product => {
      return searchTerms.some(term => {
        return product.name.toLowerCase().includes(term) ||
               product.description.toLowerCase().includes(term) ||
               product.type.toLowerCase().includes(term) ||
               (product.color && product.color.toLowerCase().includes(term)) ||
               (product.category === 'men' && 'homme'.includes(term)) ||
               (product.category === 'women' && 'femme'.includes(term));
      });
    });
  }, []);

  // Fonction de filtrage unifiée - OPTIMISÉE
  const applyAllFilters = useCallback(() => {
    let result = [...mockProducts];
    
    // 1. Filtrer par recherche d'abord (plus efficace)
    if (filters.search.trim()) {
      result = performAdvancedSearch(result, filters.search);
    }
    
    // 2. Filtrer par catégorie
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // 3. Filtrer par types
    if (filters.types.length > 0) {
      result = result.filter(product => filters.types.includes(product.type));
    }
    
    // 4. Filtrer par gamme de prix
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    // 5. Filtrer par stock
    if (filters.stockOnly) {
      result = result.filter(product => product.stock && product.stock > 0);
    }
    
    // 6. Appliquer le tri
    switch (filters.sortOption) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = result.filter(product => product.isNew)
                      .concat(result.filter(product => !product.isNew));
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Tri par défaut : nouveautés puis promos puis le reste
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.isSale && !b.isSale) return -1;
          if (!a.isSale && b.isSale) return 1;
          return 0;
        });
    }
    
    return result;
  }, [filters, performAdvancedSearch]);

  // Produits filtrés avec useMemo pour optimiser les performances
  const filteredProducts = useMemo(() => {
    return applyAllFilters();
  }, [applyAllFilters]);

  // Déterminer les types disponibles en fonction de la catégorie sélectionnée
  const availableTypes = useMemo(() => {
    return filters.category ? categoryTypes[filters.category as keyof typeof categoryTypes] : [];
  }, [filters.category]);

  // Mettre à jour le titre et la description en fonction des filtres - AMÉLIORÉ
  useEffect(() => {
    let title = 'Nos Articles';
    let description = 'Découvrez notre collection de chaussures de qualité';

    // Gestion du titre pour la recherche
    if (filters.search.trim()) {
      title = `Résultats de recherche pour "${filters.search}"`;
      description = 'Découvrez les produits correspondant à votre recherche';
    }
    // Gestion du titre pour les catégories
    else if (filters.category) {
      if (filters.category === 'men') {
        title = 'Collection Homme';
        description = 'Découvrez notre gamme de chaussures pour hommes, alliant style et confort';
      } else if (filters.category === 'women') {
        title = 'Collection Femme';
        description = 'Élégance et raffinement pour notre collection de chaussures pour femmes';
      }

      // Ajouter le type au titre si spécifié
      if (filters.types.length > 0) {
        const typeLabels: Record<string, string> = {
          'sandale': 'Sandales',
          'mule': 'Mules',
          'sabot': 'Sabots',
          'chaussure': 'Chaussures',
          'espadrille': 'Espadrilles',
          'escarpin': 'Escarpins',
          'sac': 'Sacs'
        };

        const firstType = filters.types[0];
        if (typeLabels[firstType]) {
          title += ` - ${typeLabels[firstType]}`;
          description = `Notre collection de ${typeLabels[firstType].toLowerCase()} ${filters.category === 'men' ? 'pour hommes' : 'pour femmes'}`;
        }
      }
    }

    setCategoryTitle(title);
    setCategoryDescription(description);
  }, [filters.search, filters.category, filters.types]);

  // Gestionnaires d'événements optimisés
  const toggleViewMode = useCallback((mode: 'grid' | 'list') => {
    if (viewMode !== mode) {
      setIsTransitioning(true);
      setTimeout(() => {
        setViewMode(mode);
        setIsTransitioning(false);
      }, 300);
    }
  }, [viewMode]);

  // Gestionnaires pour les filtres avec débounce pour certains
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', localSearchQuery);
  }, [localSearchQuery, updateFilter]);

  const handlePriceRangeApply = useCallback(() => {
    updateFilter('priceRange', localPriceRange);
  }, [localPriceRange, updateFilter]);

  // AMÉLIORATION : Permettre de changer de catégorie en gardant les autres filtres compatibles
  const handleCategoryChange = useCallback((category: string) => {
    const validCategory = isValidCategory(category) ? category : null;
    
    if (filters.category === validCategory) {
      // Si on clique sur la même catégorie, on la désélectionne
      updateFilter('category', null);
      updateFilter('types', []);
    } else {
      // Changement de catégorie
      updateFilter('category', validCategory);
      
      // Nettoyer les types qui ne sont pas compatibles avec la nouvelle catégorie
      if (validCategory && filters.types.length > 0) {
        const compatibleTypes = filters.types.filter(type => 
          isValidType(type, validCategory)
        );
        if (compatibleTypes.length !== filters.types.length) {
          updateFilter('types', compatibleTypes);
        }
      } else if (!validCategory) {
        // Si on désélectionne la catégorie, vider les types
        updateFilter('types', []);
      }
    }
  }, [filters.category, filters.types, updateFilter]);

  const handleTypeChange = useCallback((type: string) => {
    const newTypes = filters.types.includes(type) 
      ? filters.types.filter(t => t !== type) 
      : [...filters.types, type];
    updateFilter('types', newTypes);
  }, [filters.types, updateFilter]);

  // Fonction pour changer de catégorie depuis l'interface (boutons radio améliorés)
  const handleCategorySelect = useCallback((category: keyof typeof categoryTypes) => {
    updateFilter('category', category);
    
    // Nettoyer les types incompatibles
    if (filters.types.length > 0) {
      const compatibleTypes = filters.types.filter(type => 
        isValidType(type, category)
      );
      if (compatibleTypes.length !== filters.types.length) {
        updateFilter('types', compatibleTypes);
      }
    }
  }, [filters.types, updateFilter]);

  // Fonction pour supprimer la catégorie
  const handleCategoryClear = useCallback(() => {
    updateFilter('category', null);
    updateFilter('types', []);
  }, [updateFilter]);

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center">{categoryTitle}</h1>
          <p className="text-lg text-gray-500 text-center mt-4 max-w-2xl mx-auto">
            {categoryDescription}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres sur la gauche */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              {/* Barre de recherche */}
              <div className="mb-6">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-black transition-colors"
                  >
                    <Search size={16} />
                  </button>
                </form>
                {localSearchQuery !== filters.search && (
                  <p className="text-xs text-blue-600 mt-1">
                    Appuyez sur Entrée pour rechercher
                  </p>
                )}
              </div>

              {/* Bouton de réinitialisation des filtres */}
              <div className="mb-4">
                <button
                  onClick={resetFilters}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                >
                  Réinitialiser les filtres
                </button>
              </div>

              {/* Filtre de disponibilité */}
              <div>
                <h3 className="text-lg font-medium mb-3">Disponibilité</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="stock-filter"
                    checked={filters.stockOnly}
                    onChange={(e) => updateFilter('stockOnly', e.target.checked)}
                    className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="stock-filter" className="ml-2 text-gray-700">
                    En stock uniquement
                  </label>
                </div>
              </div>

              {/* Filtre de prix */}
              <div>
                <h3 className="text-lg font-medium mb-3">Prix (DHS)</h3>
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="number"
                    value={localPriceRange[0]}
                    onChange={(e) => setLocalPriceRange([Number(e.target.value), localPriceRange[1]])}
                    className="w-24 p-2 border border-gray-300 rounded"
                    min="0"
                    placeholder="Min"
                  />
                  <span className="mx-2">à</span>
                  <input
                    type="number"
                    value={localPriceRange[1]}
                    onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value)])}
                    className="w-24 p-2 border border-gray-300 rounded"
                    min="0"
                    placeholder="Max"
                  />
                </div>
                {(localPriceRange[0] !== filters.priceRange[0] || localPriceRange[1] !== filters.priceRange[1]) && (
                  <button
                    onClick={handlePriceRangeApply}
                    className="w-full mt-2 py-1 px-2 bg-black text-white text-xs rounded hover:bg-gray-800 transition-colors"
                  >
                    Appliquer
                  </button>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Prix entre {filters.priceRange[0]} DHS et {filters.priceRange[1]} DHS
                </div>
              </div>

              {/* Filtre de catégorie AMÉLIORÉ */}
              <div>
                <h3 className="text-lg font-medium mb-3">Catégories</h3>
                <div className="space-y-2">
                  {/* Option pour tous les produits */}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="category-all"
                      checked={!filters.category}
                      onChange={handleCategoryClear}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <label htmlFor="category-all" className="ml-2 text-gray-700">
                      Tous les produits
                    </label>
                  </div>
                  
                  {/* Catégorie Homme */}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="category-men"
                      checked={filters.category === 'men'}
                      onChange={() => handleCategorySelect('men')}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <label htmlFor="category-men" className="ml-2 text-gray-700">
                      Homme
                    </label>
                  </div>
                  
                  {/* Catégorie Femme */}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="category-women"
                      checked={filters.category === 'women'}
                      onChange={() => handleCategorySelect('women')}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <label htmlFor="category-women" className="ml-2 text-gray-700">
                      Femme
                    </label>
                  </div>
                </div>
                
                {/* Indicateur de filtre actif */}
                {filters.category && (
                  <div className="mt-2 p-2 bg-black/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Filtre actif: {filters.category === 'men' ? 'Homme' : 'Femme'}
                      </span>
                      <button
                        onClick={handleCategoryClear}
                        className="text-xs text-red-600 hover:text-red-800 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtre par type - affiché uniquement si une catégorie est sélectionnée */}
              {filters.category && availableTypes.length > 0 && (
                <div className="transition-all duration-300">
                  <h3 className="text-lg font-medium mb-3">Types</h3>
                  <div className="space-y-2">
                    {availableTypes.map(type => (
                      <div key={type.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type.id}`}
                          checked={filters.types.includes(type.id)}
                          onChange={() => handleTypeChange(type.id)}
                          className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label htmlFor={`type-${type.id}`} className="ml-2 text-gray-700">
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Indicateur des types sélectionnés */}
                  {filters.types.length > 0 && (
                    <div className="mt-2 p-2 bg-black/5 rounded-lg">
                      <div className="flex flex-wrap gap-1">
                        {filters.types.map(typeId => {
                          const typeLabel = availableTypes.find(t => t.id === typeId)?.label;
                          return (
                            <span
                              key={typeId}
                              className="inline-flex items-center px-2 py-1 bg-black text-white text-xs rounded"
                            >
                              {typeLabel}
                              <button
                                onClick={() => handleTypeChange(typeId)}
                                className="ml-1 text-xs hover:text-gray-300"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Produits sur la droite */}
          <div className="lg:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center">
                <h2 className="text-xl">
                  {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Tri */}
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">Trier par:</span>
                  <select 
                    value={filters.sortOption} 
                    onChange={(e) => updateFilter('sortOption', e.target.value)}
                    className="p-2 border border-gray-300 rounded bg-white"
                  >
                    <option value="default">Par défaut</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="name_asc">Nom A-Z</option>
                    <option value="newest">Nouveautés</option>
                  </select>
                </div>
                
                {/* Boutons de vue */}
                <div className="flex space-x-2">
                  <button 
                    className={`p-2 border border-gray-300 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleViewMode('list')}
                    aria-label="Vue liste"
                    disabled={isTransitioning}
                  >
                    <List size={20} />
                  </button>
                  <button 
                    className={`p-2 border border-gray-300 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleViewMode('grid')}
                    aria-label="Vue grille"
                    disabled={isTransitioning}
                  >
                    <LayoutGrid size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Affichage des produits */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">Aucun produit ne correspond à vos critères</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className={`bg-white rounded-lg p-4 transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}>
                {viewMode === 'grid' ? (
                  <ProductGrid products={filteredProducts} />
                ) : (
                  <ProductList products={filteredProducts} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;