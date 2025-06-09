import React, { useEffect, useState } from 'react';
import { ArrowUp, Shield, Database, Users, Lock, Cookie, Eye, MessageCircle, ChevronRight } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Fonction pour faire défiler vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Détecter la section active lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'collecte', 'utilisation', 'competitions', 'tiers', 'cookies', 'securite', 'droits'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Changer le titre de la page
  useEffect(() => {
    document.title = 'Politique de Confidentialité | YOOZAK';
  }, []);

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: Shield },
    { id: 'collecte', title: 'Collecte des données', icon: Database },
    { id: 'utilisation', title: 'Utilisation des données', icon: Users },
    { id: 'competitions', title: 'Compétitions', icon: MessageCircle },
    { id: 'tiers', title: 'Partage avec les tiers', icon: Eye },
    { id: 'cookies', title: 'Cookies', icon: Cookie },
    { id: 'securite', title: 'Sécurité', icon: Lock },
    { id: 'droits', title: 'Vos droits', icon: Users }
  ];

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      {/* En-tête héro */}
      <div className="bg-gradient-to-br from-black via-black to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Shield className="w-16 h-16 mx-auto mb-4 text-blue-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Votre confidentialité est notre priorité. Découvrez comment nous protégeons et utilisons vos données personnelles.
            </p>
            <div className="mt-8 text-sm text-blue-200">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto flex gap-8">
          {/* Table des matières - Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Table des matières</h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-gray-50 text-black border-l-4 border-black'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-left">{section.title}</span>
                        <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              
              {/* Introduction */}
              <section id="introduction" className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Nous respectons votre vie privée et nous nous efforçons de protéger vos données personnelles. Cette politique explique comment nous collectons et utilisons vos données personnelles
                    dans certaines circonstances, et définit les mesures que nous prenons pour garantir la confidentialité de vos informations. Lorsque vous visitez notre site directement ou via un autre
                    site, vous acceptez les pratiques décrites dans cette politique.
                  </p>

                  <p className="mb-6 text-gray-700">
                    La protection de vos données est essentielle pour nous. Nous utilisons votre nom et d'autres informations vous concernant conformément aux modalités énoncées dans la politique de
                    confidentialité. Nous collectons des informations lorsque cela est nécessaire ou directement lié à nos transactions avec vous.
                  </p>

                  <p className="mb-8 text-gray-700">
                    Nous conservons vos données conformément à la loi ou pour les finalités pour lesquelles elles ont été collectées. Vous pouvez naviguer sur le site sans fournir aucune donnée
                    personnelle. Votre identité reste anonyme pendant votre visite sur le site, et elle ne sera révélée que si vous avez un compte personnel sur le site auquel vous accédez avec votre nom
                    d'utilisateur et mot de passe.
                  </p>
                </div>
              </section>

              {/* Collecte des données */}
              <section id="collecte" className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">1 – Les données que nous collectons :</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-700 mb-6">
                    Nous pouvons avoir besoin de recueillir vos informations si vous souhaitez passer une commande d'achat sur notre site. Nous collectons, stockons et traitons vos informations nécessaires pour suivre votre achat sur notre site afin de sécuriser d'éventuelles réclamations qui pourraient survenir ultérieurement et pour vous fournir les services disponibles chez nous. Les informations personnelles collectées peuvent inclure, entre autres, votre nom, sexe, date de naissance, adresse e-mail, adresse postale, adresse de livraison (si différente), numéro de téléphone, coordonnées de paiement et détails des cartes de paiement.
                  </p>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
                    <h4 className="font-semibold text-green-900 mb-3">Informations que nous collectons :</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Nom, sexe, date de naissance</li>
                        <li>• Adresse e-mail</li>
                        <li>• Adresse postale et de livraison</li>
                        <li>• Numéro de téléphone</li>
                      </ul>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Coordonnées de paiement</li>
                        <li>• Détails des cartes de paiement</li>
                        <li>• Historique des achats</li>
                        <li>• Préférences produits</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">
                    Nous pouvons divulguer votre nom et votre adresse à un tiers afin de livrer votre commande d'achat (par exemple, un agent de livraison ou un fournisseur).
                  </p>

                  <p className="text-gray-700">
                    Nous pouvons être en mesure de stocker les détails de votre commande actuelle sur notre site, mais nous ne pouvons pas les récupérer directement pour des raisons de sécurité. En vous connectant à votre compte sur le site, vous pouvez consulter les informations et les détails de vos achats passés ou futurs. Vous pouvez également gérer les détails de votre adresse. Vous êtes tenu de traiter vos données personnelles avec la plus grande confidentialité et de ne les rendre disponibles à aucun tiers non autorisé. Nous ne sommes pas responsables de tout usage abusif des mots de passe, sauf en cas d'erreur de notre part.
                  </p>
                </div>
              </section>

              {/* Utilisation des données */}
              <section id="utilisation" className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Autres utilisations de vos informations personnelles :</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Nous utilisons les informations que vous fournissez pour traiter vos demandes et vous fournir les services et informations que vous demandez sur notre site. De plus, nous utilisons les informations que vous fournissez pour gérer votre compte chez nous, vérifier les transactions financières effectuées en ligne, effectuer des audits de téléchargement de données à partir du site, déterminer l'identité des visiteurs du site, et concevoir et personnaliser les pages du site et/ou leur contenu pour les utilisateurs. Nous effectuons également diverses recherches liées à la composition démographique et envoyons des informations utiles ou demandées aux utilisateurs, telles que des informations sur les produits et les services, à condition que vous n'ayez pas refusé de recevoir des communications à cet égard. La communication est effectuée par e-mail pour vous fournir des détails sur d'autres produits et services si vous le souhaitez. Si vous préférez ne pas recevoir de communications promotionnelles et marketing, veuillez vous désabonner de cette option à tout moment.
                  </p>

                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-purple-900 mb-3">Nous utilisons vos données pour :</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Traiter vos commandes et demandes</li>
                        <li>• Gérer votre compte utilisateur</li>
                        <li>• Vérifier les transactions financières</li>
                        <li>• Personnaliser votre expérience</li>
                      </ul>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Recherches démographiques</li>
                        <li>• Communications marketing (avec consentement)</li>
                        <li>• Informations sur produits et services</li>
                        <li>• Amélioration du site web</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-gray-700">
                    Nous pouvons utiliser vos informations personnelles dans le cadre d'enquêtes d'opinion et d'études de marché, conformément à vos souhaits, à des fins statistiques en garantissant leur confidentialité complète. Vous avez également le droit de vous désabonner à tout moment. Aucune réponse ne sera envoyée à un tiers. Votre adresse e-mail ne sera divulguée que si vous souhaitez participer à des concours. Nous conservons les réponses aux enquêtes d'opinion dans un endroit séparé de votre adresse e-mail personnelle.
                  </p>

                  <p className="text-gray-700">
                    Nous pouvons également utiliser certaines données, tout en maintenant la confidentialité et la sécurité sur le site, à d'autres fins, y compris la vérification de la localisation des utilisateurs et le suivi de leurs visites sur le site ou les liens dans les courriers électroniques lors de leur inscription pour les fournir de manière anonyme à un tiers tel que les éditeurs. Toutefois, ces données ne permettront pas de vous identifier personnellement, car elles ne sont pas spécifiques à votre identité réelle.
                  </p>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Note importante :</strong> Vous pouvez vous désabonner de nos communications marketing à tout moment en nous contactant ou en utilisant les liens de désinscription dans nos emails.
                    </p>
                  </div>
                </div>
              </section>

              {/* Compétitions */}
              <section id="competitions" className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Les compétitions</h2>
                </div>
                <p className="text-gray-700">
                  En ce qui concerne toute compétition, nous utilisons les données pour informer les gagnants et annoncer nos offres. Vous pouvez trouver plus de détails sur les conditions de participation à chaque compétition séparément.
                </p>
              </section>

              {/* Partage avec les tiers */}
              <section id="tiers" className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Les tiers et les liens vers d'autres sites</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Nous pouvons transférer vos informations à d'autres sociétés de notre groupe, à nos agents et aux sous-traitants qui nous aident dans les transactions conformément à notre politique de confidentialité. Par exemple, nous pouvons faire appel à un tiers pour nous aider à vous livrer des produits, recevoir des paiements de votre part, les utiliser à des fins statistiques et de recherche marketing, ou aider notre équipe du service client. Nous pourrions également devoir partager des informations avec un tiers pour se protéger contre la fraude et réduire les risques de crédit. En cas de vente de notre entreprise ou d'une partie de celle-ci, nous pourrions être amenés à transférer nos bases de données, y compris vos informations personnelles. Contrairement à ce qui est indiqué dans notre politique de confidentialité, nous ne vendrons pas vos données personnelles ni ne les divulgaerons à un tiers sans votre consentement préalable, sauf si cela est nécessaire aux fins énoncées dans cette politique de confidentialité ou si la loi l'exige. Le site peut contenir des publicités de tiers ou des liens vers d'autres sites Web ou cadres d'autres sites. Nous tenons à vous informer que nous ne sommes pas responsables de la politique de confidentialité des tiers ni du contenu de ces politiques appliquées sur d'autres sites, et nous ne sommes pas responsables des tiers auxquels vos données sont transférées conformément à notre politique de confidentialité.
                  </p>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-red-900 mb-3">Nous pouvons partager vos données avec :</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Partenaires de livraison</li>
                        <li>• Processeurs de paiement</li>
                        <li>• Prestataires de services techniques</li>
                        <li>• Équipes du service client</li>
                      </ul>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Protection contre la fraude</li>
                        <li>• Recherche marketing (anonymisée)</li>
                        <li>• Obligations légales</li>
                        <li>• Transfert d'entreprise</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Important :</strong> Nous ne vendons jamais vos données personnelles à des tiers. Tout partage se fait uniquement dans le cadre de nos services ou d'obligations légales.
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookies */}
              <section id="cookies" className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Cookie className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Les cookies</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    L'acceptation des cookies n'est pas une condition essentielle pour visiter le site. Cependant, veuillez noter que vous ne pourrez pas utiliser les fonctionnalités du "panier" sur le site et demander un article sans activer les cookies. Les cookies sont de petits fichiers texte qui permettent à notre serveur de vous identifier comme un utilisateur unique lors de la visite de certaines pages du site. Votre navigateur stocke ces fichiers sur votre disque dur. Les cookies peuvent être utilisés pour détecter votre adresse IP, ce qui vous fait gagner du temps lorsque vous visitez le site ou voulez y revenir. Nous utilisons des cookies pour assurer votre confort lors de la navigation sur ce site (nous rappelons, par exemple, votre identité lorsque vous voulez modifier votre panier sans avoir à saisir à nouveau votre adresse e-mail) et non pas pour obtenir des informations sur vous ou pour utiliser ces informations (par exemple, à des fins de marketing ciblé). Vous pouvez configurer votre navigateur pour qu'il n'accepte pas les cookies, mais cela pourrait limiter votre utilisation du site. Nous vous informons que le recours aux cookies ne contient aucune information personnelle ou confidentielle et est exempt de virus.
                  </p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-yellow-900 mb-3">Types de cookies utilisés :</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h5 className="font-medium text-yellow-900">Cookies essentiels</h5>
                          <p className="text-sm text-yellow-800">Nécessaires au fonctionnement du panier et de la connexion</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h5 className="font-medium text-yellow-900">Cookies de confort</h5>
                          <p className="text-sm text-yellow-800">Pour mémoriser votre identité et préférences de navigation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h5 className="font-medium text-yellow-900">Cookies d'identification</h5>
                          <p className="text-sm text-yellow-800">Pour détecter votre adresse IP et faciliter vos visites</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700">
                    Ce site utilise le service d'analyse Google Analytics, un service fourni par Google pour analyser les pages Web. Pour analyser comment les utilisateurs utilisent le site, le service Google Analytics se base sur les cookies, qui sont des fichiers texte placés sur votre ordinateur. Google transfère les informations générées par les cookies concernant votre utilisation du site (y compris votre adresse IP) à des serveurs situés aux États-Unis, où elles sont stockées. Google utilisera ces informations pour évaluer votre utilisation du site, établir des rapports sur l'activité du site pour les exploitants du site et fournir d'autres services liés à l'activité du site et à l'utilisation d'Internet. Google peut également transférer ces informations à des tiers si la loi l'exige ou si ces tiers traitent ces informations pour le compte de Google. Google ne liera pas votre adresse IP à d'autres données détenues par Google. Vous pouvez refuser l'utilisation de cookies en sélectionnant les paramètres appropriés de votre navigateur, mais veuillez noter que si vous le faites, vous risquez de ne pas pouvoir utiliser toutes les fonctionnalités du site. En utilisant ce site, vous consentez à ce que Google traite vos données de la manière et aux fins décrites ci-dessus.
                  </p>
                </div>
              </section>

              {/* Sécurité */}
              <section id="securite" className="p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">La sécurité</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Nous utilisons des technologies et des procédures de sécurité appropriées pour empêcher tout accès non autorisé ou illégal à vos informations, leur perte ou leur destruction. Lorsque nous recueillons des données via le site, nous stockons vos informations personnelles sur une base de données dans un serveur sécurisé. Nous utilisons des pare-feu sur nos serveurs. Lorsque nous recueillons des détails de paiement électroniques, nous les protégeons en utilisant le cryptage, tel que la couche de sockets sécurisée (SSL). Cela rend extrêmement difficile pour toute personne de déchiffrer vos informations, car nous ne pouvons pas garantir une protection à 100 %. Nous vous recommandons vivement de ne pas envoyer de détails de carte de crédit ou de débit par voie électronique sans cryptage. Nous fournissons des garanties matérielles, électroniques et procédurales directes pour le processus de collecte, de stockage et de divulgation de vos informations. Nos procédures de sécurité peuvent exiger que nous vous demandions de prouver votre identité avant de vous divulguer vos informations personnelles. Vous êtes responsable de la protection de votre mot de passe et de votre ordinateur contre tout usage non autorisé.
                  </p>

                  <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-indigo-900 mb-3">Mesures de sécurité mises en place :</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-indigo-900">Cryptage SSL</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <Shield className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-indigo-900">Serveurs sécurisés</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <Database className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-indigo-900">Pare-feu</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-indigo-900">Vérification d'identité</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Votre responsabilité :</strong> Vous êtes responsable de la protection de votre mot de passe et de votre ordinateur contre tout usage non autorisé. Nous ne recommandons pas d'envoyer des détails de carte sans cryptage.
                    </p>
                  </div>
                </div>
              </section>

              {/* Droits des utilisateurs */}
              <section id="droits" className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Droits du client</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Si vous êtes préoccupé par vos données, vous avez le droit de demander l'accès aux données personnelles que nous détenons à votre sujet ou que nous avons transférées. Vous avez le droit de nous demander de corriger toute erreur dans vos données personnelles, ce qui est fait gratuitement. Vous avez également le droit de nous demander de cesser d'utiliser vos données personnelles à des fins de marketing direct à tout moment.
                  </p>

                  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-teal-900 mb-3">Vos droits en détail :</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border border-teal-200">
                          <h5 className="font-semibold text-teal-900 mb-1">Droit d'accès</h5>
                          <p className="text-sm text-teal-800">Demander l'accès aux données personnelles que nous détenons</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-teal-200">
                          <h5 className="font-semibold text-teal-900 mb-1">Droit de rectification</h5>
                          <p className="text-sm text-teal-800">Corriger toute erreur dans vos données (gratuit)</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border border-teal-200">
                          <h5 className="font-semibold text-teal-900 mb-1">Droit d'opposition</h5>
                          <p className="text-sm text-teal-800">Cesser l'utilisation pour le marketing direct</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-teal-200">
                          <h5 className="font-semibold text-teal-900 mb-1">Données transférées</h5>
                          <p className="text-sm text-teal-800">Connaître les données que nous avons transférées</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">Comment exercer vos droits ?</h4>
                    <p className="text-blue-800 mb-3">
                      Pour exercer ces droits ou si vous avez des préoccupations concernant vos données, contactez-nous :
                    </p>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Email :</strong> privacy@yoozak.com</p>
                      <p><strong>Correction d'erreurs :</strong> Service gratuit</p>
                      <p><strong>Désinscription marketing :</strong> À tout moment</p>
                      <p><strong>Accès aux données :</strong> Sur demande avec justificatif d'identité</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Contact et dernière mise à jour */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Des questions sur cette politique ?</h3>
                <p className="text-gray-600 mb-6">
                  Notre équipe est là pour vous aider et répondre à toutes vos questions sur la confidentialité.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="mailto:privacy@yoozak.com"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Nous contacter
                  </a>
                  <a 
                    href="https://wa.me/+33600000000" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/767px-WhatsApp.svg.png" 
                      alt="WhatsApp" 
                      className="w-5 h-5"
                    />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-50"
        aria-label="Retour en haut"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default PrivacyPolicyPage;