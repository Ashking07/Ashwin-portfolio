'use client'

import Link from 'next/link'
import { Mail, Download, ArrowUpRight, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="relative">
      {/* soft fade into footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b
                   from-transparent to-black/[0.04] dark:to-white/[0.05]"
      />
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 inset-0 blur-[90px] opacity-40"
        style={{
          background:
            'radial-gradient(800px 300px at 20% 10%, rgba(99,102,241,.25), transparent 60%),' +
            'radial-gradient(600px 260px at 80% 20%, rgba(147,51,234,.20), transparent 60%)',
        }}
      />

      <div className="container py-16 md:py-20 pb-28">
        {/* <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Thanks for visiting!</h2> */}

        <div className="mt-10 grid gap-12 md:grid-cols-3">
          {/* Left: mini about + CTAs + trust logos */}
          <div>
            <h3 className="text-lg font-semibold">Ashwin Kapile</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Full-stack engineer focused on useful AI, pragmatic web apps, and clean metrics.
              Built with Next.js, Tailwind, and DeepSeek.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="mailto:awish@csu.fullerton.edu"
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40
                           bg-indigo-600 text-white px-4 py-2 shadow-sm hover:bg-indigo-500"
              >
                <Mail size={16} /> Email me
              </a>
              <a
                href="/ashwin-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2
                           hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              >
                <Download size={16} /> Resume
              </a>
            </div>

            {/* trust logos */}
            <div className="mt-6 flex items-center gap-5 opacity-80">
              <img src="/logos/marks/microsoft-mark.svg" alt="Microsoft" className="h-6 w-auto" />
              <img src="/logos/marks/google-cloud-mark.svg" alt="Google Cloud" className="h-6 w-auto" />
              <img src="/logos/marks/freecodecamp-mark.svg" alt="freeCodeCamp" className="h-6 w-auto" />
              <img src="/logos/marks/udemy-mark.svg" alt="Udemy" className="h-6 w-auto" />
            </div>
          </div>

          {/* Middle: quick links */}
          <nav aria-label="Quick links">
            <div className="font-semibold">Quick links</div>
            <ul className="mt-3 space-y-2 text-zinc-700 dark:text-zinc-300">
              <li><Link href="#hero" className="hover:underline">Home</Link></li>
              <li><Link href="#projects" className="hover:underline">Projects</Link></li>
              <li><Link href="#skills" className="hover:underline">Skills</Link></li>
              <li><Link href="#resume" className="hover:underline">Resume</Link></li>
              <li><Link href="#contact" className="hover:underline">Contact</Link></li>
            </ul>
          </nav>

          {/* Right: AI links + socials */}
          <div>
            <div className="font-semibold">AI Playground</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="#playground" className="rounded-full border px-3 py-1.5 text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                Ask Ashwin
              </Link>
              <Link href="#playground" className="rounded-full border px-3 py-1.5 text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                JD Tailor
              </Link>
              <Link href="#playground" className="rounded-full border px-3 py-1.5 text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                URL Tagger
              </Link>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href="https://www.linkedin.com/in/ashkap10/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
              <a
                href="https://github.com/Ashking07"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <Github size={16} /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* divider + bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t pt-6 md:flex-row md:items-center md:justify-between text-sm opacity-80">
          <div>© {year} Ashwin Kapile</div>

         <button
  onClick={() => document.getElementById('hero')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
  className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
>
  <ArrowUpRight size={16} /> Back to top
</button>


        </div>
      </div>
    </footer>
  )
}
