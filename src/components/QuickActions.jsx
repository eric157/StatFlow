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
                ? 'border-transparent bg-gradient-to-br from-amber-100/90 to-slate-200 text-slate-900 shadow-[0_30px_50px_rgba(248,250,252,0.35)]'
                : 'border-white/30 bg-white/80 text-slate-900 outline-1 outline-white/40 hover:border-transparent hover:shadow-[0_25px_40px_rgba(15,23,42,0.25)]'
            )}
          >
            <div className="text-2xl">{action.icon}</div>
            <p className="mt-2 font-semibold text-base text-slate-900">{action.label}</p>
            <p className="text-xs text-slate-600">{action.description}</p>
            <div
              className={clsx(
                'absolute inset-0 rounded-2xl border border-transparent transition-opacity',
                isActive ? 'opacity-0' : 'opacity-0'
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
