import React from 'react';
import Newsletter from '../components/Newsletter';
import { FiAward } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";
import { Footprints } from "lucide-react";


const AboutPage: React.FC = () => {
  // Données pour les statistiques
  const stats = [
    {
      number: "70K",
      highlight: "K",
      title: "Clients Satisfaits",
      description: "Nous sommes fiers de servir une clientèle fidèle et croissante."
    },
    {
      number: "400+",
      highlight: "+",
      title: "Produits Disponibles",
      description: "Une large gamme de chaussures pour tous les styles et besoins."
    },
    {
      number: "58K",
      highlight: "K",
      title: "Ventes Réalisées",
      description: "Des milliers de pas confortables grâce à nos chaussures."
    },
    {
      number: "98+",
      highlight: "+",
      title: "Artisans Qualifiés",
      description: "Des experts passionnés qui créent chaque paire avec soin."
    }
  ];

  return (
    <div className="pt-16">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float1 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float2 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
          100% { transform: translateY(0px); }
        }
        
        .parallax-float-1 {
          animation: float1 6s ease-in-out infinite;
        }
        
        .parallax-float-2 {
          animation: float2 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .custom-black-shadow {
          box-shadow: 0 8px 32px 0 rgba(0,0,0,0.55);
        }
      `}} />
      
      {/* Hero Section avec Mission */}
      <section className="relative overflow-hidden bg-white text-black">
        <div className="container mx-auto py-20 px-4">
          <div className="flex flex-col md:flex-row items-center md:gap-x-24">
            <div className="w-full md:w-2/5 md:pl-16 mb-12 md:mb-0 text-left">
              <div className="text-black font-medium mb-2">À Propos de YOOZAK</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Notre Mission</h1>
              
              <p className="text-gray mb-6">
               Notre mission est simple : offrir à nos clients la meilleure sélection de chaussures alliant style, durabilité et 
               confort inégalé. Nous croyons que tout le monde mérite de marcher avec confiance, ç
               c'est pourquoi nous constituons une collection diversifiée de chaussures pour satisfaire tous les goûts et besoins.
              </p>
              
              <button className="bg-black hover:bg-gray-700 text-white px-8 py-3 rounded transition-colors">
                Contactez-Nous
              </button>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="rounded-lg overflow-hidden mt-8 parallax-float-1 custom-black-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1534653299134-96a171b61581?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Chaussure sportive noire" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="rounded-lg overflow-hidden mt-9 parallax-float-2 custom-black-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Chaussure élégante" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* la fierté de Yoozak  */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Nous sommes fièrement Marocains.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <FaHeartbeat className="text-4xl mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-4">Médicales</h3>
              <p className="text-gray-600">
              La santé de nos clients est notre priorité. Nos chaussures sont spécialement conçues pour
               répondre aux besoins des pieds sensibles, 
              offrant un soutien ciblé pour soulager les douleurs articulaires et les problèmes de posture.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <FiAward className="text-4xl mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-4"> Cuir véritable de qualité</h3>
              <p className="text-gray-600">
              Nos chaussures sont fabriquées à partir de cuir véritable de la plus haute qualité. Le cuir offre une élégance intemporelle,
               une respirabilité exceptionnelle et une résistance à l'usure, assurant un confort durable et un style raffiné.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Footprints  className="text-4xl mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-4">Confort toute la journée.</h3>
              <p className="text-gray-600">
              Nous sommes reconnus pour offrir un confort exceptionnel du matin au soir. Chaque paire est soigneusement 
              conçue pour un ajustement parfait et un soutien optimal, vous permettant de rester actif tout au long de la journée..
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Chiffres Clés */}
      <section className="py-16 px-4 bg-gradient text-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img 
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Chaussure colorée" 
                className="rounded-lg shadow-2xl"
              />
            </div>
            
            <div className="md:w-1/2 md:pl-10">
              <h2 className="text-4xl text-black md:text-5xl font-bold mb-6">Marchez dans le style et le confort dès aujourd'hui !</h2>
              <p className="text-gray-900 mb-6">
              Pourquoi nous choisir ? Nous sommes fiers de notre engagement envers la satisfaction de nos clients.
              Notre équipe de professionnels dévoués est toujours prête à vous aider à trouver la paire parfaite de chaussures qui correspond parfaitement à votre style et à votre mode de vie. 
              Avec une attention particulière portée au service client de premier ordre, nous nous assurons que votre expérience d'achat avec nous est exceptionnelle.
              <br />
              <br />
              Chez Yoozak, nous comprenons l'importance de chaussures confortables, 
              surtout lorsqu'il s'agit de chaussures médicales. 
              C'est pourquoi nous proposons une sélection spécialisée de chaussures orthopédiques et de soutien conçues 
              pour soulager et soutenir divers problèmes de pieds.
              </p>
              
              <button className="bg-black text-White hover:bg-gray-700 px-8 py-3 rounded transition-colors">
                Acheter Maintenant
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Statistiques */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Nos Chiffres</h2>
            

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-5xl font-bold mb-2">
                    {stat.number.replace(stat.highlight, '')}
                    <span className="text-green-700">{stat.highlight}</span>
                  </h3>
                  <p className="font-medium mb-2">{stat.title}</p>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Notre Équipe</h2>
          
          <div className="flex flex-row justify-center items-end gap-8">
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Team member" 
                  className="w-full h-auto transition-transform hover:scale-105 duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold">Daniel Morgan</h3>
              <p className="text-gray-600">Fondateur & CEO</p>
            </div>
            
            <div className="text-center -mt-8">
              <div className="mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Team member" 
                  className="w-full h-auto transition-transform hover:scale-105 duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold">Monsieur Zakaria </h3>
              <p className="text-gray-600">Fondateur & CEO</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Team member" 
                  className="w-full h-auto transition-transform hover:scale-105 duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold">James Chen</h3>
              <p className="text-gray-600">Développement Produit</p>
            </div>
          </div>
        </div>
      </section>
      
    
    </div>
  );
};

export default AboutPage;