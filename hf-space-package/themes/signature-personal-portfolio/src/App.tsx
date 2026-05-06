import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code, 
  Cpu, 
  Globe, 
  ArrowRight, 
  ChevronDown,
  Send,
  CheckCircle2,
  Calendar,
  Briefcase,
  Settings
} from 'lucide-react';

// --- Types ---

interface Skill {
  name: string;
  level: number;
}

interface Project {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
  link: string;
}

interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  desc: string;
}

interface PortfolioData {
  name: string;
  tagline: string;
  about: string;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  accentColor: string;
}

const INITIAL_DATA: PortfolioData = {
  name: "ALEX",
  tagline: "CRAFTING DIGITAL EXPERIENCES WITH PRECISION AND PURPOSE",
  about: "Based in London, I've spent the last half-decade obsessing over the intersection of design and code. My journey started with pure curiosity and evolved into a professional career building high-end digital products for global brands. I believe in the power of minimalism and the impact of thoughtful interactions.",
  skills: [
    { name: "React / Next.js", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Tailwind CSS", level: 98 },
    { name: "Node.js", level: 85 },
    { name: "UI/UX Design", level: 88 }
  ],
  projects: [
    {
      id: "1",
      title: "Nova Dashboard",
      desc: "A high-performance analytics platform for modern SaaS companies with real-time data visualization.",
      tags: ["Next.js", "D3.js", "Tailwind"],
      image: "https://picsum.photos/seed/project1/1200/800",
      link: "#"
    },
    {
      id: "2",
      title: "Zenith E-commerce",
      desc: "A minimal, luxury shopping experience with seamless transitions and a custom checkout flow.",
      tags: ["React", "Framer Motion", "Stripe"],
      image: "https://picsum.photos/seed/project2/1200/800",
      link: "#"
    }
  ],
  experience: [
    {
      id: "1",
      year: "2022 — Present",
      title: "Senior Creative Developer",
      company: "Digital Pulse Agency",
      desc: "Leading the development of high-end interactive websites for Fortune 500 clients."
    },
    {
      id: "2",
      year: "2020 — 2022",
      title: "Frontend Engineer",
      company: "Innovate Tech",
      desc: "Developed complex React applications for the fintech sector."
    }
  ],
  accentColor: "#8b5cf6"
};

// --- Components ---

const Customizer = ({ data, setData, isOpen, onClose }: { data: PortfolioData, setData: (d: PortfolioData) => void, isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050508] border-l border-white/10 z-[101] overflow-y-auto p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-display font-black uppercase tracking-tighter">Customize Experience</h2>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                <ChevronDown className="rotate-[-90deg]" />
              </button>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Identity</label>
                <input 
                  type="text" 
                  value={data.name} 
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-violet-500 transition-all"
                />
                <textarea 
                  value={data.tagline} 
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                  placeholder="Tagline"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-violet-500 transition-all h-24 resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Narrative</label>
                <textarea 
                  value={data.about} 
                  onChange={(e) => setData({ ...data, about: e.target.value })}
                  placeholder="About Me"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-violet-500 transition-all h-32 resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Unique Palette</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: 'Electric Violet', color: '#8b5cf6' },
                    { name: 'Cyan Glow', color: '#06b6d4' },
                    { name: 'Neon Pink', color: '#ec4899' },
                    { name: 'Emerald Pulse', color: '#10b981' },
                    { name: 'Sunset Gold', color: '#f59e0b' },
                    { name: 'Royal Indigo', color: '#6366f1' }
                  ].map(item => (
                    <button 
                      key={item.color}
                      onClick={() => setData({ ...data, accentColor: item.color })}
                      className={`w-12 h-12 rounded-2xl border-2 transition-all hover:scale-110 flex items-center justify-center ${data.accentColor === item.color ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    >
                      {data.accentColor === item.color && <CheckCircle2 size={20} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                <button 
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "portfolio-config.json");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                >
                  Export Portfolio Config <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ name }: { name: string }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? 'py-4 bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'py-10'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-display font-black tracking-tighter uppercase text-glow"
        >
          {name}<span className="text-violet-500">.</span>
        </motion.div>
        
        <div className="hidden lg:flex items-center gap-12">
          {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-violet-500 transition-all group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-8 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Let's Talk
        </motion.button>
      </div>
    </nav>
  );
};

const SkillBar = ({ name, level, delay, color }: { name: string, level: number, delay: number, color: string, key?: any }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-lg font-display font-bold uppercase tracking-widest text-white/80">{name}</span>
        <span className="text-[10px] font-mono font-bold opacity-30">{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const ProjectCard = ({ title, desc, tags, image, link, color }: { title: string, desc: string, tags: string[], image: string, link: string, color: string, key?: any }) => {
  return (
    <motion.div 
      className="group relative space-y-8"
    >
      <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden border border-white/5 gradient-border">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />
        <a 
          href={link} 
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700"
        >
          <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center scale-50 group-hover:scale-100 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
            <ExternalLink size={28} />
          </div>
        </a>
      </div>
      
      <div className="space-y-4 px-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <h3 className="text-4xl font-display font-black uppercase tracking-tighter group-hover:text-glow transition-all">{title}</h3>
            <div className="flex flex-wrap gap-3">
              {tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-white/30 border border-white/10 px-4 py-1.5 rounded-full bg-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-white/40 font-medium text-lg leading-snug max-w-xl group-hover:text-white/60 transition-colors">{desc}</p>
      </div>
    </motion.div>
  );
};

const TimelineItem = ({ year, title, company, desc, color }: { year: string, title: string, company: string, desc: string, color: string, key?: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group grid md:grid-cols-12 gap-12 py-16 border-b border-white/5 hover:bg-white/[0.02] transition-all duration-700 px-10 -mx-10 rounded-[48px] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="md:col-span-3 relative z-10">
        <span className="text-xs font-mono font-bold opacity-20 group-hover:opacity-100 transition-opacity" style={{ color }}>{year}</span>
      </div>
      <div className="md:col-span-4 relative z-10">
        <h4 className="text-3xl font-display font-black uppercase tracking-tighter group-hover:text-glow transition-all">{title}</h4>
        <div className="text-sm text-white/30 font-bold uppercase tracking-widest mt-2">{company}</div>
      </div>
      <div className="md:col-span-5 relative z-10">
        <p className="text-white/30 font-medium text-lg leading-relaxed group-hover:text-white/60 transition-colors">{desc}</p>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen font-sans selection:bg-violet-500/30">
      <div className="noise-overlay" />
      <div 
        className="cursor-glow opacity-0 lg:opacity-100" 
        style={{ 
          left: mousePos.x, 
          top: mousePos.y,
          background: `radial-gradient(circle, ${data.accentColor}15 0%, transparent 70%)`
        }} 
      />
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-pink-500/5 blur-[100px] animate-float" />
      </div>

      <Navbar name={data.name} />
      <Customizer 
        data={data} 
        setData={setData} 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)} 
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-40" />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <span className="inline-block px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                Available for Projects
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] lg:text-[10vw] font-display font-black leading-[0.85] tracking-tighter uppercase mb-12"
            >
              <span className="block text-glow">Creative</span>
              <span className="block text-transparent stroke-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Developer</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto text-lg lg:text-2xl text-white/40 font-medium leading-tight mb-16 uppercase tracking-tight"
            >
              {data.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <button className="group relative px-12 py-6 rounded-3xl bg-white text-black font-black uppercase text-xs tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                <span className="relative z-10 flex items-center gap-3">View Projects <ArrowRight size={18} /></span>
                <div className="absolute inset-0 bg-violet-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
              <button 
                onClick={() => setIsCustomizerOpen(true)}
                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all"
              >
                <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-all">
                  <Settings size={18} className="group-hover:rotate-90 transition-transform duration-700" />
                </div>
                Customize Theme
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Scroll</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-violet-500 to-transparent" />
          </motion.div>
        </section>

        {/* About & Skills Section */}
        <section id="about" className="py-32 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-32 items-start">
              <div className="space-y-16">
                <div className="space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-500">01 / Narrative</span>
                  <h2 className="text-6xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.9]">
                    Beyond the <br /> <span className="text-white/20">Pixels.</span>
                  </h2>
                </div>
                <p className="text-2xl lg:text-3xl text-white/50 font-medium leading-snug">
                  {data.about}
                </p>
                <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/5">
                  <div>
                    <div className="text-5xl font-display font-black mb-2">5+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-5xl font-display font-black mb-2">40+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Projects Delivered</div>
                  </div>
                </div>
              </div>

              <div id="skills" className="glass-card p-12 lg:p-20 rounded-[64px] space-y-16 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="space-y-8 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500">02 / Expertise</span>
                  <h3 className="text-5xl font-display font-black uppercase tracking-tighter">Technical Arsenal</h3>
                </div>
                <div className="space-y-10 relative z-10">
                  {data.skills.map((skill, i) => (
                    <SkillBar 
                      key={skill.name} 
                      name={skill.name} 
                      level={skill.level} 
                      delay={i * 0.1} 
                      color={data.accentColor}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-32">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="space-y-8">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500">03 / Selected Works</span>
                <h2 className="text-7xl lg:text-9xl font-display font-black uppercase tracking-tighter leading-[0.85]">
                  Digital <br /> <span className="text-white/20">Showcase.</span>
                </h2>
              </div>
              <p className="max-w-md text-xl text-white/40 font-medium leading-relaxed">
                A collection of projects where I've pushed the boundaries of what's possible on the web.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-x-20 gap-y-40">
              {data.projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  {...project} 
                  color={data.accentColor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-32 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-mesh opacity-20 pointer-events-none" />
          <div className="max-w-7xl mx-auto space-y-24 relative z-10">
            <div className="space-y-8">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">04 / Journey</span>
              <h2 className="text-7xl lg:text-9xl font-display font-black uppercase tracking-tighter leading-[0.85]">
                Professional <br /> <span className="text-white/20">Timeline.</span>
              </h2>
            </div>

            <div className="space-y-0">
              {data.experience.map((exp) => (
                <TimelineItem 
                  key={exp.id} 
                  {...exp} 
                  color={data.accentColor}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card p-12 lg:p-32 rounded-[80px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
                <div className="space-y-12">
                  <div className="space-y-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-500">05 / Connection</span>
                    <h2 className="text-6xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.9]">
                      Let's Build <br /> <span className="text-white/20">Together.</span>
                    </h2>
                  </div>
                  <p className="text-2xl text-white/40 font-medium leading-relaxed max-w-md">
                    Have a vision? Let's turn it into a digital reality that leaves a lasting impression.
                  </p>
                  <div className="flex gap-8">
                    {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                      <a key={i} href="#" className="w-16 h-16 rounded-2xl glass flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500">
                        <Icon size={24} />
                      </a>
                    ))}
                  </div>
                </div>

                <form className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Name</label>
                      <input type="text" className="w-full bg-white/5 border-b border-white/10 py-4 outline-none focus:border-violet-500 transition-colors text-xl font-medium" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Email</label>
                      <input type="email" className="w-full bg-white/5 border-b border-white/10 py-4 outline-none focus:border-violet-500 transition-colors text-xl font-medium" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Message</label>
                    <textarea className="w-full bg-white/5 border-b border-white/10 py-4 outline-none focus:border-violet-500 transition-colors text-xl font-medium h-32 resize-none" />
                  </div>
                  <button className="w-full py-8 rounded-3xl bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-2xl font-display font-black tracking-tighter uppercase">
            {data.name}<span className="text-violet-500">.</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
            © 2026 Crafted with Passion
          </div>
          <div className="flex gap-12">
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
