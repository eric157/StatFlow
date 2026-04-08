import { motion } from 'framer-motion'
import clsx from 'clsx'
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

export default function Wizard({ recommendation }) {
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{recommendation.name}</h3>
              <p className="text-sm text-white/70 mt-1">{recommendation.description}</p>
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
    </div>
  )
}
