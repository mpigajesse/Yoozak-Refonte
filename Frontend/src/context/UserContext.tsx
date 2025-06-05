import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface Address {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  phone?: string;
  addresses?: Address[];
}

interface UserContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string, password: string, firstName: string, lastName: string }) => Promise<boolean>;
  logout: () => void;
}

// Mock user data
const mockUser: User = {
  id: 'user-123',
  firstName: 'Mohamed',
  lastName: 'Dupont',
  email: 'mohamed.dupont@example.com',
  image: 'https://randomuser.me/api/portraits/men/44.jpg',
  phone: '+212 612 345 678',
  addresses: [
    {
      id: 'addr-1',
      title: 'Domicile',
      firstName: 'Mohamed',
      lastName: 'Dupont',
      address: '123 Avenue Mohammed V',
      city: 'Casablanca',
      postalCode: '20000',
      country: 'Maroc',
      phone: '+212 612 345 678',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Bureau',
      firstName: 'Mohamed',
      lastName: 'Dupont',
      address: '45 Rue des Entreprises',
      address2: 'Étage 3, Bureau 304',
      city: 'Casablanca',
      postalCode: '20100',
      country: 'Maroc',
      phone: '+212 522 987 654',
      isDefault: false
    }
  ]
};

// Création du contexte
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Fonction de connexion (simulée)
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulation d'une vérification d'authentification
    // Dans une vraie application, cela ferait une requête API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simuler une connexion réussie si l'email est correct
        // (dans une vraie app, vérifiez aussi le mot de passe)
        if ((email === mockUser.email && password.length > 0) || email === 'test@example.com') {
          // Utiliser mockUser ou créer un utilisateur basé sur l'email
          const user = email === mockUser.email 
            ? mockUser 
            : {
                id: 'user-test',
                firstName: 'Utilisateur',
                lastName: 'Test',
                email: email,
                image: 'https://randomuser.me/api/portraits/men/22.jpg'
              };
          
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000); // Simuler un délai réseau
    });
  };

  // Fonction d'inscription (simulée)
  const register = async (userData: { email: string, password: string, firstName: string, lastName: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Créer un nouvel utilisateur
        const newUser: User = {
          id: `user-${Date.now()}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          image: 'https://randomuser.me/api/portraits/men/33.jpg' // Image par défaut
        };
        
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve(true);
      }, 1000);
    });
  };

  // Fonction de déconnexion
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Valeurs exposées par le contexte
  const value = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext; 