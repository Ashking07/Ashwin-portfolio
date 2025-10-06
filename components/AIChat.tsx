'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function AIChat() {
  const [q, setQ] = useState('')
  const [out, setOut] = useState('')
  const [dock, setDock] = useState(false)
  const [slot, setSlot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const section = document.getElementById('playground')
    setSlot(document.getElementById('playground-chat-slot'))
    if (!section) return
    const obs = new IntersectionObserver(([e]) => setDock(e.isIntersecting), { threshold: 0.4 })
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

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
      setOut((p) => p + dec.decode(value))
    }
  }

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
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 260, damping: 26 },
    },
    out: {
      opacity: 0,
      scale: 0.96,
      y: 12,
      filter: 'blur(6px)',
      transition: { duration: 0.22 },
    },
  }

  const Docked =
    slot &&
    createPortal(
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
          className="fixed z-50 bottom-4 right-4 w-[min(440px,90vw)]"
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
