// Configuration de l'API basée sur l'environnement
const getApiConfig = () => {
  const environment = (import.meta.env.VITE_NODE_ENV || 'development') as 'development' | 'staging' | 'production';
  
  const configs = {
    development: {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
      staticUrl: import.meta.env.VITE_STATIC_URL || 'http://localhost:8000/static',
      mediaUrl: import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000/media',
      timeout: 30000,
      enablePaypal: true,
      enableStripe: true,
      currency: 'MAD',
      currencySymbol: 'DH',
    },
    staging: {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://staging-api.yoozak.com/api',
      staticUrl: import.meta.env.VITE_STATIC_URL || 'https://staging-api.yoozak.com/static',
      mediaUrl: import.meta.env.VITE_MEDIA_URL || 'https://staging-api.yoozak.com/media',
      timeout: 30000,
      enablePaypal: true,
      enableStripe: true,
      currency: 'MAD',
      currencySymbol: 'DH',
    },
    production: {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.yoozak.com/api',
      staticUrl: import.meta.env.VITE_STATIC_URL || 'https://api.yoozak.com/static',
      mediaUrl: import.meta.env.VITE_MEDIA_URL || 'https://api.yoozak.com/media',
      timeout: 30000,
      enablePaypal: true,
      enableStripe: true,
      currency: 'MAD',
      currencySymbol: 'DH',
    },
  };

  return configs[environment];
};

export const API_CONFIG = getApiConfig();

// Endpoints de l'API Django
export const API_ENDPOINTS = {
  // Authentification
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    logout: '/auth/logout/',
    refresh: '/auth/refresh/',
    profile: '/auth/profile/',
    changePassword: '/auth/change-password/',
    resetPassword: '/auth/reset-password/',
    confirmReset: '/auth/confirm-reset-password/',
  },
  
  // Produits
  products: {
    list: '/products/',
    detail: (id: string) => `/products/${id}/`,
    search: '/products/search/',
    categories: '/products/categories/',
    types: '/products/types/',
    colors: '/products/colors/',
    sizes: '/products/sizes/',
    featured: '/products/featured/',
    sale: '/products/sale/',
    new: '/products/new/',
  },
  
  // Avis
  reviews: {
    list: '/reviews/',
    create: '/reviews/',
    detail: (id: string) => `/reviews/${id}/`,
    byProduct: (productId: string) => `/products/${productId}/reviews/`,
  },
  
  // Panier
  cart: {
    get: '/cart/',
    add: '/cart/add/',
    update: '/cart/update/',
    remove: '/cart/remove/',
    clear: '/cart/clear/',
  },
  
  // Commandes
  orders: {
    list: '/orders/',
    create: '/orders/',
    detail: (id: string) => `/orders/${id}/`,
    track: (id: string) => `/orders/${id}/track/`,
    cancel: (id: string) => `/orders/${id}/cancel/`,
  },
  
  // Adresses
  addresses: {
    list: '/addresses/',
    create: '/addresses/',
    detail: (id: string) => `/addresses/${id}/`,
    update: (id: string) => `/addresses/${id}/`,
    delete: (id: string) => `/addresses/${id}/`,
  },
  
  // Paiement
  payment: {
    methods: '/payment/methods/',
    process: '/payment/process/',
    webhook: '/payment/webhook/',
  },
  
  // Blog
  blog: {
    posts: '/blog/posts/',
    detail: (slug: string) => `/blog/posts/${slug}/`,
    categories: '/blog/categories/',
    tags: '/blog/tags/',
    popular: '/blog/popular/',
    recent: '/blog/recent/',
  },
  
  // Contact
  contact: {
    send: '/contact/',
    newsletter: '/newsletter/subscribe/',
  },
  
  // Wishlist
  wishlist: {
    get: '/wishlist/',
    add: '/wishlist/add/',
    remove: '/wishlist/remove/',
  },
  
  // Admin (si nécessaire)
  admin: {
    stats: '/admin/stats/',
    orders: '/admin/orders/',
    products: '/admin/products/',
    users: '/admin/users/',
  },
} as const;

// Types pour les endpoints
export type ApiEndpoint = typeof API_ENDPOINTS;

// Fonction helper pour construire l'URL complète
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.apiBaseUrl}${endpoint}`;
};

// Fonction helper pour construire l'URL des médias
export const buildMediaUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.mediaUrl}/${path}`;
};

// Fonction helper pour construire l'URL des statiques
export const buildStaticUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.staticUrl}/${path}`;
};

// Headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Fonction pour obtenir les headers avec authentification
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  return {
    ...DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Types pour la configuration
export type ApiConfig = {
  apiBaseUrl: string;
  staticUrl: string;
  mediaUrl: string;
  timeout: number;
  enablePaypal: boolean;
  enableStripe: boolean;
  currency: string;
  currencySymbol: string;
}; 