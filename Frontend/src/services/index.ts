// Services principaux
export { default as apiService } from './api';
export { default as authService } from './authService';
export { default as productService } from './productService';
export { default as categoryService } from './categoryService';

// Exports nommés pour une utilisation directe
export { apiService as api } from './api';
export { authService as auth } from './authService';
export { productService as products } from './productService';
export { categoryService as categories } from './categoryService';

// Services additionnels (à créer selon les besoins)
// export { default as cartService } from './cartService';
// export { default as orderService } from './orderService';
// export { default as blogService } from './blogService';
// export { default as reviewService } from './reviewService'; 