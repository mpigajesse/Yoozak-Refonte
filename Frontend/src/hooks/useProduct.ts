import { useState, useEffect } from 'react';
import { productService } from '../services';
import { ProductDetail } from '../types';

export const useProduct = (slug: string) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);

    try {
      const [productData, similarData] = await Promise.all([
        productService.getProduct(slug),
        productService.getSimilarProducts(slug).catch(() => []), // Produits similaires optionnels
      ]);
      
      setProduct(productData);
      setSimilarProducts(similarData);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du produit');
      setProduct(null);
      setSimilarProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  return {
    product,
    similarProducts,
    loading,
    error,
    fetchProduct,
    refetch: fetchProduct,
  };
}; 