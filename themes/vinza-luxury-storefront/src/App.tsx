/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Heart,
  Settings,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  BookOpen,
  Tag,
  Clock,
  User,
  MessageSquare,
  Share2,
  ChevronDown,
  ArrowLeft,
  Play,
  ArrowUp,
  Gift,
  Zap,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'about' | 'contact' | 'collections' | 'privacy-policy' | 'refund-policy' | 'shipping-policy' | 'terms-of-service' | 'faq' | 'wishlist' | 'blog' | 'blog-post' | 'order-tracking';

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
  reviews?: Review[];
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

interface CartItem extends Product {
  quantity: number;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Sustainable Urban Fashion",
    excerpt: "How Aura is leading the charge in eco-friendly high-performance gear.",
    content: "Sustainability is no longer a choice; it's a necessity. At Aura, we've spent the last three years developing fabrics that don't just look good, but do good. Our new Stealth Parka is made from 100% recycled ocean plastics, treated with a non-toxic water-repellent finish. This is the future of fashion—where utility meets responsibility.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
    author: "Elena Vance",
    date: "March 15, 2026",
    category: "Sustainability",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Minimalism: More Than Just an Aesthetic",
    excerpt: "Why stripping away the noise leads to better design and a better life.",
    content: "Minimalism isn't about having nothing; it's about having exactly what you need. In our latest collection, we've focused on 'Modular Essentials'—pieces that can be layered, combined, and adapted to any environment. By reducing the number of items in your wardrobe, you increase the value of each piece.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    author: "Marcus Thorne",
    date: "March 10, 2026",
    category: "Design",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Tech-Wear: Bridging the Gap Between Sport and Style",
    excerpt: "Exploring the rise of performance-driven everyday clothing.",
    content: "The lines between the gym, the office, and the street are blurring. Tech-wear is the answer to this shift. Our Onyx Flux Sneakers use a proprietary carbon-fiber plate that provides energy return for athletes but looks sleek enough for a gallery opening. It's about versatility without compromise.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop",
    author: "Sarah Jenkins",
    date: "March 05, 2026",
    category: "Technology",
    readTime: "6 min read"
  }
];

// --- Mock Data ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Aura Stealth Parka",
    price: 450,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aec16adcd?q=80&w=800&auto=format&fit=crop",
    description: "A high-performance parka designed for the modern urban explorer. Water-resistant, breathable, and minimalist.",
    isNew: true,
    isFeatured: true,
    stock: 15,
    reviews: [
      { id: 1, user: "Alex R.", rating: 5, comment: "Best parka I've ever owned. Worth every penny.", date: "Feb 12, 2026" },
      { id: 2, user: "Jordan M.", rating: 4, comment: "Great fit, very warm. Wish it had one more pocket.", date: "Jan 28, 2026" }
    ]
  },
  {
    id: 2,
    name: "Onyx Flux Sneakers",
    price: 280,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    description: "Lightweight sneakers with a futuristic silhouette. Engineered for comfort and style.",
    isFeatured: true,
    stock: 5,
    reviews: [
      { id: 1, user: "Sam K.", rating: 5, comment: "Like walking on clouds. The design is incredible.", date: "March 01, 2026" }
    ]
  },
  {
    id: 3,
    name: "Titanium Chrono",
    price: 850,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop",
    description: "A precision-engineered timepiece crafted from aerospace-grade titanium.",
    isNew: true,
    isFeatured: true,
    stock: 2,
    reviews: []
  },
  {
    id: 4,
    name: "Zenith Tote Bag",
    price: 120,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1544816153-36ad48bc4de6?q=80&w=800&auto=format&fit=crop",
    description: "A minimalist tote bag made from sustainable materials. Perfect for daily essentials.",
    isFeatured: true,
    stock: 50,
    reviews: [
      { id: 1, user: "Chris P.", rating: 4, comment: "Simple and elegant. Use it every day.", date: "Dec 15, 2025" }
    ]
  },
  {
    id: 5,
    name: "Aura Knit Sweater",
    price: 195,
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
    description: "Ultra-soft knit sweater with a modern oversized fit.",
    isNew: true,
    stock: 20,
    reviews: []
  },
  {
    id: 6,
    name: "Carbon Fiber Wallet",
    price: 85,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    description: "Slim, RFID-blocking wallet made from genuine carbon fiber.",
    stock: 100,
    reviews: []
  }
];

// --- Components ---

const AnnouncementBar = () => (
  <div className="bg-accent text-white py-2.5 text-center relative z-[60] overflow-hidden">
    <motion.div 
      animate={{ x: [0, -1000] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="whitespace-nowrap flex gap-20 items-center"
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-[10px] font-black uppercase tracking-[0.4em]">
          Free Worldwide Shipping on Orders Over $500 • New Spring Collection Out Now • 15% Off Your First Order with Code: AURA15
        </span>
      ))}
    </motion.div>
  </div>
);

