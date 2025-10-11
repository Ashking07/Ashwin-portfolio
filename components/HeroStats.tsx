'use client'

import { motion } from 'framer-motion'
import { Trophy, GraduationCap, BookOpenCheck, Cpu } from 'lucide-react'
import resume from '@/content/data/resume.json'
import stats from '@/content/data/hero-stats.json'

const tiles = (certCount: number) => [
  {
    label: 'LeetCode solved',
    value: `${stats.leetcode}+`,
    icon: <Cpu size={18} />,
  },
  {
    label: 'Capstone projects',
    value: stats.capstones,
    icon: <Trophy size={18} />,
  },
  {
    label: 'Research papers',
    value: stats.papers,
    icon: <BookOpenCheck size={18} />,
  },
  {
    label: 'Certifications',
    value: certCount,
    sub: 'Google • Microsoft',
    icon: <GraduationCap size={18} />,
  },
]

export default function HeroStats() {
  const certCount = Array.isArray((resume as any).certifications)
    ? (resume as any).certifications.length
    : 0

  return (
    <div className="mt-8 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiles(certCount).map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26, delay: i * 0.04 }}
          className="rounded-2xl border bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-4"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border bg-white/70 dark:bg-zinc-900/60">
              {t.icon}
            </div>
            <div>
              <div className="text-2xl font-semibold tabular-nums leading-tight">{t.value}</div>
              <div className="text-xs opacity-70">{t.label}</div>
              {t.sub && <div className="mt-0.5 text-[11px] opacity-60">{t.sub}</div>}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
