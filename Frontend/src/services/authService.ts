import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '../types/index';

export class AuthService {
  // Connexion utilisateur
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    
    // Stocker les tokens automatiquement
    if (response.access && response.refresh) {
      apiService.setAuthTokens(response.access, response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Inscription utilisateur
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      credentials
    );
    
    // Stocker les tokens automatiquement après inscription
    if (response.access && response.refresh) {
      apiService.setAuthTokens(response.access, response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Déconnexion utilisateur
  async logout(): Promise<void> {
    try {
      const refreshToken = apiService.getRefreshToken();
      if (refreshToken) {
        await apiService.post(API_ENDPOINTS.auth.logout, {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      // Ignorer les erreurs de déconnexion côté serveur
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer les données locales dans tous les cas
      apiService.logout();
      localStorage.removeItem('user');
    }
  }

  // Rafraîchir le token d'accès
  async refreshToken(): Promise<string> {
    const refreshToken = apiService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Aucun token de rafraîchissement disponible');
    }

    const response = await apiService.post<{ access: string }>(
      API_ENDPOINTS.auth.refresh,
      { refresh: refreshToken }
    );

    // Mettre à jour le token d'accès
    localStorage.setItem('access_token', response.access);
    return response.access;
  }

  // Récupérer le profil utilisateur
  async getProfile(): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.auth.profile);
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(userData: Partial<User>): Promise<User> {
    const updatedUser = await apiService.patch<User>(
      API_ENDPOINTS.auth.profile,
      userData
    );
    
    // Mettre à jour les données locales
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  // Changer le mot de passe
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    return apiService.post(API_ENDPOINTS.auth.changePassword, {
      current_password: data.currentPassword,
      new_password: data.newPassword,
    });
  }

  // Demander une réinitialisation de mot de passe
  async requestPasswordReset(email: string): Promise<void> {
    return apiService.post(API_ENDPOINTS.auth.resetPassword, { email });
  }

  // Confirmer la réinitialisation de mot de passe
  async confirmPasswordReset(data: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    return apiService.post(API_ENDPOINTS.auth.confirmReset, {
      token: data.token,
      new_password: data.newPassword,
    });
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return apiService.isAuthenticated() && !!this.getCurrentUser();
  }

  // Récupérer l'utilisateur actuel depuis le localStorage
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erreur lors du parsing de l\'utilisateur:', error);
      localStorage.removeItem('user');
      return null;
    }
  }

  // Vérifier si l'utilisateur est admin/staff
  isStaff(): boolean {
    const user = this.getCurrentUser();
    return user?.isStaff || false;
  }

  // Obtenir le token d'accès actuel
  getAccessToken(): string | null {
    return apiService.getAccessToken();
  }

  // Vérifier la validité du token (appel API simple)
  async verifyToken(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Instance singleton du service d'authentification
export const authService = new AuthService();

// Export par défaut
export default authService; 