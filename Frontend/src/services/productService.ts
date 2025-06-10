import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Product, ProductDetail, ProductFilters, PaginatedResponse } from '../types/index';

export class ProductService {
  // Récupérer tous les produits avec filtres et pagination
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = this.buildFilterParams(filters);
    const response = await apiService.get<PaginatedResponse<Product>>(API_ENDPOINTS.products.list, params);
    
    // Traiter les produits pour ajouter des champs calculés
    response.results = response.results.map(product => this.processProduct(product));
    
    return response;
  }

  // Récupérer un produit par slug
  async getProduct(slug: string): Promise<ProductDetail> {
    const product = await apiService.get<ProductDetail>(API_ENDPOINTS.products.detail(slug));
    return this.processDetailProduct(product);
  }

  // Récupérer les produits similaires
  async getSimilarProducts(slug: string): Promise<ProductDetail[]> {
    const products = await apiService.get<ProductDetail[]>(API_ENDPOINTS.products.similar(slug));
    return products.map(product => this.processDetailProduct(product));
  }

  // Traiter un produit détaillé
  private processDetailProduct(product: ProductDetail): ProductDetail {
    // Récupérer l'URL de l'image principale
    let imageUrl = '';
    const mainImage = product.images?.find(img => img.is_main) || product.images?.[0];
    if (mainImage && mainImage.image) {
      imageUrl = mainImage.image; // L'URL est déjà complète du backend
    }

    // Calculer les champs dérivés
    const priceNum = parseFloat(product.price);
    const oldPriceNum = product.old_price ? parseFloat(product.old_price) : null;
    const discount = oldPriceNum ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100) : 0;

    return {
      ...product,
      image: imageUrl,
      isSale: !!product.old_price,
      discount,
      isNew: false,
      rating: 4.5,
      reviewsCount: 0,
    };
  }

  // Récupérer les produits en vedette
  async getFeaturedProducts(): Promise<PaginatedResponse<Product>> {
    const params = { is_featured: true };
    const response = await apiService.get<PaginatedResponse<Product>>(API_ENDPOINTS.products.list, params);
    
    response.results = response.results.map(product => this.processProduct(product));
    return response;
  }

  // Traiter un produit pour ajouter des champs calculés
  private processProduct(product: Product): Product {
    // Récupérer l'URL de l'image principale
    let imageUrl = '';
    if (product.main_image && product.main_image.image) {
      imageUrl = product.main_image.image; // L'URL est déjà complète du backend
  }

    // Calculer les champs dérivés
    const priceNum = parseFloat(product.price);
    const oldPriceNum = product.old_price ? parseFloat(product.old_price) : null;
    const discount = oldPriceNum ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100) : 0;

    return {
      ...product,
      image: imageUrl,
      isSale: !!product.old_price,
      discount,
      isNew: false, // TODO: calculer selon la date de création
      rating: 4.5, // TODO: implémenter les vraies notes
      reviewsCount: 0, // TODO: implémenter les vrais avis
    };
  }

  // Construire les paramètres de filtre pour l'API Django
  private buildFilterParams(filters?: ProductFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    if (filters.category__slug) params.category__slug = filters.category__slug;
    if (filters.gender) params.gender = filters.gender;
    if (filters.is_featured !== undefined) params.is_featured = filters.is_featured;
    if (filters.search) params.search = filters.search;
    if (filters.ordering) params.ordering = filters.ordering;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.page_size = filters.limit;

    return params;
  }
}

// Instance singleton du service produit
export const productService = new ProductService();

// Export par défaut
export default productService; 