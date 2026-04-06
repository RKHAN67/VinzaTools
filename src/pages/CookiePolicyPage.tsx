import React from 'react';
import { Cookie, Gauge, LayoutPanelTop, ShieldCheck } from 'lucide-react';

const cookieSections = [
  {
    icon: Cookie,
    title: 'Essential Cookies',
    body:
      'Basic browser storage may be used to remember app state such as page selection, tool context, or lightweight interface preferences needed to keep navigation smooth.',
  },
  {
    icon: Gauge,
    title: 'Performance Signals',
    body:
      'Usage metrics and request logs can be used on the backend to understand traffic, failed requests, and which tools or themes are used most often. This helps improve speed and reliability.',
  },
  {
    icon: LayoutPanelTop,
    title: 'Experience Preferences',
    body:
      'Small client-side settings may be saved to support interface behavior such as open sections, preview state, or navigation flow so the site feels consistent during a session.',
  },
  {
    icon: ShieldCheck,
    title: 'Your Control',
    body:
      'You can clear browser data or block cookies in your browser settings, but some parts of the interface may feel less smooth if essential local preferences are disabled.',
  },
];

export const CookiePolicyPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      <section className="rounded-[2rem] border border-white/10 bg-[#140d0f] p-8 md:p-12">
        <div className="inline-flex items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
          Cookie Policy
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
          Simple cookie use, no unnecessary clutter.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
          This page explains how VinzaTools may use cookies or similar browser
          storage to keep sessions smooth, understand platform usage, and make
          the workspace easier to use.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {cookieSections.map((section) => {
          const Icon = section.icon;
          return (
            <article
              key={section.title}
              className="rounded-[1.75rem] border border-white/10 bg-[#171010] p-7 shadow-[0_22px_60px_rgba(0,0,0,0.24)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{section.body}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h2 className="text-2xl font-bold text-white">Need More Detail?</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
          If you need clarification about cookies, browser storage, or traffic
          logs used by the platform, you can contact the BlueVinza team at
          info@bluevinza.com.
        </p>
      </section>
    </div>
  );
};