const SearchOverlay = ({ isOpen, onClose, setPage, setSelectedProduct }: { isOpen: boolean, onClose: () => void, setPage: (p: Page) => void, setSelectedProduct: (p: Product) => void }) => {
  const [query, setQuery] = useState('');
  const results = query.length > 1 ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-luxury-black/95 backdrop-blur-xl p-6 md:p-24"
        >
          <button onClick={onClose} className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors">
            <X size={40} />
          </button>
          
          <div className="max-w-4xl mx-auto">
            <input 
              autoFocus
              type="text" 
              placeholder="Search our collection..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 py-8 text-4xl md:text-7xl font-display font-black text-white focus:border-accent outline-none transition-colors placeholder:text-white/5"
            />
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
              {results.length > 0 ? (
                results.map(product => (
                  <div 
                    key={product.id} 
                    className="flex gap-8 group cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setPage('product');
                      onClose();
                    }}
                  >
                    <div className="w-32 h-40 bg-luxury-gray rounded-xl overflow-hidden shrink-0">
                      <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={product.name} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-accent text-[10px] font-black uppercase tracking-widest mb-2">{product.category}</span>
                      <h3 className="text-2xl font-display font-bold text-white group-hover:text-accent transition-colors">{product.name}</h3>
                      <p className="text-white/40 mt-2">${product.price}</p>
                    </div>
                  </div>
                ))
              ) : query.length > 1 ? (
                <p className="text-white/20 text-xl">No products found for "{query}"</p>
              ) : (
                <div className="flex flex-col gap-6">
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Popular Searches</p>
                  <div className="flex flex-wrap gap-4">
                    {['Parka', 'Sneakers', 'Tote', 'Minimalist', 'Sustainable'].map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setQuery(tag)}
                        className="px-6 py-3 bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SizeGuideModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-luxury-black/90 backdrop-blur-md"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-luxury-black p-12 rounded-3xl border border-white/10 shadow-2xl"
        >
          <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <h2 className="text-4xl font-display font-black text-white tracking-tighter mb-8 uppercase">Size Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Size</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Chest (in)</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Waist (in)</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Hip (in)</th>
                </tr>
              </thead>
              <tbody className="text-sm text-white/70">
                <tr className="border-b border-white/5">
                  <td className="py-4 font-bold text-white">XS</td>
                  <td className="py-4">32-34</td>
                  <td className="py-4">26-28</td>
                  <td className="py-4">32-34</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 font-bold text-white">S</td>
                  <td className="py-4">35-37</td>
                  <td className="py-4">29-31</td>
                  <td className="py-4">35-37</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 font-bold text-white">M</td>
                  <td className="py-4">38-40</td>
                  <td className="py-4">32-34</td>
                  <td className="py-4">38-40</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 font-bold text-white">L</td>
                  <td className="py-4">41-43</td>
                  <td className="py-4">35-37</td>
                  <td className="py-4">41-43</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-white">XL</td>
                  <td className="py-4">44-46</td>
                  <td className="py-4">38-40</td>
                  <td className="py-4">44-46</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-xs text-white/30 leading-relaxed">
            * All measurements are in inches. If you are between sizes, we recommend sizing up for a more relaxed fit.
          </p>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const QuickViewModal = ({ product, isOpen, onClose, addToCart }: { product: Product | null, isOpen: boolean, onClose: () => void, addToCart: (p: Product, q: number) => void }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-luxury-black/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl bg-luxury-black rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl border border-white/5"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="relative aspect-square md:aspect-auto h-full bg-luxury-gray">
              <img src={product.image} className="w-full h-full object-cover" alt={product.name} referrerPolicy="no-referrer" />
              {product.isNew && (
                <span className="absolute top-8 left-8 bg-accent text-white text-[10px] font-black px-5 py-2 uppercase tracking-[0.3em] rounded-full">New</span>
              )}
            </div>
            <div className="p-12 md:p-16 flex flex-col justify-center">
              <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">{product.category}</span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter mb-6 uppercase">{product.name}</h2>
              <p className="text-2xl font-display font-bold text-white/80 mb-8">${product.price}</p>
              <p className="text-white/40 text-sm mb-10 leading-relaxed font-light">
                {product.description}
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { addToCart(product, 1); onClose(); }}
                  className="bg-white text-luxury-black py-5 font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={20} />
                  Add to Bag
                </button>
                <button 
                  onClick={onClose}
                  className="glass py-5 font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-xs"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return (
    <div className="bg-accent text-white py-2 px-6 text-center text-[10px] font-black uppercase tracking-[0.4em] relative z-[60]">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <span>Free express shipping on orders over $500</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Use code AURA20 for 20% off</span>
      </div>
      <button onClick={() => setIsVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
        <X size={14} />
      </button>
    </div>
  );
};

const TrustBadges = () => (
  <section className="py-24 border-y border-white/5 bg-white/[0.02]">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        {[
          { icon: <Truck size={24} />, title: "Free Shipping", desc: "On all orders over $500" },
          { icon: <ShieldCheck size={24} />, title: "Secure Payment", desc: "100% secure payment processing" },
          { icon: <RotateCcw size={24} />, title: "Easy Returns", desc: "30-day hassle-free return policy" },
          { icon: <Headphones size={24} />, title: "24/7 Support", desc: "Dedicated support team" }
        ].map((badge, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-500">
              {badge.icon}
            </div>
            <h4 className="text-sm font-display font-bold uppercase tracking-widest mb-2">{badge.title}</h4>
            <p className="text-xs text-white/40 font-light">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[100] w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('aura_newsletter_popup');
      if (!hasSeen) setIsOpen(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  const closePopup = () => {
    localStorage.setItem('aura_newsletter_popup', 'true');
    setIsOpen(false);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-luxury-black/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-luxury-black rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl border border-white/5"
          >
            <button onClick={closePopup} className="absolute top-6 right-6 z-10 text-white/40 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="relative h-full bg-luxury-gray hidden md:block">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Newsletter" referrerPolicy="no-referrer" />
            </div>
            <div className="p-12 md:p-16 flex flex-col justify-center">
              <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Exclusive Access</span>
              <h2 className="text-4xl font-display font-black text-white tracking-tighter mb-6 uppercase">JOIN THE INNER CIRCLE</h2>
              <p className="text-white/40 text-sm mb-10 leading-relaxed font-light">
                Subscribe to receive updates, access to exclusive deals, and 10% off your first order.
              </p>
              <div className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/5 border border-white/10 p-5 text-sm focus:border-accent outline-none transition-all"
                />
                <button className="bg-white text-luxury-black py-5 font-bold uppercase tracking-widest hover:bg-accent transition-all">
                  Subscribe Now
                </button>
                <button onClick={closePopup} className="text-[10px] text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors mt-4">
                  No thanks, I'll pay full price
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ 
  currentPage, 
  setPage, 
  cartCount, 
  wishlistCount,
  toggleCart,
  openSearch
}: { 
  currentPage: Page; 
  setPage: (p: Page) => void; 
  cartCount: number;
  wishlistCount: number;
  toggleCart: () => void;
  openSearch: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' as Page },
    { name: 'Shop', id: 'shop' as Page },
    { name: 'Collections', id: 'collections' as Page },
    { name: 'Blog', id: 'blog' as Page },
    { name: 'Tracking', id: 'order-tracking' as Page },
    { name: 'About', id: 'about' as Page },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-luxury-black/90 backdrop-blur-2xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div 
          className="text-2xl font-display font-black tracking-tighter cursor-pointer flex items-center gap-3 group"
          onClick={() => setPage('home')}
        >
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
            <div className="w-5 h-5 bg-luxury-black rounded-full" />
          </div>
          <span className="tracking-[0.2em]">AURA</span>
        </div>

        <div className="hidden lg:flex items-center gap-16">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              className={`text-[11px] font-bold tracking-[0.3em] uppercase transition-all hover:text-accent relative group ${currentPage === link.id ? 'text-accent' : 'text-white/70'}`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full ${currentPage === link.id ? 'w-full' : ''}`} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-10">
          <button 
            onClick={openSearch}
            className="text-white/70 hover:text-accent transition-colors hidden sm:block"
          >
            <Search size={18} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setPage('wishlist')}
            className="relative text-white/70 hover:text-accent transition-all hover:scale-110"
          >
            <Heart size={18} strokeWidth={2.5} className={wishlistCount > 0 ? 'text-accent fill-accent' : ''} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>
          <button 
            className="relative text-white/70 hover:text-accent transition-all hover:scale-110"
            onClick={toggleCart}
          >
            <ShoppingBag size={18} strokeWidth={2.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            className="lg:hidden text-white/70 hover:text-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-luxury-black z-[100] p-12 flex flex-col gap-8 md:hidden"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-accent">
                <X size={32} />
              </button>
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setPage(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-4xl font-display font-black text-left uppercase tracking-tighter ${currentPage === link.id ? 'text-accent' : 'text-white'}`}
              >
                {link.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = ({ setPage }: { setPage: (p: Page) => void }) => (
  <footer className="bg-luxury-black border-t border-white/5 pt-32 pb-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-32">
        <div className="col-span-1 md:col-span-1">
          <div className="text-3xl font-display font-black tracking-tighter mb-8">AURA</div>
          <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-xs">
            Redefining the digital shopping experience with high-end aesthetics and seamless performance.
          </p>
          <div className="flex gap-5">
            <button className="w-11 h-11 rounded-full glass flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-500">
              <Instagram size={18} />
            </button>
            <button className="w-11 h-11 rounded-full glass flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-500">
              <Twitter size={18} />
            </button>
            <button className="w-11 h-11 rounded-full glass flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-500">
              <Facebook size={18} />
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-display font-bold uppercase text-[10px] tracking-[0.4em] mb-10 text-accent">Collections</h4>
          <ul className="flex flex-col gap-5 text-sm text-white/40">
            <li onClick={() => setPage('shop')} className="hover:text-accent cursor-pointer transition-colors">New Arrivals</li>
            <li onClick={() => setPage('shop')} className="hover:text-accent cursor-pointer transition-colors">Best Sellers</li>
            <li onClick={() => setPage('collections')} className="hover:text-accent cursor-pointer transition-colors">All Collections</li>
            <li onClick={() => setPage('shop')} className="hover:text-accent cursor-pointer transition-colors">Outlet</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold uppercase text-[10px] tracking-[0.4em] mb-10 text-accent">Customer Care</h4>
          <ul className="flex flex-col gap-5 text-sm text-white/40">
            <li onClick={() => setPage('order-tracking')} className="hover:text-accent cursor-pointer transition-colors">Track Order</li>
            <li onClick={() => setPage('refund-policy')} className="hover:text-accent cursor-pointer transition-colors">Returns</li>
            <li onClick={() => setPage('shipping-policy')} className="hover:text-accent cursor-pointer transition-colors">Shipping</li>
            <li onClick={() => setPage('faq')} className="hover:text-accent cursor-pointer transition-colors">FAQ</li>
            <li onClick={() => setPage('blog')} className="hover:text-accent cursor-pointer transition-colors">Journal</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold uppercase text-[10px] tracking-[0.4em] mb-10 text-accent">Newsletter</h4>
          <p className="text-sm text-white/40 mb-8">Join the inner circle for exclusive drops.</p>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-white/[0.03] border border-white/10 px-5 py-4 text-sm focus:outline-none focus:border-accent w-full transition-all"
            />
            <button className="bg-white text-luxury-black py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
          © 2026 Aura Modern. All rights reserved.
        </p>
        <div className="flex gap-8">
          <span onClick={() => setPage('privacy-policy')} className="text-[10px] text-white/20 uppercase tracking-[0.3em] hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span onClick={() => setPage('terms-of-service')} className="text-[10px] text-white/20 uppercase tracking-[0.3em] hover:text-white cursor-pointer transition-colors">Terms</span>
        </div>
      </div>
    </div>
  </footer>
);

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart?: (p: Product) => void;
  onQuickView?: (p: Product) => void;
  key?: React.Key;
}

const ProductCard = ({ product, onClick, onAddToCart, onQuickView, onToggleWishlist, isWishlisted }: ProductCardProps & { onToggleWishlist?: (p: Product) => void, isWishlisted?: boolean }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="group cursor-pointer"
    onClick={onClick}
  >
    <div className="relative aspect-[4/5] overflow-hidden bg-luxury-gray mb-6 rounded-2xl">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      {product.isNew && (
        <span className="absolute top-6 left-6 bg-accent text-white text-[9px] font-black px-4 py-1.5 uppercase tracking-[0.3em] rounded-full shadow-lg">
          New
        </span>
      )}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.(product);
        }}
        className={`absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isWishlisted ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white hover:text-luxury-black'}`}
      >
        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>
      <div className="absolute inset-0 bg-luxury-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
        {onQuickView && (
          <button 
            className="bg-white text-luxury-black px-8 py-4 text-[10px] font-black tracking-[0.3em] uppercase transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-accent hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            Quick View
          </button>
        )}
        {onAddToCart && (
          <button 
            className="bg-accent text-white px-8 py-4 text-[10px] font-black tracking-[0.3em] uppercase transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-75"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            Add to Bag
          </button>
        )}
      </div>
    </div>
    <div className="flex justify-between items-start px-2">
      <div>
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent mb-2">{product.category}</p>
        <h3 className="font-display font-black text-xl text-white group-hover:text-accent transition-colors tracking-tight">{product.name}</h3>
      </div>
      <p className="font-display font-black text-xl text-white/80">${product.price}</p>
    </div>
  </motion.div>
);

// --- Pages ---

const HomePage = ({ setPage, setSelectedProduct, setSelectedPost, addToCart, openQuickView, recentlyViewed, toggleWishlist, wishlist }: { setPage: (p: Page) => void, setSelectedProduct: (p: Product) => void, setSelectedPost: (p: BlogPost) => void, addToCart: (p: Product, q: number) => void, openQuickView: (p: Product) => void, recentlyViewed: Product[], toggleWishlist: (p: Product) => void, wishlist: Product[] }) => {
  const featuredProducts = PRODUCTS.filter(p => p.isFeatured);

  return (
    <div className="bg-luxury-black flex flex-col gap-24 md:gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Fashion" 
            className="w-full h-full object-cover opacity-40 scale-105 animate-float"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/50" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <span className="inline-block text-accent font-display font-bold uppercase tracking-[0.5em] text-[10px] mb-8">
              Limited Edition Collection 2026
            </span>
            <h1 className="text-7xl md:text-9xl font-display font-black text-white leading-[0.85] tracking-tighter mb-12">
              PURE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white/50">ESSENCE</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-xl mb-12 leading-relaxed font-light">
              Experience the intersection of high-end craftsmanship and minimalist luxury. Designed for those who seek the extraordinary.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => setPage('shop')}
                className="btn-primary group flex items-center gap-4 px-10 py-5"
              >
                Shop Collection
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
              </button>
              <button 
                onClick={() => setPage('about')}
                className="btn-outline px-10 py-5"
              >
                Our Story
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="text-[10px] text-white/20 uppercase tracking-[0.4em] rotate-90 mb-8">Scroll</span>
          <div className="w-[1px] h-24 bg-gradient-to-b from-accent to-transparent" />
        </div>
      </section>

      {/* Craftsmanship Section (New) */}
      <section className="py-32 bg-luxury-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop" 
                  className="w-full h-full object-cover" 
                  alt="Craftsmanship"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-accent rounded-3xl p-12 hidden md:flex flex-col justify-end">
                <span className="text-white font-display font-black text-4xl leading-tight">100% HAND MADE</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Our Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter mb-8 leading-[0.9]">THE ART OF <br />CRAFTSMANSHIP</h2>
              <p className="text-white/40 text-lg mb-12 leading-relaxed font-light">
                Every piece in our collection is a testament to the enduring beauty of traditional techniques merged with modern design. We source only the finest sustainable materials to ensure that your Aura pieces last a lifetime.
              </p>
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-white font-display font-black text-3xl mb-2">120+</h4>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">Master Artisans</p>
                </div>
                <div>
                  <h4 className="text-white font-display font-black text-3xl mb-2">15</h4>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">Global Studios</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features / Trust Badges */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: <Truck size={24} />, title: "Free Shipping", desc: "On orders over $500" },
              { icon: <ShieldCheck size={24} />, title: "Secure Payment", desc: "100% encrypted checkout" },
              { icon: <RotateCcw size={24} />, title: "Easy Returns", desc: "30-day return policy" },
              { icon: <Headphones size={24} />, title: "24/7 Support", desc: "Dedicated assistance" },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 group">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold uppercase tracking-widest text-white mb-1">{feature.title}</h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories - Creative Layout */}
      <section className="py-32 bg-luxury-black overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div>
              <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Curated Selection</span>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter">THE EDIT</h2>
            </div>
            <p className="text-white/30 max-w-sm text-sm leading-relaxed">
              A meticulously curated selection of our most iconic pieces, designed to elevate your everyday aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-7 group relative h-[600px] overflow-hidden rounded-2xl cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="Outerwear"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12">
                <h3 className="text-4xl font-display font-black text-white mb-4">OUTERWEAR</h3>
                <button className="text-accent text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 group/btn">
                  Explore <div className="w-8 h-[1px] bg-accent transition-all group-hover/btn:w-12" />
                </button>
              </div>
            </motion.div>

            <div className="md:col-span-5 flex flex-col gap-8">
              <motion.div 
                whileHover={{ y: -10 }}
                className="group relative h-[284px] overflow-hidden rounded-2xl cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=800&auto=format&fit=crop" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt="Accessories"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-display font-black text-white mb-2">ACCESSORIES</h3>
                  <button className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">View All</button>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="group relative h-[284px] overflow-hidden rounded-2xl cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt="Footwear"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-display font-black text-white mb-2">FOOTWEAR</h3>
                  <button className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">View All</button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="py-24 bg-luxury-black overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-4xl font-display font-black tracking-tighter">VOGUE</span>
            <span className="text-4xl font-display font-black tracking-tighter">GQ</span>
            <span className="text-4xl font-display font-black tracking-tighter">HYPEBEAST</span>
            <span className="text-4xl font-display font-black tracking-tighter">ELLE</span>
            <span className="text-4xl font-display font-black tracking-tighter">BAZAAR</span>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-32 bg-luxury-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Shop by Category</span>
            <h2 className="text-5xl font-display font-black text-white tracking-tighter">OUR COLLECTIONS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aec16adcd?q=80&w=800&auto=format&fit=crop' },
              { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
              { name: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop' },
              { name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop' },
            ].map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                onClick={() => setPage('shop')}
                className="group relative h-80 overflow-hidden rounded-2xl cursor-pointer"
              >
                <img src={cat.image} className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110" alt={cat.name} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-widest">{cat.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-20">
            <h2 className="text-4xl font-display font-black text-white tracking-tighter uppercase">FEATURED PIECES</h2>
            <button 
              onClick={() => setPage('shop')}
              className="text-accent text-xs font-black uppercase tracking-[0.3em] hover:opacity-70 transition-opacity"
            >
              View Shop
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => setSelectedProduct(product)}
                onAddToCart={(p) => addToCart(p, 1)}
                onQuickView={openQuickView}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.some(p => p.id === product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="container mx-auto px-6">
        <div className="relative h-[600px] rounded-3xl overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt="Featured Collection"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-12 md:p-24 max-w-2xl">
            <span className="text-accent font-display font-bold uppercase tracking-[0.5em] text-xs mb-6">Limited Edition</span>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-10 leading-none">THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">ZENITH</span> SERIES</h2>
            <p className="text-white/60 text-lg mb-12 font-light leading-relaxed">
              A fusion of high-performance materials and avant-garde design. Engineered for the modern explorer who demands excellence in every environment.
            </p>
            <div className="flex gap-6">
              <button onClick={() => setPage('shop')} className="btn-primary px-12 py-5">Shop Collection</button>
              <button onClick={() => setPage('about')} className="glass px-12 py-5 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Our Story</button>
            </div>
          </div>
        </div>
      </section>

      {/* Journal / Blog Preview */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Insights</span>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter">THE <span className="text-accent">JOURNAL</span></h2>
          </div>
          <button 
            onClick={() => setPage('blog')}
            className="text-[11px] font-black uppercase tracking-[0.3em] border-b border-accent pb-2 hover:text-accent transition-colors"
          >
            Read All Articles
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {BLOG_POSTS.slice(0, 3).map((post, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                setPage('blog-post');
              }}
            >
              <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-8">
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt={post.title}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-accent text-[10px] font-black uppercase tracking-widest mb-4 block">{post.category}</span>
              <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-accent transition-colors leading-tight">{post.title}</h3>
              <p className="text-white/40 text-sm line-clamp-2 mb-6">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                Read More <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Viewed (New) */}
      {recentlyViewed.length > 0 && (
        <section className="py-32 bg-luxury-black border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Your History</span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter uppercase">RECENTLY VIEWED</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {recentlyViewed.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => setSelectedProduct(product)}
                  onAddToCart={(p) => addToCart(p, 1)}
                  onQuickView={openQuickView}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.some(p => p.id === product.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden h-[500px] flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              alt="Promo"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-accent/10 backdrop-blur-[2px]" />
            <div className="relative z-10 px-12 md:px-24 max-w-2xl">
              <span className="text-white font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Season Finale</span>
              <h2 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-none mb-8">
                UP TO <br />
                <span className="text-accent">50% OFF</span>
              </h2>
              <button 
                onClick={() => setPage('shop')}
                className="bg-white text-luxury-black px-12 py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all"
              >
                Shop Sale
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook Section */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative z-10 rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Lookbook"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent" />
              
              {/* Interactive Hotspots */}
              <div className="absolute top-1/4 left-1/3 group">
                <div className="w-4 h-4 bg-accent rounded-full animate-ping absolute inset-0" />
                <div className="w-4 h-4 bg-accent rounded-full relative z-10 cursor-pointer" />
                <div className="absolute left-8 top-0 bg-white text-luxury-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Aura Knit Sweater</p>
                  <p className="text-xs font-black">$195</p>
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/4 group">
                <div className="w-4 h-4 bg-accent rounded-full animate-ping absolute inset-0" />
                <div className="w-4 h-4 bg-accent rounded-full relative z-10 cursor-pointer" />
                <div className="absolute right-8 top-0 bg-white text-luxury-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Zenith Tote Bag</p>
                  <p className="text-xs font-black">$120</p>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border border-accent/20 rounded-full -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 border border-white/5 rounded-full -z-10" />
          </div>

          <div className="flex flex-col gap-10">
            <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] block">Lookbook 2026</span>
            <h2 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-none">
              SHOP THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white/50">AESTHETIC</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed font-light max-w-md">
              Our Spring Lookbook is a celebration of texture, form, and the subtle interplay of light and shadow. Each piece is designed to be a cornerstone of your modern wardrobe.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setPage('shop')}>
                <div className="w-16 h-16 bg-luxury-gray rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Product" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-sm group-hover:text-accent transition-colors">Aura Knit Sweater</h4>
                  <p className="text-accent font-black">$195</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setPage('shop')}>
                <div className="w-16 h-16 bg-luxury-gray rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1544816153-36ad48bc4de6?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Product" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-sm group-hover:text-accent transition-colors">Zenith Tote Bag</h4>
                  <p className="text-accent font-black">$120</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setPage('shop')}
              className="btn-primary w-fit px-12 py-5 mt-4"
            >
              Explore Full Lookbook
            </button>
          </div>
        </div>
      </section>

      {/* Video / Parallax Section */}
      <section className="relative h-[80vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 scale-110"
            alt="Video Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-transparent to-luxury-black" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center mb-12 group cursor-pointer hover:border-accent transition-all">
              <div className="w-16 h-16 bg-white text-luxury-black rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                <Play size={24} fill="currentColor" />
              </div>
            </div>
            <span className="text-accent font-display font-bold uppercase tracking-[0.5em] text-xs mb-6">The Aura Experience</span>
            <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-12 max-w-4xl">CRAFTING THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">FUTURE</span> OF URBAN GEAR</h2>
            <button 
              onClick={() => setPage('shop')}
              className="btn-primary px-12 py-5"
            >
              Watch the Film
            </button>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Instagram Feed */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Social</span>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-8">@AURA_MODERN</h2>
          <p className="text-white/40 uppercase tracking-widest text-[11px] font-black">Tag us to be featured</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer">
              <img 
                src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?q=80&w=400&auto=format&fit=crop`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Instagram"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white" size={24} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-luxury-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Voices of Aura</span>
            <h2 className="text-5xl font-display font-black text-white tracking-tighter">TESTIMONIALS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Julian V.", role: "Creative Director", text: "The attention to detail in every piece is simply unmatched. Aura has become my go-to for minimalist luxury." },
              { name: "Elena R.", role: "Fashion Stylist", text: "Finally, a brand that understands the balance between modern trends and timeless elegance. Absolutely stunning." },
              { name: "Marcus T.", role: "Architect", text: "Clean lines, premium materials, and a seamless shopping experience. Aura is the future of digital commerce." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="glass p-12 rounded-3xl relative"
              >
                <div className="text-accent mb-8">
                  <Star size={24} fill="currentColor" />
                </div>
                <p className="text-white/60 text-lg italic leading-relaxed mb-10">"{item.text}"</p>
                <div>
                  <h4 className="text-white font-display font-bold tracking-tight">{item.name}</h4>
                  <p className="text-accent text-[10px] uppercase tracking-widest mt-1">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal / Blog Preview */}
      <section className="py-32 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-20">
            <div>
              <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Aura Journal</span>
              <h2 className="text-5xl font-display font-black text-white tracking-tighter">LATEST STORIES</h2>
            </div>
            <button className="text-accent text-xs font-black uppercase tracking-[0.3em] hover:opacity-70 transition-opacity">
              Read All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "The Art of Minimalist Living", date: "March 15, 2026", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop" },
              { title: "Sustainable Fashion: Our Commitment", date: "March 10, 2026", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" },
              { title: "Behind the Scenes: Spring Drop", date: "March 05, 2026", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" },
            ].map((post, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                  <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={post.title} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">{post.date}</span>
                <h3 className="text-2xl font-display font-black text-white group-hover:text-accent transition-colors leading-tight mb-4">{post.title}</h3>
                <button className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 group/btn">
                  Read Story <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-32 bg-luxury-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Follow Us @AuraModern</span>
            <h2 className="text-5xl font-display font-black text-white tracking-tighter">ON INSTAGRAM</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
            ].map((img, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 0.98 }}
                className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Instagram" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Instagram size={24} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inline Newsletter (New) */}
      <section className="py-32 bg-accent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-white/80 font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-8 block">Join the Inner Circle</span>
            <h2 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter mb-12 leading-[0.85]">UNLOCK 15% OFF YOUR FIRST ORDER</h2>
            <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                className="flex-1 bg-white/10 border border-white/20 px-8 py-6 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all uppercase font-bold tracking-widest text-sm"
              />
              <button className="bg-white text-accent px-12 py-6 font-black uppercase tracking-widest hover:bg-luxury-black hover:text-white transition-all">
                Subscribe
              </button>
            </form>
            <p className="mt-8 text-white/40 text-[10px] uppercase tracking-[0.2em]">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ShopPage = ({ setSelectedProduct, setPage, addToCart, openQuickView, toggleWishlist, wishlist }: { setSelectedProduct: (p: Product) => void, setPage: (p: Page) => void, addToCart: (p: Product, q: number) => void, openQuickView: (p: Product) => void, toggleWishlist: (p: Product) => void, wishlist: Product[] }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Outerwear', 'Footwear', 'Accessories', 'Lifestyle'];

  const filteredProducts = useMemo(() => {
    if (filter === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === filter);
  }, [filter]);

  return (
    <div className="pt-48 pb-32 bg-luxury-black">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-12">
          <button onClick={() => setPage('home')} className="hover:text-accent transition-colors">Home</button>
          <ChevronRight size={12} />
          <span className="text-white/60">Shop</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
          <div className="max-w-2xl">
            <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Aura Collections</span>
            <h1 className="text-7xl md:text-9xl font-display font-black text-white tracking-tighter leading-none">THE <br /> ARCHIVE</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 border transition-all duration-500 ${filter === cat ? 'bg-accent text-white border-accent' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => setSelectedProduct(product)} 
              onAddToCart={(p) => addToCart(p, 1)}
              onQuickView={openQuickView}
              onToggleWishlist={toggleWishlist}
              isWishlisted={wishlist.some(p => p.id === product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductPage = ({ product, addToCart, setPage, setSelectedProduct, toggleWishlist, wishlist, openSizeGuide }: { product: Product, addToCart: (p: Product, q: number) => void, setPage: (p: Page) => void, setSelectedProduct: (p: Product) => void, toggleWishlist: (p: Product) => void, wishlist: Product[], openSizeGuide: () => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  if (!product) return null;

  return (
    <div className="pt-40 pb-32 container mx-auto px-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-12">
        <button onClick={() => setPage('home')} className="hover:text-accent transition-colors">Home</button>
        <ChevronRight size={12} />
        <button onClick={() => setPage('shop')} className="hover:text-accent transition-colors">Shop</button>
        <ChevronRight size={12} />
        <span className="text-white/60">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
        {/* Image Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
          <div className="flex md:flex-col gap-4 order-2 md:order-1">
            {[product.image, product.image, product.image].map((img, i) => (
              <div 
                key={i}
                className={`w-20 h-20 bg-luxury-gray cursor-pointer border transition-all ${activeImage === img ? 'border-accent' : 'border-transparent'}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} className="w-full h-full object-cover" alt="Thumb" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-luxury-gray aspect-square overflow-hidden order-1 md:order-2">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={activeImage} 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-zoom-in"
              alt={product.name}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.4em] mb-4">{product.category}</p>
          <h1 className="text-5xl font-display font-black mb-6">{product.name}</h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-between w-full">
              <p className="text-3xl font-display font-bold">${product.price}</p>
              <button 
                onClick={openSizeGuide}
                className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-accent transition-colors border-b border-white/10 pb-1"
              >
                Size Guide
              </button>
            </div>
          </div>
          <div className="flex gap-1 text-accent mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            <span className="text-white/40 text-xs ml-2">(24 Reviews)</span>
          </div>

          <div className="flex items-center gap-6 mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Share</span>
            <div className="flex gap-4">
              <button className="text-white/40 hover:text-accent transition-colors"><Facebook size={16} /></button>
              <button className="text-white/40 hover:text-accent transition-colors"><Twitter size={16} /></button>
              <button className="text-white/40 hover:text-accent transition-colors"><Instagram size={16} /></button>
              <button className="text-white/40 hover:text-accent transition-colors"><Share2 size={16} /></button>
            </div>
          </div>
          
          <p className="text-white/60 leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-6">Select Size</p>
            <div className="flex gap-4">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button 
                  key={size}
                  className="w-14 h-14 border border-white/10 flex items-center justify-center text-xs font-bold hover:border-accent hover:text-accent transition-all"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-6">Select Color</p>
            <div className="flex gap-4">
              {['#000000', '#333333', '#666666'].map((color) => (
                <button 
                  key={color}
                  className="w-10 h-10 rounded-full border border-white/10 p-1 hover:border-accent transition-all"
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4">Quantity</p>
              <div className="flex items-center w-32 glass">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:text-accent transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:text-accent transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button 
              onClick={() => addToCart(product, quantity)}
              className="w-full bg-white text-luxury-black py-5 font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-3"
            >
              Add to Cart
              <ShoppingBag size={20} />
            </button>
          </div>

          <div className="mt-16 border-t border-white/10 pt-12">
            <div className="flex gap-12 mb-10 border-b border-white/5">
              {['description', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-accent' : 'text-white/40 hover:text-white'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[200px]">
              {activeTab === 'description' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-white/50 leading-relaxed font-light">
                  <p className="mb-6">{product.description}</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-accent rounded-full" /> Premium materials sourced ethically</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-accent rounded-full" /> Designed for durability and comfort</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-accent rounded-full" /> Minimalist aesthetic for modern living</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-white/5 pb-8 last:border-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent font-bold text-xs">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">{review.user}</p>
                              <p className="text-white/20 text-[10px] uppercase tracking-widest">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 text-accent">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 glass rounded-2xl">
                      <MessageSquare size={40} className="mx-auto mb-4 text-white/10" />
                      <p className="text-white/40 text-sm">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent shrink-0">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Free Standard Shipping</h4>
                      <p className="text-white/40 text-xs leading-relaxed">On all orders over $500. Typically arrives in 3-5 business days.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent shrink-0">
                      <RotateCcw size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Easy Returns</h4>
                      <p className="text-white/40 text-xs leading-relaxed">30-day return window for unworn items in original packaging.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-3xl font-display font-black mb-12 uppercase tracking-widest">Related Essentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onClick={() => { setSelectedProduct(p); setPage('product'); }} 
              onToggleWishlist={toggleWishlist}
              isWishlisted={wishlist.some(item => item.id === p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, updateQuantity, removeItem, setPage }: { cart: CartItem[], updateQuantity: (id: number, q: number) => void, removeItem: (id: number) => void, setPage: (p: Page) => void }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="pt-40 pb-32 container mx-auto px-6">
      <h1 className="text-6xl font-display font-black mb-20">YOUR CART</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 glass">
          <ShoppingBag size={64} className="mx-auto mb-8 text-white/20" />
          <p className="text-xl text-white/50 mb-8">Your cart is currently empty.</p>
          <button 
            onClick={() => setPage('shop')}
            className="bg-white text-luxury-black px-10 py-5 font-bold uppercase tracking-widest hover:bg-accent transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-8">
              {cart.map(item => (
                <div key={item.id} className="glass p-6 flex flex-col sm:flex-row items-center gap-8">
                  <div className="w-32 h-32 bg-luxury-gray overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{item.category}</p>
                    <h3 className="text-xl font-display font-bold mb-2">{item.name}</h3>
                    <p className="text-white/50 text-sm mb-4">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center w-32 border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:text-accent transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex-1 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:text-accent transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-display font-bold text-lg w-24 text-right">${item.price * item.quantity}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-white/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass p-10 sticky top-32">
              <h3 className="text-2xl font-display font-bold mb-8 uppercase tracking-widest">Summary</h3>
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="h-[1px] bg-white/10 my-2" />
                <div className="flex justify-between text-xl font-display font-bold">
                  <span>Total</span>
                  <span className="text-accent">${subtotal}</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Promo Code</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="ENTER CODE" 
                    className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-xs focus:border-accent outline-none uppercase font-bold tracking-widest"
                  />
                  <button className="bg-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Apply</button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setPage('checkout')}
                  className="w-full bg-white text-luxury-black py-5 font-bold uppercase tracking-widest hover:bg-accent transition-all"
                >
                  Proceed to Checkout
                </button>
                <button 
                  onClick={() => setPage('shop')}
                  className="w-full border border-white/10 py-5 font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = ({ cart, setPage, clearCart }: { cart: CartItem[], setPage: (p: Page) => void, clearCart: () => void }) => {
  const [isOrdered, setIsOrdered] = useState(false);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (isOrdered) {
    return (
      <div className="pt-40 pb-32 container mx-auto px-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl mx-auto glass p-20 rounded-3xl"
        >
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-10 text-white">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-5xl font-display font-black mb-6 uppercase tracking-tighter">Order Confirmed</h1>
          <p className="text-white/50 text-lg mb-12 leading-relaxed">
            Thank you for your purchase. Your order <span className="text-accent font-bold">#AURA-92831</span> has been placed successfully. 
            We've sent a confirmation email to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => { clearCart(); setPage('home'); }}
              className="bg-white text-luxury-black px-10 py-5 font-bold uppercase tracking-widest hover:bg-accent transition-all"
            >
              Back to Home
            </button>
            <button 
              onClick={() => setPage('order-tracking')}
              className="border border-white/10 px-10 py-5 font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Track Order
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-display font-black mb-12">CHECKOUT</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-accent pb-2 inline-block">Shipping Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" />
                <input type="text" placeholder="Last Name" className="bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" />
                <input type="email" placeholder="Email Address" className="col-span-2 bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" />
                <input type="text" placeholder="Address" className="col-span-2 bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" />
                <input type="text" placeholder="City" className="bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" />
                <input type="text" placeholder="Postal Code" className="bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-accent pb-2 inline-block">Payment Method</h3>
              <div className="flex flex-col gap-4">
                <div className="glass p-4 flex items-center gap-4 cursor-pointer border-accent">
                  <div className="w-4 h-4 rounded-full border-2 border-accent flex items-center justify-center">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Credit Card</span>
                </div>
                <div className="glass p-4 flex items-center gap-4 cursor-pointer opacity-50">
                  <div className="w-4 h-4 rounded-full border-2 border-white/20" />
                  <span className="text-sm font-bold uppercase tracking-widest">PayPal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="glass p-8">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Order Review</h3>
              <div className="flex flex-col gap-4 mb-8">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/50">{item.name} x {item.quantity}</span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className="text-accent">FREE</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4" />
                <div className="flex justify-between text-xl font-display font-bold">
                  <span>Total</span>
                  <span className="text-accent">${subtotal}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOrdered(true)}
                className="w-full bg-accent text-luxury-black py-5 font-bold uppercase tracking-widest hover:bg-white transition-all"
              >
                Complete Order
              </button>
            </div>
            <p className="text-[10px] text-white/30 text-center uppercase tracking-widest">
              By completing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery." },
    { q: "What is your return policy?", a: "We offer a 30-day return policy for all unworn items in their original packaging." },
    { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location." },
    { q: "How can I track my order?", a: "You can track your order using the 'Order Tracking' page with your order ID and email address." },
    { q: "Are your materials sustainable?", a: "We prioritize sustainability by sourcing eco-friendly materials and working with ethical manufacturers." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-40 pb-32 container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block text-center">Support Center</span>
        <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter mb-16 text-center">FREQUENTLY ASKED <span className="text-accent">QUESTIONS</span></h1>
        
        <div className="flex flex-col gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/5 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-8 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-lg font-display font-bold text-white uppercase tracking-wider">{faq.q}</span>
                <ChevronDown size={20} className={`text-accent transition-transform duration-500 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-8 pb-8 text-white/40 leading-relaxed font-light">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-white/[0.02] rounded-3xl border border-white/5 text-center">
          <h3 className="text-2xl font-display font-black text-white mb-4 uppercase">Still have questions?</h3>
          <p className="text-white/40 mb-8 font-light">Our support team is here to help you 24/7.</p>
          <button className="btn-primary px-10 py-4">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

const BlogPage = ({ setPage, setSelectedPost }: { setPage: (p: Page) => void, setSelectedPost: (p: BlogPost) => void }) => {
  return (
    <div className="pt-40 pb-24 min-h-screen bg-luxury-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-8"
          >
            THE <span className="text-accent">JOURNAL</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg md:text-xl leading-relaxed"
          >
            Insights into sustainable design, urban exploration, and the future of performance-driven fashion.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {BLOG_POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                setPage('blog-post');
              }}
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-8 rounded-2xl">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-accent text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">
                <span>{post.date}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-accent transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-accent text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                Read Article <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BlogPostPage = ({ post, setPage }: { post: BlogPost | null, setPage: (p: Page) => void }) => {
  if (!post) return null;

  return (
    <div className="pt-40 pb-24 min-h-screen bg-luxury-black">
      <div className="container mx-auto px-6">
        <button 
          onClick={() => setPage('blog')}
          className="flex items-center gap-3 text-white/50 hover:text-accent transition-colors mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest">Back to Journal</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <span className="bg-accent text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <span>{post.date}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-12 leading-[0.9]">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-16 pb-16 border-b border-white/5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-accent">
              <User size={24} />
            </div>
            <div>
              <p className="text-white text-sm font-bold">{post.author}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Lead Designer</p>
            </div>
          </div>

          <div className="aspect-video rounded-3xl overflow-hidden mb-16">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 text-xl leading-relaxed mb-8 first-letter:text-7xl first-letter:font-black first-letter:text-accent first-letter:mr-3 first-letter:float-left">
              {post.content}
            </p>
            <p className="text-white/70 text-xl leading-relaxed mb-8">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
            </p>
            <blockquote className="border-l-4 border-accent pl-8 py-4 my-12 italic text-3xl font-display text-white">
              "Design is not just what it looks like and feels like. Design is how it works."
            </blockquote>
            <p className="text-white/70 text-xl leading-relaxed mb-8">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>
          </div>

          <div className="mt-24 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Share this article:</span>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-all">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-all">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <button 
              onClick={() => setPage('blog')}
              className="bg-white text-luxury-black px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all"
            >
              More Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      if (orderId.length > 5) setStatus('found');
      else setStatus('error');
    }, 1500);
  };

  return (
    <div className="pt-40 pb-24 min-h-screen bg-luxury-black">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-8">
              <Truck size={40} />
            </div>
            <h1 className="text-5xl font-display font-black tracking-tighter mb-6">TRACK YOUR <span className="text-accent">ORDER</span></h1>
            <p className="text-white/50">Enter your order details below to see the real-time status of your shipment.</p>
          </div>

          <div className="bg-white/5 p-10 rounded-3xl border border-white/5 backdrop-blur-xl">
            <form onSubmit={handleTrack} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Order ID</label>
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. #AURA-123456"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Billing Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none transition-colors"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-accent text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-luxury-black transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Locating Package...' : 'Track Order'}
              </button>
            </form>

            {status === 'found' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 pt-12 border-t border-white/10"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Status</p>
                    <p className="text-accent font-black text-xl">In Transit</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Estimated Delivery</p>
                    <p className="text-white font-black text-xl">March 25, 2026</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {[
                    { title: 'Out for Delivery', time: 'Today, 8:30 AM', active: false },
                    { title: 'Arrived at Local Facility', time: 'Yesterday, 11:45 PM', active: true },
                    { title: 'In Transit', time: 'March 20, 2:15 PM', active: true },
                    { title: 'Order Processed', time: 'March 19, 10:00 AM', active: true },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 relative">
                      {i !== 3 && <div className={`absolute left-[11px] top-8 w-[2px] h-12 ${step.active ? 'bg-accent' : 'bg-white/10'}`} />}
                      <div className={`w-6 h-6 rounded-full border-4 ${step.active ? 'bg-accent border-accent/20' : 'bg-luxury-black border-white/10'} z-10 flex-shrink-0`} />
                      <div>
                        <p className={`text-sm font-bold ${step.active ? 'text-white' : 'text-white/30'}`}>{step.title}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center"
              >
                <p className="text-sm font-bold">Order not found. Please check your details and try again.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="pt-40 pb-32">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto mb-32">
        <h1 className="text-8xl font-display font-black mb-12 text-gradient leading-none">WE ARE <br /> AURA</h1>
        <p className="text-2xl text-white/70 leading-relaxed mb-12">
          Born in the digital age, Aura was founded on the belief that technology should be an extension of our personal style, not a distraction from it.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <p className="text-white/50 leading-relaxed">
            We curate and create essentials for the modern visionary. Our design philosophy is rooted in functional minimalism—stripping away the noise to reveal the essence of form and utility. Every product in our collection undergoes rigorous selection to ensure it meets our standards of excellence.
          </p>
          <p className="text-white/50 leading-relaxed">
            From our headquarters in the heart of the tech district, we collaborate with global engineers and designers to push the boundaries of what's possible. Aura isn't just a store; it's a lifestyle movement for those who demand more from their everyday gear.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <div className="relative h-[600px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60" alt="Office" referrerPolicy="no-referrer" />
          <div className="absolute bottom-10 left-10">
            <h4 className="text-2xl font-display font-bold uppercase">Innovation</h4>
          </div>
        </div>
        <div className="relative h-[600px] overflow-hidden mt-12">
          <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60" alt="Design" referrerPolicy="no-referrer" />
          <div className="absolute bottom-10 left-10">
            <h4 className="text-2xl font-display font-bold uppercase">Design</h4>
          </div>
        </div>
        <div className="relative h-[600px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60" alt="Tech" referrerPolicy="no-referrer" />
          <div className="absolute bottom-10 left-10">
            <h4 className="text-2xl font-display font-bold uppercase">Quality</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CollectionsPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const collections = [
    { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aec16adcd?q=80&w=800&auto=format&fit=crop', count: 12 },
    { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', count: 8 },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop', count: 15 },
    { name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop', count: 10 },
  ];

  return (
    <div className="pt-48 pb-32 bg-luxury-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Explore Aura</span>
          <h1 className="text-7xl md:text-9xl font-display font-black text-white tracking-tighter leading-none">OUR <br /> COLLECTIONS</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              onClick={() => setPage('shop')}
              className="group relative h-[500px] overflow-hidden rounded-2xl cursor-pointer"
            >
              <img 
                src={col.image} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                alt={col.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12">
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">{col.count} Items</span>
                <h3 className="text-5xl font-display font-black text-white mb-4">{col.name}</h3>
                <button className="text-white text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 group/btn">
                  View Collection <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-2" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PolicyPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
  <div className="pt-48 pb-32 bg-luxury-black">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter mb-16 uppercase">{title}</h1>
        <div className="prose prose-invert max-w-none text-white/60 leading-relaxed font-light space-y-8">
          {content}
        </div>
      </div>
    </div>
  </div>
);

const PrivacyPolicy = () => (
  <PolicyPage 
    title="Privacy Policy"
    content={
      <>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
        </section>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, and send administrative messages.</p>
        </section>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">3. Sharing of Information</h2>
          <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including with third-party service providers who perform services on our behalf.</p>
        </section>
      </>
    }
  />
);

const RefundPolicy = () => (
  <PolicyPage 
    title="Refund Policy"
    content={
      <>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">Returns & Exchanges</h2>
          <p>We want you to be completely satisfied with your Aura purchase. If for any reason you are not, we accept returns and exchanges within 30 days of delivery. Items must be in their original condition, unworn, unwashed, and with all tags attached.</p>
        </section>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">Refund Process</h2>
          <p>Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.</p>
        </section>
      </>
    }
  />
);

const ShippingPolicy = () => (
  <PolicyPage 
    title="Shipping Policy"
    content={
      <>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">Worldwide Shipping</h2>
          <p>Aura offers worldwide shipping. We partner with premium carriers to ensure your order arrives safely and promptly. Shipping costs and delivery times vary depending on your location and the shipping method selected at checkout.</p>
        </section>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">Free Shipping</h2>
          <p>We offer free standard shipping on all orders over $500. For orders under $500, a flat rate shipping fee will be applied based on your region.</p>
        </section>
      </>
    }
  />
);

const TermsOfService = () => (
  <PolicyPage 
    title="Terms of Service"
    content={
      <>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">1. Terms</h2>
          <p>By accessing the website at auramodern.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
        </section>
        <section>
          <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-widest">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Aura's website for personal, non-commercial transitory viewing only.</p>
        </section>
      </>
    }
  />
);

const WishlistPage = ({ wishlist, toggleWishlist, addToCart, setPage }: { wishlist: Product[], toggleWishlist: (p: Product) => void, addToCart: (p: Product, q: number) => void, setPage: (p: Page) => void }) => (
  <div className="pt-40 pb-32 container mx-auto px-6">
    <div className="mb-20">
      <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Your Favorites</span>
      <h1 className="text-6xl font-display font-black text-white tracking-tighter uppercase">WISHLIST</h1>
    </div>

    {wishlist.length === 0 ? (
      <div className="text-center py-32 glass rounded-3xl">
        <Heart size={64} className="mx-auto mb-8 text-white/10" />
        <p className="text-xl text-white/40 mb-12">Your wishlist is empty.</p>
        <button 
          onClick={() => setPage('shop')}
          className="btn-primary px-12 py-5 mx-auto"
        >
          Explore Shop
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {wishlist.map((product) => (
          <ProductCard 
            key={product.id}
            product={product} 
            onClick={() => {}} 
            onAddToCart={(p) => addToCart(p, 1)}
            onToggleWishlist={toggleWishlist}
            isWishlisted={true}
          />
        ))}
      </div>
    )}
  </div>
);

const NewsletterModal = ({ showNewsletter, setShowNewsletter }: { showNewsletter: boolean, setShowNewsletter: (s: boolean) => void }) => {
  const [newsletterStep, setNewsletterStep] = useState<'form' | 'success'>('form');

  return (
    <AnimatePresence>
      {showNewsletter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowNewsletter(false); localStorage.setItem('hasSeenNewsletter', 'true'); }}
            className="absolute inset-0 bg-luxury-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-luxury-black rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl border border-white/5"
          >
            <div className="relative h-64 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Newsletter"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-accent/20" />
            </div>
            <div className="p-12 md:p-16 flex flex-col justify-center">
              <button 
                onClick={() => { setShowNewsletter(false); localStorage.setItem('hasSeenNewsletter', 'true'); }}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              {newsletterStep === 'form' ? (
                <>
                  <span className="text-accent font-display font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Join the Archive</span>
                  <h2 className="text-4xl font-display font-black text-white tracking-tighter mb-6 uppercase">Get 15% Off</h2>
                  <p className="text-white/40 text-sm mb-8 leading-relaxed uppercase tracking-widest">
                    Subscribe to receive updates, access to exclusive deals, and more.
                  </p>
                  <form 
                    onSubmit={(e) => { e.preventDefault(); setNewsletterStep('success'); }}
                    className="flex flex-col gap-4"
                  >
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email" 
                      className="bg-white/5 border border-white/10 p-5 text-sm focus:border-accent outline-none transition-all uppercase font-bold tracking-widest"
                    />
                    <button 
                      type="submit"
                      className="bg-white text-luxury-black py-5 font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                    >
                      Subscribe Now
                    </button>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 text-white">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-3xl font-display font-black text-white mb-4 uppercase tracking-tighter">Welcome to Aura</h2>
                  <p className="text-white/40 text-sm mb-10 leading-relaxed uppercase tracking-widest">Check your inbox for your 15% discount code.</p>
                  <button 
                    onClick={() => { setShowNewsletter(false); localStorage.setItem('hasSeenNewsletter', 'true'); }}
                    className="bg-white text-luxury-black px-10 py-4 font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                  >
                    Start Shopping
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ThemeCustomizer = ({ accentColor, setAccentColor }: { accentColor: string, setAccentColor: (c: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = ['#ff6b00', '#00ff88', '#0088ff', '#ff0088', '#ffffff'];

  return (
    <div className="fixed bottom-8 left-8 z-[120]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white text-luxury-black rounded-full shadow-2xl flex items-center justify-center hover:bg-accent hover:text-white transition-all"
      >
        <Settings size={20} className={isOpen ? 'rotate-90 transition-transform' : ''} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 left-0 w-64 glass p-6 rounded-2xl shadow-2xl"
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6">Theme Customizer</h4>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-3">Accent Color</p>
                <div className="flex gap-3">
                  {colors.map(c => (
                    <button 
                      key={c}
                      onClick={() => setAccentColor(c)}
                      className={`w-6 h-6 rounded-full border-2 ${accentColor === c ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[8px] text-white/20 uppercase leading-relaxed">
                This panel simulates the "Theme Settings" found in Shopify or WordPress customizers.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactPage = () => (
  <div className="pt-40 pb-32 container mx-auto px-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div>
        <h1 className="text-7xl font-display font-black mb-8">GET IN <br /> TOUCH</h1>
        <p className="text-xl text-white/50 mb-12 max-w-md">Have a question or want to collaborate? We'd love to hear from you.</p>
        
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-accent">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Location</p>
              <p className="font-bold">123 Tech Avenue, San Francisco, CA</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-accent">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Phone</p>
              <p className="font-bold">+1 (555) 000-1234</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-accent">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Email</p>
              <p className="font-bold">hello@auramodern.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-12">
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Name</label>
              <input type="text" className="bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" placeholder="Your Name" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Email</label>
              <input type="email" className="bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" placeholder="Your Email" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Subject</label>
            <input type="text" className="bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none" placeholder="How can we help?" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Message</label>
            <textarea rows={5} className="bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none resize-none" placeholder="Your message..."></textarea>
          </div>
          <button className="bg-white text-luxury-black py-5 font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-3">
            Send Message
            <ArrowUpRight size={20} />
          </button>
        </form>
      </div>
    </div>
  </div>
);

// --- Main App ---

// --- Main Application Component ---
/**
 * The App component serves as the central hub for state management and routing.
 * It handles the cart, wishlist, recently viewed products, and navigation.
 * 
 * For students/developers:
 * - State: Uses React's useState for local state management.
 * - Routing: Implements a simple conditional rendering based on the 'page' state.
 * - Persistence: Uses localStorage to persist cart, wishlist, and recently viewed items.
 * - Theme: Uses CSS variables for dynamic accent color customization.
 */
export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || '#ff6b00';
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Persistence
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.style.setProperty('--color-accent', accentColor);
  }, [accentColor]);

  const [showBackToTop, setShowBackToTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false);

  // Recently Viewed Logic
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);

  const handleSetSelectedProduct = (product: Product) => {
    setSelectedProduct(product);
    setPage('product');
    
    // Update recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  // Show newsletter after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletter');
      if (!hasSeenNewsletter) {
        setShowNewsletter(true);
      }
    }, 5000);
    
    const hasAcceptedCookies = localStorage.getItem('hasAcceptedCookies');
    if (!hasAcceptedCookies) {
      setShowCookieConsent(true);
    }

    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.style.setProperty('--color-accent', accentColor);
  }, [accentColor]);

  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-luxury-black flex flex-col items-center justify-center z-[200]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-24 h-24 border-2 border-white/5 rounded-full animate-spin border-t-accent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-display font-black tracking-tighter text-white">A</span>
          </div>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/40"
        >
          Aura Modern
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white selection:bg-accent selection:text-luxury-black cursor-none">
      <a href="#main-content" className="sr-only focus:not-sr-only fixed top-4 left-4 z-[200] bg-accent text-white px-6 py-3 font-bold uppercase tracking-widest">Skip to content</a>
      
      {/* Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 border border-accent rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{ 
          x: cursorPos.x - 16, 
          y: cursorPos.y - 16,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent'
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
      />
      <motion.div 
        className="fixed top-0 left-0 w-1 h-1 bg-accent rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{ x: cursorPos.x - 2, y: cursorPos.y - 2 }}
      />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-accent z-[100] transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
      
      <PromoBanner />
      <AnnouncementBar />
      <Navbar 
        currentPage={page} 
        setPage={setPage} 
        cartCount={cartCount} 
        wishlistCount={wishlist.length}
        toggleCart={() => setIsCartOpen(!isCartOpen)} 
        openSearch={() => setIsSearchOpen(true)}
      />

      <main id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {page === 'home' && <HomePage setPage={setPage} setSelectedProduct={handleSetSelectedProduct} setSelectedPost={setSelectedPost} addToCart={addToCart} openQuickView={openQuickView} recentlyViewed={recentlyViewed} toggleWishlist={toggleWishlist} wishlist={wishlist} />}
            {page === 'shop' && <ShopPage setSelectedProduct={handleSetSelectedProduct} setPage={setPage} addToCart={addToCart} openQuickView={openQuickView} toggleWishlist={toggleWishlist} wishlist={wishlist} />}
            {page === 'collections' && <CollectionsPage setPage={setPage} />}
            {page === 'product' && selectedProduct && <ProductPage product={selectedProduct} addToCart={addToCart} setPage={setPage} setSelectedProduct={handleSetSelectedProduct} toggleWishlist={toggleWishlist} wishlist={wishlist} openSizeGuide={() => setIsSizeGuideOpen(true)} />}
            {page === 'cart' && <CartPage cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} setPage={setPage} />}
            {page === 'checkout' && <CheckoutPage cart={cart} setPage={setPage} clearCart={() => setCart([])} />}
            {page === 'wishlist' && <WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} setPage={setPage} />}
            {page === 'blog' && <BlogPage setPage={setPage} setSelectedPost={setSelectedPost} />}
            {page === 'blog-post' && <BlogPostPage post={selectedPost} setPage={setPage} />}
            {page === 'order-tracking' && <OrderTrackingPage />}
            {page === 'about' && <AboutPage />}
            {page === 'contact' && <ContactPage />}
            {page === 'privacy-policy' && <PrivacyPolicy />}
            {page === 'refund-policy' && <RefundPolicy />}
            {page === 'shipping-policy' && <ShippingPolicy />}
            {page === 'terms-of-service' && <TermsOfService />}
            {page === 'faq' && <FAQPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        setPage={setPage} 
        setSelectedProduct={handleSetSelectedProduct} 
      />

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />

      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        addToCart={addToCart} 
      />

      <ThemeCustomizer accentColor={accentColor} setAccentColor={setAccentColor} />

      <Footer setPage={setPage} />

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-12 h-12 bg-white text-luxury-black rounded-full flex items-center justify-center shadow-2xl z-[60] hover:bg-accent hover:text-white transition-all"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Live Chat Mock */}
      <div className="fixed bottom-24 left-6 md:bottom-10 md:left-10 z-[60]">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
        >
          {isChatOpen ? <X size={20} /> : <Headphones size={20} />}
        </button>
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 left-0 w-80 glass p-6 rounded-2xl shadow-2xl border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Aura Concierge</p>
                  <p className="text-[10px] text-accent uppercase tracking-widest">Online</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl mb-6 text-xs text-white/60 leading-relaxed">
                Hello! How can we assist you with your luxury shopping experience today?
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-xs rounded-lg focus:border-accent outline-none"
                />
                <button className="bg-accent text-white p-2 rounded-lg"><ArrowUpRight size={16} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-luxury-black/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
        <button onClick={() => setPage('home')} className={`flex flex-col items-center gap-1 ${page === 'home' ? 'text-accent' : 'text-white/40'}`}>
          <ShoppingBag size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => setPage('shop')} className={`flex flex-col items-center gap-1 ${page === 'shop' ? 'text-accent' : 'text-white/40'}`}>
          <Search size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Shop</span>
        </button>
        <button onClick={() => setPage('wishlist')} className={`flex flex-col items-center gap-1 ${page === 'wishlist' ? 'text-accent' : 'text-white/40'}`}>
          <Heart size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Wishlist</span>
        </button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-white/40 relative">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[8px] flex items-center justify-center rounded-full">{cartCount}</span>}
          <span className="text-[8px] font-black uppercase tracking-widest">Cart</span>
        </button>
      </div>

      {/* Newsletter Modal */}
      <NewsletterModal showNewsletter={showNewsletter} setShowNewsletter={setShowNewsletter} />

      {/* Cookie Consent */}

      {/* Cookie Consent */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-96 z-[90] glass p-8 rounded-2xl border border-white/10 shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Privacy Preference</h4>
                <p className="text-white/40 text-xs leading-relaxed">
                  We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  localStorage.setItem('hasAcceptedCookies', 'true');
                  setShowCookieConsent(false);
                }}
                className="flex-1 bg-white text-luxury-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
              >
                Accept
              </button>
              <button 
                onClick={() => setShowCookieConsent(false)}
                className="flex-1 glass py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Decline
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-black z-[70] border-l border-white/10 flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-white/10">
                <h2 className="text-xl font-display font-bold uppercase tracking-widest">Your Cart ({cartCount})</h2>
                <button onClick={() => setIsCartOpen(false)} className="hover:text-accent transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="px-8 py-6 bg-white/[0.02] border-b border-white/10">
                {cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) >= 500 ? (
                  <div className="flex items-center gap-3 text-accent">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">You've unlocked free shipping!</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">
                      Add <span className="text-white font-bold">${500 - cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span> more for free shipping
                    </p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) / 500) * 100)}%` }}
                        className="h-full bg-accent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/30">
                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                    <p className="uppercase tracking-widest text-xs">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-luxury-gray overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                        <p className="text-xs text-white/40 mb-2">${item.price} x {item.quantity}</p>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-white/40 hover:text-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-white/40 hover:text-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-white/10 bg-luxury-gray/30">
                  <div className="flex justify-between mb-6">
                    <span className="uppercase tracking-widest text-xs font-bold">Subtotal</span>
                    <span className="text-accent font-bold">${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { setPage('cart'); setIsCartOpen(false); }}
                      className="w-full glass py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                      View Cart
                    </button>
                    <button 
                      onClick={() => { setPage('checkout'); setIsCartOpen(false); }}
                      className="w-full bg-white text-luxury-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ScrollToTop />
    </div>
  );
}
