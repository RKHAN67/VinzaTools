import React from 'react';
import { 
  Info, 
  Sparkles, 
  Target, 
  Zap, 
  Heart, 
  Users, 
  Globe, 
  Shield, 
  Clock,
  Award,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Coffee
} from 'lucide-react';

export const AboutPage = () => {
  // Stats
  const stats = [
    { value: '94', label: 'Tools', icon: Zap },
    { value: '4', label: 'Themes', icon: Users },
    { value: '6', label: 'Categories', icon: Clock },
    { value: '1', label: 'Workspace', icon: Heart },
  ];

  // Features
  const features = [
    { 
      icon: Target, 
      title: 'Precision', 
      desc: 'Every tool is crafted for accuracy and reliability.' 
    },
    { 
      icon: Zap, 
      title: 'Speed', 
      desc: 'Process files in seconds, not minutes.' 
    },
    { 
      icon: Shield, 
      title: 'Security', 
      desc: 'Your files are safe and auto-deleted after processing.' 
    },
    { 
      icon: Heart, 
      title: 'Simplicity', 
      desc: 'No learning curve. Just drag, drop, and done.' 
    },
  ];

  // Values
  const values = [
    { title: 'User First', desc: 'Every decision starts with user needs.' },
    { title: 'Quality Over Quantity', desc: 'Better tools, not more tools.' },
    { title: 'Clear & Practical', desc: 'Useful tools, simple steps, and no unnecessary friction.' },
  ];

  return (
    <div className="space-y-20 max-w-6xl mx-auto pb-20">
      {/* Hero Section */}
      <div className="text-center py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-rose-500/20 via-coral-500/20 to-orange-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-sm mb-6">
            <Info size={14} />
            <span>About Us</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Making Work{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-coral-500 to-orange-500">
              Effortless
            </span>
          </h1>
          
          <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Our mission is to make everyday work feel easy, fast, and friendly. 
            One platform, all the tools you need.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className="group p-6 bg-[#1a1414] rounded-2xl border border-white/10 text-center hover:border-rose-500/30 transition-all"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
              <stat.icon size={24} className="text-rose-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* What We Do & Why - Split Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative h-full bg-[#1a1414] rounded-3xl p-10 border border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6">
              <Lightbulb size={32} className="text-rose-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">What We Do</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              We provide a practical suite of online tools including background remover,
              PDF merge and split, PDF to Word, image conversion, YouTube and social video downloaders,
              resume tools, and developer utilities in one workspace.
            </p>
            <ul className="space-y-3">
              {['PDF Tools', 'Image Processing', 'Professional Resume Builder', 'Developer Utilities'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={18} className="text-rose-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative h-full bg-[#1a1414] rounded-3xl p-10 border border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
              <Heart size={32} className="text-orange-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Why It Matters</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              People waste time switching between dozens of apps. VinzaTools brings everything 
              into one place with clean UX and clear steps. Work smarter, not harder.
            </p>
            <ul className="space-y-3">
              {['No App Switching', 'Clean Interface', 'Fast Processing', 'Simple Workflow'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={18} className="text-orange-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Built With <span className="text-rose-400">Purpose</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group p-8 bg-[#1a1414] rounded-2xl border border-white/10 hover:border-rose-500/30 transition-all text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon size={28} className="text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-3xl p-10 border border-rose-500/20">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                <Award size={20} className="text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
              <p className="text-slate-400 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-[#1a1414] rounded-3xl p-10 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">The Story</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              VinzaTools started with a simple frustration: everyday file work should not require jumping between too many apps. What began as a practical build grew into one focused workspace for tools, themes, and daily digital tasks.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Today the goal is still the same: keep the product clean, practical, and easy to use so people can focus on the work itself instead of fighting the interface.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
              <Coffee size={32} className="text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">94</div>
              <div className="text-xs text-slate-500">Active Tools</div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
              <Rocket size={32} className="text-rose-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-xs text-slate-500">Theme Packs</div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
              <Globe size={32} className="text-coral-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-xs text-slate-500">Core Categories</div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
              <Heart size={32} className="text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-xs text-slate-500">Unified Workspace</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-coral-600 to-orange-600 p-12 text-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-4">Ready to experience better?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Open the tools you need, work faster, and keep everything in one clean workspace.
          </p>
          <a href="#/tools" className="px-8 py-4 bg-white text-rose-600 font-bold rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2 mx-auto group">
            Explore Tools
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

