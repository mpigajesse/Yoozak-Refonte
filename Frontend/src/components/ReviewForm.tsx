import React, { useState } from 'react';
import { Star, X, Send, User, AlertCircle } from 'lucide-react';

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  name: string;
  email: string;
  size: string;
  recommend: boolean;
}

interface ReviewFormProps {
  productId: string;
  productName: string;
  availableSizes: string[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewFormData) => Promise<boolean>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  productId, 
  productName, 
  availableSizes, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    comment: '',
    name: '',
    email: '',
    size: '',
    recommend: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});
  const [hoverRating, setHoverRating] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};

    if (formData.rating === 0) {
      newErrors.rating = 0;
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.comment.trim() || formData.comment.length < 10) {
      newErrors.comment = 'Le commentaire doit contenir au moins 10 caractères';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email valide requis';
    }
    if (!formData.size) {
      newErrors.size = 'Veuillez sélectionner une taille';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        // Réinitialiser le formulaire
        setFormData({
          rating: 0,
          title: '',
          comment: '',
          name: '',
          email: '',
          size: '',
          recommend: true
        });
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    setErrors(prev => ({ ...prev, rating: undefined }));
  };

  const handleInputChange = (field: keyof ReviewFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Écrire un avis</h2>
            <p className="text-gray-600 mt-1">Partagez votre expérience avec "{productName}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Note générale *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    size={32}
                    className={`transition-colors duration-200 ${
                      star <= (hoverRating || formData.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {formData.rating === 0 ? 'Cliquez pour noter' : 
                 formData.rating === 1 ? 'Très déçu' :
                 formData.rating === 2 ? 'Déçu' :
                 formData.rating === 3 ? 'Correct' :
                 formData.rating === 4 ? 'Bien' : 'Excellent'}
              </span>
            </div>
            {errors.rating !== undefined && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Veuillez donner une note
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de votre avis *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Résumez votre expérience en quelques mots"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.title}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">{formData.title.length}/100 caractères</p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre commentaire *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none ${
                errors.comment ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Décrivez votre expérience avec ce produit (qualité, confort, taille, etc.)"
              maxLength={500}
            />
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.comment}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">{formData.comment.length}/500 caractères</p>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille achetée *
            </label>
            <select
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.size ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez votre taille</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  Taille {size}
                </option>
              ))}
            </select>
            {errors.size && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.size}
              </p>
            )}
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre nom *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre prénom"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">Votre email ne sera pas publié</p>
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.recommend}
                onChange={(e) => handleInputChange('recommend', e.target.checked)}
                className="w-5 h-5 text-black focus:ring-black border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Je recommande ce produit à d'autres clients
              </span>
            </label>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              En soumettant cet avis, vous acceptez que vos informations soient utilisées pour améliorer notre service. 
              Votre email ne sera pas publié et sera uniquement utilisé pour vérifier votre achat.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Publier l'avis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm; 