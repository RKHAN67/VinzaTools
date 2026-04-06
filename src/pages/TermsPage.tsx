import React from 'react';
import { FileCheck2, Scale, Shield, Wrench } from 'lucide-react';

const terms = [
  {
    icon: FileCheck2,
    title: 'Using The Platform',
    body:
      'You may use VinzaTools for normal personal, educational, business, and internal workflow tasks. You agree not to misuse the tools for abusive uploads, harmful content, unauthorized access attempts, or illegal activity.',
  },
  {
    icon: Wrench,
    title: 'Tool Availability',
    body:
      'We work to keep tools running smoothly, but some tools depend on external services, browser support, file formats, or server resources. Features may be improved, changed, paused, or removed when needed for quality and safety.',
  },
  {
    icon: Shield,
    title: 'Uploads And Downloads',
    body:
      'You remain responsible for the files and content you upload. Make sure you have the right to use, convert, preview, or download the material you submit to the platform.',
  },
  {
    icon: Scale,
    title: 'Service Limits',
    body:
      'VinzaTools is provided as a practical productivity platform. Results can vary by file quality, browser behavior, or third-party platform restrictions. We do not promise that every file or external source will work in every case.',
  },
];

export const TermsPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      <section className="rounded-[2rem] border border-white/10 bg-[#140d0f] p-8 md:p-12">
        <div className="inline-flex items-center rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-300">
          Terms & Conditions
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
          Clear rules for a clean, reliable workspace.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
          These Terms explain how VinzaTools is meant to be used, what the
          platform provides, and the responsibilities users keep when working
          with uploads, downloads, themes, and content processing.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {terms.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-white/10 bg-[#171010] p-7 shadow-[0_22px_60px_rgba(0,0,0,0.24)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-300">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item.body}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h2 className="text-2xl font-bold text-white">Important Notes</h2>
        <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-400">
          <li>
            Theme previews and downloads are offered for legitimate usage,
            evaluation, and workflow support only.
          </li>
          <li>
            Some media tools depend on outside platforms, so provider-side
            blocking or policy changes can affect results.
          </li>
          <li>
            Contact requests, feedback, and tool ideas may be reviewed inside
            the admin dashboard for support and product improvement.
          </li>
        </ul>
      </section>
    </div>
  );
};
