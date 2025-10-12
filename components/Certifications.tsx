'use client'
import { motion } from 'framer-motion'
import resume from '@/content/data/resume.json'

const SHORT_MARKS: Record<string, string> = {
  'Microsoft': '/logos/marks/microsoft-mark.svg',
  'Google Cloud': '/logos/marks/google-cloud-mark.svg',
  'freeCodeCamp': '/logos/marks/freecodecamp-mark.svg',
  'Udemy': '/logos/marks/udemy-mark.svg',
}

export default function Certifications() {
  const certs = (resume as any).certifications || []
  const issuers = Array.from(
    new Map(certs.map((c: any) => [
      c.issuer,
      { full: c.logo, short: SHORT_MARKS[c.issuer] ?? c.logo }
    ])).entries()
  )

  return (
    <div className="space-y-6">
     <div className="flex flex-wrap items-center gap-8">
     {issuers.map(([issuer, logos]: any) => (
       <motion.div
         key={issuer}
         initial={{ opacity: 0, y: 6 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, amount: 0.5 }}
         className="h-8 w-auto transition-transform hover:scale-105 flex items-center"
       >
         <img
           src={logos.short}
           alt={issuer}
           className="h-8 w-auto"
         />
       </motion.div>
     ))}
     </div>


      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((c: any, i: number) => (
          <motion.article key={i} className="rounded-2xl border p-4 bg-white/60 dark:bg-zinc-900/50"
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}>
            <div className="flex items-center gap-2">
              <img src={c.logo} alt={c.issuer} className="h-5 w-auto" />
              <div className="text-xs opacity-70">{c.issuer}</div>
            </div>
            <div className="mt-2 font-medium">{c.title}</div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
