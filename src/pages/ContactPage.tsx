import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Send, 
  Save, 
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import type { ContactTab } from '../types/app';
import { apiFetch } from '../api';
import { trackGaEvent } from '../lib/analytics';

interface ContactPageProps {
  contactTab: ContactTab;
  setContactTab: (tab: ContactTab) => void;
}

export const ContactPage = ({ contactTab, setContactTab }: ContactPageProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const tabs = [
    { id: 'general', label: 'General Contact', icon: HelpCircle, desc: 'Questions or issues' },
    { id: 'tool', label: 'Request a Tool', icon: Lightbulb, desc: 'Suggest new features' },
    { id: 'feedback', label: 'Give Feedback', icon: MessageCircle, desc: 'Share your thoughts' },
  ] as const;

  const currentTab = tabs.find(t => t.id === contactTab);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setStatusMessage('Please fill out your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
          category: contactTab
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message.');
      }

      setStatus('success');
      setStatusMessage('Thank you. Your message has been sent successfully and our team usually replies within 24 hours.');
      trackGaEvent('contact_submit', {
        category: contactTab,
        has_phone: Boolean(phone.trim()),
      });
      setShowSuccessPopup(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-[1.8rem] border border-emerald-400/20 bg-[#151010] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-center text-2xl font-black text-white">Thank you for reaching out</h3>
            <p className="mt-3 text-center text-sm leading-7 text-slate-300">
              Your request has been received successfully. Please expect a reply within 24 hours, In shaa Allah.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccessPopup(false)}
              className="vinza-button mt-6 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:shadow-lg hover:shadow-rose-500/25"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-sm mb-6">
            <MessageCircle size={14} />
            <span>Contact & Feedback</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-coral-500 to-orange-500">Touch</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Request new tools, report issues, or share feedback. We're here to help and always listening.
          </p>
        </div>
      </div>

      {/* Tab Selection - Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const isActive = contactTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setContactTab(tab.id)}
              className={`group relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                isActive 
                  ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10' 
                  : 'bg-[#1a1414] border-white/10 hover:border-rose-500/30 hover:bg-[#1f1919]'
              }`}
            >
              {/* Glow for active */}
              {isActive && (
                <div className="absolute -inset-px bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-2xl blur-sm" />
              )}
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  isActive ? 'bg-rose-500 text-white' : 'bg-white/5 text-slate-400 group-hover:bg-rose-500/20 group-hover:text-rose-400'
                }`}>
                  <Icon size={24} />
                </div>
                <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                  {tab.label}
                </h3>
                <p className="text-sm text-slate-500">{tab.desc}</p>
                
                {isActive && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1414] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  {currentTab && <currentTab.icon size={24} className="text-rose-400" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentTab?.label}</h3>
                  <p className="text-sm text-slate-400">We typically reply within 24 hours</p>
                </div>
              </div>

              {/* Form Fields */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium">Your Name</label>
                    <input 
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white placeholder-slate-600 transition-all"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium">Email Address</label>
                    <input 
                      className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white placeholder-slate-600 transition-all"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">WhatsApp Number (Optional)</label>
                  <input 
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white placeholder-slate-600 transition-all"
                    placeholder="+92 341 2890356"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    If you add your WhatsApp number, admin can reply there directly. Otherwise the reply will go to your email.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">
                    {contactTab === 'tool' ? 'Tool Request Title' : contactTab === 'feedback' ? 'Feedback Title' : 'Subject'}
                  </label>
                  <input 
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white placeholder-slate-600 transition-all"
                    placeholder={contactTab === 'tool' ? 'e.g., Video Compressor Tool' : contactTab === 'feedback' ? 'e.g., Great UI but...' : 'e.g., Need help with PDF'}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400 font-medium">Message</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white placeholder-slate-600 transition-all h-40 resize-none"
                    placeholder={contactTab === 'tool' 
                      ? 'Describe the tool you want us to build. What should it do? Why do you need it?' 
                      : contactTab === 'feedback' 
                        ? 'Share your thoughts, ideas, or suggestions. What do you love? What can we improve?' 
                        : 'Describe your issue or question in detail...'
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 transition-all flex items-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <button 
                    type="button"
                    className="px-6 py-3 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Draft
                  </button>
                </div>

                {status !== 'idle' && (
                  <div className={`text-sm font-semibold ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {statusMessage}
                  </div>
                )}

                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <Clock size={14} className="text-rose-400" />
                  We reply within 24 hours. Your message helps us improve.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar - Contact Info */}
        <div className="space-y-6">
          {/* Contact Cards */}
          <div className="bg-[#1a1414] rounded-3xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-rose-400" />
              Contact Options
            </h3>
            
            <div className="space-y-4">
              <a 
                href="mailto:info@bluevinza.com"
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                  <Mail size={20} className="text-rose-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">Email Us</div>
                  <div className="text-sm text-slate-400">info@bluevinza.com</div>
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </a>

              <a 
                href="tel:+923412890356"
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Phone size={20} className="text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">Call Us</div>
                  <div className="text-sm text-slate-400">+92-341-2890356</div>
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>

          {/* Quick Help */}
          <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-3xl p-6 border border-rose-500/20">
            <h3 className="text-lg font-bold text-white mb-4">Need Quick Help?</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-rose-400 mt-0.5 shrink-0" />
                <span>Check the privacy policy, terms, and cookie policy pages for quick guidance before sending a request.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-rose-400 mt-0.5 shrink-0" />
                <span>Browse the tools page to see what is already available before requesting a new tool.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-rose-400 mt-0.5 shrink-0" />
                <span>Use this form to send support, feedback, or a custom tool request directly.</span>
              </li>
            </ul>
          </div>

          {/* Response Time */}
          <div className="bg-[#1a1414] rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Clock size={28} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">24h</div>
            <div className="text-sm text-slate-400">Average response time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

