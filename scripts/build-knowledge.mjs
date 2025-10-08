// scripts/build-knowledge.mjs
import fs from 'node:fs'
import path from 'node:path'
import bm25 from 'wink-bm25-text-search'
import nlp from 'wink-nlp-utils'

const root = process.cwd()
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))

// ---- 1) Load your data ----
const resumePath = path.resolve('content/data/resume.json')
console.log('Reading resume from', resumePath)
const resume = readJSON(resumePath)

const projects = readJSON(path.join(root, 'content/data/projects.json'))

// Normalize into small “chunks”
let docs = []
let id = 0
const push = (title, text, source) => {
  if (!text) return
  docs.push({ id: String(id++), title, text: String(text), source })
}

push('Summary', resume.title, 'resume')
;(resume.skills || []).forEach((s) => push(`Skill: ${s}`, s, 'skills'))
;(resume.experience || []).forEach((e) => {
  push(`Company: ${e.company}`, `${e.role} — ${e.company}`, 'experience')
  ;(e.highlights || []).forEach((h) => push(`Exp: ${e.company}`, h, 'experience'))
})
;(resume.education || []).forEach((ed) =>
  push(`Education: ${ed.school}`, `${ed.degree} (${ed.start}–${ed.end ?? 'Present'})`, 'education')
)
// After pushing each certification, add this (or replace the cert loop with this):
;(resume.certifications || []).forEach((c) => {
  const line = `${c.title} — ${c.issuer} (certification, certificate, cert)`
  push(`Cert: ${c.issuer}`, line, 'certs')
})

;(projects || []).forEach((p) => {
  push(`Project: ${p.name}`, p.summary, `project:${p.slug}`)
  ;(p.metrics || []).forEach((m) => push(`Metrics: ${p.name}`, `${m.label}: ${m.value}`, `project:${p.slug}`))
  ;(p.tech || []).forEach((t) => push(`Tech: ${p.name}`, t, `project:${p.slug}`))
})

console.log('Resume keys:', Object.keys(resume))
console.log('Certifications:', resume.certifications?.length || 0)

// ---- 2) Build BM25 index ----
const engine = bm25()
engine.defineConfig({ fldWeights: { title: 2, text: 1 } })
engine.definePrepTasks([
  nlp.string.lowerCase,
  nlp.string.removeHTMLTags,
  nlp.string.removePunctuations,
  nlp.string.tokenize0,
  nlp.tokens.removeWords,
  nlp.tokens.stem,
])
docs.forEach((d) => engine.addDoc(d, d.id))
engine.consolidate()

// ---- 3) Save to /public for runtime use ----
const outDir = path.join(root, 'public')
fs.writeFileSync(path.join(outDir, 'knowledge-docs.json'), JSON.stringify(docs, null, 2))
fs.writeFileSync(path.join(outDir, 'knowledge-index.json'), JSON.stringify(engine.exportJSON()))
console.log(`Built knowledge: ${docs.length} chunks`)
