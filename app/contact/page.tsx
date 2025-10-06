'use client'
export default function ContactPage() {
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault()
alert('Thanks! This is a stub — we’ll wire email in Sprint 1.')
}
return (
<section className="max-w-xl">
<h1 className="text-3xl font-bold mb-2">Contact</h1>
<p className="opacity-80 mb-4">Use the form below or reach out via LinkedIn/GitHub.</p>
<form className="space-y-3" onSubmit={onSubmit}>
<input className="w-full border rounded-xl p-2" placeholder="Your email" required />
<textarea className="w-full border rounded-xl p-2" rows={5} placeholder="Message" required />
<button className="border rounded-xl px-4 py-2">Send (stub)</button>
</form>
</section>
)
}
