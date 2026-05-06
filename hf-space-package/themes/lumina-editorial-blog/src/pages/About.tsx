import React from 'react';
import { motion } from 'motion/react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 lg:px-12 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-32 max-w-5xl mx-auto"
      >
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-8">
          Our Philosophy
        </span>
        <h1 className="text-6xl md:text-9xl font-serif font-light leading-[0.9] text-brand-black mb-12">
          We believe in the <br />
          <span className="italic">Power of Stories.</span>
        </h1>
        <p className="text-2xl font-serif italic text-brand-black/50 leading-relaxed max-w-3xl mx-auto">
          "BlueVinza is a digital publication dedicated to exploring the intersection of technology, design, and culture in the 21st century. We curate the extraordinary in the everyday."
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="aspect-[21/9] rounded-[3rem] overflow-hidden mb-32 premium-shadow"
      >
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
          alt="Our workspace"
          className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
        <div className="lg:col-span-5 space-y-10">
          <h2 className="text-5xl font-serif font-light italic">Our <span className="not-italic font-medium">Mission</span></h2>
          <div className="space-y-8 text-xl font-serif text-brand-black/60 leading-relaxed italic">
            <p>
              "In a world of bite-sized content and fleeting attention spans, BlueVinza aims to provide a sanctuary for deep thought and meaningful analysis. We don't just report on what's happening; we explore why it matters."
            </p>
            <p>
              "Our team of writers, designers, and thinkers are committed to high-quality journalism that respects the reader's intelligence and time."
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-6 lg:col-start-7 space-y-16">
          <h2 className="text-5xl font-serif font-light italic">Our <span className="not-italic font-medium">Values</span></h2>
          <div className="space-y-12">
            {[
              { id: '01', title: 'Quality over Quantity', desc: 'We publish fewer articles to ensure every piece is worth your time.' },
              { id: '02', title: 'Human-Centric', desc: 'Technology should serve people, not the other way around.' },
              { id: '03', title: 'Radical Transparency', desc: 'We are open about our process, our biases, and our funding.' }
            ].map((value) => (
              <div key={value.id} className="group flex items-start gap-10 pb-12 border-b border-brand-black/5 last:border-0">
                <span className="text-5xl font-serif font-light italic text-brand-black/10 group-hover:text-brand-accent transition-colors duration-500">
                  {value.id}
                </span>
                <div className="space-y-3">
                  <h4 className="text-2xl font-serif font-medium group-hover:text-brand-accent transition-colors duration-500">{value.title}</h4>
                  <p className="text-lg font-serif italic text-brand-black/40 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
