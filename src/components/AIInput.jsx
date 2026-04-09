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
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.25)]">
      <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500">AI reasoning</p>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={3}
        placeholder="Describe your comparison: data type, groups, pairing, normality..."
        className="h-24 w-full rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
      />
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-slate-500">
        <span>Gemma 4 (Ollama)</span>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-full border border-slate-300 px-4 py-1 transition hover:border-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking…' : 'Analyze problem'}
        </button>
      </div>
    </div>
  )
}
