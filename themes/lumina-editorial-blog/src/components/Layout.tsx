import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ArrowRight, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 glass-panel' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <span className="text-3xl font-serif font-light tracking-tight text-brand-black group-hover:text-brand-accent transition-colors duration-500">
              Blue<span className="font-bold italic">Vinza</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-brand-accent relative group ${
                  location.pathname === link.path ? 'text-brand-black' : 'text-brand-black/40'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-full h-[1px] bg-brand-accent transition-transform duration-500 origin-left ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-8">
            <button className="text-brand-black/40 hover:text-brand-accent transition-colors duration-300">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              to="/subscribe"
              className="px-8 py-3 bg-brand-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-accent transition-all duration-500 premium-shadow"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-brand-black/60 hover:text-brand-black transition-colors"
            >
              {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-brand-paper pt-32 px-8"
          >
            <div className="space-y-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-5xl font-serif font-light italic text-brand-black hover:text-brand-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-12"
              >
                <Link
                  to="/subscribe"
                  className="inline-block px-12 py-5 bg-brand-black text-white text-xs font-bold uppercase tracking-widest rounded-full"
                >
                  Subscribe Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-white pt-32 pb-16 border-t border-brand-black/5">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <Link to="/" className="text-4xl font-serif font-light tracking-tight mb-8 block">
              Blue<span className="font-bold italic">Vinza</span>
            </Link>
            <p className="text-brand-black/50 text-lg font-serif italic max-w-md leading-relaxed mb-10">
              "Curating the extraordinary in the everyday. A journal for the modern mind, the creative soul, and the curious spirit."
            </p>
            <div className="flex space-x-6">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="text-brand-black/30 hover:text-brand-accent transition-colors duration-300">
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/30 mb-8">Journal</h4>
            <ul className="space-y-4">
              {['Home', 'Categories', 'About', 'Contact'].map(item => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-sm text-brand-black/60 hover:text-brand-accent transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/30 mb-8">Legal</h4>
            <ul className="space-y-4">
              {['Privacy', 'Terms', 'Cookies', 'Licensing'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-brand-black/60 hover:text-brand-accent transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/30 mb-8">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'Community', 'Newsletter', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-brand-black/60 hover:text-brand-accent transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-brand-black/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-black/30">
            © 2026 BlueVinza Journal. All rights reserved.
          </p>
          <div className="flex items-center space-x-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/30">Crafted with Precision</span>
            <div className="w-8 h-[1px] bg-brand-black/10" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black/60">Edition 01</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Newsletter = () => {
  return (
    <section className="py-32 bg-brand-black text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] aspect-square rounded-full bg-brand-accent blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] aspect-square rounded-full bg-brand-accent/30 blur-[100px]" />
      </div>
      
      <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-8">
          The Weekly Journal
        </span>
        <h2 className="text-5xl md:text-7xl font-serif font-light mb-10 text-white leading-tight">
          Insights for the <br />
          <span className="italic">Modern Creative</span>
        </h2>
        <p className="text-xl font-serif italic text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
          "Join 25,000+ readers who receive our curated selection of thoughts on design, technology, and the art of living well."
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/30 focus:outline-none focus:border-brand-accent/50 transition-all duration-500 font-serif italic text-lg"
            required
          />
          <button
            type="submit"
            className="group px-10 py-5 bg-white text-brand-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-brand-accent hover:text-white transition-all duration-500 flex items-center justify-center"
          >
            Join Now <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-white/20">
          Unsubscribe at any time. We value your privacy.
        </p>
      </div>
    </section>
  );
};

export const Sidebar = ({ categories, trendingPosts }: { categories: string[], trendingPosts: any[] }) => {
  return (
    <aside className="space-y-20">
      <div className="glass-panel p-10 rounded-[2rem] premium-shadow">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/30 mb-10 pb-4 border-b border-brand-black/5">
          Explore Topics
        </h4>
        <div className="flex flex-col space-y-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/categories?type=${cat.toLowerCase()}`}
              className="group flex justify-between items-center text-sm font-medium text-brand-black/60 hover:text-brand-accent transition-all duration-300"
            >
              <span className="font-serif italic text-lg">{cat}</span>
              <div className="w-8 h-[1px] bg-brand-black/5 group-hover:w-12 group-hover:bg-brand-accent transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/30 mb-10 pb-4 border-b border-brand-black/5">
          Most Read
        </h4>
        <div className="space-y-10">
          {trendingPosts.map((post, idx) => (
            <Link key={post.id} to={`/post/${post.id}`} className="group block">
              <div className="flex items-start space-x-6">
                <span className="text-4xl font-serif font-light italic text-brand-black/10 group-hover:text-brand-accent/20 transition-colors duration-500">
                  {idx + 1}
                </span>
                <div className="space-y-2">
                  <h5 className="text-lg font-serif font-medium leading-snug group-hover:text-brand-accent transition-colors duration-500">
                    {post.title}
                  </h5>
                  <div className="flex items-center space-x-3 text-[9px] font-bold uppercase tracking-widest text-brand-black/30">
                    <span>{post.category}</span>
                    <div className="w-1 h-1 rounded-full bg-brand-black/10" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="bg-brand-accent/5 p-10 rounded-[2rem] border border-brand-accent/10">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-6">
          The Print Edition
        </h4>
        <p className="text-brand-black/60 font-serif italic text-lg mb-8 leading-relaxed">
          "Experience our journal in physical form. Issue 04 now available for pre-order."
        </p>
        <button className="w-full py-4 border border-brand-accent text-brand-accent text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-accent hover:text-white transition-all duration-500">
          Pre-order Issue 04
        </button>
      </div>
    </aside>
  );
};
