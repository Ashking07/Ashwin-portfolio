// components/ThemeProvider.tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemes, useTheme } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"       // adds/removes "dark" on <html>
      defaultTheme="light"    // start in light
      enableSystem={false}    // ignore OS theme for now
      storageKey="ak-theme"   // persistent key
    >
      <MigrateOldKey />
      {children}
    </NextThemes>
  )
}

/** If an old key exists (e.g., "theme"), copy it once to "ak-theme". */
function MigrateOldKey() {
  const { setTheme } = useTheme()
  React.useEffect(() => {
    try {
      const legacy = localStorage.getItem('theme') // some libs use this
      if (legacy && !localStorage.getItem('ak-theme')) {
        setTheme(legacy as 'light' | 'dark')
        localStorage.setItem('ak-theme', legacy)
      }
    } catch {}
  }, [setTheme])
  return null
}
