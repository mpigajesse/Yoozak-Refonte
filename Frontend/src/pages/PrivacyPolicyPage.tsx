import React, { useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Changer le titre de la page
  useEffect(() => {
    document.title = 'Politique de Confidentialité | YOOZAK';
  }, []);

  return (
    <div className="pt-24 pb-16">
      {/* En-tête de la page */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Politique de Confidentialité</h1>
        </div>
      </div>

      {/* Section vidéo/GIF avec design terne */}
      <div className="w-full py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-lg shadow-lg" style={{ height: "300px" }}>
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGJ3ajJpcnN6cnF3aml2a3B3MXdyZXk0OXR5NHh0bDFrcHNocm56cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2SpYQz6BTixBtoCA/giphy.gif"
              alt="Protection des données"
              className="absolute inset-0 w-full h-full object-cover filter grayscale"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center text-white px-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Protection de vos données</h2>
                <p className="text-lg md:text-xl opacity-90">Nous nous engageons à protéger vos informations personnelles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto prose prose-gray">
          {/* Introduction */}
          <p className="text-lg mb-6">
            Nous respectons votre vie privée et nous nous efforçons de protéger vos données personnelles. Cette politique explique comment nous collectons et utilisons vos données personnelles
            dans certaines circonstances, et définit les mesures que nous prenons pour garantir la confidentialité de vos informations. Lorsque vous visitez notre site directement ou via un autre
            site, vous acceptez les pratiques décrites dans cette politique.
          </p>

          <p className="mb-6">
            La protection de vos données est essentielle pour nous. Nous utilisons votre nom et d'autres informations vous concernant conformément aux modalités énoncées dans la politique de
            confidentialité. Nous collectons des informations lorsque cela est nécessaire ou directement lié à nos transactions avec vous.
          </p>

          <p className="mb-8">
            Nous conservons vos données conformément à la loi ou pour les finalités pour lesquelles elles ont été collectées. Vous pouvez naviguer sur le site sans fournir aucune donnée
            personnelle. Votre identité reste anonyme pendant votre visite sur le site, et elle ne sera révélée que si vous avez un compte personnel sur le site auquel vous accédez avec votre nom
            d'utilisateur et mot de passe.
          </p>

          {/* Section 1 */}
          <h2 className="text-2xl font-bold mt-10 mb-4">1 – Les données que nous collectons :</h2>
          <p className="mb-6">
            Nous pouvons avoir besoin de recueillir vos informations si vous souhaitez passer une commande d'achat sur notre site. Nous collectons, stockons et traitons vos informations nécessaires pour suivre votre achat sur notre site afin de sécuriser d'éventuelles réclamations qui pourraient survenir ultérieurement et pour vous fournir les services disponibles chez nous. Les informations personnelles collectées peuvent inclure, entre autres, votre nom, sexe, date de naissance, adresse e-mail, adresse postale, adresse de livraison (si différente), numéro de téléphone, coordonnées de paiement et détails des cartes de paiement.
          </p>

          <p className="mb-6">
            Nous utilisons les informations que vous fournissez pour traiter vos demandes et vous fournir les services et informations que vous demandez sur notre site. De plus, nous utilisons les informations que vous fournissez pour gérer votre compte chez nous, vérifier les transactions financières effectuées en ligne, effectuer des audits de téléchargement de données à partir du site, déterminer l'identité des visiteurs du site, et concevoir et personnaliser les pages du site et/ou leur contenu pour les utilisateurs. Nous effectuons également diverses recherches liées à la composition démographique et envoyons des informations utiles ou demandées aux utilisateurs, telles que des informations sur les produits et les services, à condition que vous n'ayez pas refusé de recevoir des communications à cet égard. La communication est effectuée par e-mail pour vous fournir des détails sur d'autres produits et services si vous le souhaitez. Si vous préférez ne pas recevoir de communications promotionnelles et marketing, veuillez vous désabonner de cette option à tout moment.
          </p>

          <p className="mb-6">
            Nous pouvons divulguer votre nom et votre adresse à un tiers afin de livrer votre commande d'achat (par exemple, un agent de livraison ou un fournisseur).
          </p>

          <p className="mb-8">
            Nous pouvons être en mesure de stocker les détails de votre commande actuelle sur notre site, mais nous ne pouvons pas les récupérer directement pour des raisons de sécurité. En vous connectant à votre compte sur le site, vous pouvez consulter les informations et les détails de vos achats passés ou futurs. Vous pouvez également gérer les détails de votre adresse. Vous êtes tenu de traiter vos données personnelles avec la plus grande confidentialité et de ne les rendre disponibles à aucun tiers non autorisé. Nous ne sommes pas responsables de tout usage abusif des mots de passe, sauf en cas d'erreur de notre part.
          </p>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold mt-10 mb-4">Autres utilisations de vos informations personnelles :</h2>
          <p className="mb-6">
            Nous pouvons utiliser vos informations personnelles dans le cadre d'enquêtes d'opinion et d'études de marché, conformément à vos souhaits, à des fins statistiques en garantissant leur confidentialité complète. Vous avez également le droit de vous désabonner à tout moment. Aucune réponse ne sera envoyée à un tiers. Votre adresse e-mail ne sera divulguée que si vous souhaitez participer à des concours. Nous conservons les réponses aux enquêtes d'opinion dans un endroit séparé de votre adresse e-mail personnelle.
          </p>

          <p className="mb-8">
            Nous pouvons également utiliser certaines données, tout en maintenant la confidentialité et la sécurité sur le site, à d'autres fins, y compris la vérification de la localisation des utilisateurs et le suivi de leurs visites sur le site ou les liens dans les courriers électroniques lors de leur inscription pour les fournir de manière anonyme à un tiers tel que les éditeurs. Toutefois, ces données ne permettront pas de vous identifier personnellement, car elles ne sont pas spécifiques à votre identité réelle.
          </p>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold mt-10 mb-4">Les compétitions</h2>
          <p className="mb-8">
            En ce qui concerne toute compétition, nous utilisons les données pour informer les gagnants et annoncer nos offres. Vous pouvez trouver plus de détails sur les conditions de participation à chaque compétition séparément.
          </p>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold mt-10 mb-4">Les tiers et les liens vers d'autres sites</h2>
          <p className="mb-8">
            Nous pouvons transférer vos informations à d'autres sociétés de notre groupe, à nos agents et aux sous-traitants qui nous aident dans les transactions conformément à notre politique de confidentialité. Par exemple, nous pouvons faire appel à un tiers pour nous aider à vous livrer des produits, recevoir des paiements de votre part, les utiliser à des fins statistiques et de recherche marketing, ou aider notre équipe du service client. Nous pourrions également devoir partager des informations avec un tiers pour se protéger contre la fraude et réduire les risques de crédit. En cas de vente de notre entreprise ou d'une partie de celle-ci, nous pourrions être amenés à transférer nos bases de données, y compris vos informations personnelles. Contrairement à ce qui est indiqué dans notre politique de confidentialité, nous ne vendrons pas vos données personnelles ni ne les divulguerons à un tiers sans votre consentement préalable, sauf si cela est nécessaire aux fins énoncées dans cette politique de confidentialité ou si la loi l'exige. Le site peut contenir des publicités de tiers ou des liens vers d'autres sites Web ou cadres d'autres sites. Nous tenons à vous informer que nous ne sommes pas responsables de la politique de confidentialité des tiers ni du contenu de ces politiques appliquées sur d'autres sites, et nous ne sommes pas responsables des tiers auxquels vos données sont transférées conformément à notre politique de confidentialité.
          </p>

          {/* Section 5 */}
          <h2 className="text-2xl font-bold mt-10 mb-4">Les cookies</h2>
          <p className="mb-8">
            L'acceptation des cookies n'est pas une condition essentielle pour visiter le site. Cependant, veuillez noter que vous ne pourrez pas utiliser les fonctionnalités du "panier" sur le site et demander un article sans activer les cookies. Les cookies sont de petits fichiers texte qui permettent à notre serveur de vous identifier comme un utilisateur unique lors de la visite de certaines pages du site. Votre navigateur stocke ces fichiers sur votre disque dur. Les cookies peuvent être utilisés pour détecter votre adresse IP, ce qui vous fait gagner du temps lorsque vous visitez le site ou voulez y revenir. Nous utilisons des cookies pour assurer votre confort lors de la navigation sur ce site (nous rappelons, par exemple, votre identité lorsque vous voulez modifier votre panier sans avoir à saisir à nouveau votre adresse e-mail) et non pas pour obtenir des informations sur vous ou pour utiliser ces informations (par exemple, à des fins de marketing ciblé). Vous pouvez configurer votre navigateur pour qu'il n'accepte pas les cookies, mais cela pourrait limiter votre utilisation du site. Nous vous informons que le recours aux cookies ne contient aucune information personnelle ou confidentielle et est exempt de virus. Ce site utilise le service d'analyse Google Analytics, un service fourni par Google pour analyser les pages Web. Pour analyser comment les utilisateurs utilisent le site, le service Google Analytics se base sur les cookies, qui sont des fichiers texte placés sur votre ordinateur. Google transfère les informations générées par les cookies concernant votre utilisation du site (y compris votre adresse IP) à des serveurs situés aux États-Unis, où elles sont stockées. Google utilisera ces informations pour évaluer votre utilisation du site, établir des rapports sur l'activité du site pour les exploitants du site et fournir d'autres services liés à l'activité du site et à l'utilisation d'Internet. Google peut également transférer ces informations à des tiers si la loi l'exige ou si ces tiers traitent ces informations pour le compte de Google. Google ne liera pas votre adresse IP à d'autres données détenues par Google. Vous pouvez refuser l'utilisation de cookies en sélectionnant les paramètres appropriés de votre navigateur, mais veuillez noter que si vous le faites, vous risquez de ne pas pouvoir utiliser toutes les fonctionnalités du site. En utilisant ce site, vous consentez à ce que Google traite vos données de la manière et aux fins décrites ci-dessus.
          </p>

          {/* Section 6 */}
          <h2 className="text-2xl font-bold mt-10 mb-4">La sécurité</h2>
          <p className="mb-8">
            Nous utilisons des technologies et des procédures de sécurité appropriées pour empêcher tout accès non autorisé ou illégal à vos informations, leur perte ou leur destruction. Lorsque nous recueillons des données via le site, nous stockons vos informations personnelles sur une base de données dans un serveur sécurisé. Nous utilisons des pare-feu sur nos serveurs. Lorsque nous recueillons des détails de paiement électroniques, nous les protégeons en utilisant le cryptage, tel que la couche de sockets sécurisée (SSL). Cela rend extrêmement difficile pour toute personne de déchiffrer vos informations, car nous ne pouvons pas garantir une protection à 100 %. Nous vous recommandons vivement de ne pas envoyer de détails de carte de crédit ou de débit par voie électronique sans cryptage. Nous fournissons des garanties matérielles, électroniques et procédurales directes pour le processus de collecte, de stockage et de divulgation de vos informations. Nos procédures de sécurité peuvent exiger que nous vous demandions de prouver votre identité avant de vous divulguer vos informations personnelles. Vous êtes responsable de la protection de votre mot de passe et de votre ordinateur contre tout usage non autorisé.
          </p>

          {/* Section 7 */}
          <h2 className="text-2xl font-bold mt-10 mb-4">Droits du client</h2>
          <p className="mb-8">
            Si vous êtes préoccupé par vos données, vous avez le droit de demander l'accès aux données personnelles que nous détenons à votre sujet ou que nous avons transférées. Vous avez le droit de nous demander de corriger toute erreur dans vos données personnelles, ce qui est fait gratuitement. Vous avez également le droit de nous demander de cesser d'utiliser vos données personnelles à des fins de marketing direct à tout moment.
          </p>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Retour en haut"
      >
        <ArrowUp size={24} />
      </button>

      {/* Bouton WhatsApp */}
      <a 
        href="https://wa.me/+33600000000" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-8 left-8 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Contacter par WhatsApp"
      >
        <span className="ml-2 mr-2 text-right hidden md:inline-block">هل تحتاج للمساعدة؟ تواصل معنا على الواتساب</span>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/767px-WhatsApp.svg.png" 
          alt="WhatsApp" 
          className="w-6 h-6 inline-block"
        />
      </a>
    </div>
  );
};

export default PrivacyPolicyPage; 