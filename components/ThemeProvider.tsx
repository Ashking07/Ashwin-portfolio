'use client'

import * as React from 'react'
import { ThemeProvider as NextThemes } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"     // adds/removes "dark" on <html>
      defaultTheme="light"  // ← force light by default in prod
      enableSystem={false}  // set to true if you want OS-based instead
      storageKey="ak-theme" // persistent key
    >
      {children}
    </NextThemes>
  )
}
