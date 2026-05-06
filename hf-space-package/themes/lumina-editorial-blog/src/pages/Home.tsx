import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { MOCK_POSTS, CATEGORIES } from '../types';
import { Sidebar, Newsletter } from '../components/Layout';

const Home = () => {
  const featuredPost = MOCK_POSTS.find(p => p.featured) || MOCK_POSTS[0];
  const latestPosts = MOCK_POSTS.filter(p => !p.featured);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 bg-brand-accent/10 text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
                Featured Edition
              </span>
              <h1 className="text-6xl md:text-8xl font-serif font-light leading-[0.9] text-brand-black mb-8">
                The Art of <br />
                <span className="italic">Living Well</span>
              </h1>
              <p className="text-xl font-serif italic text-brand-black/50 max-w-md leading-relaxed mb-10">
                "{featuredPost.excerpt}"
              </p>
              <Link 
                to={`/post/${featuredPost.id}`}
                className="group inline-flex items-center space-x-4 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-black hover:text-brand-accent transition-colors duration-500"
              >
                <span>Read the Story</span>
                <div className="w-12 h-[1px] bg-brand-black group-hover:w-20 group-hover:bg-brand-accent transition-all duration-500" />
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-[4/5] md:aspect-[16/10] rounded-[3rem] overflow-hidden premium-shadow"
            >
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                <div className="text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{featuredPost.category}</p>
                  <h2 className="text-2xl font-serif italic">{featuredPost.title}</h2>
                </div>
                <Link 
                  to={`/post/${featuredPost.id}`}
                  className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-black transition-all duration-500"
                >
                  <ArrowUpRight size={24} strokeWidth={1.5} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* Latest Articles Grid */}
        <div className="lg:col-span-8">
          <div className="flex items-end justify-between mb-16 pb-8 border-b border-brand-black/5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4 block">Archive</span>
              <h2 className="text-4xl font-serif font-light">Latest <span className="italic">Stories</span></h2>
            </div>
            <Link to="/categories" className="group flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-brand-black/40 hover:text-brand-black transition-colors">
              <span>View All</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {latestPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
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
                    <Link
                      to={`/categories?type=${post.category.toLowerCase()}`}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent"
                    >
                      {post.category}
                    </Link>
                    <div className="w-8 h-[1px] bg-brand-black/5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/30">{post.readTime}</span>
                  </div>
                  
                  <Link to={`/post/${post.id}`} className="block">
                    <h3 className="text-3xl font-serif font-medium leading-tight group-hover:text-brand-accent transition-colors duration-500">
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar categories={CATEGORIES} trendingPosts={MOCK_POSTS.slice(0, 4)} />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-48 -mx-6 lg:-mx-12">
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
