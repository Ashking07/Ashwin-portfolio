'use client';

import projects from '@/content/data/projects.json';
import resume from '@/content/data/resume.json';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import dynamic from 'next/dynamic'
const AIChat = dynamic(() => import('@/components/AIChat'), { ssr: false })


export default function HomePage() {
  return (
    <div className="main-snap">
      <Section id="hero" headline={`Hi, I’m Ashwin — Full-stack\nSoftware Engineer`}
        sub="I build scalable web apps, wire real metrics, and ship useful AI features.">
        <div className="mt-6 flex gap-3">
          <a className="px-4 py-2 rounded-xl border" href="#projects">View Projects</a>
          <a className="px-4 py-2 rounded-xl border inline-flex items-center gap-2" href="#playground">
            AI Playground <ArrowRight size={16}/>
          </a>
        </div>
        <div className="mt-10 hidden md:flex items-center gap-2 text-sm opacity-70">
          <span>Scroll</span><ArrowDown size={16}/>
        </div>
      </Section>

      <Section id="projects" headline="Featured Projects" sub="Problem → solution → metrics.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <Card key={p.slug} title={p.name} subtitle={p.summary} chips={p.tech} metrics={p.metrics} links={p.links}/>
          ))}
        </div>
      </Section>

      <Section id="skills" headline="Skills & Tools" sub="A practical stack I use to ship.">
        <div className="flex flex-wrap gap-2 text-sm">
          {resume.skills.map((s: string) => <span key={s} className="border rounded-full px-3 py-1">{s}</span>)}
        </div>
      </Section>

      <Section id="resume" headline="Resume" sub="Quick highlights — download full PDF for details.">
        <a href="/ashwin-resume.pdf" target="_blank" className="inline-block px-4 py-2 rounded-xl border">Download PDF</a>
      </Section>

      <Section id="playground" headline="AI Playground" sub="Ask about my projects, skills, or experience.">
        {/* Slot where the chat will mount when this section is in view */}
        <div id="playground-chat-slot" className="mt-6 max-w-3xl"></div>
        </Section>

      <Section id="contact" headline="Contact" sub="I’m open to roles, freelance, and collaborations.">
        <form className="max-w-xl space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Thanks! This is a stub.'); }}>
          <input className="w-full border rounded-xl p-3" placeholder="Your email" required />
          <textarea className="w-full border rounded-xl p-3" rows={5} placeholder="Message" required />
          <button className="border rounded-xl px-4 py-2">Send (stub)</button>
        </form>
      </Section>

      {/* Mount the floating chat once so it’s visible on all sections */}
      <AIChat />
    </div>
  );
}

function Card({ title, subtitle, chips, metrics, links }: any) {
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} className="rounded-2xl border p-5 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm opacity-80 mt-1">{subtitle}</p>
      <ul className="mt-3 flex flex-wrap gap-2 text-xs opacity-70">
        {chips?.map((t: string) => <li key={t} className="border rounded-full px-2 py-0.5">{t}</li>)}
      </ul>
      {metrics?.length ? (
        <ul className="mt-3 text-sm">
          {metrics.map((m: any, i: number) => <li key={i}>• <span className="font-medium">{m.label}:</span> {m.value}</li>)}
        </ul>
      ) : null}
      <div className="mt-4 flex gap-3 text-sm">
        {links?.demo && <a className="underline" href={links.demo} target="_blank">Live demo</a>}
        {links?.repo && <a className="underline" href={links.repo} target="_blank">Code</a>}
      </div>
    </motion.article>
  );
}

function Section({ id, headline, sub, children }: { id: string; headline: string; sub?: string; children?: React.ReactNode }) {
  return (
    <section id={id} className="snap-section">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }} className="container">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight whitespace-pre-line">{headline}</h2>
        {sub && <p className="mt-4 text-lg opacity-80 max-w-2xl">{sub}</p>}
        <div className="mt-8">{children}</div>
      </motion.div>
    </section>
  );
}
