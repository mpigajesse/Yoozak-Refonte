export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women'; // Seulement hommes et femmes
  type: 'sandale' | 'mule' | 'sabot' | 'chaussure' | 'espadrille' | 'escarpin' | 'sac'; // Types réels utilisés
  price: number;
  image: string;
  description: string;
  color?: string; // Couleur optionnelle
  size?: string[];  // Taille optionnelle
  stock?: number;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Sandales Cuir Élégantes',
    category: 'men',
    type: 'sandale',
    price: 1899,
    image: 'https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sandales en cuir véritable pour homme, idéales pour l\'été avec une semelle confortable et durable.',
    color: 'Marron',
    size: ['40', '41', '42', '43', '44', '45'],
    stock: 15,
    rating: 4.5,
    reviews: 128,
    isNew: true
  },
  {
    id: '2',
    name: 'Sandales Bohème',
    category: 'women',
    type: 'sandale',
    price: 1599,
    image: 'https://images.pexels.com/photos/1447262/pexels-photo-1447262.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sandales bohèmes légères et confortables avec détails tressés et finitions artisanales.',
    color: 'Beige',
    size: ['36', '37', '38', '39', '40'],
    stock: 20,
    rating: 4.8,
    reviews: 95,
    isSale: true,
    discount: 20
  },
  {
    id: '3',
    name: 'Sandales Outdoor',
    category: 'men',
    type: 'sandale',
    price: 2199,
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sandales outdoor robustes, parfaites pour la randonnée et les activités en plein air.',
    color: 'Noir',
    size: ['41', '42', '43', '44', '45'],
    stock: 8,
    rating: 4.6,
    reviews: 75
  },
  {
    id: '4',
    name: 'Sandales à Lanières',
    category: 'women',
    type: 'sandale',
    price: 1699,
    image: 'https://images.pexels.com/photos/1447262/pexels-photo-1447262.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Élégantes sandales à lanières croisées, parfaites pour les soirées d\'été.',
    color: 'Camel',
    size: ['36', '37', '38', '39'],
    stock: 12,
    rating: 4.7,
    reviews: 63,
    isNew: true
  },
  {
    id: '5',
    name: 'Sabots Traditionnels',
    category: 'men',
    type: 'sabot',
    price: 1499,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sabots traditionnels en bois et cuir, fabriqués selon les méthodes ancestrales.',
    color: 'Brun foncé',
    size: ['41', '42', '43', '44'],
    stock: 10,
    rating: 4.3,
    reviews: 42
  },
  {
    id: '6',
    name: 'Sabots Modernes',
    category: 'women',
    type: 'sabot',
    price: 1799,
    image: 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sabots contemporains avec semelle anatomique et cuir souple pour un confort optimal.',
    color: 'Beige',
    size: ['36', '37', '38', '39', '40'],
    stock: 18,
    rating: 4.9,
    reviews: 87,
    isSale: true,
    discount: 15
  },
  {
    id: '7',
    name: 'Sabots de Chef',
    category: 'men',
    type: 'sabot',
    price: 1599,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sabots professionnels adaptés aux métiers de la restauration et de la santé, antidérapants.',
    color: 'Noir'
  },
  {
    id: '8',
    name: 'Sabots Scandinaves',
    category: 'women',
    type: 'sabot',
    price: 1999,
    image: 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sabots d\'inspiration scandinave, alliant style minimaliste et confort quotidien.',
    color: 'Naturel'
  },
  {
    id: '9',
    name: 'Mules Casual',
    category: 'men',
    type: 'mule',
    price: 1399,
    image: 'https://images.pexels.com/photos/2562992/pexels-photo-2562992.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Mules décontractées en cuir souple avec semelle en caoutchouc durable.',
    color: 'Marron',
    size: ['40', '41', '42', '43', '44'],
    stock: 25,
    rating: 4.4,
    reviews: 56
  },
  {
    id: '10',
    name: 'Mules Élégantes',
    category: 'women',
    type: 'mule',
    price: 1899,
    image: 'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Mules raffinées en cuir premium avec talon bas, parfaites pour le bureau.',
    color: 'Noir',
    size: ['36', '37', '38', '39', '40'],
    stock: 15,
    rating: 4.7,
    reviews: 93,
    isNew: true
  },
  {
    id: '11',
    name: 'Mules d\'Intérieur',
    category: 'men',
    type: 'mule',
    price: 1299,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Mules confortables pour la maison avec doublure en laine naturelle.',
    color: 'Gris'
  },
  {
    id: '12',
    name: 'Mules d\'Été',
    category: 'women',
    type: 'mule',
    price: 1499,
    image: 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Mules légères et respirantes, idéales pour la saison estivale.',
    color: 'Blanc'
  },
  {
    id: '13',
    name: 'Mules d\'hiver',
    category: 'men',
    type: 'mule',
    price: 1500,
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Mules légères et respirantes, idéales pour la saison estivale.',
    color: 'Blanc'
  },
  {
    id: '14',
    name: 'Chaussures Derby Classic',
    category: 'men',
    type: 'chaussure',
    price: 2499,
    image: 'https://images.pexels.com/photos/1334607/pexels-photo-1334607.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Chaussures Derby en cuir véritable avec finition artisanale, parfaites pour les occasions formelles.',
    color: 'Noir',
    size: ['40', '41', '42', '43', '44', '45'],
    stock: 18,
    rating: 4.7,
    reviews: 85,
    isNew: true
  },
  {
    id: '15',
    name: 'Chaussures Oxford Premium',
    category: 'men',
    type: 'chaussure',
    price: 2899,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Chaussures Oxford haut de gamme en cuir italien avec semelle cousue Goodyear.',
    color: 'Brun',
    size: ['41', '42', '43', '44', '45'],
    stock: 12,
    rating: 4.9,
    reviews: 62
  },
  {
    id: '16',
    name: 'Espadrilles Méditerranéennes',
    category: 'men',
    type: 'espadrille',
    price: 1199,
    image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Espadrilles authentiques avec semelle en jute naturel et toile de coton respirante.',
    color: 'Bleu marine',
    size: ['40', '41', '42', '43', '44'],
    stock: 22,
    rating: 4.5,
    reviews: 73
  },
  {
    id: '17',
    name: 'Espadrilles Casual Chic',
    category: 'men',
    type: 'espadrille',
    price: 1399,
    image: 'https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Espadrilles modernes avec finitions en cuir et semelle renforcée pour un confort quotidien.',
    color: 'Beige',
    size: ['41', '42', '43', '44'],
    stock: 15,
    rating: 4.6,
    reviews: 48,
    isNew: true
  }
];