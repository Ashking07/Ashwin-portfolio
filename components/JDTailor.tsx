'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Copy } from 'lucide-react'

type JDOut = { summary: string; bullets: string[]; citations?: string[] }

export default function JDTailor() {
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [out, setOut] = useState<JDOut | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const run = async () => {
    setLoading(true); setErr(null); setOut(null); setCopied(false)
    try {
      const r = await fetch('/api/jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd }),
      })
      if (!r.ok) throw new Error(await r.text())
      const json = await r.json()
      setOut(json)
    } catch (e: any) {
      setErr(e.message || 'Failed to tailor JD')
    } finally {
      setLoading(false)
    }
  }

  const copyAll = async () => {
    if (!out) return
    const text =
      `${out.summary}\n\n` +
      out.bullets.map((b, i) => `• ${b}`).join('\n') +
      (out.citations?.length ? `\n\nCitations: ${out.citations.join(' ')}` : '')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className="rounded-2xl border bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl grid place-items-center border">
          <FileText size={16} />
        </div>
        <div className="font-semibold">JD Tailor</div>
        <div className="ml-auto">
          <button
            onClick={run}
            disabled={loading || jd.trim().length < 30}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm"
            title="Generate tailored bullets"
          >
            <Sparkles size={16} />
            {loading ? 'Tailoring…' : 'Tailor'}
          </button>
        </div>
      </div>

      <textarea
        className="w-full border rounded-xl px-3 py-2 bg-transparent"
        placeholder="Paste the Job Description here (≥ 30 chars)…"
        rows={6}
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      {out && (
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <div className="font-medium">Tailored Output</div>
            <button
              onClick={copyAll}
              className="ml-auto inline-flex items-center gap-2 rounded-xl border px-2.5 py-1 text-xs"
              title="Copy"
            >
              <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 text-sm opacity-80">{out.summary}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {out.bullets?.map((b: string, i: number) => (
              <li key={i} className="rounded-xl border px-3 py-2 bg-white/60 dark:bg-zinc-900/50">
                • {b}
              </li>
            ))}
          </ul>
          {!!out.citations?.length && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {out.citations.map((c) => (
                <span key={c} className="border rounded-full px-2 py-0.5">{c}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
