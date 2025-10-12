'use client'

import { motion } from 'framer-motion'
import resume from '@/content/data/resume.json'
import projects from '@/content/data/projects.json'

type Stat = { label: string; value: string }
type Cert = { issuer: string; name: string; url?: string; year?: string }
type Exp  = { role: string; company: string; start: string; end?: string; bullets?: string[] }
type Edu  = { degree: string; school: string; year?: string; gpa?: string; honors?: string[] }

const fade = { initial:{opacity:0,y:16}, whileInView:{opacity:1,y:0}, viewport:{once:true,amount:.4} }

const marks: Record<string, string> = {
  Microsoft: '/logos/microsoft-mark.svg',
  GoogleCloud: '/logos/google-cloud-mark.svg',
  freeCodeCamp: '/logos/freecodecamp-mark.svg',
  Udemy: '/logos/udemy-mark.svg',
  // add more if needed
}

export default function ResumeSection() {
  // ---- Stats (derive safe fallbacks) ----
  const stats: Stat[] = [
    ...(Array.isArray((resume as any).stats) ? (resume as any).stats : []),
  ]
  if (!stats.length) {
    stats.push(
      { label: 'Capstone projects', value: `${projects.slice(0, 4).length}` },
      { label: 'Certs (GCP + Azure)', value: `${(resume as any).certifications?.length ?? 0}` },
      { label: 'LeetCode solved', value: '120+' },        // tweak if you have exact
      { label: 'Core stack', value: 'TS • Next.js • Node • Mongo' },
    )
  }

  const featured = projects.slice(0, 2)

  return (
    <div className="container">
      {/* Header */}
      <motion.div {...fade} className="mb-6">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Resume</h2>
        <p className="mt-3 text-lg opacity-80">
          Quick highlights — download full PDF for details.
        </p>
        <a
          href="/ashwin-resume.pdf"
          target="_blank"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10"
        >
          Download PDF
        </a>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade} className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="section-surface p-4">
            <div className="text-2xl font-semibold">{s.value}</div>
            <div className="text-sm opacity-70">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Experience */}
        <motion.div {...fade} className="lg:col-span-2 section-surface p-5">
          <h3 className="font-semibold text-lg mb-3">Experience</h3>
          <ul className="space-y-4">
            {(resume as any).experience?.map((e: Exp, i: number) => (
              <li key={i} className="border-l pl-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium">{e.role}</span>
                  <span className="opacity-70">• {e.company}</span>
                  <span className="ml-auto text-sm opacity-60">
                    {e.start} – {e.end || 'Present'}
                  </span>
                </div>
                {!!e.bullets?.length && (
                  <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
                    {e.bullets.slice(0, 2).map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Certifications */}
        <motion.div {...fade} className="section-surface p-5">
          <h3 className="font-semibold text-lg mb-3">Certifications</h3>
          <ul className="space-y-3">
            {(resume as any).certifications?.map((c: Cert, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <img
                  src={marks[c.issuer] || '/logos/microsoft-mark.svg'}
                  alt={c.issuer}
                  className="h-6 w-6 rounded"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {c.url ? (
                      <a href={c.url} target="_blank" className="hover:underline">{c.name}</a>
                    ) : c.name}
                  </div>
                  <div className="text-xs opacity-70">{c.issuer}{c.year ? ` • ${c.year}` : ''}</div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Education */}
        <motion.div {...fade} className="section-surface p-5 lg:col-span-1">
          <h3 className="font-semibold text-lg mb-3">Education</h3>
          {(resume as any).education?.map((ed: Edu, i: number) => (
            <div key={i} className="mb-3">
              <div className="font-medium">{ed.degree}</div>
              <div className="text-sm opacity-80">{ed.school}{ed.year ? ` • ${ed.year}` : ''}</div>
              {ed.gpa && <div className="text-xs opacity-70">GPA: {ed.gpa}</div>}
              {!!ed.honors?.length && (
                <div className="mt-1 text-xs opacity-70">{ed.honors.join(' • ')}</div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Skills */}
      <motion.div {...fade} className="mt-8 section-surface p-5">
        <h3 className="font-semibold text-lg mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          {(resume as any).skills?.map((s: string) => (
            <span key={s} className="border rounded-full px-3 py-1">{s}</span>
          ))}
        </div>
      </motion.div>

      {/* Featured projects */}
      <motion.div {...fade} className="mt-8">
        <h3 className="font-semibold text-lg mb-3">Featured projects</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {featured.map((p: any) => (
            <article key={p.slug} className="section-surface p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 text-xs opacity-70 mb-1">
                {p.tech?.slice(0,3)?.map((t: string) =>
                  <span key={t} className="border rounded-full px-2 py-0.5">{t}</span>
                )}
              </div>
              <h4 className="font-semibold">{p.name}</h4>
              <p className="text-sm opacity-80 mt-1 line-clamp-3">{p.summary}</p>
              {p.metrics?.[0] && (
                <div className="mt-3 text-sm">
                  • <span className="font-medium">{p.metrics[0].label}:</span> {p.metrics[0].value}
                </div>
              )}
              <a href="#projects" className="mt-4 inline-block text-sm underline opacity-80">
                View case study
              </a>
            </article>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
