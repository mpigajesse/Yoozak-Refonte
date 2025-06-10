// ============================================================================
// TYPES CORE
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isStaff?: boolean;
  dateJoined: string;
  lastLogin?: string;
}

// Interface pour les images de produits (correspond au modèle Django ProductImage)
export interface ProductImage {
  id: number;
  image: string; // URL complète de l'image
  alt_text?: string;
  is_main: boolean;
  order: number;
}

// Interface pour les catégories (correspond au modèle Django Category)
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: string;
}

// Interface pour les produits - Liste (ProductListSerializer)
export interface Product {
  id: number;
  name: string;
  slug: string;
  reference: string;
  category: Category;
  gender: 'men' | 'women' | 'unisex';
  price: string; // Decimal field from Django
  old_price?: string;
  main_image?: ProductImage; // Image principale pour la liste
  images?: ProductImage[]; // Toutes les images du produit
  is_active: boolean;
  is_featured: boolean;
  stock_status: string;
  
  // Champs calculés pour compatibilité avec l'UI existante
  image?: string; // URL de l'image principale
  rating?: number;
  reviewsCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
}

// Interface pour les produits détaillés (ProductDetailSerializer)
export interface ProductDetail extends Omit<Product, 'main_image'> {
  description?: string;
  images: ProductImage[];
  available_sizes: string[];
  colors: string[];
  material?: string;
  meta_title?: string;
  meta_description?: string;
  stock?: any;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  totalPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  currency: string;
  currencySymbol: string;
}

export interface Order {
  id: string;
  user: User;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  currency: string;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Review {
  id: string;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  product: string; // Product ID
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TYPES AUTHENTIFICATION
// ============================================================================

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ResetPasswordCredentials {
  email: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
}

// ============================================================================
// TYPES API
// ============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ProductFilters {
  category__slug?: string;
  gender?: 'men' | 'women' | 'unisex';
  is_featured?: boolean;
  search?: string;
  ordering?: 'name' | '-name' | 'price' | '-price' | 'created_at' | '-created_at';
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ============================================================================
// TYPES CONFIGURATION
// ============================================================================

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    endpoints: {
      auth: {
        login: string;
        register: string;
        logout: string;
        refresh: string;
        profile: string;
        resetPassword: string;
        changePassword: string;
      };
      products: {
        list: string;
        detail: string;
        search: string;
        featured: string;
        categories: string;
      };
      cart: {
        get: string;
        add: string;
        update: string;
        remove: string;
        clear: string;
      };
      orders: {
        list: string;
        create: string;
        detail: string;
        track: string;
      };
      reviews: {
        list: string;
        create: string;
        update: string;
        delete: string;
      };
      blog: {
        posts: string;
        post: string;
        categories: string;
      };
    };
  };
  media: {
    baseUrl: string;
    staticUrl: string;
  };
  payment: {
    enablePaypal: boolean;
    enableStripe: boolean;
    currency: string;
    currencySymbol: string;
  };
}

// ============================================================================
// TYPES FORMULAIRES
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface CheckoutFormData {
  shippingAddress: Address;
  billingAddress?: Address;
  useSameAddress: boolean;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  saveAddress: boolean;
  newsletter: boolean;
}

// ============================================================================
// TYPES STORE (ZUSTAND)
// ============================================================================

export interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity: number, options?: { size?: string; color?: string }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface ProductStore {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  searchQuery: string;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  fetchProducts: (filters?: ProductFilters, page?: number) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  searchProducts: (query: string, filters?: SearchFilters) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
}

// ============================================================================
// TYPES UTILITAIRES
// ============================================================================

export type Currency = 'MAD';
export type CurrencySymbol = 'DH';
export type PaymentMethod = 'stripe' | 'paypal' | 'cod';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ProductCategory = 'men' | 'women';
export type ProductType = 'sandale' | 'mule' | 'sabot' | 'chaussure' | 'espadrille' | 'escarpin' | 'sac';
export type SortOrder = 'asc' | 'desc';

// ============================================================================
// TYPES EVENTS
// ============================================================================

export interface CartEvent {
  type: 'add' | 'update' | 'remove' | 'clear';
  itemId?: string;
  productId?: string;
  quantity?: number;
}

export interface AuthEvent {
  type: 'login' | 'logout' | 'register' | 'refresh';
  user?: User;
}

// ============================================================================
// EXPORTS PAR DÉFAUT
// ============================================================================

export default AppConfig; 