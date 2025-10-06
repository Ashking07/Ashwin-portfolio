'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const items = [
{ href: '#hero', label: 'Home' },
{ href: '#projects', label: 'Projects' },
{ href: '#skills', label: 'Skills' },
{ href: '#resume', label: 'Resume' },
{ href: '#contact', label: 'Contact' },
]

export default function Header() {
return (
<header className="border-b sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-zinc-950/70">
<div className="container h-14 flex items-center justify-between gap-4">
<Link href="#hero" className="font-semibold">Ashwin</Link>
<nav className="flex items-center gap-4 text-sm">
{items.map(i => (
<a key={i.href} href={i.href} className="hover:underline underline-offset-4">{i.label}</a>
))}
<ThemeToggle />
</nav>
</div>
</header>
)
}
