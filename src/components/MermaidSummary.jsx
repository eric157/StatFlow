import mermaid from 'mermaid'
import { useEffect, useMemo, useRef } from 'react'

const definition = `
graph TD
  PRE[-1 PRE-ANALYSIS] --> CLEAN[0 DATA CLEANING & ASSUMPTIONS]
  CLEAN --> EDA[1 EDA]
  EDA --> FE[1.5 FEATURE ENGINEERING]
  FE --> GOAL[2 DEFINE YOUR GOAL]
  GOAL --> COMP[A. COMPARISON]
  COMP --> REL[► B. RELATIONSHIP]
  REL --> PRED[► C. PREDICTION]
  PRED --> UNSUP[► D. UNSUPERVISED LEARNING]
  UNSUP --> TIME[► E. TIME SERIES]
  TIME --> CAUSAL[► F. CAUSAL INFERENCE]
  CAUSAL --> BAYES[► G. BAYESIAN ANALYSIS]
  BAYES --> MAG[🔹 3. MAGNITUDE & INTERPRETATION]
  MAG --> VAL[🔹 4. VALIDATION & ROBUSTNESS]
  VAL --> COMMS[🔹 5. COMMUNICATION & ETHICS]
  COMMS --> END[✅ END → DECISION / ACTION]
`

export default function MermaidSummary() {
  const containerRef = useRef(null)
  const renderId = useMemo(() => `mermaid-${Math.random().toString(16).slice(2)}`, [])

  useEffect(() => {
    if (!containerRef.current) return
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#5b30ff',
        secondaryColor: '#3dd598',
        tertiaryColor: '#ff5e8d',
        nodeBorder: '#ffffff33',
        lineColor: '#ffffff30',
        textColor: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    })
    mermaid.render(renderId, definition, (svgCode) => {
      if (containerRef.current) {
        containerRef.current.innerHTML = svgCode
      }
    })
  }, [renderId])

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_40px_90px_rgba(0,0,0,0.35)]">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">Mermaid summary</p>
          <h3 className="text-lg font-semibold text-white">Workflow timeline</h3>
        </div>
      </div>
      <div ref={containerRef} className="min-h-[180px]" />
    </div>
  )
}
