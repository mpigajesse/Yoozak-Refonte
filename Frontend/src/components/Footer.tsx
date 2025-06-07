import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { FaTiktok, FaWhatsapp, FaTelegram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">
                Restez informé de nos nouveautés
              </h3>
              <p className="mt-4 text-gray-400">
                Inscrivez-vous à notre newsletter pour recevoir en avant-première nos offres exclusives et nos dernières collections.
              </p>
            </div>
            <form className="flex flex-col gap-4 sm:flex-row lg:mt-4">
              <input
                type="email"
                placeholder="Entrez votre email"
                className="w-full rounded-full bg-white/10 px-6 py-3 text-white placeholder-gray-400 outline-none ring-1 ring-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-white px-6 py-3 text-black transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold">YOOZAK</Link>
            <p className="text-gray-400 max-w-xs">
              Votre destination pour des chaussures élégantes et confortables, alliant style et qualité.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://web.facebook.com/yoozakelegant" 
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/yoozak_officiel/" 
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
                aria-label="TikTok"
              >
                <FaTiktok size={20} />
              </a>
              <a 
                href="https://wa.me/212634215639" 
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <a 
                href="#" 
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300"
                aria-label="Telegram"
              >
                <FaTelegram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              {[
                { text: "Accueil", href: "/" },
                { text: "Produits", href: "/products" },
                { text: "À propos", href: "/about" },
                { text: "Blog", href: "/blog" },
                { text: "Contact", href: "/contact" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform duration-200">
                      {link.text}
                    </span>
                    <ArrowRight 
                      size={16} 
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200" 
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Mon Compte</h4>
            <ul className="space-y-3">
              {[
                { text: "Mon compte", href: "/account" },
                { text: "Mon panier", href: "/cart" },
                { text: "Mes commandes", href: "/orders" },
                { text: "Mes favoris", href: "/wishlist" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform duration-200">
                      {link.text}
                    </span>
                    <ArrowRight 
                      size={16} 
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200" 
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:yz.prestation@gmail.com"
                  className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Mail size={20} className="mr-3 text-gray-500 group-hover:text-white transition-colors duration-200" />
                  <span>yz.prestation@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+212634215639"
                  className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Phone size={20} className="mr-3 text-gray-500 group-hover:text-white transition-colors duration-200" />
                  <span>+212 634-21-56-39</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <MapPin size={20} className="mr-3 text-gray-500 group-hover:text-white transition-colors duration-200" />
                  <span>Settat, Maroc</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} YOOZAK. Tous droits réservés.
            </p>
            <ul className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors duration-200">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors duration-200">
                  Politique de remboursement
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;