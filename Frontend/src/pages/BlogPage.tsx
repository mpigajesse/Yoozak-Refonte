import React, { useState } from 'react';
import { Calendar, User, Tag, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from '../components/Link';
import Newsletter from '../components/Newsletter';

// Données simulées pour les articles de blog
const blogPosts = [
  {
    id: '1',
    title: 'Comment choisir les meilleures chaussures pour l\'été',
    excerpt: 'Découvrez nos conseils pour sélectionner des chaussures confortables et élégantes pour la saison estivale.',
    content: `
      <p>L'été est la saison idéale pour porter des sandales, des mules et des sabots. Mais comment choisir les bonnes chaussures qui combinent style et confort ?</p>
      
      <h3>Privilégiez les matériaux naturels</h3>
      <p>Les matériaux comme le cuir véritable, le liège et le coton permettent à votre pied de respirer, ce qui est essentiel pendant les journées chaudes. Évitez les matières synthétiques qui favorisent la transpiration.</p>
      
      <h3>Vérifiez le soutien de la voûte plantaire</h3>
      <p>Même pour des sandales d'été, un bon soutien de la voûte plantaire est crucial pour éviter les douleurs au niveau des pieds, des genoux et du dos, surtout si vous prévoyez de marcher longtemps.</p>
      
      <h3>Adaptez votre choix à l'occasion</h3>
      <p>Pour la plage, privilégiez des sandales résistantes à l'eau. Pour une soirée élégante, optez pour des mules raffinées. Pour le quotidien, des sabots confortables feront l'affaire.</p>
      
      <h3>Conclusion</h3>
      <p>L'investissement dans une paire de chaussures de qualité est toujours judicieux. Chez YOOZAK, nous proposons des modèles qui combinent élégance, durabilité et confort pour vous accompagner tout au long de l'été.</p>
    `,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'Emma Wilson',
    date: '15 Mai 2023',
    category: 'Guide d\'achat',
    tags: ['été', 'sandales', 'conseils'],
  },
  {
    id: '2',
    title: 'Les tendances chaussures pour l\'automne 2023',
    excerpt: 'Préparez votre garde-robe pour la saison à venir avec notre guide des tendances incontournables.',
    content: `
      <p>L'automne 2023 s'annonce riche en nouveautés et en retour aux classiques revisités. Voici les tendances à surveiller :</p>
      
      <h3>Le retour des sabots</h3>
      <p>Les sabots font leur grand retour, mais dans des versions modernisées avec des semelles plateformes et des détails métalliques.</p>
      
      <h3>Les couleurs terreuses</h3>
      <p>Les tons de marron, d'olive et de bordeaux domineront cette saison, remplaçant les couleurs vives de l'été.</p>
      
      <h3>Le cuir texturé</h3>
      <p>Les finitions crocodile, python et autres textures apporteront une dimension supplémentaire à des modèles classiques.</p>
      
      <h3>Les semelles chunky</h3>
      <p>La tendance des semelles épaisses se poursuit, offrant à la fois style et praticité pour affronter les premiers froids.</p>
      
      <h3>Comment adopter ces tendances ?</h3>
      <p>Pas besoin de renouveler entièrement votre collection. Choisissez une ou deux pièces phares qui complèteront votre garde-robe existante. Chez YOOZAK, notre nouvelle collection d'automne propose des modèles qui intègrent subtilement ces tendances tout en restant intemporels.</p>
    `,
    image: 'https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'James Chen',
    date: '2 Août 2023',
    category: 'Tendances',
    tags: ['automne', 'tendances', '2023'],
  },
  {
    id: '3',
    title: 'L\'art de la fabrication artisanale des chaussures en cuir',
    excerpt: 'Plongez dans les coulisses de notre atelier et découvrez le savoir-faire ancestral de nos artisans.',
    content: `
      <p>La fabrication artisanale d'une chaussure en cuir est un processus qui demande patience, précision et expertise. Chez YOOZAK, nous perpétuons ces traditions tout en les adaptant aux exigences modernes.</p>
      
      <h3>La sélection du cuir</h3>
      <p>Tout commence par le choix du cuir. Nous sélectionnons uniquement des peaux de première qualité, tannées de manière traditionnelle pour garantir leur durabilité et leur beauté.</p>
      
      <h3>Le patronage</h3>
      <p>Chaque modèle est d'abord dessiné puis transformé en patron. C'est une étape cruciale qui détermine le confort et l'esthétique de la chaussure finale.</p>
      
      <h3>La découpe et l'assemblage</h3>
      <p>Les différentes pièces sont découpées à la main puis assemblées. Nos artisans utilisent des techniques de couture traditionnelles qui garantissent la solidité des assemblages.</p>
      
      <h3>Le montage</h3>
      <p>La tige est ensuite montée sur la forme puis fixée à la semelle. C'est une opération délicate qui requiert une grande précision.</p>
      
      <h3>Les finitions</h3>
      <p>Enfin, la chaussure reçoit ses dernières finitions : teinture, cirage, polissage... Ces étapes révèlent toute la beauté du cuir et donnent à chaque paire son caractère unique.</p>
      
      <h3>L'importance de l'artisanat</h3>
      <p>Dans un monde dominé par la production de masse, l'artisanat permet de créer des produits uniques, durables et respectueux de l'environnement. En choisissant des chaussures artisanales, vous investissez dans un produit qui vous accompagnera pendant de nombreuses années.</p>
    `,
    image: 'https://images.pexels.com/photos/4252950/pexels-photo-4252950.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'Daniel Morgan',
    date: '10 Juin 2023',
    category: 'Artisanat',
    tags: ['fabrication', 'cuir', 'artisanat'],
  },
];

const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Extraire toutes les catégories uniques
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  // Filtrer les articles en fonction de la recherche et de la catégorie
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === null || post.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Trouve le post sélectionné pour l'affichage détaillé
  const currentPost = selectedPost 
    ? blogPosts.find(post => post.id === selectedPost) 
    : null;

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden bg-gray-900">
        <img 
          src="https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600" 
          alt="Blog hero" 
          className="absolute w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Notre Blog</h1>
            <p className="text-xl text-white max-w-2xl mx-auto px-4">
              Conseils, tendances et actualités sur l'univers de la chaussure
            </p>
          </div>
        </div>
      </div>
      
      {/* Blog Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className={`w-full ${selectedPost ? 'lg:w-3/4' : 'lg:w-2/3'}`}>
            {selectedPost ? (
              // Article détaillé
              currentPost && (
                <div>
                  <div className="mb-6">
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="flex items-center text-gray-600 hover:text-black transition-colors"
                    >
                      <ChevronRight size={16} className="transform rotate-180 mr-1" />
                      <span>Retour aux articles</span>
                    </button>
                  </div>
                  
                  <article>
                    <img 
                      src={currentPost.image} 
                      alt={currentPost.title}
                      className="w-full h-[400px] object-cover rounded-lg mb-6"
                    />
                    
                    <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>{currentPost.date}</span>
                      </div>
                      <div className="flex items-center">
                        <User size={16} className="mr-1" />
                        <span>{currentPost.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag size={16} className="mr-1" />
                        <span>{currentPost.category}</span>
                      </div>
                    </div>
                    
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentPost.content }}
                    ></div>
                    
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex flex-wrap gap-2">
                        {currentPost.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              )
            ) : (
              // Liste des articles
              <>
                <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
                  <h2 className="text-2xl font-bold">Articles Récents</h2>
                  
                  <div className="flex gap-4 items-center flex-wrap">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    
                    <select
                      value={filterCategory || ''}
                      onChange={e => setFilterCategory(e.target.value || null)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-600">Aucun article ne correspond à votre recherche.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {filteredPosts.map(post => (
                      <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute top-3 left-3 bg-black bg-opacity-80 text-white text-xs px-3 py-1 rounded-full">
                            {post.category}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-600 mb-3 gap-4">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center">
                              <User size={14} className="mr-1" />
                              <span>{post.author}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          
                          <button
                            onClick={() => setSelectedPost(post.id)}
                            className="flex items-center font-medium text-black hover:text-gray-700 transition-colors"
                          >
                            <span>Lire la suite</span>
                            <ArrowRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          {!selectedPost && (
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-4">Catégories</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setFilterCategory(null)}
                      className={`w-full text-left px-2 py-1 hover:bg-gray-100 rounded ${
                        filterCategory === null ? 'font-medium text-black' : 'text-gray-600'
                      }`}
                    >
                      Toutes les catégories
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        onClick={() => setFilterCategory(category)}
                        className={`w-full text-left px-2 py-1 hover:bg-gray-100 rounded flex justify-between items-center ${
                          filterCategory === category ? 'font-medium text-black' : 'text-gray-600'
                        }`}
                      >
                        <span>{category}</span>
                        <span className="bg-gray-200 text-xs px-2 py-0.5 rounded-full">
                          {blogPosts.filter(post => post.category === category).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-4">Articles populaires</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map(post => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post.id)}
                      className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg w-full text-left"
                    >
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-medium line-clamp-2">{post.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{post.date}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(blogPosts.flatMap(post => post.tags))).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded-full transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Newsletter />
    </div>
  );
};

export default BlogPage; 