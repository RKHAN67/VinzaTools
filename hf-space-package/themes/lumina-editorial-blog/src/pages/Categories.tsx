import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES, MOCK_POSTS } from '../types';

const Categories = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('type');

  const filteredPosts = activeCategory 
    ? MOCK_POSTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase())
    : MOCK_POSTS;

  return (
    <div className="max-w-7xl mx-auto px-8 lg:px-12 py-24">
      <header className="mb-24 text-center max-w-3xl mx-auto">
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-6">
          Explore the Journal
        </span>
        <h1 className="text-6xl md:text-8xl font-serif font-light italic mb-12 text-brand-black">
          {activeCategory ? activeCategory : 'Categories'}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/categories"
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border ${
              !activeCategory 
                ? 'bg-brand-black text-white border-brand-black premium-shadow' 
                : 'bg-transparent text-brand-black/40 border-brand-black/5 hover:border-brand-accent hover:text-brand-accent'
            }`}
          >
            All Stories
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/categories?type=${cat.toLowerCase()}`}
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border ${
                activeCategory === cat.toLowerCase() 
                  ? 'bg-brand-black text-white border-brand-black premium-shadow' 
                  : 'bg-transparent text-brand-black/40 border-brand-black/5 hover:border-brand-accent hover:text-brand-accent'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </header>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {filteredPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <Link to={`/post/${post.id}`} className="block mb-10 relative overflow-hidden rounded-[2rem] aspect-[4/5] premium-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/10 transition-colors duration-500" />
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                    {post.category}
                  </span>
                  <div className="w-8 h-[1px] bg-brand-black/5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/30">{post.readTime}</span>
                </div>
                
                <Link to={`/post/${post.id}`} className="block">
                  <h3 className="text-2xl font-serif font-medium leading-tight group-hover:text-brand-accent transition-colors duration-500">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-brand-black/50 text-lg font-serif italic leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="pt-4">
                  <Link 
                    to={`/post/${post.id}`}
                    className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-brand-black/40 group-hover:text-brand-black transition-colors"
                  >
                    Read Story <ArrowUpRight size={12} className="ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <p className="text-2xl font-serif italic text-brand-black/30">"No stories found in this collection yet."</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
