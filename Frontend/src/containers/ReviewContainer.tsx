import  { useState } from 'react';
import ReviewForm from '../components/ReviewForm';

// Interface pour les données d'avis
interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  name: string;
  email: string;
  size: string;
  recommend: boolean;
}

// Interface pour un avis complet
export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  title: string;
  size: string;
  verified: boolean;
  helpful: number;
  recommend: boolean;
}

interface ReviewContainerProps {
  productId: string;
  productName: string;
  availableSizes: string[];
  reviews: Review[];
  onReviewAdded: (newReview: Review) => void;
}

const useReviewContainer = ({
  productId,
  productName,
  availableSizes,
  reviews,
  onReviewAdded
}: ReviewContainerProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour soumettre un nouvel avis
  const handleSubmitReview = async (reviewData: ReviewFormData): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Créer le nouvel avis
      const newReview: Review = {
        id: `review-${Date.now()}`,
        userName: reviewData.name,
        rating: reviewData.rating,
        date: new Date().toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }),
        comment: reviewData.comment,
        title: reviewData.title,
        size: reviewData.size,
        verified: true, // Supposons que tous les nouveaux avis sont vérifiés
        helpful: 0,
        recommend: reviewData.recommend
      };
      
      // Ajouter l'avis à la liste
      onReviewAdded(newReview);
      
      // Fermer le formulaire
      setIsFormOpen(false);
      
      // Afficher un message de succès
      alert('Merci ! Votre avis a été publié avec succès.');
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'avis:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour ouvrir le formulaire
  const openReviewForm = () => {
    setIsFormOpen(true);
  };

  // Fonction pour fermer le formulaire
  const closeReviewForm = () => {
    if (!isSubmitting) {
      setIsFormOpen(false);
    }
  };

  // Calculer les statistiques des avis
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  // Composant du formulaire
  const ReviewFormComponent = () => (
    <ReviewForm
      productId={productId}
      productName={productName}
      availableSizes={availableSizes}
      isOpen={isFormOpen}
      onClose={closeReviewForm}
      onSubmit={handleSubmitReview}
    />
  );

  return {
    // État du formulaire
    isFormOpen,
    isSubmitting,
    
    // Fonctions
    openReviewForm,
    closeReviewForm,
    handleSubmitReview,
    
    // Statistiques
    averageRating,
    ratingDistribution,
    totalReviews: reviews.length,
    
    // Composant du formulaire
    ReviewFormComponent
  };
};

export default useReviewContainer; 