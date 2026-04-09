import { AnimatePresence, motion } from 'framer-motion'

export default function MethodDetail({ method }) {
  return (
    <AnimatePresence>
      {method ? (
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white/80 via-white/90 to-slate-100/80 p-6 shadow-[0_40px_80px_rgba(15,23,42,0.35)] text-slate-900"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.5em] text-slate-500">What to do</p>
              <h3 className="text-2xl font-semibold text-slate-900">{method.name}</h3>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.4em] text-plasma-100">
              Detail
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">{method.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {method.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-300 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-slate-600 bg-slate-100/70"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500">Why this method?</p>
              <p className="text-sm text-slate-600 leading-6">{method.why}</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500">Assumptions</p>
              <ul className="space-y-2 text-sm text-slate-600">
                {(method.assumptions ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-5 text-center text-sm text-slate-500"
        >
          Select a method to unlock detailed guidance.
        </motion.div>
      )}
    </AnimatePresence>
  )
}
