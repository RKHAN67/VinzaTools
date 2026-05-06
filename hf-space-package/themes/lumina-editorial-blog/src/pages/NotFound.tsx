import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[15rem] md:text-[25rem] font-serif font-black leading-none tracking-tighter text-black/5 select-none relative">
            404
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl md:text-6xl font-serif font-black text-black tracking-tight">Lost in the <span className="text-brand-accent italic">void.</span></span>
            </div>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 space-y-8"
        >
          <p className="text-xl text-black/40 font-serif italic max-w-md mx-auto">
            The story you are looking for has either been archived, moved, or never existed in this dimension.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/" 
              className="group flex items-center space-x-4 px-10 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all duration-500 shadow-2xl shadow-black/20"
            >
              <Home size={16} />
              <span>Back to Journal</span>
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="group flex items-center space-x-4 px-10 py-5 bg-black/5 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
