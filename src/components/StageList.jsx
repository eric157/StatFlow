import * as Accordion from '@radix-ui/react-accordion'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const escapeRegex = (value) => value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
const highlightText = (value = '', query) => {
  if (!query) return value
  const regex = new RegExp(escapeRegex(query), 'gi')
  return value.replace(regex, (match) => `<mark class="bg-amber-300/40 text-amber-100">${match}</mark>`)
}

export default function StageList({
  stages,
  searchQuery,
  selectedMethodId,
  recommendedMethod,
  onMethodClick,
  openStageIds,
  setOpenStageIds,
}) {
  if (!stages.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
        No methods match "{searchQuery}". Try a different search or reset filters.
      </div>
    )
  }

  return (
    <Accordion.Root
      type="multiple"
      value={openStageIds}
      onValueChange={(value) => setOpenStageIds(value)}
      className="space-y-3"
    >
      {stages.map((stage) => {
        const stageHasRecommendation = stage.id === recommendedMethod?.stageId
        const stageClasses = clsx(
          'rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(5,4,15,0.45)]',
          stageHasRecommendation ? 'border-plasma-400/80 shadow-neon' : 'hover:border-white/30'
        )
        return (
          <Accordion.Item key={stage.id} value={stage.id} className={stageClasses}>
            <Accordion.Trigger asChild>
              <button className="w-full rounded-3xl border-b border-white/10 px-5 py-4 text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stage.icon}</span>
                    <div>
                      <p className="text-lg font-semibold text-white">{stage.title}</p>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/60">{stage.badge}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span className="rounded-full border border-white/20 px-2 py-0.5">
                      {stage.sections.reduce((sum, section) => sum + section.methods.length, 0)} methods
                    </span>
                    <span className="text-lg">⌄</span>
                  </div>
                </div>
              </button>
            </Accordion.Trigger>
            <Accordion.Content asChild>
              <motion.div layout className="px-5 pb-5 pt-4 space-y-4">
                {stage.sections.map((section) => {
                  const methods = section.methods
                    .filter((method) => {
                      if (!searchQuery) return true
                      const haystack = `${method.name} ${method.when} ${method.tags.join(' ')}`.toLowerCase()
                      return haystack.includes(searchQuery.toLowerCase())
                    })
                    .map((method) => ({
                      ...method,
                      highlightedWhen: highlightText(method.when, searchQuery),
                      highlightedName: highlightText(method.name, searchQuery),
                    }))

                  if (!methods.length) return null

                  return (
                    <div key={`${stage.id}-${section.label}`} className="space-y-2">
                      <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">
                        {section.label}
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {methods.map((method) => {
                          const isSelected = method.id === selectedMethodId
                                const isRecommended = method.id === recommendedMethod?.methodId
                          return (
                            <motion.button
                              layout
                              key={method.id}
                              onClick={() => onMethodClick(stage.id, method)}
                              className={clsx(
                                'text-left',
                                'rounded-2xl border px-4 py-3 transition-all duration-200',
                                isSelected
                                  ? 'border-plasma-400/90 bg-plasma-500/20 text-white shadow-neon'
                                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10'
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <h3 className="text-base font-semibold" dangerouslySetInnerHTML={{ __html: method.highlightedName }} />
                                {isRecommended && (
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-plasma-100">
                                    Suggested
                                  </span>
                                )}
                              </div>
                              <p
                                className="mt-2 text-sm leading-5 text-white/60"
                                dangerouslySetInnerHTML={{ __html: method.highlightedWhen }}
                              />
                              <div className="mt-3 flex flex-wrap gap-2">
                                {method.tags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="rounded-full border border-white/20 px-2 py-0.5 text-[11px] uppercase tracking-wider text-white/70">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
