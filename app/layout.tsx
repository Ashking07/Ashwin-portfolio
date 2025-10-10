import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
title: 'Ashwin Kapile — Portfolio',
description: 'Personal portfolio and AI playground',
metadataBase: new URL('http://localhost:3000'),
openGraph: { title: 'Ashwin Kapile — Portfolio', type: 'website' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en" suppressHydrationWarning>
<body className={`${inter.className} bg-white text-gray-900 dark:bg-zinc-950 dark:text-zinc-100`}>
<ThemeProvider>
<Header />
<main className="container mx-auto px-4 py-10">{children}</main>
{/* <Footer /> */}
</ThemeProvider>
</body>
</html>
)
}
