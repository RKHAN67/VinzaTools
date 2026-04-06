/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Award, 
  Menu, 
  X,
  Linkedin,
  Twitter,
  Facebook,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Globe
} from 'lucide-react';

// --- Types ---
interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface Testimonial {
  id: number;
  content: string;
  author: string;
  company: string;
}

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '#about' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-blue-800' : 'text-white'}`}>
              Blue<span className="text-blue-500">Vinza</span>
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${isScrolled ? 'text-slate-700' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact" 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isScrolled ? 'text-slate-900' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 px-3">
                <a 
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
          alt="Corporate Office" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6">
            Leading Business Solutions
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Empowering Your <span className="text-blue-400">Digital Future</span>
          </h1>
          <p className="text-xl text-blue-100/80 mb-10 leading-relaxed">
            BlueVinza provides innovative corporate strategies and technological solutions to help your business scale in an ever-evolving global market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#services" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center group">
              Explore Services
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            <a href="#about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all text-center">
              Learn More
            </a>
          </div>
        </motion.div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-white/5 backdrop-blur-sm border-t border-white/10 py-8 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-blue-400">15+</span>
            <span className="text-sm uppercase tracking-widest text-blue-200">Years of Experience</span>
          </div>
          <div className="h-12 w-px bg-white/20"></div>
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-blue-400">500+</span>
            <span className="text-sm uppercase tracking-widest text-blue-200">Global Clients</span>
          </div>
          <div className="h-12 w-px bg-white/20"></div>
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-blue-400">98%</span>
            <span className="text-sm uppercase tracking-widest text-blue-200">Client Satisfaction</span>
          </div>
          <div className="h-12 w-px bg-white/20"></div>
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-blue-400">24/7</span>
            <span className="text-sm uppercase tracking-widest text-blue-200">Expert Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services: Service[] = [
    {
      id: 1,
      title: "Strategic Consulting",
      description: "Tailored business strategies to optimize your operations and maximize growth potential.",
      icon: <BarChart3 className="text-blue-600" size={32} />
    },
    {
      id: 2,
      title: "Digital Transformation",
      description: "Modernize your business with cutting-edge technology and seamless digital workflows.",
      icon: <Zap className="text-blue-600" size={32} />
    },
    {
      id: 3,
      title: "Risk Management",
      description: "Comprehensive risk assessment and mitigation strategies to protect your corporate assets.",
      icon: <Shield className="text-blue-600" size={32} />
    },
    {
      id: 4,
      title: "Global Expansion",
      description: "Scale your business across borders with our international market entry expertise.",
      icon: <Globe className="text-blue-600" size={32} />
    },
    {
      id: 5,
      title: "Financial Advisory",
      description: "Expert financial planning and investment strategies for sustainable long-term success.",
      icon: <Briefcase className="text-blue-600" size={32} />
    },
    {
      id: 6,
      title: "Operational Excellence",
      description: "Streamline your internal processes to increase efficiency and reduce overhead costs.",
      icon: <CheckCircle2 className="text-blue-600" size={32} />
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Our Expertise</h2>
          <p className="text-4xl font-bold text-slate-900 mb-4">Solutions Built for Success</p>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div 
              key={service.id}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
              <a href="#contact" className="mt-6 inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                Learn more <ChevronRight size={16} className="ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                alt="Team Meeting" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-600 rounded-2xl -z-0 hidden md:block"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-0 hidden md:block"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">About BlueVinza</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              A Legacy of Excellence and Innovation
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Founded on the principles of integrity and forward-thinking, BlueVinza has grown from a boutique consultancy into a global leader in corporate strategy and digital solutions.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We believe that every business has the potential to achieve greatness. Our mission is to provide the tools, insights, and support necessary to unlock that potential and drive sustainable growth.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="mt-1 bg-blue-100 p-1 rounded-full">
                  <CheckCircle2 className="text-blue-600" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Client-Centric</h4>
                  <p className="text-sm text-slate-500">Your success is our primary metric.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 bg-blue-100 p-1 rounded-full">
                  <CheckCircle2 className="text-blue-600" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Innovation First</h4>
                  <p className="text-sm text-slate-500">Always staying ahead of the curve.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 bg-blue-100 p-1 rounded-full">
                  <CheckCircle2 className="text-blue-600" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Global Reach</h4>
                  <p className="text-sm text-slate-500">Expertise across multiple continents.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 bg-blue-100 p-1 rounded-full">
                  <CheckCircle2 className="text-blue-600" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Expert Team</h4>
                  <p className="text-sm text-slate-500">Industry veterans at your service.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const team: TeamMember[] = [
    {
      id: 1,
      name: "Alexander Vance",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      role: "Chief Strategy Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      name: "Marcus Thorne",
      role: "Head of Digital Transformation",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 4,
      name: "Elena Rodriguez",
      role: "Director of Global Operations",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <section id="team" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Our Leadership</h2>
          <p className="text-4xl font-bold text-slate-900 mb-4">Meet the Experts</p>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <motion.div 
              key={member.id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h4>
                <p className="text-blue-600 text-sm font-medium mb-4">{member.role}</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>
                  <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Twitter size={18} /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "BlueVinza completely transformed our digital infrastructure. Their strategic approach and attention to detail are unmatched in the industry.",
      author: "David Chen",
      company: "TechFlow Solutions"
    },
    {
      id: 2,
      content: "Working with the BlueVinza team was a game-changer for our international expansion. They provided insights we hadn't even considered.",
      author: "Jessica Miller",
      company: "Global Retail Group"
    },
    {
      id: 3,
      content: "The level of professionalism and expertise at BlueVinza is exceptional. They are more than just consultants; they are true partners.",
      author: "Robert Wilson",
      company: "Apex Financial"
    }
  ];

  return (
    <section className="py-24 bg-blue-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-3">Testimonials</h2>
          <p className="text-4xl font-bold mb-4">What Our Clients Say</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Award key={i} size={16} className="text-blue-400 fill-blue-400 mr-1" />
                ))}
              </div>
              <p className="text-blue-100/80 italic mb-6 leading-relaxed">
                "{t.content}"
              </p>
              <div>
                <p className="font-bold text-white">{t.author}</p>
                <p className="text-blue-400 text-sm">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Contact Us</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Let's Start a Conversation</h3>
            <p className="text-slate-600 mb-10 leading-relaxed">
              Ready to take your business to the next level? Get in touch with our experts today for a confidential consultation.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email us</p>
                  <p className="font-bold text-slate-900">contact@bluevinza.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Call us</p>
                  <p className="font-bold text-slate-900">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Visit us</p>
                  <p className="font-bold text-slate-900">123 Corporate Plaza, NY 10001</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h4>
                  <p className="text-slate-600">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="text-2xl font-bold tracking-tight mb-6 block">
              Blue<span className="text-blue-500">Vinza</span>
            </span>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Leading the way in corporate innovation and strategic growth. We empower businesses to achieve their full potential in the digital age.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Services</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#team" className="hover:text-blue-400 transition-colors">Our Team</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Strategic Consulting</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Digital Transformation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Risk Management</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Financial Advisory</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Global Expansion</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-6">Subscribe to get the latest business insights and updates.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/5 border border-white/10 px-4 py-3 rounded-l-xl outline-none focus:border-blue-500 w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-r-xl transition-colors">
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} BlueVinza Corporate. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm font-medium">
            Powered by <span className="text-blue-500">BlueVinza</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Team />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
