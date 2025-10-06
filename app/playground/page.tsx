import dynamic from 'next/dynamic'
const AIChat = dynamic(() => import('@/components/AIChat'), { ssr: false })

export default function PlaygroundPage() {
return (
<section className="space-y-4">
<h1 className="text-3xl font-bold">AI Playground</h1>
<p className="opacity-80">Ask about my projects, skills, or experience. This is a streaming demo — RAG connects in Sprint 1.</p>
<AIChat />
</section>
)
}