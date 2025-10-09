'use client'

// components/SiteFooter.tsx
import { ArrowUp, Linkedin, Github, Sparkles, Link as LinkIcon } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer id="site-footer" className="mt-20 border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        {/* About */}
        <div>
          <div className="text-lg font-semibold">Ashwin Kapile</div>
          <p className="mt-2 text-sm opacity-75">
            Full-stack engineer focused on useful AI, pragmatic web apps, and clean metrics.
            Built with Next.js, Tailwind, and DeepSeek.
          </p>
        </div>

        {/* Quick links */}
        <nav className="text-sm">
          <div className="font-medium mb-2">Quick links</div>
          <ul className="space-y-1 opacity-80">
            <li><a href="#hero" className="hover:opacity-100">Home</a></li>
            <li><a href="#projects" className="hover:opacity-100">Projects</a></li>
            <li><a href="#skills" className="hover:opacity-100">Skills</a></li>
            <li><a href="#resume" className="hover:opacity-100">Resume</a></li>
            <li><a href="#contact" className="hover:opacity-100">Contact</a></li>
          </ul>
        </nav>

        {/* Playground shortcuts */}
        <div className="text-sm">
          <div className="font-medium mb-2">AI Playground</div>
          <div className="flex flex-wrap gap-2">
            <a href="#playground" className="inline-flex items-center gap-1 border rounded-full px-3 py-1">
              <Sparkles size={14}/> JD Tailor
            </a>
            <a href="#playground" className="inline-flex items-center gap-1 border rounded-full px-3 py-1">
              <LinkIcon size={14}/> URL Tagger
            </a>
            <a href="#playground" className="inline-flex items-center gap-1 border rounded-full px-3 py-1">
              <Sparkles size={14}/> Ask Ashwin
            </a>
          </div>

          {/* Social minimal */}
          <div className="mt-4 flex items-center gap-2">
            <a href="https://www.linkedin.com/in/ashkap10/" target="_blank" className="border rounded-xl px-3 py-1.5 inline-flex items-center gap-2">
              <Linkedin size={16}/> LinkedIn
            </a>
            <a href="https://github.com/Ashking07" target="_blank" className="border rounded-xl px-3 py-1.5 inline-flex items-center gap-2">
              <Github size={16}/> GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 flex items-center gap-4">
        <div className="text-xs opacity-70">© {new Date().getFullYear()} Ashwin Kapile</div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="ml-auto inline-flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs"
          aria-label="Back to top"
        >
          <ArrowUp size={14}/> Back to top
        </button>
      </div>
    </footer>
  )
}
