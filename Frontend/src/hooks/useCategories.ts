import { useState, useEffect } from 'react';
import { categoryService } from '../services';
import { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nestedCategories, setNestedCategories] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesData, nestedData] = await Promise.all([
        categoryService.getCategories(),
        categoryService.getNestedCategories(),
      ]);
      
      setCategories(categoriesData);
      setNestedCategories(nestedData);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des catégories');
      setCategories([]);
      setNestedCategories(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    nestedCategories,
    loading,
    error,
    fetchCategories,
    refetch: fetchCategories,
  };
}; 