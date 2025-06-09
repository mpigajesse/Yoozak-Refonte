import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useUser();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Si l'utilisateur est déjà connecté, rediriger vers la page du compte
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/account');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (isLogin) {
        // Tentative de connexion
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Email ou mot de passe incorrect');
        }
      } else {
        // Vérifier que les mots de passe correspondent
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }
        
        // Tentative d'inscription
        success = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
        
        if (!success) {
          setError('Erreur lors de l\'inscription');
        }
      }
      
      if (success) {
        // Rediriger vers la page du compte en cas de succès
        navigate('/account');
      }
    } catch (err) {
      setError('Une erreur est survenue');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="pb-16 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h2>
          
          {/* Tabs */}
          <div className="flex mb-8 border-b">
            <button
              className={`flex-1 py-2 font-medium ${isLogin ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
              onClick={() => setIsLogin(true)}
            >
              Connexion
            </button>
            <button
              className={`flex-1 py-2 font-medium ${!isLogin ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
              onClick={() => setIsLogin(false)}
            >
              Inscription
            </button>
          </div>
          
          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champs de nom et prénom (uniquement pour l'inscription) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
              </div>
            )}
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            
            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            
            {/* Confirmation du mot de passe (uniquement pour l'inscription) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
            )}
            
            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span>Chargement...</span>
              ) : (
                <span>{isLogin ? 'Se connecter' : 'S\'inscrire'}</span>
              )}
            </button>
          </form>
          
          {/* Lien de récupération de mot de passe (uniquement pour la connexion) */}
          {isLogin && (
            <p className="text-center mt-4">
              <a href="#" className="text-sm text-gray-600 hover:text-black">
                Mot de passe oublié?
              </a>
            </p>
          )}
          
          {/* Compte de test pour faciliter les démonstrations */}
          {isLogin && (
            <div className="mt-6 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-1">Compte de démonstration :</p>
              <p className="text-sm"><strong>Email:</strong> test@example.com</p>
              <p className="text-sm"><strong>Mot de passe:</strong> password (n'importe quel mot de passe fonctionnera)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 