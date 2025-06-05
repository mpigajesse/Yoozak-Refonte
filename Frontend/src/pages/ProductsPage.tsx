import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import { mockProducts } from '../data/mockData';

const ProductsPage: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [categoryTitle, setCategoryTitle] = useState('Nos Articles');
  const [categoryDescription, setCategoryDescription] = useState('Découvrez notre collection de chaussures de qualité');

  useEffect(() => {
    // Extraire les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const type = urlParams.get('type');

    // Filtrer les produits en fonction des paramètres
    let filtered = [...mockProducts];
    let title = 'Nos Articles';
    let description = 'Découvrez notre collection de chaussures de qualité';

    if (category) {
      filtered = filtered.filter(product => product.category === category);
      
      if (category === 'men') {
        title = 'Collection Homme';
        description = 'Découvrez notre gamme de chaussures pour hommes, alliant style et confort';
      } else if (category === 'women') {
        title = 'Collection Femme';
        description = 'Élégance et raffinement pour notre collection de chaussures pour femmes';
      }
    }

    if (type) {
      // Utiliser le champ 'type' pour filtrer les produits
      filtered = filtered.filter(product => product.type === type);

      // Mettre à jour le titre et la description en fonction du type
      if (type === 'sandale') {
        title += ' - Sandales';
        description = 'Nos sandales élégantes et confortables pour toutes les occasions';
      } else if (type === 'mule') {
        title += ' - Mules';
        description = 'Découvrez nos mules, le parfait équilibre entre style et praticité';
      } else if (type === 'sabot') {
        title += ' - Sabots';
        description = 'Nos sabots traditionnels revisités pour un confort moderne';
      }
    }

    setFilteredProducts(filtered);
    setCategoryTitle(title);
    setCategoryDescription(description);
  }, []);

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center">{categoryTitle}</h1>
          <p className="text-lg text-gray-300 text-center mt-4 max-w-2xl mx-auto">
            {categoryDescription}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl">Showing Results</h2>
          <div className="flex space-x-2">
            <button className="p-2 border border-gray-700 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 border border-gray-700 rounded bg-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <ProductGrid products={filteredProducts} />
      
      <Newsletter />
    </div>
  );
};

export default ProductsPage;