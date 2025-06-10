import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Category } from '../types/index';

export class CategoryService {
  // Récupérer toutes les catégories actives
  async getCategories(): Promise<Category[]> {
    return apiService.get<Category[]>(API_ENDPOINTS.categories.list);
  }

  // Récupérer les catégories organisées par structure imbriquée
  async getNestedCategories(): Promise<any> {
    return apiService.get<any>(API_ENDPOINTS.categories.nested);
  }
}

// Instance singleton du service catégorie
export const categoryService = new CategoryService();

// Export par défaut
export default categoryService; 