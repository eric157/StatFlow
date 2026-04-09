import { useState } from 'react'

export default function AIInput({ onAnalyze, loading }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = () => {
    const trimmed = prompt.trim()
    if (!trimmed) return
    onAnalyze(trimmed)
    setPrompt('')
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
      <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">AI reasoning</p>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={3}
        placeholder="Describe your comparison: data type, groups, pairing, normality..."
        className="h-24 w-full rounded-2xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-plasma-400/80 focus:outline-none"
      />
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-white/60">
        <span>Gemma 4 (Ollama)</span>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-full border border-white/20 px-4 py-1 transition hover:border-white/40 disabled:opacity-60"
        >
          {loading ? 'Thinking…' : 'Analyze problem'}
        </button>
      </div>
    </div>
  )
}
