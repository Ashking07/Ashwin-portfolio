'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import featured from '@/content/data/projects.json'
import mini from '@/content/data/mini-projects.json'
import ProjectModal from './ProjectModal'

function Card({ p, onOpen }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      className="group cursor-pointer"
      onClick={() => onOpen(p)}
      role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(p)}
      aria-label={`Open ${p.name}`}
    >
      {/* gradient frame */}
      <div className="rounded-3xl p-[2px] bg-gradient-to-r from-indigo-500/45 via-fuchsia-500/35 to-emerald-500/45
                      transition-colors duration-500 ease-[cubic-bezier(.2,.8,.2,1)]
                      group-hover:from-indigo-500 group-hover:to-emerald-500">
        {/* actual card */}
        <article
          className="rounded-3xl border bg-white/70 dark:bg-zinc-900/60 p-5 backdrop-blur
                     shadow-sm transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)]
                     group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:bg-white/80 dark:group-hover:bg-zinc-900/70">
          <div className="flex items-start gap-3">
            <h3 className="font-semibold text-lg leading-snug">{p.name}</h3>
            <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full border opacity-80">Featured</span>
          </div>

          <p className="text-sm opacity-80 mt-2">{p.summary}</p>

          <ul className="mt-3 flex flex-wrap gap-2 text-xs opacity-80">
            {p.tech?.slice(0, 6).map((t: string) => (
              <li key={t} className="border rounded-full px-2 py-0.5">{t}</li>
            ))}
          </ul>

          {p.metrics?.length ? (
            <ul className="mt-4 space-y-1 text-sm">
              {p.metrics.slice(0, 2).map((m: any, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="font-medium">{m.label}:</span> <span className="opacity-90">{m.value}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4 text-xs opacity-60">Click to view details & screenshots</div>
        </article>
      </div>
    </motion.div>
  )
}



export default function ProjectsGrid() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<any | null>(null)
  const onOpen = (p: any) => { setActive(p); setOpen(true) }
  const onClose = () => setOpen(false)

  return (
    <>
      {/* Featured grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((p: any) => <Card key={p.slug} p={p} onOpen={onOpen} />)}
      </div>

      {/* Mini projects rail */}
      {/* Mini projects rail */}
<div className="mt-10">
  <div className="text-sm font-medium mb-3 opacity-80">Other mini projects</div>
  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar">
    {mini.map((m: any, i: number) => (
      <a key={i} href={m.link} target="_blank" rel="noopener noreferrer"
         className="snap-start flex-none min-w-[260px] rounded-2xl p-[2px]
                    bg-gradient-to-r from-slate-200/70 via-slate-100/60 to-slate-200/70
                    dark:from-zinc-800/70 dark:via-zinc-800/40 dark:to-zinc-800/70">
        <div className="rounded-2xl border bg-white/70 dark:bg-zinc-900/60 px-4 py-3">
          <div className="text-sm font-medium line-clamp-1">{m.title}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] opacity-80">
            {m.tags?.map((t: string) => (
              <span key={t} className="border rounded-full px-2 py-0.5">{t}</span>
            ))}
          </div>
        </div>
      </a>
    ))}
  </div>
</div>


      <ProjectModal open={open} onClose={onClose} project={active} />
    </>
  )
}
