import React from 'react';
import { Database, Eye, Lock, ShieldCheck } from 'lucide-react';

const policySections = [
  {
    icon: Database,
    title: 'What We Collect',
    body:
      'VinzaTools only collects the details needed to run the platform, process requests, and reply to support messages. This can include your contact form details, theme download activity, admin usage logs, and tool processing metadata needed for stability.',
  },
  {
    icon: Eye,
    title: 'How Data Is Used',
    body:
      'We use this data to keep tools working, measure traffic, improve performance, review support requests, and understand which tools or themes are being used the most. We do not sell personal data to outside parties.',
  },
  {
    icon: Lock,
    title: 'File Handling',
    body:
      'Files uploaded to tools are handled for processing only. Some tools temporarily store files during conversion or download preparation, but the platform is built to avoid keeping files longer than needed for the task.',
  },
  {
    icon: ShieldCheck,
    title: 'Your Rights',
    body:
      'If you need clarification, removal of a submitted message, or information about your stored contact details, you can reach the BlueVinza team directly at info@bluevinza.com.',
  },
];

export const PolicyPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      <section className="rounded-[2rem] border border-white/10 bg-[#140d0f] p-8 md:p-12">
        <div className="inline-flex items-center rounded-full border border-rose-500/25 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-rose-300">
          Privacy Policy
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
          Your data should stay clear, limited, and respected.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
          This Privacy Policy explains how VinzaTools and BlueVinza handle
          contact details, activity logs, theme actions, and temporary file
          processing. The goal is simple: only collect what helps the platform
          work and keep the experience reliable.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {policySections.map((section) => {
          const Icon = section.icon;
          return (
            <article
              key={section.title}
              className="rounded-[1.75rem] border border-white/10 bg-[#171010] p-7 shadow-[0_22px_60px_rgba(0,0,0,0.24)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-300">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{section.body}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h2 className="text-2xl font-bold text-white">Contact for Privacy Questions</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
          For privacy-related questions, corrections, or support requests, use
          the contact page or email the team directly.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#120c0c] p-5">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Email
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              info@bluevinza.com
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#120c0c] p-5">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Phone
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              +92-341-2890356
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
