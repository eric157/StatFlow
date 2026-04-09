import { motion } from 'framer-motion'
import clsx from 'clsx'
import AIInput from './AIInput'
import { useFlowStore } from '../store/useFlowStore'

const steps = [
  {
    label: 'Goal',
    key: 'goal',
    options: [
      { value: 'compare', label: 'Comparison', sub: 'A. Hypothesis testing' },
      { value: 'relate', label: 'Relationship', sub: 'B. Association' },
      { value: 'predict', label: 'Prediction', sub: 'C. Supervised learning' },
      { value: 'explore', label: 'Explore', sub: 'EDA & clustering' },
      { value: 'time', label: 'Time series', sub: 'Seasonality & forecasting' },
      { value: 'causal', label: 'Causal', sub: 'Identify causal levers' },
    ],
  },
  {
    label: 'Data type',
    key: 'dataType',
    options: [
      { value: 'numerical', label: 'Numerical' },
      { value: 'categorical', label: 'Categorical' },
    ],
  },
  {
    label: 'Groups',
    key: 'groups',
    options: [
      { value: '1', label: '1 group' },
      { value: '2', label: '2 groups' },
      { value: '3+', label: '3+ groups' },
    ],
  },
  {
    label: 'Normality',
    key: 'normality',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
]

export default function Wizard({ recommendation, aiSummary, onAnalyze, aiLoading }) {
  const { wizard, setWizard } = useFlowStore()

  return (
    <div className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-white/60">Decision wizard</p>
          <h2 className="text-2xl font-semibold text-white">Smart guidance</h2>
        </div>
        <span className="px-3 py-1 text-xs font-semibold tracking-widest rounded-full border border-white/20 text-white/70">Multistep</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step) => (
          <div key={step.key} className="space-y-2">
            <div className="text-xs uppercase tracking-[0.4em] text-white/60">{step.label}</div>
            <div className="grid gap-2 md:grid-cols-3">
              {step.options.map((option) => {
                const isActive = wizard[step.key] === option.value
                return (
                  <motion.button
                    key={option.value}
                    layout
                    onClick={() => setWizard({ [step.key]: option.value })}
                    className={clsx(
                      'relative overflow-hidden rounded-2xl border px-3 py-2 text-left text-sm font-medium transition-all',
                      isActive
                        ? 'border-plasma-500/80 bg-gradient-to-br from-plasma-500/30 to-plasma-500/10 text-white shadow-neon'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10'
                    )}
                  >
                    <div>{option.label}</div>
                    {option.sub ? <div className="text-xs text-white/60">{option.sub}</div> : null}
                    {isActive && (
                      <motion.div
                        layoutId={`wizard-pill-${step.key}`}
                        className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {recommendation && (
        <motion.div
          layout
          className="rounded-2xl border border-plasma-400/60 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-inner"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/60 mb-2">Smart recommendation</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">{recommendation.name}</h3>
              <p className="text-sm text-white/70 mt-1 leading-relaxed">{recommendation.description}</p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Why</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/80">{recommendation.why}</p>
          <div className="mt-3 grid gap-2 text-xs text-white/70">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-plasma-100">
              <span className="h-2 w-2 rounded-full bg-plasma-500" /> Stage: {recommendation.stageTitle}
            </span>
          </div>
        </motion.div>
      )}

      <motion.div
        layout
        className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 to-black/30 p-5 shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">AI reasoning</p>
            <p className="text-xs text-white/70">Gemma 4 (Ollama)</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">Dynamic prompts</span>
        </div>
        <div className="mt-4 space-y-4">
          <AIInput onAnalyze={onAnalyze} loading={aiLoading} />
          {aiSummary && (
            <div className="rounded-2xl border border-plasma-400/40 bg-black/80 p-4 shadow-inner">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">Suggested test</p>
              <h3 className="text-2xl font-semibold text-white mt-1">{aiSummary.recommended_test}</h3>
              <p className="mt-2 text-sm text-white/70">{aiSummary.reasoning}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {aiSummary.data_type || 'Numerical'}
                </span>
                {aiSummary.groups && (
                  <span className="rounded-full border border-white/10 px-3 py-1">{aiSummary.groups} groups</span>
                )}
                {aiSummary.normality && (
                  <span className="rounded-full border border-white/10 px-3 py-1">{aiSummary.normality}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
