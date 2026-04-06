import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  FileJson, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  GripVertical, 
  Type as TypeIcon, 
  Palette, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  Folder,
  Heart,
  Languages,
  User,
  Layout,
  Eye,
  Save,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import confetti from 'canvas-confetti';

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
  description?: string;
}

interface Project {
  id: string;
  title: string;
  link?: string;
  description: string;
}

interface Reference {
  id: string;
  name: string;
  position: string;
  contact: string;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface Course {
  id: string;
  name: string;
  institution: string;
  year: string;
}

interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ExtraCurricular {
  id: string;
  activity: string;
  role: string;
  duration: string;
  description: string;
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface ResumeData {
  photo: string;
  fullName: string;
  jobTitle: string;
  summary: string;
  email: string;
  phone: string;
  website: string;
  address?: string;
  socialLinks: SocialLink[];
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: { id: string; name: string; year: string }[];
  projects: Project[];
  courses: Course[];
  internships: Internship[];
  extraCurricular: ExtraCurricular[];
  hobbies: string[];
  references: Reference[];
  languages: Language[];
  customSections: CustomSection[];
  sectionOrder: string[];
  themeColor: string;
  fontFamily: string;
  fontSize: number;
}

const INITIAL_DATA: ResumeData = {
  photo: '',
  fullName: 'John Doe',
  jobTitle: 'Senior Software Engineer',
  summary: 'Passionate developer with 10+ years of experience in building scalable web applications.',
  email: 'john@example.com',
  phone: '+1 234 567 890',
  website: 'www.johndoe.com',
  address: 'New York, USA',
  socialLinks: [
    { id: '1', platform: 'LinkedIn', url: 'linkedin.com/in/johndoe' },
    { id: '2', platform: 'GitHub', url: 'github.com/johndoe' }
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'AWS'],
  experience: [
    { id: '1', company: 'Tech Corp', position: 'Lead Developer', duration: '2020 - Present', description: 'Led a team of 10 developers to build a cloud-based platform.' }
  ],
  education: [
    { id: '1', school: 'University of Technology', degree: 'B.S. in Computer Science', year: '2016', description: 'Graduated with Honors' }
  ],
  certifications: [
    { id: '1', name: 'AWS Certified Solutions Architect', year: '2021' }
  ],
  projects: [
    { id: '1', title: 'Portfolio Website', link: 'https://github.com', description: 'A personal portfolio built with React and Tailwind.' }
  ],
  courses: [
    { id: '1', name: 'Advanced React Patterns', institution: 'Frontend Masters', year: '2022' }
  ],
  internships: [
    { id: '1', company: 'Startup Inc', role: 'Software Intern', duration: '2015', description: 'Assisted in developing the core API.' }
  ],
  extraCurricular: [
    { id: '1', activity: 'Open Source Contributor', role: 'Maintainer', duration: '2018 - Present', description: 'Contributing to various React libraries.' }
  ],
  hobbies: ['Photography', 'Hiking', 'Chess'],
  references: [
    { id: '1', name: 'Jane Smith', position: 'CTO at Tech Corp', contact: 'jane@techcorp.com' }
  ],
  languages: [
    { id: '1', name: 'English', level: 'Native' },
    { id: '2', name: 'Spanish', level: 'Intermediate' }
  ],
  customSections: [
    { id: '1', title: 'Volunteering', content: 'Volunteered at local animal shelter for 2 years.' }
  ],
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'internships', 'courses', 'extraCurricular', 'hobbies', 'references', 'customSections'],
  themeColor: '#f43f5e',
  fontFamily: 'Inter',
  fontSize: 14
};

const SortableSection = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div {...attributes} {...listeners} className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose-500/10 rounded-lg">
        <GripVertical size={16} className="text-slate-500" />
      </div>
      {children}
    </div>
  );
};

