'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

const HIDE_ON_IDS = ['hero', 'projects', 'certs']
const HARD_HIDE_IDS = ['footer', 'site-footer']

export default function AIChat() {
  const [q, setQ] = useState('')
  const [out, setOut] = useState('')
  const [dock, setDock] = useState(false)
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  const [bump, setBump] = useState(false)
  const [hidden, setHidden] = useState(false)

  // debounce/cancel to avoid flicker
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelDebounce = () => { if (hideTimer.current) clearTimeout(hideTimer.current) }

  const getRoot = () => (document.querySelector('.main-snap') as Element | null) ?? null

  // Footer bump — only when visible AND we're not hidden
  useEffect(() => {
    const footer = document.getElementById('site-footer') || document.getElementById('footer')
    if (!footer) return
    const io = new IntersectionObserver(
      ([entry]) => {
        // don't bump if we're (going to be) hidden or docked in playground
        if (hidden || dock) { setBump(false); return }
        setBump(entry.isIntersecting)
      },
      { threshold: 0.01, root: getRoot() }
    )
    io.observe(footer)
    return () => io.disconnect()
  }, [hidden, dock])

  // Find slot + dock when Playground visible
  useEffect(() => {
    setSlot(document.getElementById('playground-chat-slot') as HTMLElement | null)
    const section = document.getElementById('playground')
    if (!section) return
    const io = new IntersectionObserver(
      ([e]) => setDock(e.isIntersecting && e.intersectionRatio > 0.1),
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-20% 0px -30% 0px', root: getRoot() }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  // Most-visible section → decide hide/show
  const steps = (n = 24) => Array.from({ length: n + 1 }, (_, i) => i / n)
  useEffect(() => {
    const root = (document.querySelector('.main-snap') as Element | null) ?? undefined
    const sections = Array.from((root ?? document).querySelectorAll<HTMLElement>('section[id]'))
    if (sections.length === 0) return

    const ratios = new Map<Element, number>()
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => ratios.set(e.target, e.intersectionRatio))

        let bestEl: Element | null = null
        let best = -1
        ratios.forEach((r, el) => { if (r > best) { best = r; bestEl = el } })

        const currentId = (bestEl as HTMLElement | null)?.id ?? ''

        // If footer dominates: hide immediately and also clear any bump
        if (HARD_HIDE_IDS.includes(currentId)) {
          cancelDebounce()
          setHidden(true)
          setBump(false)                 // <- prevent the "jump then vanish"
          return
        }

        // Normal hide on these sections (tiny debounce to avoid flicker)
        if (HIDE_ON_IDS.includes(currentId)) {
          cancelDebounce()
          hideTimer.current = setTimeout(() => setHidden(true), 60)
          return
        }

        // Otherwise (contact / playground etc.) show, and allow bumping again
        cancelDebounce()
        setHidden(false)
      },
      { root, threshold: steps(), rootMargin: '0px' }
    )

    sections.forEach(s => io.observe(s))
    return () => { cancelDebounce(); io.disconnect() }
  }, [dock])

  const ask = async () => {
    setOut('')
    const res = await fetch('/api/ask', { method: 'POST', body: JSON.stringify({ query: q }) })
    const reader = res.body?.getReader()
    const dec = new TextDecoder()
    while (reader) {
      const { done, value } = await reader.read()
      if (done) break
      setOut(p => p + dec.decode(value))
    }
  }

  // If hidden (and not docked in playground), don't render; AnimatePresence will handle fade-out
  if (hidden && !dock) return null

  const Box = (
    <div className="rounded-2xl border p-4 shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
      <div className="text-sm opacity-70 mb-2">Ask Ashwin</div>
      <textarea
        value={q}
        onChange={e => setQ(e.target.value)}
        className="w-full border rounded p-2 mb-2 bg-transparent"
        rows={3}
        placeholder="Ask about my projects, skills, or experience…"
      />
      <button onClick={ask} className="px-3 py-2 rounded-lg border">Send</button>
      <pre className="mt-3 whitespace-pre-wrap text-sm max-h-40 overflow-auto">{out}</pre>
    </div>
  )

  const variants = {
    in:  { opacity: 1, scale: 1, y: 0,  filter: 'blur(0px)', transition: { type: 'spring', stiffness: 260, damping: 26 } },
    out: { opacity: 0, scale: 0.96, y: 12, filter: 'blur(6px)',  transition: { duration: 0.18 } },
  }

  const Docked =
    slot &&
    createPortal(
      <AnimatePresence mode="wait">
        {dock && (
          <motion.div key="docked" initial="out" animate="in" exit="out" variants={variants} className="mx-auto w-full max-w-2xl">
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
          className="fixed z-50 right-4 w-[min(440px,90vw)] will-change-transform will-change-opacity"
          style={{
            // do NOT bump if we're hidden (or about to be hidden)
            bottom: `calc(env(safe-area-inset-bottom, 0px) + ${bump && !hidden ? 320 : 16}px)`,
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
