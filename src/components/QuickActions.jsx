import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function QuickActions({ actions, activePhase, onAction }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {actions.map((action) => {
        const isActive = activePhase === action.phase
        return (
          <motion.button
            layout
            key={action.id}
            onClick={() => onAction(action.phase)}
            className={clsx(
              'group relative overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-300',
              isActive
                ? 'border-plasma-400/70 bg-plasma-400/20 text-white shadow-neon'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10'
            )}
          >
            <div className="text-2xl">{action.icon}</div>
            <p className="mt-2 font-semibold text-base text-white">{action.label}</p>
            <p className="text-xs text-white/60">{action.description}</p>
            <div
              className={clsx(
                'absolute inset-0 rounded-2xl border border-white/10 transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
