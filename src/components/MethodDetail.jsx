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
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 shadow-[0_40px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">What to do</p>
              <h3 className="text-2xl font-semibold text-white">{method.name}</h3>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.4em] text-plasma-100">
              Detail
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/80">{method.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {method.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Why this method?</p>
              <p className="text-sm text-white/80 leading-6">{method.why}</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Assumptions</p>
              <ul className="space-y-2 text-sm text-white/80">
                {(method.assumptions ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-plasma-300" />
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
          className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-5 text-center text-sm text-white/60"
        >
          Select a method to unlock detailed guidance.
        </motion.div>
      )}
    </AnimatePresence>
  )
}
