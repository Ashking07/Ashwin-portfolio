// lib/rag.ts
import fs from 'node:fs'
import path from 'node:path'
import bm25 from 'wink-bm25-text-search'
import nlp from 'wink-nlp-utils'

type Doc = { id: string; title: string; text: string; source: string }

let engine: any
let docs: Doc[] = []

export function loadKB() {
  if (engine && docs.length) return
  // ✅ Always load from the compiled /public/ directory inside the Next project root
  const root = process.cwd()
  const docsPath = path.resolve(root, 'public/knowledge-docs.json')
  const idxPath = path.resolve(root, 'public/knowledge-index.json')

  console.log('[RAG] Loading KB from', docsPath)
  if (!fs.existsSync(docsPath)) {
    console.warn('[RAG] KB not found, run npm run build:knowledge')
    docs = []
    return
  }

  docs = JSON.parse(fs.readFileSync(docsPath, 'utf8'))
  const rawIndex = fs.readFileSync(idxPath, 'utf8')

  engine = bm25()
  engine.defineConfig({ fldWeights: { title: 2, text: 1 } })
  engine.definePrepTasks([
    nlp.string.lowerCase,
    nlp.string.removeHTMLTags,
    nlp.string.removePunctuations,
    nlp.string.tokenize0,
    nlp.tokens.removeWords,
    nlp.tokens.stem,
  ])
  engine.importJSON(JSON.parse(rawIndex))
  console.log(`[RAG] Loaded ${docs.length} docs into memory`)
}

// lib/rag.ts (replace searchTopK with this)
export function searchTopK(query: string, k = 6) {
  loadKB()
  const hits = engine?.search?.(query) ?? []
  let picked = (hits || []).slice(0, k).map((h: any) => docs.find((d) => d.id === h[0])!).filter(Boolean)

  // Fallback: naive keyword scan if BM25 finds nothing
  if (picked.length === 0 && docs.length) {
    const q = query.toLowerCase()
    const score = (t: string) => {
      let s = 0
      if (q.includes('cert')) s += /cert/i.test(t) ? 3 : 0
      if (q.includes('education') || q.includes('degree')) s += /education|degree|bachelor|master/i.test(t) ? 3 : 0
      if (q.includes('experience') || q.includes('intern')) s += /experience|intern|role|highlights/i.test(t) ? 2 : 0
      return s + (t.toLowerCase().includes(q) ? 2 : 0)
    }
    picked = [...docs]
      .map(d => ({ d, s: score(`${d.title} ${d.text}`) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, k)
      .map(x => x.d)
  }

  return picked
}


export function formatContext(chunks: Doc[]) {
  return chunks
    .map((c, i) => `[#${i + 1} • ${c.title}] ${c.text}`)
    .join('\n')
}
