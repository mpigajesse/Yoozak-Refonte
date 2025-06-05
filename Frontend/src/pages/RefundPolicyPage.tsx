import React from 'react';
import { Link } from '../components/Link';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Politique de Remboursement et de Retours</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Chez YOOZAK, nous nous efforçons de vous offrir des produits de la plus haute qualité. Nous comprenons cependant 
              que parfois un article peut ne pas correspondre à vos attentes. Cette politique de remboursement et de retours 
              définit les conditions dans lesquelles vous pouvez retourner un produit acheté sur notre site.
            </p>
            <p>
              Veuillez lire attentivement cette politique avant d'effectuer un achat. En passant commande sur notre site, 
              vous acceptez d'être lié par les termes et conditions décrits ci-dessous.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Conditions générales de retour</h2>
            <p className="mb-4">
              Pour être éligible à un retour, votre article doit répondre aux conditions suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>L'article doit avoir été acheté directement sur notre site www.yoozak.com</li>
              <li>La demande de retour doit être effectuée dans les 14 jours calendaires suivant la réception de votre commande</li>
              <li>L'article doit être dans son état d'origine, non porté, non endommagé et avec toutes les étiquettes attachées</li>
              <li>L'article doit être retourné dans son emballage d'origine</li>
              <li>Vous devez fournir une preuve d'achat (confirmation de commande ou facture)</li>
            </ul>
            <p>
              Certains articles ne sont pas éligibles au retour, notamment :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Les articles personnalisés ou sur mesure</li>
              <li>Les articles soldés ou en promotion (sauf défaut de fabrication)</li>
              <li>Les articles d'hygiène personnelle</li>
              <li>Les chaussettes et autres articles intimes</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Procédure de retour</h2>
            <p className="mb-4">
              Pour retourner un article, veuillez suivre ces étapes :
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Contactez notre service client à l'adresse returns@yoozak.com ou via le formulaire de contact sur notre site</li>
              <li>Indiquez votre numéro de commande, les articles que vous souhaitez retourner et la raison du retour</li>
              <li>Notre équipe vous enverra un formulaire de retour et les instructions détaillées</li>
              <li>Emballez soigneusement l'article avec tous les accessoires, étiquettes et documentation d'origine</li>
              <li>Joignez le formulaire de retour complété à votre colis</li>
              <li>Expédiez le colis à l'adresse indiquée dans les instructions</li>
            </ol>
            <p className="mb-4">
              Nous vous recommandons d'utiliser un service d'expédition avec suivi et assurance, car nous ne sommes pas responsables 
              des articles perdus ou endommagés pendant le transport de retour.
            </p>
            <p>
              Les frais de retour sont à votre charge, sauf dans les cas suivants :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Article défectueux ou endommagé à la réception</li>
              <li>Article incorrect envoyé par erreur</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Remboursements</h2>
            <p className="mb-4">
              Une fois votre retour reçu et inspecté, nous vous enverrons un e-mail pour vous informer que nous avons reçu votre article. 
              Nous vous informerons également de l'approbation ou du rejet de votre demande de remboursement.
            </p>
            <p className="mb-4">
              Si votre demande est approuvée, votre remboursement sera traité et un crédit sera automatiquement appliqué à votre 
              carte de crédit ou méthode de paiement originale dans un délai de 7 à 14 jours ouvrables.
            </p>
            <p className="mb-4 font-medium">
              Remboursement complet
            </p>
            <p className="mb-4">
              Vous recevrez un remboursement complet du prix d'achat de l'article dans les cas suivants :
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Article défectueux ou endommagé à la réception</li>
              <li>Article incorrect envoyé par erreur</li>
              <li>Retour effectué dans les 14 jours suivant la réception, avec l'article dans son état d'origine</li>
            </ul>
            <p className="mb-4 font-medium">
              Remboursement partiel
            </p>
            <p className="mb-4">
              Un remboursement partiel peut être accordé dans les cas suivants :
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Article retourné après 14 jours mais avant 30 jours suivant la réception</li>
              <li>Article retourné avec des signes d'utilisation mineurs</li>
              <li>Article retourné sans l'emballage d'origine complet</li>
            </ul>
            <p>
              Les frais de livraison initiaux ne sont remboursés que dans le cas d'articles défectueux ou envoyés par erreur.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Échanges</h2>
            <p className="mb-4">
              Si vous souhaitez échanger un article contre un autre (par exemple, pour une taille ou une couleur différente), 
              veuillez suivre la procédure de retour standard et passer une nouvelle commande pour l'article souhaité.
            </p>
            <p>
              Cette méthode est plus rapide que d'attendre que nous recevions votre retour avant de vous envoyer un nouvel article.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Articles défectueux ou endommagés</h2>
            <p className="mb-4">
              Si vous recevez un article défectueux ou endommagé, veuillez nous contacter dans les 48 heures suivant la réception. 
              Nous vous demanderons de fournir des photos du défaut ou du dommage pour accélérer le processus.
            </p>
            <p className="mb-4">
              Pour les articles défectueux ou endommagés, nous couvrirons les frais de retour et vous proposerons l'une des options suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Remplacement de l'article (sous réserve de disponibilité)</li>
              <li>Remboursement complet, y compris les frais de livraison initiaux</li>
              <li>Crédit en magasin</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Garantie</h2>
            <p className="mb-4">
              Tous nos produits sont couverts par une garantie contre les défauts de fabrication pour une période de 6 mois à compter 
              de la date d'achat. Cette garantie ne couvre pas l'usure normale, les dommages causés par une utilisation inappropriée 
              ou un accident, ni les modifications apportées au produit par le client.
            </p>
            <p>
              Pour faire une réclamation sous garantie, veuillez contacter notre service client avec une description du défaut et 
              des photos à l'appui.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
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
            <p>Dernière mise à jour : 15 juillet 2023</p>
          </div>
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