import Link from 'next/link'
import resume from '@/content/data/resume.json'

export default function ResumePage() {
return (
<section className="space-y-6">
<div className="flex items-center justify-between gap-3">
<h1 className="text-3xl font-bold">Resume</h1>
<Link href="/ashwin-resume.pdf" className="border rounded-xl px-3 py-2" target="_blank">Download PDF</Link>
</div>
<div className="space-y-3">
<div className="text-xl font-semibold">{resume.name}</div>
<div className="opacity-80">{resume.title}</div>
</div>
<section>
<h2 className="text-xl font-semibold mb-2">Skills</h2>
<div className="flex flex-wrap gap-2 text-sm">
{resume.skills.map((s: string) => <span key={s} className="border rounded-full px-2 py-0.5">{s}</span>)}
</div>
</section>
<section>
<h2 className="text-xl font-semibold mb-2">Experience</h2>
<ul className="space-y-4">
{resume.experience.map((e: any, i: number) => (
<li key={i} className="rounded-xl border p-4">
<div className="font-medium">{e.role} — {e.company}</div>
<div className="text-sm opacity-70">{e.start} – {e.end || 'Present'}</div>
<ul className="mt-2 list-disc ml-4 text-sm">
{e.highlights.map((h: string, j: number) => <li key={j}>{h}</li>)}
</ul>
</li>
))}
</ul>
</section>
<section>
<h2 className="text-xl font-semibold mb-2">Education</h2>
<ul className="space-y-2">
{resume.education.map((e: any, i: number) => (
<li key={i} className="text-sm">{e.degree} — {e.school} ({e.start}–{e.end})</li>
))}
</ul>
</section>
</section>
)
}
