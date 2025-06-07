import React, { useState } from 'react';
import { Calendar, User, Tag, ChevronRight, ArrowRight, Search, Clock } from 'lucide-react';
import { Link } from '../components/Link';


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
    <div className="pt-24 pb-16 bg-gray-50">
      {/* Hero Section - Modern & Minimal */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Blog YOOZAK
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Conseils d'experts, tendances mode et guides d'achat pour vous accompagner dans votre style
            </p>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-sm font-medium">Découvrez nos derniers articles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className={`w-full ${selectedPost ? 'lg:w-3/4' : 'lg:w-2/3'}`}>
            {selectedPost ? (
              // Article détaillé
              currentPost && (
                <div>
                  <div className="mb-8">
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="flex items-center text-gray-600 hover:text-black transition-all duration-200 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md"
                    >
                      <ChevronRight size={16} className="transform rotate-180 mr-2" />
                      <span className="font-medium">Retour aux articles</span>
                    </button>
                  </div>
                  
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img 
                      src={currentPost.image} 
                      alt={currentPost.title}
                      className="w-full h-[400px] object-cover"
                    />
                    
                    <div className="p-8">
                      <h1 className="text-4xl font-bold mb-6 text-gray-900">{currentPost.title}</h1>
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8 gap-6">
                        <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                          <Calendar size={14} className="mr-2" />
                          <span>{currentPost.date}</span>
                        </div>
                        <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                          <User size={14} className="mr-2" />
                          <span>{currentPost.author}</span>
                        </div>
                        <div className="flex items-center bg-black text-white px-3 py-1 rounded-full">
                          <Tag size={14} className="mr-2" />
                          <span>{currentPost.category}</span>
                        </div>
                      </div>
                      
                      <div 
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: currentPost.content }}
                      ></div>
                      
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {currentPost.tags.map(tag => (
                            <span key={tag} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-full font-medium transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )
            ) : (
              // Liste des articles
              <>
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Articles Récents</h2>
                  
                  <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Rechercher un article..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                        
                        <select
                          value={filterCategory || ''}
                          onChange={e => setFilterCategory(e.target.value || null)}
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white min-w-[180px]"
                        >
                          <option value="">Toutes les catégories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                      <Search size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat</h3>
                      <p className="text-gray-600">Aucun article ne correspond à votre recherche.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredPosts.map(post => (
                      <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {post.category}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-4 gap-4">
                            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                              <Calendar size={12} className="mr-1" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                              <User size={12} className="mr-1" />
                              <span>{post.author}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                          
                          <button
                            onClick={() => setSelectedPost(post.id)}
                            className="flex items-center font-semibold text-black hover:gap-3 transition-all duration-200 group/btn"
                          >
                            <span>Lire la suite</span>
                            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          {!selectedPost && (
            <div className="w-full lg:w-1/3 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Catégories</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setFilterCategory(null)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        filterCategory === null 
                          ? 'bg-black text-white font-semibold' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      Toutes les catégories
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        onClick={() => setFilterCategory(category)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex justify-between items-center ${
                          filterCategory === category 
                            ? 'bg-black text-white font-semibold' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span>{category}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          filterCategory === category 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {blogPosts.filter(post => post.category === category).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Articles populaires</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map(post => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post.id)}
                      className="flex gap-4 hover:bg-gray-50 p-3 rounded-xl w-full text-left transition-all duration-200 group"
                    >
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold line-clamp-2 text-gray-900 group-hover:text-black mb-1">{post.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={10} className="mr-1" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(blogPosts.flatMap(post => post.tags))).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 bg-gray-100 hover:bg-black hover:text-white text-sm rounded-full transition-all duration-200 font-medium"
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
      

    </div>
  );
};

export default BlogPage; 