export const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [template, setTemplate] = useState(0);
  const [step, setStep] = useState<'setup' | 'editor'>('editor');
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const previewRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const templates = [
    { name: 'Classic', desc: 'Traditional & Professional', icon: Briefcase },
    { name: 'Modern', desc: 'Clean & Contemporary', icon: Layout },
    { name: 'Executive', desc: 'Bold & Authoritative', icon: Award },
    { name: 'Minimal', desc: 'Simple & Elegant', icon: Eye },
    { name: 'Bold', desc: 'High Impact Design', icon: Sparkles },
    { name: 'Skilled', desc: 'Focus on Expertise', icon: User }
  ];

  const fonts = [
    { name: 'Inter', class: 'font-sans' },
    { name: 'Playfair Display', class: 'font-serif' },
    { name: 'JetBrains Mono', class: 'font-mono' },
    { name: 'Outfit', class: 'font-outfit' },
    { name: 'Space Grotesk', class: 'font-space' },
  ];

  const colors = [
    '#f43f5e', '#e11d48', '#be123c', '#fb7185', '#fda4af', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.sectionOrder.indexOf(active.id);
        const newIndex = prev.sectionOrder.indexOf(over.id);
        return {
          ...prev,
          sectionOrder: arrayMove(prev.sectionOrder, oldIndex, newIndex),
        };
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setData({ ...data, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => setData({ ...data, skills: [...data.skills, 'New Skill'] });
  const removeSkill = (index: number) => setData({ ...data, skills: data.skills.filter((_, i) => i !== index) });

  const addExperience = () => setData({
    ...data,
    experience: [...data.experience, { id: Date.now().toString(), company: '', position: '', duration: '', description: '' }]
  });

  const addEducation = () => setData({
    ...data,
    education: [...data.education, { id: Date.now().toString(), school: '', degree: '', year: '', description: '' }]
  });

  const addProject = () => setData({
    ...data,
    projects: [...data.projects, { id: Date.now().toString(), title: '', link: '', description: '' }]
  });

  const addReference = () => setData({
    ...data,
    references: [...data.references, { id: Date.now().toString(), name: '', position: '', contact: '' }]
  });

  const addLanguage = () => setData({
    ...data,
    languages: [...data.languages, { id: Date.now().toString(), name: '', level: '' }]
  });

  const addCertification = () => setData({
    ...data,
    certifications: [...data.certifications, { id: Date.now().toString(), name: '', year: '' }]
  });

  const addSocialLink = () => setData({
    ...data,
    socialLinks: [...data.socialLinks, { id: Date.now().toString(), platform: '', url: '' }]
  });

  const addCourse = () => setData({
    ...data,
    courses: [...data.courses, { id: Date.now().toString(), name: '', institution: '', year: '' }]
  });

  const addInternship = () => setData({
    ...data,
    internships: [...data.internships, { id: Date.now().toString(), company: '', role: '', duration: '', description: '' }]
  });

  const addExtraCurricular = () => setData({
    ...data,
    extraCurricular: [...data.extraCurricular, { id: Date.now().toString(), activity: '', role: '', duration: '', description: '' }]
  });

  const addHobby = () => setData({ ...data, hobbies: [...data.hobbies, 'New Hobby'] });
  const removeHobby = (index: number) => setData({ ...data, hobbies: data.hobbies.filter((_, i) => i !== index) });

  const addCustomSection = () => setData({
    ...data,
    customSections: [...data.customSections, { id: Date.now().toString(), title: '', content: '' }]
  });

  const exportToPdf = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#e11d48', '#be123c']
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const saveAsJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    a.click();
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          if (importedData.fullName && importedData.sectionOrder) {
            setData(importedData);
            setStep('editor');
          } else {
            alert('Invalid resume file format.');
          }
        } catch (error) {
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Dark theme input classes
  const inputClass = "w-full bg-[#0f0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all outline-none text-sm";
  const textareaClass = "w-full bg-[#0f0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all outline-none text-sm resize-none";
  const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-wider";
  const sectionHeaderClass = "flex items-center gap-3 mb-6 pb-4 border-b border-white/10";
  const cardClass = "bg-[#1a1414] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-rose-500/20 transition-all";

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-[#0f0a0a] flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full bg-[#1a1414] rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl"
        >
          <div className="md:w-1/2 p-12 bg-gradient-to-br from-rose-600 to-rose-500 text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-black">Build Your Professional Resume</h1>
              <p className="text-rose-100 text-lg">Choose a starting template and customize it to match your personal brand.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-rose-200">Select Theme Color</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(c => (
                    <button 
                      key={c}
                      onClick={() => setData({ ...data, themeColor: c })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${data.themeColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setStep('editor')}
              className="w-full py-4 bg-white text-rose-600 rounded-2xl font-bold text-lg shadow-xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
            >
              Start Building <ChevronRight size={20} />
            </button>
          </div>
          <div className="md:w-1/2 p-12 space-y-8 overflow-y-auto max-h-[80vh] bg-[#0f0a0a]">
            <h2 className="text-2xl font-bold text-white">Choose a Template</h2>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTemplate(i)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${template === i ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 hover:border-white/20'}`}
                >
                  <div className="w-full aspect-[3/4] bg-[#1a1414] rounded-lg mb-3 flex items-center justify-center text-slate-500">
                    <t.icon size={32} />
                  </div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0a0a] text-white">
      {/* Top Navigation Bar */}
<div className="h-16 bg-[#1a1414] border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 overflow-x-auto no-scrollbar">
  
  <div className="flex items-center gap-8 flex-nowrap min-w-max">
    
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-rose-500/20">
        <FileText size={20} />
      </div>
      <span className="font-bold text-lg tracking-tight">
        Resume<span className="text-rose-500">Builder</span>
      </span>
    </div>
    
    <div className="h-8 w-px bg-white/10" />
    
    <div className="flex gap-1">
      {templates.map((t, i) => (
        <button
          key={i}
          onClick={() => setTemplate(i)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            template === i
              ? 'bg-rose-500 text-white'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          {t.name}
        </button>
      ))}
    </div>

  </div>

  <div className="flex items-center gap-6 flex-nowrap min-w-max">
    
    {/* Color */}
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Color</span>
      <div className="flex gap-1.5">
        {colors.map(c => (
          <button 
            key={c}
            onClick={() => setData({ ...data, themeColor: c })}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              data.themeColor === c
                ? 'border-white scale-110'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>

    <div className="h-8 w-px bg-white/10" />

    {/* Size */}
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Size</span>
      <div className="flex items-center bg-[#0f0a0a] rounded-lg p-1 border border-white/10">
        <button 
          onClick={() => setData({ ...data, fontSize: Math.max(10, data.fontSize - 1) })}
          className="w-7 h-7 flex items-center justify-center hover:bg-white/5 rounded-md transition-colors text-slate-400"
        >
          -
        </button>
        <span className="w-8 text-center text-xs font-bold text-white">{data.fontSize}</span>
        <button 
          onClick={() => setData({ ...data, fontSize: Math.min(24, data.fontSize + 1) })}
          className="w-7 h-7 flex items-center justify-center hover:bg-white/5 rounded-md transition-colors text-slate-400"
        >
          +
        </button>
      </div>
    </div>

    <div className="h-8 w-px bg-white/10" />

    {/* Buttons */}
    <div className="flex gap-2">
      <button onClick={saveAsJson} className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
        <FileJson size={20} />
      </button>
      <button 
        onClick={exportToPdf} 
        disabled={isExporting}
        className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
      >
        {isExporting ? "Exporting..." : "PDF"}
      </button>
    </div>

  </div>
</div>

      <div className="flex max-w-[1800px] mx-auto">
        {/* Editor Sidebar */}
        <div className="w-[500px] min-h-[calc(100vh-64px)] overflow-y-auto bg-[#151010] border-r border-white/10 p-6">
          <div className="space-y-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'personal', label: 'Personal', icon: User },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'skills', label: 'Skills', icon: Sparkles },
                { id: 'other', label: 'Other', icon: Folder }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-rose-500 text-white' : 'bg-[#0f0a0a] text-slate-400 hover:text-white border border-white/10'}`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Personal Information</h3>
                </div>
                
                <div className="flex gap-6">
                  <div className="shrink-0 space-y-3">
                    <div className="relative group w-28 h-28">
                      <div className="w-full h-full bg-[#0f0a0a] rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-white/10 group-hover:border-rose-500/50 transition-all">
                        {data.photo ? (
                          <img src={data.photo} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="mx-auto text-slate-600 mb-1" size={24} />
                            <span className="text-[10px] font-bold text-slate-500">PHOTO</span>
                          </div>
                        )}
                      </div>
                      <input type="file" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                    <button 
                      onClick={() => setData({ ...data, photo: '' })}
                      className="w-full py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      REMOVE
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className={labelClass}>Full Name</p>
                      <input className={inputClass} placeholder="e.g. John Doe" value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Job Title</p>
                      <input className={inputClass} placeholder="e.g. Software Engineer" value={data.jobTitle} onChange={e => setData({...data, jobTitle: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Email</p>
                      <input className={inputClass} placeholder="john@example.com" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Phone</p>
                      <input className={inputClass} placeholder="+1 234 567 890" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Website</p>
                      <input className={inputClass} placeholder="www.johndoe.com" value={data.website} onChange={e => setData({...data, website: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Location</p>
                      <input className={inputClass} placeholder="New York, USA" value={data.address} onChange={e => setData({...data, address: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Social Links</label>
                    <button onClick={addSocialLink} className="text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg transition-all">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {data.socialLinks.map((link, i) => (
                      <div key={link.id} className="flex gap-2">
                        <input className={`${inputClass} w-24`} placeholder="Platform" value={link.platform} onChange={e => {
                          const newLinks = [...data.socialLinks];
                          newLinks[i].platform = e.target.value;
                          setData({...data, socialLinks: newLinks});
                        }} />
                        <input className={`${inputClass} flex-1`} placeholder="URL" value={link.url} onChange={e => {
                          const newLinks = [...data.socialLinks];
                          newLinks[i].url = e.target.value;
                          setData({...data, socialLinks: newLinks});
                        }} />
                        <button onClick={() => setData({...data, socialLinks: data.socialLinks.filter(l => l.id !== link.id)})} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <div className={sectionHeaderClass}>
                    <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                    <label className="text-sm font-bold uppercase tracking-wider text-white">Professional Summary</label>
                  </div>
                  <textarea className={`${textareaClass} h-32`} placeholder="Briefly describe your professional background..." value={data.summary} onChange={e => setData({...data, summary: e.target.value})} />
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Work Experience</h3>
                  <button onClick={addExperience} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={exp.id} className={cardClass}>
                      <button onClick={() => setData({...data, experience: data.experience.filter(e => e.id !== exp.id)})} className="absolute -right-2 -top-2 w-7 h-7 bg-[#0f0a0a] border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-all">
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className={labelClass}>Job Title</p>
                          <input className={inputClass} placeholder="e.g. Software Engineer" value={exp.position} onChange={e => {
                            const newExp = [...data.experience];
                            newExp[i].position = e.target.value;
                            setData({...data, experience: newExp});
                          }} />
                        </div>
                        <div className="space-y-2">
                          <p className={labelClass}>Company</p>
                          <input className={inputClass} placeholder="e.g. Google" value={exp.company} onChange={e => {
                            const newExp = [...data.experience];
                            newExp[i].company = e.target.value;
                            setData({...data, experience: newExp});
                          }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Duration</p>
                        <input className={inputClass} placeholder="e.g. Jan 2021 - Present" value={exp.duration} onChange={e => {
                          const newExp = [...data.experience];
                          newExp[i].duration = e.target.value;
                          setData({...data, experience: newExp});
                        }} />
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Description</p>
                        <textarea className={`${textareaClass} h-24`} placeholder="• Key responsibility..." value={exp.description} onChange={e => {
                          const newExp = [...data.experience];
                          newExp[i].description = e.target.value;
                          setData({...data, experience: newExp});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Internships */}
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Internships</h3>
                  <button onClick={addInternship} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {data.internships.map((intern, i) => (
                    <div key={intern.id} className={cardClass}>
                      <button onClick={() => setData({...data, internships: data.internships.filter(e => e.id !== intern.id)})} className="absolute -right-2 -top-2 w-7 h-7 bg-[#0f0a0a] border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className={labelClass}>Company</p>
                          <input className={inputClass} value={intern.company} onChange={e => {
                            const newIntern = [...data.internships];
                            newIntern[i].company = e.target.value;
                            setData({...data, internships: newIntern});
                          }} />
                        </div>
                        <div className="space-y-2">
                          <p className={labelClass}>Role</p>
                          <input className={inputClass} value={intern.role} onChange={e => {
                            const newIntern = [...data.internships];
                            newIntern[i].role = e.target.value;
                            setData({...data, internships: newIntern});
                          }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Duration</p>
                        <input className={inputClass} value={intern.duration} onChange={e => {
                          const newIntern = [...data.internships];
                          newIntern[i].duration = e.target.value;
                          setData({...data, internships: newIntern});
                        }} />
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Description</p>
                        <textarea className={`${textareaClass} h-20`} value={intern.description} onChange={e => {
                          const newIntern = [...data.internships];
                          newIntern[i].description = e.target.value;
                          setData({...data, internships: newIntern});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Education</h3>
                  <button onClick={addEducation} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                
                <div className="space-y-4">
                  {data.education.map((edu, i) => (
                    <div key={edu.id} className={cardClass}>
                      <button onClick={() => setData({...data, education: data.education.filter(e => e.id !== edu.id)})} className="absolute -right-2 -top-2 w-7 h-7 bg-[#0f0a0a] border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className={labelClass}>Degree</p>
                          <input className={inputClass} placeholder="e.g. B.S. Computer Science" value={edu.degree} onChange={e => {
                            const newEdu = [...data.education];
                            newEdu[i].degree = e.target.value;
                            setData({...data, education: newEdu});
                          }} />
                        </div>
                        <div className="space-y-2">
                          <p className={labelClass}>School</p>
                          <input className={inputClass} placeholder="e.g. MIT" value={edu.school} onChange={e => {
                            const newEdu = [...data.education];
                            newEdu[i].school = e.target.value;
                            setData({...data, education: newEdu});
                          }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Year</p>
                        <input className={inputClass} placeholder="e.g. 2018 - 2022" value={edu.year} onChange={e => {
                          const newEdu = [...data.education];
                          newEdu[i].year = e.target.value;
                          setData({...data, education: newEdu});
                        }} />
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Details</p>
                        <textarea className={`${textareaClass} h-20`} placeholder="GPA, Honors, etc." value={edu.description} onChange={e => {
                          const newEdu = [...data.education];
                          newEdu[i].description = e.target.value;
                          setData({...data, education: newEdu});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Courses */}
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Courses</h3>
                  <button onClick={addCourse} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {data.courses.map((course, i) => (
                    <div key={course.id} className="p-4 bg-[#0f0a0a] border border-white/10 rounded-xl space-y-3 relative">
                      <button onClick={() => setData({...data, courses: data.courses.filter(c => c.id !== course.id)})} className="absolute -right-2 -top-2 w-6 h-6 bg-[#1a1414] border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 transition-all">
                        <Trash2 size={12} />
                      </button>
                      <input className={inputClass} placeholder="Course Name" value={course.name} onChange={e => {
                        const newCourses = [...data.courses];
                        newCourses[i].name = e.target.value;
                        setData({...data, courses: newCourses});
                      }} />
                      <div className="flex gap-2">
                        <input className={`${inputClass} flex-1`} placeholder="Institution" value={course.institution} onChange={e => {
                          const newCourses = [...data.courses];
                          newCourses[i].institution = e.target.value;
                          setData({...data, courses: newCourses});
                        }} />
                        <input className={`${inputClass} w-24`} placeholder="Year" value={course.year} onChange={e => {
                          const newCourses = [...data.courses];
                          newCourses[i].year = e.target.value;
                          setData({...data, courses: newCourses});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Skills</h3>
                  <button onClick={addSkill} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add Skill
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="group relative">
                      <input 
                        className="bg-[#0f0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm w-32 focus:border-rose-500/50 focus:outline-none transition-all"
                        value={skill}
                        onChange={e => {
                          const newSkills = [...data.skills];
                          newSkills[i] = e.target.value;
                          setData({...data, skills: newSkills});
                        }}
                      />
                      <button onClick={() => removeSkill(i)} className="absolute -right-2 -top-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Languages */}
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Languages</h3>
                  <button onClick={addLanguage} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {data.languages.map((lang, i) => (
                    <div key={lang.id} className="flex gap-2">
                      <input className={inputClass} placeholder="Language" value={lang.name} onChange={e => {
                        const newLang = [...data.languages];
                        newLang[i].name = e.target.value;
                        setData({...data, languages: newLang});
                      }} />
                      <input className={`${inputClass} w-32`} placeholder="Level" value={lang.level} onChange={e => {
                        const newLang = [...data.languages];
                        newLang[i].level = e.target.value;
                        setData({...data, languages: newLang});
                      }} />
                      <button onClick={() => setData({...data, languages: data.languages.filter(l => l.id !== lang.id)})} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Tab */}
            {activeTab === 'other' && (
              <div className="space-y-6">
                {/* Projects */}
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Projects</h3>
                  <button onClick={addProject} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {data.projects.map((proj, i) => (
                    <div key={proj.id} className={cardClass}>
                      <button onClick={() => setData({...data, projects: data.projects.filter(p => p.id !== proj.id)})} className="absolute -right-2 -top-2 w-7 h-7 bg-[#0f0a0a] border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className={labelClass}>Title</p>
                          <input className={inputClass} value={proj.title} onChange={e => {
                            const newProj = [...data.projects];
                            newProj[i].title = e.target.value;
                            setData({...data, projects: newProj});
                          }} />
                        </div>
                        <div className="space-y-2">
                          <p className={labelClass}>Link</p>
                          <input className={inputClass} value={proj.link} onChange={e => {
                            const newProj = [...data.projects];
                            newProj[i].link = e.target.value;
                            setData({...data, projects: newProj});
                          }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Description</p>
                        <textarea className={`${textareaClass} h-20`} value={proj.description} onChange={e => {
                          const newProj = [...data.projects];
                          newProj[i].description = e.target.value;
                          setData({...data, projects: newProj});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Certifications</h3>
                  <button onClick={addCertification} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {data.certifications.map((cert, i) => (
                    <div key={cert.id} className="flex gap-2">
                      <input className={inputClass} placeholder="Certification" value={cert.name} onChange={e => {
                        const newCert = [...data.certifications];
                        newCert[i].name = e.target.value;
                        setData({...data, certifications: newCert});
                      }} />
                      <input className={`${inputClass} w-24`} placeholder="Year" value={cert.year} onChange={e => {
                        const newCert = [...data.certifications];
                        newCert[i].year = e.target.value;
                        setData({...data, certifications: newCert});
                      }} />
                      <button onClick={() => setData({...data, certifications: data.certifications.filter(c => c.id !== cert.id)})} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Hobbies */}
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Hobbies</h3>
                  <button onClick={addHobby} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {data.hobbies.map((hobby, i) => (
                    <div key={i} className="group relative">
                      <input 
                        className="bg-[#0f0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm w-32 focus:border-rose-500/50 focus:outline-none transition-all"
                        value={hobby}
                        onChange={e => {
                          const newHobbies = [...data.hobbies];
                          newHobbies[i] = e.target.value;
                          setData({...data, hobbies: newHobbies});
                        }}
                      />
                      <button onClick={() => removeHobby(i)} className="absolute -right-2 -top-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* References */}
                <div className={sectionHeaderClass}>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">References</h3>
                  <button onClick={addReference} className="ml-auto text-rose-400 hover:text-rose-300 font-bold text-xs flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {data.references.map((ref, i) => (
                    <div key={ref.id} className={cardClass}>
                      <button onClick={() => setData({...data, references: data.references.filter(r => r.id !== ref.id)})} className="absolute -right-2 -top-2 w-7 h-7 bg-[#0f0a0a] border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className={labelClass}>Name</p>
                          <input className={inputClass} value={ref.name} onChange={e => {
                            const newRef = [...data.references];
                            newRef[i].name = e.target.value;
                            setData({...data, references: newRef});
                          }} />
                        </div>
                        <div className="space-y-2">
                          <p className={labelClass}>Position</p>
                          <input className={inputClass} value={ref.position} onChange={e => {
                            const newRef = [...data.references];
                            newRef[i].position = e.target.value;
                            setData({...data, references: newRef});
                          }} />
                        </div>
                        <div className="space-y-2">
                          <p className={labelClass}>Contact</p>
                          <input className={inputClass} value={ref.contact} onChange={e => {
                            const newRef = [...data.references];
                            newRef[i].contact = e.target.value;
                            setData({...data, references: newRef});
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Order (Always visible) */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Section Order</label>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-1 rounded-full font-bold">Drag to reorder</span>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={data.sectionOrder} strategy={verticalListSortingStrategy}>
                  <div className="grid grid-cols-2 gap-2">
                    {data.sectionOrder.map(id => (
                      <SortableSection key={id} id={id}>
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0f0a0a] border border-white/10 rounded-xl hover:border-rose-500/30 transition-all cursor-grab active:cursor-grabbing">
                          <GripVertical size={14} className="text-slate-500" />
                          <span className="text-xs font-medium text-slate-300 capitalize">{id.replace(/([A-Z])/g, ' $1')}</span>
                        </div>
                      </SortableSection>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-[#0f0a0a] overflow-y-auto p-8 flex justify-center items-start">
          <div 
            ref={resumeRef}
            className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-12 origin-top"
            style={{ fontSize: `${data.fontSize}px`, fontFamily: data.fontFamily }}
          >
            {/* Template 0 - Classic */}
            {template === 0 && (
              <div className="flex gap-12 text-neutral-900">
                <div className="w-1/3 space-y-8">
                  {data.photo && <img src={data.photo} className="w-full aspect-square object-cover rounded-3xl" />}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: data.themeColor }}>Contact</h3>
                    <div className="space-y-2 text-sm text-neutral-600">
                      <p>{data.email}</p>
                      <p>{data.phone}</p>
                      <p>{data.website}</p>
                      {data.address && <p>{data.address}</p>}
                      {data.socialLinks.map(link => (
                        <p key={link.id} style={{ color: data.themeColor }}>{link.platform}: {link.url}</p>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: data.themeColor }}>Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-neutral-100 rounded text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  {data.languages.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: data.themeColor }}>Languages</h3>
                      <div className="space-y-2">
                        {data.languages.map(l => (
                          <div key={l.id} className="flex justify-between text-sm">
                            <span className="text-neutral-900 font-medium">{l.name}</span>
                            <span className="text-neutral-400">{l.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-8">
                  <div>
                    <h1 className="text-5xl font-black tracking-tighter text-neutral-900 mb-2">{data.fullName}</h1>
                    <p className="text-xl font-medium text-neutral-500">{data.jobTitle}</p>
                  </div>
                  
                  {data.sectionOrder.map(sectionId => {
                    if (sectionId === 'summary' && data.summary) return (
                      <div key={sectionId} className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-neutral-100 pb-2" style={{ color: data.themeColor }}>Profile</h3>
                        <p className="text-neutral-600 leading-relaxed text-sm">{data.summary}</p>
                      </div>
                    );
                    if (sectionId === 'experience' && data.experience.length > 0) return (
                      <div key={sectionId} className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-neutral-100 pb-2" style={{ color: data.themeColor }}>Experience</h3>
                        {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-2">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-neutral-900">{exp.position}</h4>
                              <span className="text-xs font-bold text-neutral-400">{exp.duration}</span>
                            </div>
                            <p className="text-sm font-medium" style={{ color: data.themeColor }}>{exp.company}</p>
                            <p className="text-sm text-neutral-600 leading-relaxed">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    );
                    if (sectionId === 'education' && data.education.length > 0) return (
                      <div key={sectionId} className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-neutral-100 pb-2" style={{ color: data.themeColor }}>Education</h3>
                        {data.education.map(edu => (
                          <div key={edu.id} className="space-y-1">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-neutral-900">{edu.degree}</h4>
                              <span className="text-xs font-bold text-neutral-400">{edu.year}</span>
                            </div>
                            <p className="text-sm font-medium" style={{ color: data.themeColor }}>{edu.school}</p>
                          </div>
                        ))}
                      </div>
                    );
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Template 1 - Modern */}
            {template === 1 && (
              <div className="w-full space-y-10 text-neutral-900">
                <div className="text-center border-b-4 border-neutral-900 pb-8">
                  <h1 className="text-6xl font-serif font-bold mb-2">{data.fullName}</h1>
                  <p className="text-2xl font-serif italic text-neutral-600">{data.jobTitle}</p>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm font-bold uppercase tracking-widest">
                    <span>{data.email}</span>
                    <span>•</span>
                    <span>{data.phone}</span>
                    {data.socialLinks.map(link => (
                      <React.Fragment key={link.id}>
                        <span>•</span>
                        <span>{link.platform}: {link.url}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-12">
                  <div className="col-span-2 space-y-8">
                    {data.experience.length > 0 && (
                      <section className="space-y-4">
                        <h3 className="text-lg font-bold border-b-2 border-neutral-200 pb-1">Professional Experience</h3>
                        {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between font-bold">
                              <span>{exp.company}</span>
                              <span>{exp.duration}</span>
                            </div>
                            <p className="italic">{exp.position}</p>
                            <p className="text-sm text-neutral-600">{exp.description}</p>
                          </div>
                        ))}
                      </section>
                    )}
                  </div>
                  <div className="space-y-8">
                    {data.skills.length > 0 && (
                      <section className="space-y-4">
                        <h3 className="text-lg font-bold border-b-2 border-neutral-200 pb-1">Skills</h3>
                        <ul className="space-y-1 text-sm">
                          {data.skills.map((s, i) => <li key={i}>• {s}</li>)}
                        </ul>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Template 2 - Executive */}
            {template === 2 && (
              <div className="w-full flex flex-col h-full text-neutral-900">
                <div className="bg-neutral-900 text-white p-12 -mx-12 -mt-12 mb-12 flex justify-between items-center">
                  <div>
                    <h1 className="text-5xl font-bold mb-2">{data.fullName}</h1>
                    <p className="text-xl font-medium" style={{ color: data.themeColor }}>{data.jobTitle}</p>
                    <div className="flex gap-4 mt-4 text-xs text-neutral-400">
                      <span>{data.email}</span>
                      <span>{data.phone}</span>
                    </div>
                  </div>
                  {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full border-4 border-white object-cover" />}
                </div>
                <div className="space-y-12">
                  <section className="grid grid-cols-4 gap-8">
                    <h3 className="font-bold uppercase tracking-widest text-xs pt-1" style={{ color: data.themeColor }}>About</h3>
                    <p className="col-span-3 text-neutral-600 leading-relaxed">{data.summary}</p>
                  </section>
                  {data.experience.length > 0 && (
                    <section className="grid grid-cols-4 gap-8">
                      <h3 className="font-bold uppercase tracking-widest text-xs pt-1" style={{ color: data.themeColor }}>Experience</h3>
                      <div className="col-span-3 space-y-8">
                        {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-2">
                            <h4 className="text-xl font-bold">{exp.position}</h4>
                            <div className="flex justify-between text-sm font-bold text-neutral-400">
                              <span>{exp.company}</span>
                              <span>{exp.duration}</span>
                            </div>
                            <p className="text-neutral-600">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            )}

            {/* Template 3 - Minimal */}
            {template === 3 && (
              <div className="w-full space-y-8 text-neutral-900">
                <div className="flex items-center gap-8 border-l-8 pl-8 py-4" style={{ borderColor: data.themeColor }}>
                  <div>
                    <h1 className="text-6xl font-black tracking-tighter">{data.fullName}</h1>
                    <p className="text-2xl font-bold text-neutral-400">{data.jobTitle}</p>
                    <div className="flex gap-4 mt-2 text-sm text-neutral-500">
                      <span>{data.email}</span>
                      <span>•</span>
                      <span>{data.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-8">
                    {data.experience.length > 0 && (
                      <section className="space-y-4">
                        <h3 className="text-xl font-bold bg-neutral-100 px-4 py-2 rounded-lg">Experience</h3>
                        {data.experience.map(exp => (
                          <div key={exp.id} className="space-y-1">
                            <p className="font-bold">{exp.position}</p>
                            <p className="text-sm" style={{ color: data.themeColor }}>{exp.company} | {exp.duration}</p>
                            <p className="text-sm text-neutral-600">{exp.description}</p>
                          </div>
                        ))}
                      </section>
                    )}
                  </div>
                  <div className="space-y-8">
                    {data.education.length > 0 && (
                      <section className="space-y-4">
                        <h3 className="text-xl font-bold bg-neutral-100 px-4 py-2 rounded-lg">Education</h3>
                        {data.education.map(edu => (
                          <div key={edu.id} className="space-y-1">
                            <p className="font-bold">{edu.degree}</p>
                            <p className="text-sm" style={{ color: data.themeColor }}>{edu.school} | {edu.year}</p>
                          </div>
                        ))}
                      </section>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Template 4 - Bold */}
            {template === 4 && (
              <div className="w-full space-y-6 text-neutral-900">
                <div className="flex justify-between items-start border-b-2 border-neutral-100 pb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-neutral-900">{data.fullName}</h1>
                    <p className="text-lg font-medium" style={{ color: data.themeColor }}>{data.jobTitle}</p>
                    <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                      <span>{data.email}</span>
                      <span>{data.phone}</span>
                    </div>
                  </div>
                  {data.photo && <img src={data.photo} className="w-20 h-20 rounded-xl object-cover" />}
                </div>
                <div className="grid grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-6">
                    {data.experience.length > 0 && (
                      <section className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Experience</h3>
                        {data.experience.map(exp => (
                          <div key={exp.id}>
                            <p className="font-bold text-neutral-900">{exp.position} @ {exp.company}</p>
                            <p className="text-xs text-neutral-400 mb-1">{exp.duration}</p>
                            <p className="text-sm text-neutral-600">{exp.description}</p>
                          </div>
                        ))}
                      </section>
                    )}
                  </div>
                  <div className="space-y-6">
                    {data.skills.length > 0 && (
                      <section className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                          {data.skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold">{s}</span>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Template 5 - Skilled */}
            {template === 5 && (
              <div className="w-full text-neutral-900">
                <div className="flex items-center gap-8 mb-12 pb-8 border-b border-neutral-100">
                  {data.photo && <img src={data.photo} className="w-32 h-32 rounded-full object-cover border-4" style={{ borderColor: data.themeColor }} />}
                  <div>
                    <h1 className="text-5xl font-black tracking-tighter mb-2" style={{ color: data.themeColor }}>{data.fullName}</h1>
                    <p className="text-xl font-bold text-neutral-500 uppercase tracking-widest">{data.jobTitle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-12">
                  <div className="col-span-2 space-y-12">
                    {data.summary && (
                      <section>
                        <h2 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.themeColor }} />
                          About Me
                        </h2>
                        <p className="text-neutral-600 leading-relaxed">{data.summary}</p>
                      </section>
                    )}
                    {data.experience.length > 0 && (
                      <section>
                        <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.themeColor }} />
                          Experience
                        </h2>
                        <div className="space-y-8">
                          {data.experience.map(exp => (
                            <div key={exp.id} className="relative pl-6 border-l-2 border-neutral-100">
                              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: data.themeColor }} />
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xl font-bold">{exp.position}</h3>
                                <span className="text-sm font-bold text-neutral-400">{exp.duration}</span>
                              </div>
                              <p className="text-sm font-bold mb-2" style={{ color: data.themeColor }}>{exp.company}</p>
                              <p className="text-sm text-neutral-600">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                  <div className="space-y-12">
                    <section>
                      <h2 className="text-sm font-black uppercase tracking-widest mb-4">Contact</h2>
                      <div className="space-y-3 text-sm text-neutral-600">
                        {data.email && <div className="flex items-center gap-2"><Mail size={14} /> {data.email}</div>}
                        {data.phone && <div className="flex items-center gap-2"><Phone size={14} /> {data.phone}</div>}
                      </div>
                    </section>
                    {data.skills.length > 0 && (
                      <section>
                        <h2 className="text-sm font-black uppercase tracking-widest mb-4">Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                          {data.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-bold text-neutral-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};