'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

const HIDE_ON_IDS = [
  'hero',
  'projects',          // Featured Projects
  'certs',    // Research & Certifications (rename if your id differs)
  'footer',            // if you used <Section id="footer" ...>
  'site-footer'        // or if your Footer uses this id
]

export default function AIChat() {
  const [q, setQ] = useState('')
  const [out, setOut] = useState('')
  const [dock, setDock] = useState(false)
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  const [bump, setBump] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Lift the floating widget above the footer when footer is visible
  useEffect(() => {
    const footer = document.getElementById('site-footer')
    if (!footer) return
    const io = new IntersectionObserver(
      ([entry]) => setBump(entry.isIntersecting),
      { threshold: 0.01 }
    )
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  // Find slot and dock when Playground is on screen (trigger a bit earlier)
  useEffect(() => {
    setSlot(document.getElementById('playground-chat-slot') as HTMLElement | null)

    const section = document.getElementById('playground')
    if (!section) return
    const io = new IntersectionObserver(
      ([e]) => {
        // Treat as "in" once ~10% is in view (more forgiving, smoother)
        setDock(e.isIntersecting && e.intersectionRatio > 0.1)
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-20% 0px -30% 0px' }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  // Hide the widget on the sections we don't want it visible
  useEffect(() => {
    const targets = HIDE_ON_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean) as Element[]
    if (targets.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some(e => e.isIntersecting && e.intersectionRatio > 0.25)
        // If we're docked in Playground, don't hide; otherwise hide when any of those sections are visible
        setHidden(anyVisible && !dock)
      },
      { threshold: [0, 0.25, 0.5], rootMargin: '-5% 0px -5% 0px' }
    )
    targets.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [dock])

  const ask = async () => {
    setOut('')
    const res = await fetch('/api/ask', {
      method: 'POST',
      body: JSON.stringify({ query: q }),
    })
    const reader = res.body?.getReader()
    const dec = new TextDecoder()
    while (reader) {
      const { done, value } = await reader.read()
      if (done) break
      setOut(p => p + dec.decode(value))
    }
  }

  // Don’t render at all when hidden (and not docked)
  if (hidden && !dock) return null

  const Box = (
    <div className="rounded-2xl border p-4 shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
      <div className="text-sm opacity-70 mb-2">Ask Ashwin</div>
      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full border rounded p-2 mb-2 bg-transparent"
        rows={3}
        placeholder="Ask about my projects, skills, or experience…"
      />
      <button onClick={ask} className="px-3 py-2 rounded-lg border">
        Send
      </button>
      <pre className="mt-3 whitespace-pre-wrap text-sm max-h-40 overflow-auto">{out}</pre>
    </div>
  )

  const variants = {
    in:  { opacity: 1, scale: 1, y: 0,  filter: 'blur(0px)', transition: { type: 'spring', stiffness: 260, damping: 26 } },
    out: { opacity: 0, scale: 0.96, y: 12, filter: 'blur(6px)',  transition: { duration: 0.22 } },
  }

  const Docked = slot && createPortal(
    <AnimatePresence mode="wait">
      {dock && (
        <motion.div
          key="docked"
          initial="out"
          animate="in"
          exit="out"
          variants={variants}
          className="mx-auto w-full max-w-2xl"
        >
          {Box}
        </motion.div>
      )}
    </AnimatePresence>,
    slot
  )

  const Floating = (
    <AnimatePresence mode="wait">
      {!dock && (
        <motion.div
          key="floating"
          initial="out"
          animate="in"
          exit="out"
          variants={variants}
          className="fixed z-50 right-4 w-[min(440px,90vw)]"
          style={{
            // lift above the footer when it's visible
            bottom: `calc(env(safe-area-inset-bottom, 0px) + ${bump ? 320 : 16}px)`
          }}
        >
          {Box}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {Floating}
      {Docked}
    </>
  )
}
