import api from './api';

export interface CartItem {
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderData {
  client_name: string;
  phone: string;
  address: string;
  city: string;
  region?: string;
  articles: Array<{
    product: number;
    quantity: number;
    size?: string;
    color_fr?: string;
    color_ar?: string;
    price: number;
  }>;
  client_data?: ShippingInfo;
  source: string;
  notes?: string;
}

export interface Order {
  yoozak_id: number;
  order_number: string;
  client_name: string;
  phone: string;
  address: string;
  city: string;
  price: number;
  creation_date: string;
  status: string;
  status_display: string;
  payment_status: string;
  delivery_status: string;
  articles: Array<{
    id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
    size: string;
    color_fr: string;
    total_price: number;
  }>;
  client_info?: {
    id: number;
    full_name: string;
    email: string;
    is_guest: boolean;
  };
}

export interface TrackingStep {
  step: number;
  title: string;
  description: string;
  date?: string;
  completed: boolean;
}

class OrderService {
  /**
   * Valider les articles du panier avant de passer commande
   */
  async validateCart(cartItems: CartItem[]) {
    try {
      const response = await api.post('/orders/api/validate-cart/', {
        cart_items: cartItems
      }) as any;
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la validation du panier:', error);
      throw error;
    }
  }

  /**
   * Récupérer les informations de livraison pour un utilisateur connecté
   */
  async getShippingInfo() {
    try {
      const response = await api.get('/orders/api/shipping-info/') as any;
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des infos de livraison:', error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle commande
   */
  async createOrder(orderData: OrderData) {
    try {
      const response = await api.post('/orders/api/create/', orderData) as any;
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  }

  /**
   * Récupérer les détails d'une commande
   */
  async getOrderDetails(orderNumber: string) {
    try {
      const response = await api.get(`/orders/api/${orderNumber}/`) as any;
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la commande:', error);
      throw error;
    }
  }

  /**
   * Suivre une commande
   */
  async trackOrder(orderNumber: string) {
    try {
      const response = await api.get(`/orders/api/track/${orderNumber}/`) as any;
      return response.data;
    } catch (error) {
      console.error('Erreur lors du suivi de la commande:', error);
      throw error;
    }
  }

  /**
   * Convertir les articles du panier au format API
   */
  convertCartItemsToOrderArticles(cartItems: any[], shippingCost: number = 50) {
    return cartItems.map(item => ({
      product: item.product.id,
      quantity: item.quantity,
      size: item.size || '',
      color_fr: item.color || '',
      color_ar: '', // À ajouter si nécessaire
      price: parseFloat(item.product.price)
    }));
  }

  /**
   * Préparer les données de commande pour l'API
   */
  prepareOrderData(
    shippingInfo: ShippingInfo,
    cartItems: any[]
  ): OrderData {
    const articles = this.convertCartItemsToOrderArticles(cartItems);
    
    const orderData: OrderData = {
      client_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      city: shippingInfo.city,
      region: '', // À ajouter si nécessaire
      articles: articles,
      source: 'website',
      notes: ''
    };

    // Ajouter les données client si nécessaire
    if (shippingInfo) {
      orderData.client_data = shippingInfo;
    }

    return orderData;
  }

  /**
   * Calculer le total de la commande
   */
  calculateOrderTotal(cartItems: any[], shippingCost: number = 50) {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);
    
    return {
      subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost
    };
  }
}

export const orderService = new OrderService(); 