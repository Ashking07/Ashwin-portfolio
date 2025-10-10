'use client'
import dynamic from 'next/dynamic'
import projects from '@/content/data/projects.json'
import resume from '@/content/data/resume.json'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown, ExternalLink } from 'lucide-react'
import DemoTiles from '@/components/DemoTiles'
import Certifications from '@/components/Certifications'
import SkillsShowcase from '@/components/SkillsShowcase'
import UrlTagger from '@/components/UrlTagger'
import ContactCard from '@/components/ContactCard'
import ProjectsGrid from '@/components/ProjectsGrid'
import Footer from '@/components/Footer'
const AIChat = dynamic(() => import('@/components/AIChat'), { ssr: false })

export default function HomePage() {
  return (
    <div className="main-snap relative">
      {/* Ambient gradient for hero */}
      <div className="hero-bg" />

      <Section
        id="hero"
        headline={`Hi, I’m Ashwin — Full-stack\nSoftware Engineer`}
        className="snap-section"
        sub="I build scalable web apps, wire real metrics, and ship useful AI features."
      >
        <div className="mt-6 flex gap-3">
          <a className="px-4 py-2 rounded-xl border" href="#projects">
            View Projects
          </a>
          <a
            className="px-4 py-2 rounded-xl border inline-flex items-center gap-2"
            href="#playground"
          >
            AI Playground <ArrowRight size={16} />
          </a>
        </div>
        <div className="mt-10 hidden md:flex items-center gap-2 text-sm opacity-70">
          <span>Scroll</span>
          <ArrowDown size={16} />
        </div>
      </Section>

      {/* <Section id="projects" headline="Featured Projects" sub="Problem → solution → metrics.">
        <ProjectsGrid />
      </Section> */}
      <Section id="projects" headline="Featured Projects" className="snap-section" sub="Problem → solution → metrics.">
        <div className="relative">
          <ProjectsGrid />
        </div>
      </Section>

      <Section id="skills" headline="Skills & Tools" className="snap-section" sub="A practical stack I use to ship.">
         <SkillsShowcase />
      </Section>

      <Section id="certs" headline="Academic Research / Certifications" className="snap-section" sub="Selected credentials from Microsoft, Google Cloud, freeCodeCamp, and Udemy.">
        <Certifications />
      </Section>

      <Section id="resume" headline="Resume" className="snap-section" sub="Quick highlights — download full PDF for details.">
        <a href="/ashwin-resume.pdf" target="_blank" className="inline-block px-4 py-2 rounded-xl border">
          Download PDF
        </a>
      </Section>

      <Section id="playground" headline="AI Playground" className="snap-section" sub="Ask about my projects, skills, or experience.">
        <DemoTiles />
         <UrlTagger />
        <div id="playground-chat-slot" className="mt-6 max-w-3xl"></div>
      </Section>

      <Section id="contact" headline="Contact" className="snap-section" sub="I’m open to roles, freelance, and collaborations.">
        <ContactCard />
      </Section>

      <Section id="footer" headline="Thanks for visiting!" className="snap-section pb-40 md:pb-56 lg:pb-64">
  <Footer />
</Section>

      <AIChat />
    </div>
  )
}

// ✅ Fixed Section definition
// Section component (add className prop)
function Section({
  id, headline, sub, children, className,
}: {
  id: string; headline: string; sub?: string; children?: React.ReactNode; className?: string
}) {
  return (
    <section id={id} className={`snap-section ${className ?? ''}`}>
      <motion.div
      // render immediately (no fade gate)
  initial={{ y: 8, scale: 0.995, opacity: 1 }}
  whileInView={{ y: 0, scale: 1, opacity: 1 }}

  // start earlier so it’s ready *as* the snap lands
  viewport={{ once: false, amount: 0.2, margin: '-20% 0% -40% 0%' }}

  // crisp & fast
  transition={{ type: 'tween', duration: 0.14, ease: 'easeOut' }}

  // micro-optimization to keep it buttery
  style={{ willChange: 'transform' }}
  className="container"
>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight whitespace-pre-line">{headline}</h2>
        {sub && <p className="mt-4 text-lg opacity-80 max-w-2xl">{sub}</p>}
        <div className="mt-8">{children}</div>
      </motion.div>
    </section>
  )
}
