import * as Accordion from '@radix-ui/react-accordion'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const escapeRegex = (value) => value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
const highlightText = (value = '', query) => {
  if (!query) return value
  const regex = new RegExp(escapeRegex(query), 'gi')
  return value.replace(
    regex,
    (match) => `<mark class="bg-amber-200/70 text-amber-900">${match}</mark>`,
  )
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
      <div className="rounded-2xl border border-slate-300/40 bg-white/80 p-6 text-center text-sm text-slate-900">
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
          'rounded-3xl border border-slate-200/30 bg-gradient-to-br from-white/80 to-slate-100/60 shadow-[0_20px_60px_rgba(15,23,42,0.35)]',
          stageHasRecommendation ? 'border-amber-400/90 shadow-[0_30px_70px_rgba(244,196,125,0.35)]' : 'hover:border-amber-300/70'
        )
        return (
        <Accordion.Item key={stage.id} value={stage.id} className={stageClasses}>
            <Accordion.Trigger asChild>
              <button className="w-full rounded-3xl border-b border-slate-200/30 px-5 py-4 text-left bg-white/0">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stage.icon}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{stage.title}</p>
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{stage.badge}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
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
                        <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
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
                                  ? 'border-amber-400 bg-white text-slate-900 shadow-[0_20px_60px_rgba(253,186,116,0.35)]'
                                  : 'border-slate-200 bg-white/90 text-slate-900 hover:border-amber-300 hover:bg-white'
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <h3 className="text-base font-semibold" dangerouslySetInnerHTML={{ __html: method.highlightedName }} />
                                {isRecommended && (
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-600">
                                    Suggested
                                  </span>
                                )}
                              </div>
                              <p
                                className="mt-2 text-sm leading-5 text-slate-600"
                                dangerouslySetInnerHTML={{ __html: method.highlightedWhen }}
                              />
                              <div className="mt-3 flex flex-wrap gap-2">
                                {method.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] uppercase tracking-wider text-slate-600 bg-slate-100/60"
                                  >
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
