import React, { useState, useEffect } from 'react';
import { User, Package, Heart, LogOut, Settings, Map, CreditCard, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from '../components/Link';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

// Types pour les données
interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  totalAmount: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

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

// Données fictives pour l'historique des commandes
const mockOrders: Order[] = [
  {
    id: 'ORD-2023-0426',
    date: '26 Avril 2023',
    status: 'delivered',
    totalAmount: 729.98,
    items: [
      {
        id: '2',
        name: 'Elegant Suede Moccasins',
        price: 289.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
      {
        id: '5',
        name: 'Tassel Suede Loafers',
        price: 349.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/12725055/pexels-photo-12725055.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
    ],
  },
  {
    id: 'ORD-2023-0310',
    date: '10 Mars 2023',
    status: 'delivered',
    totalAmount: 389.99,
    items: [
      {
        id: '3',
        name: 'Horsebit Leather Loafers',
        price: 389.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
    ],
  },
  {
    id: 'ORD-2023-0105',
    date: '5 Janvier 2023',
    status: 'delivered',
    totalAmount: 329.99,
    items: [
      {
        id: '1',
        name: 'Classic Penny Loafers',
        price: 329.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/2562992/pexels-photo-2562992.jpeg?auto=compress&cs=tinysrgb&w=1600',
      },
    ],
  },
];

// Données fictives pour la liste de souhaits
const mockWishlist: WishlistItem[] = [
  {
    id: '6',
    name: 'Crystal Buckle Loafers',
    price: 399.99,
    image: 'https://images.pexels.com/photos/15513607/pexels-photo-15513607.jpeg?auto=compress&cs=tinysrgb&w=1600',
    inStock: true,
  },
  {
    id: '10',
    name: 'Pearl-Embellished Loafers',
    price: 419.99,
    image: 'https://images.pexels.com/photos/15513623/pexels-photo-15513623.jpeg?auto=compress&cs=tinysrgb&w=1600',
    inStock: true,
  },
  {
    id: '8',
    name: 'Quilted Leather Moccasins',
    price: 339.99,
    image: 'https://images.pexels.com/photos/14334705/pexels-photo-14334705.jpeg?auto=compress&cs=tinysrgb&w=1600',
    inStock: false,
  },
];

// Données fictives pour les adresses
const mockAddresses: Address[] = [
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
];

// Données fictives pour l'utilisateur
const mockUser = {
  name: 'Mohamed Dupont',
  email: 'mohamed.dupont@example.com',
  image: 'https://randomuser.me/api/portraits/men/44.jpg',
};

const AccountPage: React.FC = () => {
  const { isAuthenticated, currentUser, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses'>('orders');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [userAddresses, setUserAddresses] = useState<Address[]>(mockAddresses);

  // Fonction pour ajouter/modifier une adresse
  const handleSaveAddress = (address: Address) => {
    if (address.id) {
      // Modifier une adresse existante
      setUserAddresses(prevAddresses => 
        prevAddresses.map(addr => addr.id === address.id ? address : addr)
      );
    } else {
      // Ajouter une nouvelle adresse
      const newAddress = {
        ...address,
        id: `addr-${Date.now()}`
      };
      setUserAddresses(prevAddresses => [...prevAddresses, newAddress]);
    }
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  // Fonction pour supprimer une adresse
  const handleDeleteAddress = (addressId: string) => {
    setUserAddresses(prevAddresses => 
      prevAddresses.filter(addr => addr.id !== addressId)
    );
  };

  // Fonction pour définir une adresse par défaut
  const handleSetDefaultAddress = (addressId: string) => {
    setUserAddresses(prevAddresses => 
      prevAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
  };

  // Ouvrir le modal pour modifier une adresse
  const openEditAddressModal = (address: Address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  // Ouvrir le modal pour ajouter une adresse
  const openAddAddressModal = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Si l'utilisateur n'est pas authentifié, ne pas afficher le contenu
  if (!isAuthenticated || !currentUser) {
    return <div className="pt-24 pb-16 text-center">Chargement...</div>;
  }

  // Fonction pour afficher le statut de la commande avec la bonne couleur
  const getStatusDisplay = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm">Livré</span>;
      case 'shipped':
        return <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm">Expédié</span>;
      case 'processing':
        return <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-md text-sm">En traitement</span>;
      case 'cancelled':
        return <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md text-sm">Annulé</span>;
      default:
        return null;
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-8">
                <img 
                  src={currentUser.image || mockUser.image} 
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <h2 className="font-semibold text-lg">{`${currentUser.firstName} ${currentUser.lastName}`}</h2>
                  <p className="text-gray-600 text-sm">{currentUser.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Package size={18} className="mr-3" />
                  <span>Mes commandes</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeTab === 'wishlist' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Heart size={18} className="mr-3" />
                  <span>Ma liste de souhaits</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  <span>Mon profil</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Map size={18} className="mr-3" />
                  <span>Mes adresses</span>
                </button>
     
                
                <Link 
                  href="#"
                  className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <Settings size={18} className="mr-3" />
                  <span>Paramètres</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 text-red-600"
                >
                  <LogOut size={18} className="mr-3" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="md:w-3/4">
            {/* Mes commandes */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>
                
                {mockOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
                    <p className="text-gray-600 mb-6">
                      Vous n'avez pas encore effectué de commande.
                    </p>
                    <Link 
                      href="/products" 
                      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Découvrir nos produits
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className="font-semibold mr-2">Commande #{order.id}</span>
                              {getStatusDisplay(order.status)}
                            </div>
                            <p className="text-gray-600 text-sm">
                              Passée le {order.date}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <p className="font-semibold">{order.totalAmount.toFixed(2)} DHS</p>
                            <Link 
                              href={`/orders/${order.id}`}
                              className="text-sm text-black hover:underline"
                            >
                              Voir les détails
                            </Link>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="ml-4 flex-grow">
                                  <Link 
                                    href={`/products/${item.id}`}
                                    className="font-medium hover:underline"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="text-gray-600 text-sm">
                                    Quantité: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    {(item.price * item.quantity).toFixed(2)} DHS
                                  </p>
                                  <Link 
                                    href={`/products/${item.id}`}
                                    className="text-sm text-black hover:underline"
                                  >
                                    Acheter à nouveau
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Ma liste de souhaits */}
            {activeTab === 'wishlist' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Ma liste de souhaits</h1>
                
                {mockWishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Votre liste de souhaits est vide</h2>
                    <p className="text-gray-600 mb-6">
                      Parcourez notre catalogue et ajoutez des produits à votre liste de souhaits.
                    </p>
                    <Link 
                      href="/products" 
                      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Découvrir nos produits
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockWishlist.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        <div className="relative h-48 bg-gray-100">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <button 
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Retirer de la liste de souhaits"
                          >
                            <Heart size={18} className="text-red-500 fill-current" />
                          </button>
                        </div>
                        
                        <div className="p-4">
                          <Link 
                            href={`/products/${item.id}`}
                            className="font-semibold hover:underline block mb-2"
                          >
                            {item.name}
                          </Link>
                          
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold">{item.price.toFixed(2)} DHS</span>
                            <span className={item.inStock ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                              {item.inStock ? 'En stock' : 'Rupture de stock'}
                            </span>
                          </div>
                          
                          <button 
                            className={`w-full py-2 rounded-lg ${
                              item.inStock 
                                ? 'bg-black text-white hover:bg-gray-800' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            } transition-colors`}
                            disabled={!item.inStock}
                          >
                            {item.inStock ? 'Ajouter au panier' : 'Indisponible'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Mon profil */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Mon profil</h1>
                
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="sm:w-32 h-32 relative">
                      <img 
                        src={currentUser.image || mockUser.image} 
                        alt={`${currentUser.firstName} ${currentUser.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                      <button className="absolute bottom-0 right-0 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold mb-1">{`${currentUser.firstName} ${currentUser.lastName}`}</h2>
                      <p className="text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Informations personnelles</h3>
                    
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                          <input 
                            type="text" 
                            defaultValue={currentUser.firstName} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                          <input 
                            type="text" 
                            defaultValue={currentUser.lastName} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          defaultValue={currentUser.email} 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                        <input 
                          type="tel" 
                          defaultValue={currentUser.phone} 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button 
                          type="submit"
                          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Sécurité</h3>
                    
                    <div className="space-y-4">
                      <button className="text-black hover:underline font-medium">
                        Changer le mot de passe
                      </button>
                      <button className="text-black hover:underline font-medium">
                        Activer l'authentification à deux facteurs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mes adresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Mes adresses</h1>
                  <button 
                    className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={openAddAddressModal}
                  >
                    <Plus size={18} className="mr-2" />
                    Nouvelle adresse
                  </button>
                </div>
                
                {userAddresses.length === 0 ? (
                  <div className="text-center py-8">
                    <Plus size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Aucune adresse</h2>
                    <p className="text-gray-600 mb-6">
                      Vous n'avez pas encore ajouté d'adresse.
                    </p>
                    <button 
                      onClick={openAddAddressModal}
                      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Ajouter une adresse
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userAddresses.map((address) => (
                      <div key={address.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className="font-semibold mr-2">{address.title}</span>
                              {address.isDefault ? (
                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm">Par défaut</span>
                              ) : (
                                <button 
                                  onClick={() => handleSetDefaultAddress(address.id)} 
                                  className="text-blue-600 text-sm hover:underline"
                                >
                                  Définir par défaut
                                </button>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {address.address}, {address.city}, {address.postalCode}, {address.country}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <p className="font-semibold">{address.phone}</p>
                            <div className="flex space-x-2 mt-2">
                              <button 
                                className="flex items-center text-sm text-black hover:underline"
                                onClick={() => openEditAddressModal(address)}
                              >
                                <Edit size={14} className="mr-1" />
                                Modifier
                              </button>
                              <button 
                                className="flex items-center text-sm text-red-600 hover:underline"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Trash2 size={14} className="mr-1" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="space-y-4">
                            {address.address2 && (
                              <p className="text-gray-600">
                                <span className="font-medium">Complément d'adresse:</span> {address.address2}
                              </p>
                            )}
                            <p className="text-gray-600">
                              <span className="font-medium">Téléphone:</span> {address.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal d'ajout/modification d'adresse */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const addressData: Omit<Address, 'id'> = {
                  title: formData.get('title') as string,
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  address: formData.get('address') as string,
                  address2: formData.get('address2') as string || undefined,
                  city: formData.get('city') as string,
                  postalCode: formData.get('postalCode') as string,
                  country: formData.get('country') as string,
                  phone: formData.get('phone') as string || undefined,
                  isDefault: Boolean(formData.get('isDefault')),
                };
                
                if (editingAddress) {
                  handleSaveAddress({ ...addressData, id: editingAddress.id });
                } else {
                  handleSaveAddress({ ...addressData, id: `addr-${Date.now()}` });
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'adresse</label>
                  <input 
                    type="text" 
                    name="title"
                    defaultValue={editingAddress?.title || ''}
                    placeholder="Ex: Domicile, Bureau, etc."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input 
                      type="text" 
                      name="firstName"
                      defaultValue={editingAddress?.firstName || currentUser?.firstName || ''}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input 
                      type="text" 
                      name="lastName"
                      defaultValue={editingAddress?.lastName || currentUser?.lastName || ''}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input 
                    type="text" 
                    name="address"
                    defaultValue={editingAddress?.address || ''}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complément d'adresse (facultatif)</label>
                  <input 
                    type="text" 
                    name="address2"
                    defaultValue={editingAddress?.address2 || ''}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input 
                      type="text" 
                      name="city"
                      defaultValue={editingAddress?.city || ''}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      defaultValue={editingAddress?.postalCode || ''}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <input 
                    type="text" 
                    name="country"
                    defaultValue={editingAddress?.country || 'Maroc'}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (facultatif)</label>
                  <input 
                    type="tel" 
                    name="phone"
                    defaultValue={editingAddress?.phone || currentUser?.phone || ''}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    name="isDefault"
                    defaultChecked={editingAddress?.isDefault || false}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    Définir comme adresse par défaut
                  </label>
                </div>
                
                <div className="pt-4 flex justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddressModal(false);
                      setEditingAddress(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {editingAddress ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage; 