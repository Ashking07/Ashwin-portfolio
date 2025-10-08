'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiExpress, SiJsonwebtokens, SiMongodb, SiMysql,
  SiDocker, SiMicrosoftazure, SiGooglecloud, SiGithub, SiPostman
} from 'react-icons/si'
import { FiCloud } from 'react-icons/fi' // fallback

type Skill = { name: string; level: number; icon: JSX.Element }
type Bucket = { key: string; label: string; skills: Skill[] }

const DATA: Bucket[] = [
  {
    key: 'core', label: 'Core',
    skills: [
      { name: 'JavaScript', level: 90, icon: <SiJavascript color="#f7df1e" /> },
      { name: 'TypeScript', level: 88, icon: <SiTypescript color="#3178c6" /> },
      { name: 'GitHub', level: 85, icon: <SiGithub /> },
    ],
  },
  {
    key: 'frontend', label: 'Frontend',
    skills: [
      { name: 'React', level: 90, icon: <SiReact color="#61dafb" /> },
      { name: 'Next.js', level: 88, icon: <SiNextdotjs /> },
      { name: 'Tailwind CSS', level: 86, icon: <SiTailwindcss color="#38bdf8" /> },
    ],
  },
  {
    key: 'backend', label: 'Backend',
    skills: [
      { name: 'Node.js', level: 88, icon: <SiNodedotjs color="#3c873a" /> },
      { name: 'Express', level: 85, icon: <SiExpress /> },
      { name: 'JWT', level: 82, icon: <SiJsonwebtokens color="#ef4444" /> },
    ],
  },
  {
    key: 'db', label: 'Databases',
    skills: [
      { name: 'MongoDB', level: 82, icon: <SiMongodb color="#4db33d" /> },
      { name: 'MySQL', level: 78, icon: <SiMysql color="#00758f" /> },
    ],
  },
  {
    key: 'cloud', label: 'Cloud & DevOps',
    skills: [
      { name: 'Azure', level: 80, icon: <FiCloud color="#0078d4" /> },
      { name: 'Google Cloud', level: 70, icon: <SiGooglecloud color="#4285f4" /> },
      { name: 'Docker', level: 72, icon: <SiDocker color="#0db7ed" /> },
    ],
  },
  {
    key: 'tools', label: 'Tools',
    skills: [
      { name: 'Postman', level: 82, icon: <SiPostman color="#ff6c37" /> },
    ],
  },
]

export default function SkillsShowcase() {
  const [tab, setTab] = useState('core')
  const buckets = useMemo(() => DATA, [])
  const active = buckets.find(b => b.key === tab) ?? buckets[0]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {buckets.map(b => (
          <button
            key={b.key}
            onClick={() => setTab(b.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition
              ${tab === b.key ? 'bg-white/80 dark:bg-zinc-900/80 shadow-sm' : 'hover:bg-white/60 dark:hover:bg-zinc-900/60'}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {active.skills.map((s, i) => (
            <motion.article
              key={s.name}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="rounded-2xl border p-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xl">{s.icon}</div>
                  <div className="font-medium">{s.name}</div>
                </div>
                <span className="text-xs opacity-70">{s.level}%</span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="text-xs opacity-60">
        Levels are directional, based on recency and depth of use.
      </div>
    </div>
  )
}
