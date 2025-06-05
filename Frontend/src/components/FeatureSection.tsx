import React from 'react';
import { Star, Award, Heart, Users, Package } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'} mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-red-500/10 group`}>
      {/* Icône et numéro */}
      <div className="flex-shrink-0 relative">
        <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-green-600 rounded-2xl flex items-center justify-center text-white transform transition-transform duration-500 group-hover:scale-110">
          {icon}
        </div>
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
          {index + 1}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const detailedFeatures = [
    {
      icon: <Award size={36} />,
      title: "Un savoir-faire marocain, une fierté locale",
      description: "Fièrement basés au Maroc, nous mettons en valeur le talent et la qualité locale en vous proposant des chaussures conçues avec passion et exigence."
    },
    {
      icon: <Star size={36} />,
      title: "Une qualité irréprochable",
      description: "Nos modèles sont fabriqués à partir de cuir véritable de haute qualité, garantissant élégance, résistance et respirabilité. Un choix idéal pour ceux qui recherchent des chaussures durables et stylées."
    },
    {
      icon: <Heart size={36} />,
      title: "Le confort avant tout",
      description: "Que vous marchiez toute la journée ou que vous ayez besoin de chaussures spécifiques pour vos pieds sensibles, nous avons ce qu'il vous faut. Notre collection inclut des chaussures médicales orthopédiques, pensées pour soulager les douleurs articulaires, améliorer la posture et offrir un soutien ciblé."
    },
    {
      icon: <Package size={36} />,
      title: "Une collection pour tous les goûts",
      description: "Des modèles tendance aux chaussures thérapeutiques, notre gamme variée répond à tous les besoins et styles de vie, pour hommes comme pour femmes."
    },
    {
      icon: <Users size={36} />,
      title: "Un service client dédié",
      description: "Notre équipe est toujours à l'écoute pour vous aider à trouver la paire parfaite. Nous plaçons la satisfaction client au cœur de notre mission et veillons à ce que chaque achat soit une expérience fluide, agréable et personnalisée."
    }
  ];

  return (
    <section className="relative py-16 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/morocco-pattern.png')] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-green-50 opacity-90" />
      
      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* En-tête de section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
            Pourquoi Choisir YOOZAK ?
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez ce qui fait de YOOZAK votre destination privilégiée pour des chaussures de qualité.
          </p>
        </div>

        {/* Liste des caractéristiques */}
        <div className="space-y-6">
          {detailedFeatures.map((feature, index) => (
            <Feature 
              key={index}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;