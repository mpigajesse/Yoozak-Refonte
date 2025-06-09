import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface ProductFilters {
  search: string;
  category: string | null;
  types: string[];
  priceRange: [number, number];
  stockOnly: boolean;
  sortOption: string;
}

export const useProductFilters = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // États des filtres
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: null,
    types: [],
    priceRange: [0, 1000],
    stockOnly: false,
    sortOption: 'default'
  });

  // Fonction pour analyser les paramètres URL
  const parseURLParams = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    
    return {
      search: urlParams.get('search') ? decodeURIComponent(urlParams.get('search')!) : '',
      category: urlParams.get('category') || null,
      types: urlParams.get('type') ? [urlParams.get('type')!] : [],
      priceRange: [
        parseInt(urlParams.get('minPrice') || '0'),
        parseInt(urlParams.get('maxPrice') || '1000')
      ] as [number, number],
      stockOnly: urlParams.get('stockOnly') === 'true',
      sortOption: urlParams.get('sort') || 'default'
    };
  }, [location.search]);

  // Fonction pour construire l'URL avec les filtres
  const buildURLWithFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const currentFilters = { ...filters, ...newFilters };
    const params = new URLSearchParams();

    // Ajouter les paramètres non vides
    if (currentFilters.search.trim()) {
      params.set('search', currentFilters.search.trim());
    }
    
    if (currentFilters.category) {
      params.set('category', currentFilters.category);
    }
    
    if (currentFilters.types.length > 0) {
      currentFilters.types.forEach(type => {
        params.append('type', type);
      });
    }
    
    if (currentFilters.priceRange[0] !== 0) {
      params.set('minPrice', currentFilters.priceRange[0].toString());
    }
    
    if (currentFilters.priceRange[1] !== 1000) {
      params.set('maxPrice', currentFilters.priceRange[1].toString());
    }
    
    if (currentFilters.stockOnly) {
      params.set('stockOnly', 'true');
    }
    
    if (currentFilters.sortOption !== 'default') {
      params.set('sort', currentFilters.sortOption);
    }

    return params.toString();
  }, [filters]);

  // Fonction pour naviguer avec les filtres
  const navigateWithFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const queryString = buildURLWithFilters(newFilters);
    const url = queryString ? `/products?${queryString}` : '/products';
    navigate(url);
  }, [navigate, buildURLWithFilters]);

  // Initialiser les filtres depuis l'URL
  useEffect(() => {
    if (location.pathname === '/products') {
      const urlFilters = parseURLParams();
      setFilters(urlFilters);
    }
  }, [location.pathname, location.search, parseURLParams]);

  // Fonction pour mettre à jour un filtre spécifique
  const updateFilter = useCallback(<K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Naviguer immédiatement si on est sur la page produits
    if (location.pathname === '/products') {
      navigateWithFilters({ [key]: value });
    }
  }, [filters, location.pathname, navigateWithFilters]);

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = useCallback(() => {
    const defaultFilters: ProductFilters = {
      search: '',
      category: null,
      types: [],
      priceRange: [0, 1000],
      stockOnly: false,
      sortOption: 'default'
    };
    
    setFilters(defaultFilters);
    
    if (location.pathname === '/products') {
      navigate('/products');
    }
  }, [navigate, location.pathname]);

  // Fonction pour naviguer avec des filtres prédéfinis (depuis la navbar)
  const applyFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    navigateWithFilters(newFilters);
  }, [navigateWithFilters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
    navigateWithFilters,
    isOnProductsPage: location.pathname === '/products'
  };
};

export default useProductFilters; 