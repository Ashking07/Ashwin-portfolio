'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AvatarThumb from './AvatarThumb'

const links = [
  { href: '#hero', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#certs', label: 'Certs' },
  { href: '#skills', label: 'Skills' },
  { href: '#playground', label: 'Playground' },
  { href: '#contact', label: 'Contact' },
]


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b',
        'backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/50',
        'bg-white/70 dark:bg-zinc-900/40',
        scrolled ? 'shadow-[0_1px_12px_rgba(0,0,0,0.06)]' : 'shadow-none',
      ].join(' ')}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link
  href="#hero"
  className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
>
  <AvatarThumb src="/ashwin.jpg" alt="Ashwin Kapile" />
  <span>Ashwin</span>
</Link>

        <div className="ml-auto hidden gap-1 sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-3 py-1.5 text-sm text-zinc-700/90 hover:text-zinc-900 hover:bg-zinc-900/[.04] dark:text-zinc-200/80 dark:hover:text-white dark:hover:bg-white/10 transition"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
