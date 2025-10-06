'use client'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
const { theme, setTheme } = useTheme()
const isDark = theme !== 'light'
return (
<button aria-label="Toggle theme" className="rounded-xl border p-2" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
{isDark ? <Sun size={16}/> : <Moon size={16}/>}
</button>
)
}
