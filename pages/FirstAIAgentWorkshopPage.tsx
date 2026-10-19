import AcademyBrand from '../components/AcademyBrand';
import React from 'react';
import { ArrowRight, CalendarDays, Clock3, MapPin, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const PAGE_PATH = '/workshops/build-your-first-ai-agent';
const POSTER_PATH = '/images/workshops/first-ai-agent-20261017.jpg';

const FirstAIAgentWorkshopPage: React.FC = () => (
  <>
    <SEO
      title="Past Event: Build Your First AI Agent | 17 October 2026 | Nexius Academy"
      description="Past event: Nexius Academy’s AI agent workshop took place on 17 October 2026, 10am–12pm Singapore time, at Devan Nair Institute. Registration is closed."
      canonical={PAGE_PATH}
      robots="index,follow"
      ogImage={`https://academy.nexiuslabs.com${POSTER_PATH}`}
      ogImageWidth={1024}
      ogImageHeight={1536}
      ogImageAlt="Build your first AI agent in 2 hours — Nexius Academy workshop, 17 October 2026"
    />
    <div className="min-h-screen bg-[#06141e] text-white">
      <a href="#workshop" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-slate-950">Skip to workshop details</a>
      <header className="border-b border-white/10">
        <nav aria-label="Workshop navigation" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <a href="/" aria-label="Nexius Academy home" className="text-sm font-bold uppercase tracking-[0.22em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"><AcademyBrand /></a>
          <a href="#event-details" className="text-sm font-semibold text-slate-200 underline decoration-slate-500 underline-offset-4 hover:text-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300">Event details</a>
        </nav>
      </header>

      <main id="workshop" tabIndex={-1} className="outline-none">
        <section className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16" aria-labelledby="workshop-title">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-teal-300">Past event · 17 October 2026</p>
            <h1 id="workshop-title" className="font-heading text-4xl font-black uppercase leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.45rem]">
              Build your first AI agent <span className="text-teal-300">in 2 hours</span>
            </h1>
            <div role="note" className="mt-7 rounded-xl border border-teal-300/40 bg-[#0b2230] p-5"><h2 className="text-xl font-bold">This event has ended</h2><p className="mt-2 leading-7 text-slate-200">The 17 October 2026 workshop is over. Registration is closed.</p></div>
            <p className="mt-7 text-xl font-semibold leading-8 text-white">About this workshop</p>
            <p className="mt-4 text-base leading-7 text-slate-300">This practical two-hour session focused on building a first AI agent around an everyday work task.</p>
            <p className="mt-4 text-base leading-7 text-slate-300">The workshop explored how an AI agent can help organise information, streamline repetitive work and turn a simple idea into a useful workflow.</p>

            <section id="event-details" className="mt-8 scroll-mt-6 rounded-2xl border border-teal-300/30 bg-[#0b2230] p-5 sm:p-6" aria-labelledby="event-details-title">
              <h2 id="event-details-title" className="mb-5 text-lg font-bold">Event details</h2>
              <dl className="space-y-5 text-sm leading-6">
                <div className="flex gap-4">
                  <CalendarDays aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-teal-300" />
                  <div><dt className="text-slate-300">Date</dt><dd className="text-base font-bold"><time dateTime="2026-10-17">17 October 2026</time></dd></div>
                </div>
                <div className="flex gap-4">
                  <Clock3 aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-teal-300" />
                  <div><dt className="text-slate-300">Time</dt><dd className="text-base font-bold"><time dateTime="2026-10-17T10:00:00+08:00">10am</time> to <time dateTime="2026-10-17T12:00:00+08:00">12pm</time> <span className="font-normal text-slate-300">(Singapore time)</span></dd></div>
                </div>
                <div className="flex gap-4">
                  <MapPin aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-teal-300" />
                  <div><dt className="text-slate-300">Venue</dt><dd><span className="text-base font-bold">Devan Nair Institute</span><address className="mt-1 not-italic text-slate-200">80 Jurong East Street 21<br />#01-01/02/03, Singapore 609607</address></dd></div>
                </div>
              </dl>
            </section>

            <p className="mt-7 flex items-start gap-3 text-base font-semibold leading-7"><CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-teal-300" />No coding background is required.</p>
            <a href="/#courses" className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-accent px-7 py-4 text-sm font-bold text-slate-950 hover:bg-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300">Explore current courses <ArrowRight aria-hidden="true" className="h-5 w-5" /></a>
          </div>

          <figure className="mx-auto w-full max-w-xl lg:sticky lg:top-8">
            <img src={POSTER_PATH} width={1024} height={1536} alt="Nexius Academy: Build your first AI agent in 2 hours. 17 October 2026, 10am to 12pm, Devan Nair Institute, 80 Jurong East Street 21, #01-01/02/03, Singapore 609607. No coding background required." className="h-auto w-full rounded-2xl border border-teal-300/20 object-contain shadow-2xl" decoding="async" />
            <figcaption className="mt-3 text-center text-xs leading-5 text-slate-400">Original event poster · Past event · 17 October 2026</figcaption>
          </figure>
        </section>
        <section id="registration" tabIndex={-1} aria-labelledby="registration-title" className="mx-auto max-w-3xl scroll-mt-6 px-5 pb-14 outline-none sm:px-8"><div className="rounded-2xl border border-teal-300/30 bg-[#0b2230] p-5 sm:p-8"><h2 id="registration-title" className="text-2xl font-bold">Registration closed</h2><p className="mt-3 leading-7 text-slate-300">This workshop ended on 17 October 2026. We are no longer accepting registration requests for this event.</p></div></section>
      </main>
      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-300"><a href="/" className="underline underline-offset-4 hover:text-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"><AcademyBrand /></a> · Practical AI learning</footer>
    </div>
  </>
);

export default FirstAIAgentWorkshopPage;
