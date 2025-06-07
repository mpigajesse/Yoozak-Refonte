import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const DiscoverMore: React.FC = () => {
  const categories = [
    {
      title: 'Collection Homme',
      subtitle: 'Découvrez notre sélection de chaussures pour homme',
      image: '/assets/images/Collection_Homme.png',
      link: '/products?category=men',
      label: 'Men'
    },
    {
      title: 'Collection Femme',
      subtitle: 'Explorez nos modèles exclusifs pour femme',
      image: '/assets/images/Collection_Femme.png',
      link: '/products?category=women',
      label: 'Women'
    }
  ];

  return (
    <section id="discover-more" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Découvrez nos collections
          </h2>
          <p className="text-lg text-gray-600">
            Des chaussures élégantes et confortables pour tous les styles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {categories.map((category, index) => (
            <Link
              key={category.label}
              to={category.link}
              className="group relative overflow-hidden rounded-2xl bg-black"
            >
              {/* Image avec overlay */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0" />
              </div>

              {/* Contenu */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-300 mb-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {category.subtitle}
                  </p>
                  <div className="inline-flex items-center text-white">
                    <span className="text-sm font-medium">Explorer</span>
                    <ArrowUpRight
                      size={20}
                      className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
              </div>

              {/* Effet de bordure animée */}
              <div className="absolute inset-0 border-2 border-white/0 rounded-2xl transition-all duration-500 group-hover:border-white/20" />
            </Link>
          ))}
        </div>

        {/* Section des avantages */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Livraison rapide',
              description: 'Recevez votre commande en 3-5 jours'
            },
            {
              title: 'Retours faciles',
              description: 'Retours gratuits sous 30 jours'
            },
            {
              title: 'Service client',
              description: 'Assistance 7j/7 pour vous aider'
            },
            {
              title: 'Paiement sécurisé',
              description: 'Vos paiements sont 100% sécurisés'
            }
          ].map((advantage, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverMore; 