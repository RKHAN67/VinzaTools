import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Star,
  Zap,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Rocket,
  Code2,
  Quote,
  Target,
  TrendingUp,
  Clock,
  Shield,
  CheckCircle2,
  Download,
  MonitorSmartphone,
  Wrench,
} from 'lucide-react';

interface TeamPageProps {
  imageSrc: string;
}

export const TeamPage = ({ imageSrc }: TeamPageProps) => {
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  const timeline = [
    { year: '2020', title: 'Started the Build', desc: 'Initial product ideas and first working code.', icon: Code2 },
    { year: '2021', title: 'Utility Prototypes', desc: 'Core file and workflow tools started taking shape.', icon: Download },
    { year: '2022', title: 'Product Direction', desc: 'Clear focus on usability, quality, and consistency.', icon: Users },
    { year: '2023', title: 'VinzaTools Launch', desc: 'The platform identity and working tool library came together.', icon: Rocket },
    { year: '2024', title: 'Ongoing Expansion', desc: 'More tools, stronger polish, and cleaner delivery.', icon: Globe },
  ];

  const skills = [
    { name: 'React', level: 95, color: 'from-rose-500 to-pink-500' },
    { name: 'TypeScript', level: 90, color: 'from-blue-500 to-cyan-500' },
    { name: 'Node.js', level: 88, color: 'from-green-500 to-emerald-500' },
    { name: 'UI/UX', level: 85, color: 'from-purple-500 to-violet-500' },
    { name: 'DevOps', level: 80, color: 'from-amber-500 to-orange-500' },
  ];

  const achievements = [
    { icon: Target, label: 'Clear Vision', sublabel: 'Business direction' },
    { icon: TrendingUp, label: 'Product Growth', sublabel: 'Steady improvement' },
    { icon: Clock, label: 'Fast Delivery', sublabel: 'Focused execution' },
    { icon: Shield, label: 'Reliable Build', sublabel: 'Quality-first mindset' },
  ];

  const builderHighlights = [
    {
      icon: Rocket,
      title: 'Builds working tools',
      copy: 'Turns product ideas into live utility tools, polished flows, and practical screens users can actually rely on.',
    },
    {
      icon: MonitorSmartphone,
      title: 'Improves responsive UX',
      copy: 'Checks layouts on desktop and mobile so the platform feels cleaner, faster, and easier to use.',
    },
    {
      icon: Wrench,
      title: 'Fixes issues quickly',
      copy: 'Handles tool-level bugs, frontend polish, and release-ready refinements before updates go live.',
    },
    {
      icon: CheckCircle2,
      title: 'Supports quality checks',
      copy: 'Reviews tool behavior, interaction details, and overall consistency across the VinzaTools workspace.',
    },
  ];

  const builderStats = [
    { label: 'Primary Focus', value: 'Product delivery' },
    { label: 'Working Style', value: 'Hands-on builder' },
    { label: 'Platform Role', value: 'Tool execution' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-20 pb-20">
      <div className="relative py-20 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-500/20 via-coral-500/20 to-orange-500/20 blur-[120px] animate-pulse" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-400 backdrop-blur-sm">
            <Users size={14} />
            <span>Team Page</span>
          </div>

          <h1 className="text-6xl font-black text-white md:text-8xl">
            Meet the{' '}
            <span className="animate-gradient bg-gradient-to-r from-rose-400 via-coral-500 to-orange-500 bg-clip-text text-transparent">
              Leadership
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-400">
            BlueVinza drives the business direction, while VinzaTools delivers the working product experience people use every day.
          </p>
        </div>
      </div>

      <div className="group relative">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-rose-500 via-coral-500 to-orange-500 opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1414]/80 p-10 shadow-2xl backdrop-blur-xl md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.15),transparent_50%)]" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-5">
            <div className="flex flex-col items-center lg:col-span-2">
              <div className="relative">
                <div
                  className="absolute -inset-6 animate-spin-slow rounded-[2.5rem] border-2 border-dashed border-rose-500/30"
                  style={{ animationDuration: '20s' }}
                />

                <div className="relative flex h-56 w-56 items-center justify-center rounded-[2rem] border-4 border-rose-500/40 bg-gradient-to-br from-rose-500 to-orange-500 shadow-2xl shadow-rose-500/30 transition-transform duration-500 group-hover:scale-105">
                  <span className="text-7xl font-black tracking-tight text-white">HR</span>
                </div>

                <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-2 font-bold text-white shadow-lg shadow-rose-500/30">
                  <Star size={16} className="fill-white" />
                  Chairman & Owner
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                {achievements.slice(0, 2).map((item, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                    <item.icon size={20} className="mx-auto mb-1 text-rose-400" />
                    <div className="text-lg font-bold text-white">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.sublabel}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 lg:col-span-3">
              <div>
                <h2 className="mb-3 text-5xl font-black text-white">Habib Ur Rehman</h2>
                <div className="flex flex-wrap items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-sm text-rose-400">
                    <Zap size={14} className="text-amber-400" />
                    Chairman & Owner
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin size={14} />
                    Pakistan
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Calendar size={14} />
                    Since 2020
                  </span>
                </div>
              </div>

              <p className="border-l-4 border-rose-500 pl-6 text-lg leading-relaxed text-slate-300">
                Habib Ur Rehman leads BlueVinza as the business head behind the platform vision, brand direction, and long-term growth strategy. His focus is to keep the company moving with clarity, strong standards, and a product direction that helps VinzaTools stay useful, reliable, and ready for scale.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Target, label: 'BlueVinza Role', value: 'Company leadership and business direction.' },
                  { icon: Rocket, label: 'VinzaTools Focus', value: 'Platform growth, product quality, and launch readiness.' },
                  { icon: Shield, label: 'Leadership Priority', value: 'Stable products, clean execution, and trusted delivery.' },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                      <item.icon size={18} />
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-sm font-medium leading-6 text-slate-200">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="group relative">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1414]/80 p-10 shadow-2xl backdrop-blur-xl md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.14),transparent_42%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_75%,rgba(249,115,22,0.14),transparent_46%)]" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-5">
            <div className="flex flex-col items-center lg:col-span-2">
              <div className="relative">
                <div
                  className="absolute -inset-6 animate-spin-slow rounded-[2.5rem] border-2 border-dashed border-amber-500/30"
                  style={{ animationDuration: '22s' }}
                />

                <div className="relative h-56 w-56 overflow-hidden rounded-[2rem] border-4 border-amber-500/40 shadow-2xl shadow-amber-500/20 transition-transform duration-500 group-hover:scale-105">
                  <img src={imageSrc} alt="Rizwan Khan" className="h-full w-full object-cover" />
                </div>

                <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 font-bold text-white shadow-lg shadow-amber-500/30">
                  <Star size={16} className="fill-white" />
                  Lead Builder
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                {[
                  { icon: Rocket, label: 'Fast Execution', sublabel: 'Build focused' },
                  { icon: Shield, label: 'Quality Checks', sublabel: 'Polish first' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                    <item.icon size={20} className="mx-auto mb-1 text-amber-400" />
                    <div className="text-lg font-bold text-white">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.sublabel}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 lg:col-span-3">
              <div>
                <h2 className="mb-3 text-5xl font-black text-white">Rizwan Khan</h2>
                <div className="flex flex-wrap items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-300">
                    <Zap size={14} className="text-amber-300" />
                    Product Developer & Lead Builder
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin size={14} />
                    Pakistan
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Calendar size={14} />
                    Since 2020
                  </span>
                </div>
              </div>

              <p className="border-l-4 border-amber-500 pl-6 text-lg leading-relaxed text-slate-300">
                Rizwan Khan works on the build side of VinzaTools with a practical focus on tool execution, interface polish, responsiveness, and day-to-day product improvements. He helps turn ideas into live features, fixes issues before release, and keeps the experience cleaner for users across the platform.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Rocket,
                    label: 'Platform Role',
                    value: 'Builds and improves working tools inside VinzaTools.',
                  },
                  {
                    icon: MonitorSmartphone,
                    label: 'Primary Focus',
                    value: 'Responsive UX, cleaner flows, and practical feature delivery.',
                  },
                  {
                    icon: Wrench,
                    label: 'Daily Work',
                    value: 'Fixes issues, refines tools, and supports release readiness.',
                  },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
                      <item.icon size={18} />
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-sm font-medium leading-6 text-slate-200">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <h3 className="mb-10 text-center text-3xl font-black text-white">
          Journey <span className="text-rose-400">So Far</span>
        </h3>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-1 rounded-full bg-gradient-to-b from-rose-500 via-coral-500 to-orange-500 md:block" />

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className={`flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`inline-block rounded-2xl border border-white/10 bg-[#1a1414] p-6 transition-all group-hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/10 ${i % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <div className="mb-2 flex items-center justify-center gap-3 md:justify-start" style={{ flexDirection: i % 2 === 0 ? 'row-reverse' : 'row' }}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 transition-colors group-hover:bg-rose-500/20">
                        <item.icon size={20} className="text-rose-400" />
                      </div>
                      <span className="text-xl font-bold text-rose-400">{item.year}</span>
                    </div>
                    <h4 className="mb-1 text-lg font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>

                <div className="relative z-10 hidden md:block">
                  <div className="h-5 w-5 rounded-full border-4 border-[#0f0a0a] bg-rose-500 shadow-lg shadow-rose-500/50" />
                </div>

                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#1a1414] p-8">
          <h3 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
            <Code2 size={24} className="text-rose-400" />
            Tech Stack
          </h3>

          <div className="space-y-6">
            {skills.map((skill, i) => (
              <div key={i} className="group" onMouseEnter={() => setActiveSkill(i)} onMouseLeave={() => setActiveSkill(null)}>
                <div className="mb-3 flex items-center justify-between">
                  <span className={`font-medium transition-colors ${activeSkill === i ? 'text-white' : 'text-slate-300'}`}>
                    {skill.name}
                  </span>
                  <span className="font-mono font-bold text-rose-400">{skill.level}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div className={`relative h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700`} style={{ width: `${skill.level}%` }}>
                    {activeSkill === i && <div className="absolute inset-0 animate-pulse bg-white/30" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-20 blur-xl transition-opacity group-hover:opacity-30" />

          <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#1a1414] p-8">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  Product Delivery Focus
                </div>
                <h3 className="mt-4 text-3xl font-black text-white">How Rizwan supports VinzaTools</h3>
                <p className="mt-2 text-slate-400">Working close to the product so tools feel cleaner, faster, and more reliable in real use.</p>
              </div>

              <p className="leading-7 text-slate-300">
                This side of the work focuses on practical delivery: refining layouts, fixing issues, checking responsive behavior, and making sure new ideas turn into working tools instead of staying as rough concepts.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {builderStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold leading-6 text-slate-100">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {builderHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
                        <item.icon size={18} />
                      </div>
                      <div className="text-sm font-bold text-white">{item.title}</div>
                    </div>
                    <p className="text-sm leading-6 text-slate-400">{item.copy}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="mailto:info@bluevinza.com"
                  className="vinza-button flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-white hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <Mail size={16} />
                  Contact Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h3 className="mb-3 text-3xl font-black text-white">
            BlueVinza & <span className="text-rose-400">VinzaTools</span>
          </h3>
          <p className="mx-auto max-w-3xl text-slate-400">
            BlueVinza is the business and leadership layer behind the work, while VinzaTools is the practical product platform where the tools, user flows, and delivery experience come together.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: 'BlueVinza', copy: 'The company side focused on leadership, direction, positioning, and long-term business growth.', icon: Sparkles },
            { title: 'VinzaTools', copy: 'The product side focused on tool quality, user experience, responsive screens, and working utility flows.', icon: Rocket },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-[#1a1414] p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
                <item.icon size={24} />
              </div>
              <h4 className="text-2xl font-black text-white">{item.title}</h4>
              <p className="mt-4 leading-7 text-slate-300">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative py-20">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-rose-500/5 via-coral-500/5 to-orange-500/5" />
        <div className="relative mx-auto max-w-4xl px-8 text-center">
          <Quote size={64} className="mx-auto mb-6 text-rose-500/20" />
          <p className="mb-8 text-3xl font-medium leading-tight text-white md:text-4xl">
            "Strong products grow when the vision is clear, the experience is simple, and every detail is built with <span className="text-rose-400">purpose</span>."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-rose-500/30 bg-gradient-to-br from-rose-500 to-orange-500 text-sm font-black text-white">
              HR
            </div>
            <div className="text-left">
              <div className="font-bold text-white">Habib Ur Rehman</div>
              <div className="text-sm text-rose-400">Chairman, BlueVinza</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-coral-600 to-orange-600 p-12 text-center md:p-16">
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>

        <div className="relative z-10">
          <Globe size={56} className="mx-auto mb-6 text-white/90" />
          <h2 className="mb-4 text-4xl font-black text-white">Let's build something amazing</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            Focused on building better digital tools, cleaner user journeys, and products people can trust every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:info@bluevinza.com" className="vinza-button flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-rose-600 transition-all hover:shadow-xl hover:shadow-black/20">
              <Mail size={20} />
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
