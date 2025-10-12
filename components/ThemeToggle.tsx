// components/ThemeToggle.tsx
'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null // avoid hydration flash

  const isDark = theme === 'dark'
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5
                 hover:bg-black/5 dark:hover:bg-white/10 transition"
    >
      {isDark ? <Sun size={16}/> : <Moon size={16}/>}
      <span className="text-sm">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
