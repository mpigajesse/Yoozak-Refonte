import React from 'react';
import { Link } from '../components/Link';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Politique de Remboursement et de Retours</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Principes Généraux</h2>
            <p className="mb-4">
              Le remplacement et le remboursement sont des droits garantis à tous nos clients, et cela concerne 
              tous les produits que nous proposons sur notre magasin.
            </p>
            <p>
              Tous les produits présentés sur notre magasin sont éligibles à la politique de remplacement et de 
              remboursement, selon les termes et conditions énoncés sur cette page.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Conditions de Retour</h2>
            <p className="mb-4">
              Le retour ou le remplacement est possible si le produit est dans son état d'origine au moment de l'achat 
              et emballé dans l'emballage d'origine.
            </p>
            <p>
              Le remboursement peut être effectué dans les trois (3) jours et le remplacement dans les sept (7) jours 
              suivant la date d'achat.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Procédure de Demande</h2>
            <p className="mb-4">
              Veuillez nous contacter via la page "Contactez-nous" ou via nos numéros de téléphone pour demander 
              un remboursement ou un remplacement.
            </p>
            <p>
              Veuillez prendre une photo du produit et l'envoyer avec la mention de la ville, de l'adresse et du 
              numéro de commande afin qu'il puisse être remplacé par un autre produit en cas de produit défectueux 
              ou présentant un défaut spécifique, ou s'il n'est pas conforme à ce qui a été convenu.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Conditions de Remboursement</h2>
            <p className="mb-4">
              Le montant sera entièrement remboursé au client si le produit qu'il a reçu est complètement différent 
              de la description du produit sur notre site.
            </p>
            <p className="mb-4">
              Nous ne sommes pas responsables de toutes les attentes d'utilisation des produits par le client que 
              nous n'avons pas mentionnées sur la page du produit sur notre site.
            </p>
            <p>
              Une déduction de 30% ou d'une valeur égale ou supérieure à 25 dirhams est appliquée si le client ne 
              souhaite pas conserver le produit sans qu'il présente de défaut ou de problème notable.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">5. Contact</h2>
            <p className="mb-4">
              Si vous avez des questions concernant notre politique de remboursement et de retours, n'hésitez pas à nous contacter :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Par e-mail : returns@yoozak.com</li>
              <li>Par téléphone : +212 500 000 000</li>
              <li>Par courrier : Service Retours YOOZAK, 123 Avenue Mohammed V, Casablanca, Maroc</li>
            </ul>
          </section>
          
          <div className="mt-8 text-sm text-gray-600">
            <p>Dernière mise à jour : 15 mars 2024</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Retour à l'accueil
          </Link>
                </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage; 