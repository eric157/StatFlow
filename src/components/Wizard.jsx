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

export default function Wizard({
  recommendation,
  aiSummary,
  onAnalyze,
  aiLoading,
  quickActions = [],
  activePhase,
  onQuickAction,
}) {
  const { wizard, setWizard } = useFlowStore()

  return (
    <div className="border border-slate-200/40 bg-white/90 backdrop-blur-xl shadow-[0_50px_80px_rgba(15,23,42,0.35)] rounded-3xl p-6 space-y-6 text-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-slate-500">Decision wizard</p>
          <h2 className="text-2xl font-semibold text-slate-900">Smart guidance</h2>
        </div>
        <span className="px-3 py-1 text-xs font-semibold tracking-widest rounded-full border border-slate-300 text-slate-500">
          Multistep
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step) => (
          <div key={step.key} className="space-y-2">
            <div className="text-xs uppercase tracking-[0.4em] text-slate-500">{step.label}</div>
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
                        ? 'border-amber-400 bg-gradient-to-br from-amber-200/90 to-white text-slate-900 shadow-[0_20px_60px_rgba(253,186,116,0.35)]'
                        : 'border-slate-200 bg-white text-slate-900/80 hover:border-amber-200 hover:text-slate-900'
                    )}
                  >
                    <div>{option.label}</div>
                    {option.sub ? <div className="text-xs text-slate-400">{option.sub}</div> : null}
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

      {quickActions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.45em] text-slate-400">Focus goals</p>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Tap to jump</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const isActive = action.phase === activePhase
              return (
                <button
                  key={action.id}
                  onClick={() => onQuickAction?.(action.phase)}
                  className={clsx(
                    'group flex flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition duration-200',
                    isActive
                      ? 'border-amber-400 bg-amber-100/80 text-slate-900 shadow-[0_20px_50px_rgba(253,186,116,0.35)]'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-amber-200'
                  )}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <p className="text-lg font-semibold tracking-tight">{action.label}</p>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {recommendation && (
        <motion.div
          layout
          className="rounded-2xl border border-slate-300/60 bg-gradient-to-br from-white/80 to-slate-100/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.25)] text-slate-900"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500 mb-2">Smart recommendation</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">{recommendation.name}</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{recommendation.description}</p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Why</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{recommendation.why}</p>
          <div className="mt-3 grid gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-600">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Stage: {recommendation.stageTitle}
            </span>
          </div>
        </motion.div>
      )}

      <motion.div
        layout
        className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-[0_30px_70px_rgba(15,23,42,0.25)] text-slate-900"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500">AI reasoning</p>
            <p className="text-xs text-slate-500">Gemma 4 (Ollama)</p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Dynamic prompts</span>
        </div>
        <div className="mt-4 space-y-4">
          <AIInput onAnalyze={onAnalyze} loading={aiLoading} />
          {aiSummary && (
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-inner text-slate-900">
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Suggested test</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1">{aiSummary.recommended_test}</h3>
              <p className="mt-2 text-sm text-slate-600">{aiSummary.reasoning}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                <span className="rounded-full border border-slate-200 px-3 py-1">
                  {aiSummary.data_type || 'Numerical'}
                </span>
                {aiSummary.groups && (
                  <span className="rounded-full border border-slate-200 px-3 py-1">{aiSummary.groups} groups</span>
                )}
                {aiSummary.normality && (
                  <span className="rounded-full border border-slate-200 px-3 py-1">{aiSummary.normality}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
