'use client'
import { motion } from 'framer-motion'
import { Brain, FileText, Link as LinkIcon } from 'lucide-react'

const demos = [
{
icon: Brain,
title: 'Resume Q&A',
desc: 'Ask about my experience; answers cite sections of my projects/resume.',
},
{
icon: FileText,
title: 'JD Tailor',
desc: 'Drop a job description and get tailored bullets based on my background.',
},
{
icon: LinkIcon,
title: 'URL Tagger',
desc: 'Paste a link and get categories + short summary with sources.',
},
]

export default function DemoTiles() {
return (
<div className="grid sm:grid-cols-3 gap-4">
{demos.map((d, i) => (
<motion.div key={i} initial={{opacity:0, y:8}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:.4}}
className="rounded-2xl border p-4 section-surface">
<div className="flex items-center gap-2 font-medium">
<d.icon size={18} /> {d.title}
</div>
<p className="text-sm opacity-80 mt-2">{d.desc}</p>
</motion.div>
))}
</div>
)
}
