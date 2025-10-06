import projects from '@/content/data/projects.json'

export default function ProjectsPage() {
return (
<section>
<h1 className="text-3xl font-bold mb-6">Projects</h1>
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
{projects.map(p => (
<article key={p.slug} id={p.slug} className="rounded-2xl border p-5">
<h2 className="font-semibold text-lg">{p.name}</h2>
<p className="text-sm opacity-80 mt-1">{p.summary}</p>
<ul className="mt-3 flex flex-wrap gap-2 text-xs opacity-70">
{p.tech.map((t: string) => <li key={t} className="border rounded-full px-2 py-0.5">{t}</li>)}
</ul>
{p.metrics?.length ? (
<ul className="mt-3 text-sm">
{p.metrics.map((m: any, i: number) => (
<li key={i}>• <span className="font-medium">{m.label}:</span> {m.value}</li>
))}
</ul>
) : null}
<div className="mt-4 flex gap-3 text-sm">
{p.links?.demo && <a className="underline" href={p.links.demo} target="_blank">Live demo</a>}
{p.links?.repo && <a className="underline" href={p.links.repo} target="_blank">Code</a>}
</div>
</article>
))}
</div>
</section>
)
}
