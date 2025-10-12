import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ashwin Kapile — Portfolio',
  description: 'Personal portfolio and AI playground',
  // set your prod URL here so OpenGraph is correct in prod
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  openGraph: { title: 'Ashwin Kapile — Portfolio', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Keep body neutral; dark styles are applied ONLY when "dark"
         class is on <html> from next-themes */}
      <body className={`${inter.className} antialiased bg-white text-zinc-900`}>
        <ThemeProvider>
          <Navbar />
          {/* keep your page content; remove container here if your pages already set layout */}
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
