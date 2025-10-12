'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react'

type P = { open: boolean; onClose: () => void; project: any | null }

export default function ProjectModal({ open, onClose, project }: P) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)      // ← NEW: the actual dialog panel
  const railRef    = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)

  // Close on ESC + body scroll lock
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, (project?.images?.length ?? 1) - 1))
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(i - 1, 0))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, project])

  // **Close when clicking outside the panel**
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const panel = panelRef.current
      if (panel && !panel.contains(e.target as Node)) {
        onClose()
      }
    }
    window.addEventListener('mousedown', onDown, true)   // capture: fire before inner handlers
    return () => window.removeEventListener('mousedown', onDown, true)
  }, [open, onClose])

  // Snap current image into view
  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const child = el.children[idx] as HTMLElement | undefined
    if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }, [idx])

  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          ref={overlayRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {/* gradient ring wrapper */}
          <motion.div
            // ↓ this element is the "panel" for outside-click testing
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            {...{ className: "w-[min(980px,94vw)] max-h-[90dvh] rounded-3xl p-[2px] bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/30 to-emerald-500/40" }}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="rounded-3xl border bg-white/80 dark:bg-zinc-900/70 backdrop-blur flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 border-b bg-white/70 dark:bg-zinc-900/60 backdrop-blur px-5 py-4 flex items-start gap-3">
                <div className="font-semibold text-lg leading-tight">{project.name}</div>
                <button className="ml-auto rounded-lg border p-2 hover:bg-black/5 transition" onClick={onClose} aria-label="Close">
                  <X size={16} />
                </button>
              </div>

              {/* Gallery */}
              {project.images?.length ? (
                <div className="relative px-4 pt-4">
                  <div className="rounded-xl overflow-hidden shadow-xl border bg-white">
                    <div ref={railRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
                      {project.images.map((src: string, i: number) => (
                        <img
                          key={src}
                          src={src}
                          alt={`${project.slug} screenshot ${i + 1}`}
                          className="max-h-[52dvh] w-full flex-none snap-center object-contain bg-white"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/80 backdrop-blur p-2 shadow hover:scale-105 transition"
                    onClick={() => setIdx(i => Math.max(i - 1, 0))}
                    aria-label="Prev"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/80 backdrop-blur p-2 shadow hover:scale-105 transition"
                    onClick={() => setIdx(i => Math.min(i + 1, (project.images?.length ?? 1) - 1))}
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {project.images.length > 1 && (
                    <div className="mt-3 flex justify-center gap-1.5">
                      {project.images.map((_: string, i: number) => (
                        <span
                          key={i}
                          className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-zinc-900/80 dark:bg-white/90' : 'w-2 bg-zinc-400/50'}`}
                          onClick={() => setIdx(i)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid gap-5 p-5 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-3">
                    <p className="opacity-80 text-[15px] leading-relaxed">{project.summary}</p>
                    {project.metrics?.length ? (
                      <ul className="text-sm space-y-1">
                        {project.metrics.map((m: any, i: number) => (
                          <li key={i}>• <span className="font-medium">{m.label}:</span> {m.value}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {project.tech?.map((t: string) => (
                        <span key={t} className="border rounded-full px-2 py-0.5">{t}</span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      {project.links?.demo && (
                        <a target="_blank" className="inline-flex items-center gap-2 border rounded-xl px-3 py-1.5 hover:bg-black/5 transition"
                           href={project.links.demo} rel="noopener noreferrer">
                          <ExternalLink size={16}/> Live demo
                        </a>
                      )}
                      {project.links?.repo && (
                        <a target="_blank" className="inline-flex items-center gap-2 border rounded-xl px-3 py-1.5 hover:bg-black/5 transition"
                           href={project.links.repo} rel="noopener noreferrer">
                          <Github size={16}/> Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import { createPortal } from 'react-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react'

// type P = { open: boolean; onClose: () => void; project: any | null }

// export default function ProjectModal({ open, onClose, project }: P) {
//   const overlayRef = useRef<HTMLDivElement>(null)
//   const panelRef   = useRef<HTMLDivElement>(null)
//   const railRef    = useRef<HTMLDivElement>(null)
//   const [idx, setIdx] = useState(0)
//   const [mounted, setMounted] = useState(false)      // ← ensure portal only on client

//   useEffect(() => setMounted(true), [])

//   // Reset slide when a new project opens
//   useEffect(() => { if (open) setIdx(0) }, [open, project])

//   // Close on ESC + body scroll lock
//   useEffect(() => {
//     if (!open) return
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose()
//       if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, ((project?.images?.length ?? 1) - 1)))
//       if (e.key === 'ArrowLeft')  setIdx(i => Math.max(i - 1, 0))
//     }
//     document.body.style.overflow = 'hidden'
//     window.addEventListener('keydown', onKey)
//     return () => {
//       document.body.style.overflow = ''
//       window.removeEventListener('keydown', onKey)
//     }
//   }, [open, onClose, project])

//   // Close when clicking outside the panel
//   useEffect(() => {
//     if (!open) return
//     const onDown = (e: MouseEvent) => {
//       const panel = panelRef.current
//       if (panel && !panel.contains(e.target as Node)) onClose()
//     }
//     window.addEventListener('mousedown', onDown, true)
//     return () => window.removeEventListener('mousedown', onDown, true)
//   }, [open, onClose])

//   // Snap current image into view
//   useEffect(() => {
//     const el = railRef.current
//     if (!el) return
//     const child = el.children[idx] as HTMLElement | undefined
//     if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'center' })
//   }, [idx])

//   if (!mounted) return null   // ← prevents SSR/hydration mismatch

//   return (
//     <AnimatePresence>
//       {open
//         ? createPortal(
//             (
//               <motion.div
//                 ref={overlayRef}
//                 className="fixed inset-0 z-[90] bg-black/40 dark:bg-black/50 backdrop-blur-lg flex items-center justify-center p-4"
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               >
//                 {/* gradient ring wrapper */}
//                 <motion.div
//                   role="dialog" aria-modal="true"
//                   ref={panelRef}
//                   className="w-[min(980px,94vw)] max-h-[90dvh] rounded-3xl p-[2px]
//                              bg-gradient-to-r from-indigo-500/40 via-fuchsia-500/30 to-emerald-500/40"
//                   initial={{ opacity: 0, y: 20, scale: 0.98 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: 10, scale: 0.98 }}
//                 >
//                   <div className="rounded-3xl border bg-white/80 dark:bg-zinc-900/70 backdrop-blur flex flex-col overflow-hidden">
//                     {/* Header */}
//                     <div className="sticky top-0 z-10 border-b bg-white/70 dark:bg-zinc-900/60 backdrop-blur px-5 py-4 flex items-start gap-3">
//                       <div className="font-semibold text-lg leading-tight">{project?.name ?? 'Project'}</div>
//                       <button className="ml-auto rounded-lg border p-2 hover:bg-black/5 transition" onClick={onClose} aria-label="Close">
//                         <X size={16} />
//                       </button>
//                     </div>

//                     {/* Gallery */}
//                     {(project?.images?.length ?? 0) > 0 ? (
//                       <div className="relative px-4 pt-4">
//                         <div className="rounded-xl overflow-hidden shadow-xl border bg-white">
//                           <div ref={railRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
//                             {project!.images.map((src: string, i: number) => (
//                               <img
//                                 key={src}
//                                 src={src}
//                                 alt={`${project?.slug ?? 'project'} screenshot ${i + 1}`}
//                                 className="max-h-[52dvh] w-full flex-none snap-center object-contain bg-white"
//                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
//                               />
//                             ))}
//                           </div>
//                         </div>

//                         <button
//                           className="absolute left-6 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/80 backdrop-blur p-2 shadow hover:scale-105 transition"
//                           onClick={() => setIdx(i => Math.max(i - 1, 0))}
//                           aria-label="Prev"
//                         >
//                           <ChevronLeft size={18} />
//                         </button>
//                         <button
//                           className="absolute right-6 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/80 backdrop-blur p-2 shadow hover:scale-105 transition"
//                           onClick={() => setIdx(i => Math.min(i + 1, (project?.images?.length ?? 1) - 1))}
//                           aria-label="Next"
//                         >
//                           <ChevronRight size={18} />
//                         </button>

//                         {(project?.images?.length ?? 0) > 1 && (
//                           <div className="mt-3 flex justify-center gap-1.5">
//                             {project!.images.map((_: string, i: number) => (
//                               <span
//                                 key={i}
//                                 className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-zinc-900/80 dark:bg-white/90' : 'w-2 bg-zinc-400/50'}`}
//                                 onClick={() => setIdx(i)}
//                               />
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ) : null}

//                     {/* Body */}
//                     <div className="flex-1 overflow-y-auto">
//                       <div className="grid gap-5 p-5 md:grid-cols-3">
//                         <div className="md:col-span-2 space-y-3">
//                           <p className="opacity-80 text-[15px] leading-relaxed">{project?.summary}</p>
//                           {project?.metrics?.length ? (
//                             <ul className="text-sm space-y-1">
//                               {project!.metrics.map((m: any, i: number) => (
//                                 <li key={i}>• <span className="font-medium">{m.label}:</span> {m.value}</li>
//                               ))}
//                             </ul>
//                           ) : null}
//                         </div>

//                         <div className="space-y-3">
//                           <div className="flex flex-wrap gap-2 text-xs">
//                             {project?.tech?.map((t: string) => (
//                               <span key={t} className="border rounded-full px-2 py-0.5">{t}</span>
//                             ))}
//                           </div>

//                           <div className="flex flex-wrap gap-2 text-sm">
//                             {project?.links?.demo && (
//                               <a target="_blank" className="inline-flex items-center gap-2 border rounded-xl px-3 py-1.5 hover:bg-black/5 transition"
//                                 href={project.links.demo} rel="noopener noreferrer">
//                                 <ExternalLink size={16}/> Live demo
//                               </a>
//                             )}
//                             {project?.links?.repo && (
//                               <a target="_blank" className="inline-flex items-center gap-2 border rounded-xl px-3 py-1.5 hover:bg-black/5 transition"
//                                 href={project.links.repo} rel="noopener noreferrer">
//                                 <Github size={16}/> Code
//                               </a>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             ),
//             document.body
//           )
//         : null}
//     </AnimatePresence>
//   )
// }
