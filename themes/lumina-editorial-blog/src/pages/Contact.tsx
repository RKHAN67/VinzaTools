import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Send, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 lg:px-12 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 space-y-12"
        >
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-8">
              Connect With Us
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-light leading-[0.9] text-brand-black mb-10">
              Get in <br />
              <span className="italic text-brand-accent">Touch.</span>
            </h1>
            <p className="text-xl font-serif italic text-brand-black/50 leading-relaxed max-w-md">
              "Have a story tip, a question about our publication, or just want to say hello? We'd love to hear from you."
            </p>
          </div>

          <div className="space-y-12 pt-12 border-t border-brand-black/5">
            {[
              { icon: Mail, label: 'Email Us', value: 'hello@bluevinza.com' },
              { icon: MapPin, label: 'Visit Us', value: 'Via della Spiga, 15, 20121 Milano, Italy' },
              { icon: Phone, label: 'Call Us', value: '+39 02 1234 5678' }
            ].map((item, i) => (
              <div key={i} className="group flex items-center space-x-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-brand-accent/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-500">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black/30 mb-1">{item.label}</h4>
                  <p className="text-lg font-serif italic text-brand-black/70">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 lg:col-start-7"
        >
          <div className="glass-panel p-12 md:p-16 rounded-[3rem] premium-shadow">
            <form className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/30 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-0 py-4 bg-transparent border-b border-brand-black/10 text-brand-black placeholder:text-brand-black/20 focus:outline-none focus:border-brand-accent transition-all font-serif italic text-lg"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/30 ml-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-0 py-4 bg-transparent border-b border-brand-black/10 text-brand-black placeholder:text-brand-black/20 focus:outline-none focus:border-brand-accent transition-all font-serif italic text-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/30 ml-1">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-0 py-4 bg-transparent border-b border-brand-black/10 text-brand-black placeholder:text-brand-black/20 focus:outline-none focus:border-brand-accent transition-all font-serif italic text-lg"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/30 ml-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us more..."
                  className="w-full px-0 py-4 bg-transparent border-b border-brand-black/10 text-brand-black placeholder:text-brand-black/20 focus:outline-none focus:border-brand-accent transition-all font-serif italic text-lg resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="group w-full py-6 bg-brand-black text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-brand-accent transition-all duration-500 flex items-center justify-center premium-shadow"
              >
                Send Message <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
