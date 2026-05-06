import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Bookmark, MessageSquare, ArrowUpRight, Twitter, Instagram, Linkedin } from 'lucide-react';
import { MOCK_POSTS } from '../types';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = MOCK_POSTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-serif font-light italic mb-8">Post not found</h2>
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/40 hover:text-brand-accent transition-colors"
        >
          <ArrowLeft size={14} className="mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Journal
        </button>
      </div>
    );
  }

  return (
    <article className="pb-32">
      {/* Post Header */}
      <header className="max-w-5xl mx-auto px-8 pt-24 md:pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link
            to={`/categories?type=${post.category.toLowerCase()}`}
            className="inline-block px-6 py-2 bg-brand-accent/5 text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-12 hover:bg-brand-accent hover:text-white transition-all duration-500"
          >
            {post.category}
          </Link>
          <h1 className="text-5xl md:text-8xl font-serif font-light mb-12 leading-[0.95] text-brand-black">
            {post.title.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 1 ? 'italic' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
            <div className="flex items-center group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-brand-black/5 flex items-center justify-center mr-4 font-serif italic text-xl text-brand-black/20 group-hover:bg-brand-accent group-hover:text-white transition-all duration-500">
                {post.author[0]}
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-brand-black/30 mb-1">Written by</p>
                <span className="text-sm font-medium text-brand-black group-hover:text-brand-accent transition-colors">{post.author}</span>
              </div>
            </div>
            
            <div className="hidden md:block w-[1px] h-8 bg-brand-black/5"></div>
            
            <div className="text-left">
              <p className="text-[9px] font-bold uppercase tracking-widest text-brand-black/30 mb-1">Published on</p>
              <span className="text-sm font-medium text-brand-black">{post.date}</span>
            </div>
            
            <div className="hidden md:block w-[1px] h-8 bg-brand-black/5"></div>
            
            <div className="text-left">
              <p className="text-[9px] font-bold uppercase tracking-widest text-brand-black/30 mb-1">Reading Time</p>
              <span className="text-sm font-medium text-brand-black">{post.readTime}</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Featured Image */}
      <div className="max-w-7xl mx-auto px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="rounded-[3rem] overflow-hidden aspect-[16/9] md:aspect-[21/9] premium-shadow"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Social Share Sidebar (Desktop) */}
          <aside className="hidden lg:block w-12 sticky top-40 h-fit space-y-8">
            {[Share2, Bookmark, MessageSquare].map((Icon, i) => (
              <button 
                key={i} 
                className="w-12 h-12 rounded-full border border-brand-black/5 flex items-center justify-center text-brand-black/20 hover:text-brand-accent hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all duration-500"
              >
                <Icon size={18} strokeWidth={1.5} />
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div 
              className="prose prose-xl prose-serif selection:bg-brand-accent/20"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-24 pt-12 border-t border-brand-black/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/30">Topics</span>
                  <div className="flex flex-wrap gap-3">
                    {['Minimalism', 'Digital', 'Creativity'].map(tag => (
                      <span key={tag} className="px-5 py-2 bg-brand-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-black/60 hover:bg-brand-accent hover:text-white transition-all duration-300 cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/30">Share</span>
                  <div className="flex space-x-4">
                    {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                      <a key={i} href="#" className="text-brand-black/30 hover:text-brand-accent transition-colors">
                        <Icon size={18} strokeWidth={1.5} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-24 p-12 bg-brand-accent/5 rounded-[3rem] border border-brand-accent/10 flex flex-col md:flex-row items-start gap-10">
              <div className="w-24 h-24 rounded-full bg-brand-accent/10 flex-shrink-0 flex items-center justify-center text-4xl font-serif italic text-brand-accent/30">
                {post.author[0]}
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-serif font-medium mb-2">{post.author}</h4>
                  <p className="text-lg font-serif italic text-brand-black/50 leading-relaxed">
                    "A writer and designer obsessed with the intersection of technology and human behavior. Based in Milan, exploring the world one story at a time."
                  </p>
                </div>
                <div className="flex items-center space-x-8">
                  <a href="#" className="group flex items-center text-[10px] font-bold uppercase tracking-widest text-brand-black/40 hover:text-brand-accent transition-colors">
                    Follow on Twitter <ArrowUpRight size={12} className="ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="#" className="group flex items-center text-[10px] font-bold uppercase tracking-widest text-brand-black/40 hover:text-brand-accent transition-colors">
                    Visit Website <ArrowUpRight size={12} className="ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostPage;
