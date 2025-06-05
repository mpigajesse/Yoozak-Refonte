import React from 'react';
import { ArrowRight } from 'lucide-react';

const AnimatedFeatures: React.FC = () => {
  const faqs = [
    {
      question: "Un savoir-faire marocain, une fierté locale",
      answer: "Fièrement basés au Maroc, nous mettons en valeur le talent et la qualité locale en vous proposant des chaussures conçues avec passion et exigence."
    },
    {
      question: "Une qualité irréprochable",
      answer: "Nos modèles sont fabriqués à partir de cuir véritable de haute qualité, garantissant élégance, résistance et respirabilité. Un choix idéal pour ceux qui recherchent des chaussures durables et stylées."
    },
    {
      question: "Le confort avant tout",
      answer: "Que vous marchiez toute la journée ou que vous ayez besoin de chaussures spécifiques pour vos pieds sensibles, nous avons ce qu'il vous faut. Notre collection inclut des chaussures médicales orthopédiques, pensées pour soulager les douleurs articulaires, améliorer la posture et offrir un soutien ciblé."
    },
    {
      question: "Une collection pour tous les goûts",
      answer: "Des modèles tendance aux chaussures thérapeutiques, notre gamme variée répond à tous les besoins et styles de vie, pour hommes comme pour femmes"
    },
    {
      question: "Un service client dédié",
      answer: "Notre équipe est toujours à l'écoute pour vous aider à trouver la paire parfaite. Nous plaçons la satisfaction client au cœur de notre mission et veillons à ce que chaque achat soit une expérience fluide, agréable et personnalisée"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Colonne de gauche avec le titre et le bouton */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Pourquoi Choisir YOOZAK ?
              </h2>
              <p className="text-gray-600 text-lg sm:text-xl mb-8">
                Découvrez ce qui fait de YOOZAK votre destination privilégiée pour des chaussures de qualité.
              </p>
              <a
                href="/about"
                className="group inline-flex items-center border-2 border-black rounded-full px-6 py-3 text-base sm:text-lg font-medium hover:bg-black hover:text-white transition-all duration-300"
              >
                À propos de nous
                <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </a>
            </div>
          </div>

          {/* Colonne de droite avec les FAQ */}
          <div className="flex flex-col space-y-8 sm:space-y-10">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="group border-t border-gray-200 pt-6 transition-all duration-300 hover:border-gray-400"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-gray-900 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedFeatures; 