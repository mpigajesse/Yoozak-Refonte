import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Product, ProductFilters, PaginatedResponse } from '../types/index';

export class ProductService {
  // Récupérer tous les produits avec filtres et pagination
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = this.buildFilterParams(filters);
    return apiService.get<PaginatedResponse<Product>>(API_ENDPOINTS.products.list, params);
  }

  // Récupérer un produit par ID
  async getProduct(id: string): Promise<Product> {
    return apiService.get<Product>(API_ENDPOINTS.products.detail(id));
  }

  // Rechercher des produits
  async searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = {
      q: query,
      ...this.buildFilterParams(filters),
    };
    return apiService.get<PaginatedResponse<Product>>(API_ENDPOINTS.products.search, params);
  }

  // Récupérer les produits en vedette
  async getFeaturedProducts(): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.products.featured);
  }

  // Récupérer les produits en solde
  async getSaleProducts(): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.products.sale);
  }

  // Récupérer les nouveaux produits
  async getNewProducts(): Promise<Product[]> {
    return apiService.get<Product[]>(API_ENDPOINTS.products.new);
  }

  // Récupérer les catégories disponibles
  async getCategories(): Promise<string[]> {
    return apiService.get<string[]>(API_ENDPOINTS.products.categories);
  }

  // Récupérer les types disponibles
  async getTypes(): Promise<string[]> {
    return apiService.get<string[]>(API_ENDPOINTS.products.types);
  }

  // Récupérer les couleurs disponibles
  async getColors(): Promise<string[]> {
    return apiService.get<string[]>(API_ENDPOINTS.products.colors);
  }

  // Récupérer les tailles disponibles
  async getSizes(): Promise<string[]> {
    return apiService.get<string[]>(API_ENDPOINTS.products.sizes);
  }

  // Construire les paramètres de filtre pour l'API
  private buildFilterParams(filters?: ProductFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    if (filters.category) params.category = filters.category;
    if (filters.type?.length) params.type = filters.type.join(',');
    if (filters.colors?.length) params.colors = filters.colors.join(',');
    if (filters.sizes?.length) params.sizes = filters.sizes.join(',');
    if (filters.priceRange) {
      params.price_min = filters.priceRange[0];
      params.price_max = filters.priceRange[1];
    }
    if (filters.inStock !== undefined) params.in_stock = filters.inStock;
    if (filters.onSale !== undefined) params.on_sale = filters.onSale;
    if (filters.sortBy) params.ordering = this.mapSortToOrdering(filters.sortBy);
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.page_size = filters.limit;

    return params;
  }

  // Mapper les options de tri frontend vers les paramètres Django
  private mapSortToOrdering(sortBy: string): string {
    const sortMap: Record<string, string> = {
      'price_asc': 'price',
      'price_desc': '-price',
      'name_asc': 'name',
      'name_desc': '-name',
      'newest': '-created_at',
      'rating': '-rating',
    };

    return sortMap[sortBy] || '-created_at';
  }
}

// Instance singleton du service produit
export const productService = new ProductService();

// Export par défaut
export default productService; 