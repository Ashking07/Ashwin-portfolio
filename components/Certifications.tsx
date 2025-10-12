'use client'

import { motion } from 'framer-motion'
import resume from '@/content/data/resume.json'

const SHORT_MARKS: Record<string, string> = {
  Microsoft: '/logos/marks/microsoft-mark.svg',
  'Google Cloud': '/logos/marks/google-cloud-mark.svg',
  freeCodeCamp: '/logos/marks/freecodecamp-mark.svg',
  Udemy: '/logos/marks/udemy-mark.svg',
}

/** canonical links you gave me */
const LINKS = {
  nodeUdemy:
    'https://www.udemy.com/certificate/UC-07a57e69-fa00-4348-af81-0f7a70d3a0db/',
  reactUdemy:
    'https://www.udemy.com/certificate/UC-3c3caa05-4cce-416b-8f6c-13ca01d609ff/',
  fccResponsive:
    'https://www.freecodecamp.org/certification/fcc194b1b08-356d-4623-8f44-0099721bf1b5/responsive-web-design',
  googleCloud:
    'https://www.cloudskillsboost.google/public_profiles/5fbaf485-b073-4d06-96bc-e59c0b25c3bf',
  msAzureAI:
    'https://www.credly.com/badges/93a80500-5efa-40e0-9761-d82f32942f89/linked_in_profile',
  msAzureFund:
    'https://www.credly.com/badges/f8206d65-bdad-447d-b17c-5e2115d0645f/linked_in_profile',
}

/** Try to resolve a URL using title/issuer text (case-insensitive). */
function resolveCertUrl(c: { title?: string; issuer?: string; url?: string }) {
  if (c.url) return c.url // if you later add url directly in resume.json

  const t = (c.title || '').toLowerCase()
  const i = (c.issuer || '').toLowerCase()

  // Microsoft
  if (i.includes('microsoft')) {
    if (t.includes('ai')) return LINKS.msAzureAI
    if (t.includes('fundamentals')) return LINKS.msAzureFund
  }
  // Google Cloud
  if (i.includes('google') || t.includes('google cloud') || t.includes('qwiklabs'))
    return LINKS.googleCloud

  // freeCodeCamp
  if (i.includes('freecodecamp') || t.includes('responsive web design'))
    return LINKS.fccResponsive

  // Udemy – decide from the title keywords
  if (i.includes('udemy')) {
    if (t.includes('react')) return LINKS.reactUdemy
    if (t.includes('node') || t.includes('express') || t.includes('mongodb'))
      return LINKS.nodeUdemy
  }

  // Generic fallbacks by keywords
  if (t.includes('react')) return LINKS.reactUdemy
  if (t.includes('node') || t.includes('express') || t.includes('mongodb'))
    return LINKS.nodeUdemy

  return undefined
}

export default function Certifications() {
  const certs = (resume as any).certifications || []
  const issuers = Array.from(
    new Map(
      certs.map((c: any) => [
        c.issuer,
        { full: c.logo, short: SHORT_MARKS[c.issuer] ?? c.logo },
      ]),
    ).entries(),
  )

  return (
    <div className="space-y-6">
      {/* issuer strip */}
      <div className="flex flex-wrap items-center gap-8">
        {issuers.map(([issuer, logos]: any) => (
          <motion.div
            key={issuer}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="h-8 w-auto transition-transform hover:scale-105 flex items-center"
          >
            <img src={logos.short} alt={issuer} className="h-8 w-auto" />
          </motion.div>
        ))}
      </div>

      {/* cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((c: any, i: number) => {
          const link = resolveCertUrl(c)
          const CardInner = (
            <>
              <div className="flex items-center gap-2">
                <img src={c.logo} alt={c.issuer} className="h-5 w-auto" />
                <div className="text-xs opacity-70">{c.issuer}</div>
              </div>
              <div className="mt-2 font-medium">{c.title}</div>
            </>
          )

          return (
            <motion.article
              key={i}
              className="rounded-2xl border p-4 bg-white/60 dark:bg-zinc-900/50 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
                >
                  {CardInner}
                </a>
              ) : (
                <div>{CardInner}</div>
              )}
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
