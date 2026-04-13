import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  Mail,
  Newspaper,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: 'PDF Tools' | 'Image Editing' | 'Media Workflow' | 'Resume' | 'Developer';
  featured: boolean;
};

const posts: BlogPost[] = [
  {
    id: 1,
    title: 'How to Remove Backgrounds for Product Photos and Thumbnails',
    excerpt:
      'Use the VinzaTools background remover to clean product shots, profile photos, and thumbnail images without opening bulky desktop software.',
    image: '/assets/blog/background-remover-guide.png',
    author: 'VinzaTools Desk',
    date: 'Apr 05, 2026',
    readTime: '4 min',
    category: 'Image Editing',
    featured: true,
  },
  {
    id: 2,
    title: 'The Clean PDF Workflow: Merge, Split, Compress, and Convert',
    excerpt:
      'Build a practical PDF routine with merge, split, PDF to Word, JPG to PDF, and quick cleanup tools from one dashboard.',
    image: '/assets/blog/pdf-workflow-guide.png',
    author: 'VinzaTools Desk',
    date: 'Apr 04, 2026',
    readTime: '6 min',
    category: 'PDF Tools',
    featured: true,
  },
  {
    id: 3,
    title: 'How to Download YouTube Videos Without Breaking Your Workflow',
    excerpt:
      'Fetch public YouTube links, choose the right format, and keep your downloads simple, organized, and ready to use.',
    image: '/assets/blog/youtube-downloader-guide.png',
    author: 'VinzaTools Desk',
    date: 'Apr 03, 2026',
    readTime: '5 min',
    category: 'Media Workflow',
    featured: false,
  },
  {
    id: 4,
    title: 'Instagram, TikTok, and Facebook Downloads: A Cleaner Social Workflow',
    excerpt:
      'Save public reels, videos, and clips from Instagram, TikTok, and Facebook with fewer steps and clearer results.',
    image: '/assets/blog/social-download-guide.png',
    author: 'VinzaTools Desk',
    date: 'Apr 02, 2026',
    readTime: '5 min',
    category: 'Media Workflow',
    featured: false,
  },
  {
    id: 5,
    title: 'Resume Builder Tips for Faster, Cleaner Job Applications',
    excerpt:
      'Create sharper resumes, stay ATS-friendly, and keep your personal branding clean when applying for new roles.',
    image: '/assets/blog/resume-builder-guide.png',
    author: 'VinzaTools Desk',
    date: 'Apr 01, 2026',
    readTime: '7 min',
    category: 'Resume',
    featured: false,
  },
  {
    id: 6,
    title: 'Developer Utilities That Save Real Time',
    excerpt:
      'Format JSON, minify code, review database rows, and generate helper content without jumping between tabs.',
    image: '/assets/blog/developer-utilities-guide.png',
    author: 'VinzaTools Desk',
    date: 'Mar 31, 2026',
    readTime: '4 min',
    category: 'Developer',
    featured: false,
  },
];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Posts' },
  { id: 'pdf', label: 'PDF Tools' },
  { id: 'image', label: 'Image Editing' },
  { id: 'media', label: 'Media Workflow' },
  { id: 'resume', label: 'Resume' },
  { id: 'dev', label: 'Developer' },
] as const;

export const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORY_OPTIONS)[number]['id']>('all');

  const categories = useMemo(
    () =>
      CATEGORY_OPTIONS.map((category) => ({
        ...category,
        count:
          category.id === 'all'
            ? posts.length
            : posts.filter((post) => post.category === category.label).length,
      })),
    []
  );

  const featuredPost = posts[0];

  const filteredPosts = posts.filter(
    (post) =>
      (activeCategory === 'all' ||
        post.category === categories.find((category) => category.id === activeCategory)?.label) &&
      (searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-16 max-w-6xl mx-auto pb-20">
      <div className="text-center py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-sm mb-6">
            <Newspaper size={14} />
            <span>Blog</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Practical <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-coral-500 to-orange-500">Guides</span> for Real Work
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Find simple walkthroughs for background remover, PDF tools, YouTube downloads, social media downloads,
            resume building, and everyday productivity inside VinzaTools.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1a1414] border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white placeholder-slate-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-60">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {!searchQuery && activeCategory === 'all' && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-coral-500 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />

          <div className="relative bg-[#1a1414] rounded-3xl overflow-hidden border border-white/10">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1414] hidden md:block" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Sparkles size={12} />
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
                  <span className="text-rose-400 font-medium">{featuredPost.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-rose-300 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-400 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                      {featuredPost.author[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{featuredPost.author}</div>
                      <div className="text-slate-500 text-xs">{featuredPost.date}</div>
                    </div>
                  </div>
                  <a href="#/tools" className="flex items-center gap-2 text-rose-400 font-medium hover:gap-3 transition-all">
                    Open Related Tools
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={24} className="text-rose-400" />
            {searchQuery
              ? 'Search Results'
              : activeCategory === 'all'
                ? 'Latest Posts'
                : categories.find((category) => category.id === activeCategory)?.label}
          </h2>
          <span className="text-slate-500 text-sm">{filteredPosts.length} articles</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-[#1a1414] rounded-2xl overflow-hidden border border-white/10 hover:border-rose-500/30 transition-all hover:shadow-lg hover:shadow-rose-500/10"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1414] to-transparent opacity-60" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/10">
                    {post.category}
                  </span>
                </div>
                {post.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-rose-500/90 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                      <Sparkles size={10} />
                      Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rose-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold">
                      {post.author[0]}
                    </div>
                    <span className="text-slate-400 text-sm">{post.author}</span>
                  </div>
                  <a href="#/tools" className="text-rose-400 text-sm font-semibold hover:text-rose-300 transition-colors">
                    Open Tools
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-3xl blur opacity-20" />
        <div className="relative bg-[#1a1414] rounded-3xl p-8 md:p-12 border border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="text-rose-400" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Need a specific guide?</h2>
            <p className="text-slate-400 mb-8">
              If you want a walkthrough for a tool, workflow, or download process, send us a message and we will help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500/50 text-white placeholder-slate-500"
              />
              <a
                href="mailto:info@bluevinza.com?subject=VinzaTools%20Blog%20Updates"
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
