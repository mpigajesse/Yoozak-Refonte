import React from 'react';
import { Link } from '../components/Link';

const TermsOfUsePage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Conditions Générales d'Utilisation</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Bienvenue sur YOOZAK. Les présentes conditions générales d'utilisation régissent votre utilisation du site web YOOZAK, 
              accessible à l'adresse [www.yoozak.com]. En accédant à ce site, vous acceptez ces conditions sans réserve. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
            </p>
            <p>
              YOOZAK se réserve le droit de modifier ces conditions à tout moment. Vous êtes donc invité à les consulter régulièrement.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Définitions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Site</strong> : Le site web YOOZAK accessible à l'adresse [www.yoozak.com]</li>
              <li><strong>YOOZAK</strong> : Désigne l'entité propriétaire et exploitante du Site</li>
              <li><strong>Utilisateur</strong> : Toute personne qui accède et navigue sur le Site</li>
              <li><strong>Client</strong> : Utilisateur qui effectue un achat sur le Site</li>
              <li><strong>Compte</strong> : Espace personnel créé par l'Utilisateur sur le Site</li>
              <li><strong>Produits</strong> : Articles proposés à la vente sur le Site</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Compte utilisateur</h2>
            <p className="mb-4">
              Pour effectuer des achats sur le Site, vous pouvez créer un compte utilisateur. Vous êtes responsable de maintenir 
              la confidentialité de vos informations de connexion et de toutes les activités qui se produisent sous votre compte.
            </p>
            <p className="mb-4">
              Vous vous engagez à :
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Fournir des informations exactes, à jour et complètes lors de la création de votre compte</li>
              <li>Mettre à jour rapidement vos informations pour qu'elles restent exactes, à jour et complètes</li>
              <li>Maintenir la sécurité et la confidentialité de votre mot de passe et de toute identification</li>
              <li>Nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
            </ul>
            <p>
              YOOZAK se réserve le droit de suspendre ou de supprimer votre compte si vous fournissez des informations inexactes, 
              incomplètes ou périmées, ou si vous ne respectez pas les présentes conditions.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Commandes et paiements</h2>
            <p className="mb-4">
              En passant commande sur notre Site, vous déclarez avoir 18 ans ou plus et avoir la capacité juridique de conclure des contrats.
            </p>
            <p className="mb-4">
              Les étapes pour passer une commande sont les suivantes :
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Sélection des produits et ajout au panier</li>
              <li>Vérification du contenu du panier</li>
              <li>Saisie des informations de livraison et de facturation</li>
              <li>Sélection du mode de livraison</li>
              <li>Vérification de la commande complète</li>
              <li>Paiement</li>
            </ol>
            <p className="mb-4">
              Une commande n'est définitive qu'après confirmation du paiement. YOOZAK se réserve le droit de refuser ou d'annuler toute commande 
              d'un client avec lequel il existerait un litige relatif au paiement d'une commande antérieure.
            </p>
            <p>
              Les modes de paiement acceptés sont indiqués sur la page de paiement lors du processus de commande.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Prix et disponibilité</h2>
            <p className="mb-4">
              Les prix affichés sur le Site sont en Dirhams marocains (MAD) et incluent la TVA, sauf indication contraire. 
              Les frais de livraison sont indiqués séparément avant la validation de la commande.
            </p>
            <p className="mb-4">
              Malgré nos efforts pour maintenir les informations à jour, il est possible que certains produits affichés sur le Site 
              soient temporairement indisponibles ou que leurs prix aient changé. Dans ce cas, nous vous en informerons dès que possible.
            </p>
            <p>
              YOOZAK se réserve le droit de modifier les prix à tout moment, mais les produits seront facturés sur la base des tarifs 
              en vigueur au moment de la validation de la commande.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Propriété intellectuelle</h2>
            <p className="mb-4">
              Tous les contenus présents sur le Site, incluant sans limitation les textes, graphiques, logos, images, clips audio, 
              vidéos, icônes de boutons, logiciels et leur compilation, sont la propriété exclusive de YOOZAK ou de ses fournisseurs 
              de contenu et sont protégés par les lois nationales et internationales sur la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces 
              différents éléments est strictement interdite sans l'accord exprès par écrit de YOOZAK.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Limitation de responsabilité</h2>
            <p className="mb-4">
              YOOZAK s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur le Site. 
              Cependant, YOOZAK ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le Site.
            </p>
            <p>
              En aucun cas, YOOZAK ne pourra être tenu responsable :
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>De tout dommage direct ou indirect résultant de l'utilisation du Site</li>
              <li>D'une interruption du Site pour des raisons techniques ou de force majeure</li>
              <li>De virus informatiques contractés en navigant sur le Site</li>
              <li>D'erreurs dans les informations fournies sur le Site</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Liens vers d'autres sites</h2>
            <p>
              Le Site peut contenir des liens vers d'autres sites internet. YOOZAK n'exerce aucun contrôle sur ces sites et n'assume 
              aucune responsabilité quant à leur contenu. La présence de liens vers d'autres sites ne constitue en aucun cas une 
              approbation ou une validation de leur contenu par YOOZAK.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Protection des données personnelles</h2>
            <p className="mb-4">
              YOOZAK s'engage à protéger vos données personnelles conformément à notre Politique de Confidentialité, 
              qui fait partie intégrante des présentes conditions.
            </p>
            <p>
              Pour plus d'informations sur la façon dont nous collectons, utilisons et protégeons vos données personnelles, 
              veuillez consulter notre <Link href="/privacy" className="text-black underline">Politique de Confidentialité</Link>.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Droit applicable et juridiction compétente</h2>
            <p className="mb-4">
              Les présentes conditions sont régies par le droit marocain. En cas de litige, les tribunaux de Casablanca seront seuls compétents.
            </p>
            <p>
              Avant toute action en justice, vous vous engagez à rechercher une solution amiable avec YOOZAK.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">11. Contact</h2>
            <p>
              Pour toute question concernant les présentes conditions générales d'utilisation, vous pouvez nous contacter :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Par e-mail : contact@yoozak.com</li>
              <li>Par téléphone : +212 500 000 000</li>
              <li>Par courrier : YOOZAK, 123 Avenue Mohammed V, Casablanca, Maroc</li>
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

export default TermsOfUsePage; 