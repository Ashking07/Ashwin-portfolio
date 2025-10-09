'use client'

import { useMemo, useState } from 'react'
import { Mail, Phone, Copy, Check, Linkedin, Github, ArrowRight } from 'lucide-react'

const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/ashkap10/',
  github: 'https://github.com/Ashking07',
  email: 'awish@csu.fullerton.edu',
  phone: '+16572179520',
}

export default function ContactCard() {
  const [email, setEmail] = useState(SOCIAL.email)
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const mailto = useMemo(() => {
    const subject = encodeURIComponent('Hello Ashwin — via portfolio')
    const body = encodeURIComponent(msg || '')
    return `mailto:${email}?subject=${subject}&body=${body}`
  }, [email, msg])

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="max-w-2xl rounded-2xl border bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-5">
      <h3 className="text-xl font-semibold">Let’s work together</h3>
      <p className="mt-1 text-sm opacity-80">
        I’m open to full-time roles, freelance, and collaborations.
      </p>

      {/* quick actions */}
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <a
          href={`tel:${SOCIAL.phone}`}
          className="flex items-center gap-2 rounded-xl border px-3 py-2"
          aria-label="Call Ashwin"
        >
          <Phone size={16} /> {SOCIAL.phone}
        </a>
        <a
          href={`mailto:${SOCIAL.email}`}
          className="flex items-center gap-2 rounded-xl border px-3 py-2"
          aria-label="Email Ashwin"
        >
          <Mail size={16} /> {SOCIAL.email}
        </a>
      </div>

      {/* tiny form -> opens email client */}
      <div className="mt-5 space-y-3">
        <input
          className="w-full border rounded-xl px-3 py-2 bg-transparent"
          placeholder="Your email (for reply)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <textarea
          className="w-full border rounded-xl px-3 py-2 bg-transparent"
          rows={5}
          placeholder="Short message…"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <a href={mailto} className="rounded-xl border px-4 py-2 inline-flex items-center gap-2">
            Send via Email <ArrowRight size={16} />
          </a>
          <button
            onClick={() => copy(SOCIAL.email, 'email')}
            className="rounded-xl border px-3 py-2 inline-flex items-center gap-2 text-sm"
          >
            {copied === 'email' ? <Check size={16} /> : <Copy size={16} />} Copy email
          </button>
          <button
            onClick={() => copy(SOCIAL.phone, 'phone')}
            className="rounded-xl border px-3 py-2 inline-flex items-center gap-2 text-sm"
          >
            {copied === 'phone' ? <Check size={16} /> : <Copy size={16} />} Copy phone
          </button>
        </div>
      </div>

      {/* social row */}
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <a
          href={SOCIAL.linkedin}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
          aria-label="LinkedIn"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
        <a
          href={SOCIAL.github}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
          aria-label="GitHub"
        >
          <Github size={16} /> GitHub
        </a>
      </div>
    </div>
  )
}
