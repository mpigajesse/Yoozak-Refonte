import { Product } from '../types';

/**
 * Obtient l'URL de l'image principale d'un produit de manière fiable.
 * 
 * Cette fonction vérifie plusieurs sources possibles pour l'image et renvoie
 * une URL valide ou une image de remplacement par défaut.
 * 
 * @param product - L'objet produit.
 * @returns L'URL de l'image à afficher.
 */
export const getProductImage = (product: Product): string => {
  const placeholder = 'https://via.placeholder.com/400x400.png?text=Image+Indisponible';

  // 1. Vérifier l'image principale depuis l'API
  if (product.main_image?.image) {
    return product.main_image.image;
  }
  
  // 2. Vérifier le champ image calculé
  if (product.image) {
    return product.image;
  }
  
  // 3. Vérifier les images du produit (pour la vue détaillée)
  if (product.images && product.images.length > 0) {
    const mainImage = product.images.find(img => img.is_main) || product.images[0];
    if (mainImage?.image) {
      return mainImage.image;
    }
  }

  // Si aucune image n'est trouvée, renvoyer une image par défaut
  return placeholder;
}; 