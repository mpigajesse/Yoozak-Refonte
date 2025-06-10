import { useState, useEffect } from 'react';
import { productService } from '../services';
import { Product, ProductFilters, PaginatedResponse } from '../types';

export const useProducts = (initialFilters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    count: 0,
    next: null,
    previous: null,
  });

  const fetchProducts = async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<Product> = await productService.getProducts(filters);
      setProducts(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(initialFilters);
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    refetch: () => fetchProducts(initialFilters),
  };
}; 