import { useCallback, useEffect, useMemo, useState } from 'react'
import QuickActions from './components/QuickActions'
import Wizard from './components/Wizard'
import { stages as stageData, quickActions, recommendationRules } from './data/stages'
import { analyzeProblem } from './lib/aiClient'
import { useFlowStore } from './store/useFlowStore'
import statflowLogo from './assets/images/statflow-logo.png'
import statflowIcon from './assets/images/statflow-icon.png'

const findStageMethodById = (methodId) => {
  for (const stage of stageData) {
    for (const section of stage.sections) {
      for (const method of section.methods) {
        if (method.id === methodId) {
          return { stage, method }
        }
      }
    }
  }
  return null
}

const fallbackMethod = () => {
  const stage = stageData[0]
  const section = stage?.sections?.[0]
  const method = section?.methods?.[0]
  if (!stage || !method) return null
  return { stage, method }
}

function App() {
  const {
    activePhase,
    searchQuery,
    selectedMethodId,
    wizard,
    openStageIds,
    setActivePhase,
    setSearchQuery,
    selectMethod,
    setOpenStageIds,
    ensureStageOpen,
    resetFilters,
  } = useFlowStore()

  const [aiSummary, setAiSummary] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredStages = useMemo(() => {
    return stageData
      .filter((stage) => activePhase === 'all' || stage.phase === activePhase)
      .map((stage) => ({
        ...stage,
        sections: stage.sections
          .map((section) => ({
            ...section,
            methods: section.methods.filter((method) => {
              if (!normalizedQuery) return true
              const haystack = `${method.name} ${method.when} ${method.tags.join(' ')}`.toLowerCase()
              return haystack.includes(normalizedQuery)
            }),
          }))
          .filter((section) => section.methods.length > 0),
      }))
      .filter((stage) => stage.sections.length > 0)
  }, [activePhase, normalizedQuery])

  const recommendation = useMemo(() => {
    const rule =
      recommendationRules.find(
        (entry) =>
          entry.goal === wizard.goal &&
          entry.dataType === wizard.dataType &&
          entry.groups === wizard.groups &&
          (entry.normality === wizard.normality || entry.normality === 'unknown'),
      ) ||
      recommendationRules.find((entry) => entry.goal === wizard.goal) ||
      recommendationRules[0]

    const match = findStageMethodById(rule?.methodId)
    const resolved = match || fallbackMethod()
    if (!resolved) return null
    return {
      ...resolved.method,
      methodId: resolved.method.id,
      stageId: resolved.stage.id,
      stageTitle: resolved.stage.title,
      description: resolved.method.when,
    }
  }, [wizard])

  const selectedMethod = useMemo(() => {
    if (!selectedMethodId) return null
    const match = findStageMethodById(selectedMethodId)
    if (!match) return null
    return {
      ...match.method,
      methodId: match.method.id,
      stageId: match.stage.id,
      stageTitle: match.stage.title,
      description: match.method.when,
    }
  }, [selectedMethodId])

  const detailMethod = selectedMethod || recommendation

  useEffect(() => {
    if (detailMethod?.stageId) {
      ensureStageOpen(detailMethod.stageId)
    }
  }, [detailMethod, ensureStageOpen])

  const handleMethodClick = useCallback(
    (stageId, method) => {
      selectMethod(method.id)
      ensureStageOpen(stageId)
      const stage = stageData.find((item) => item.id === stageId)
      if (stage) {
        setActivePhase(stage.phase)
      }
    },
    [selectMethod, ensureStageOpen, setActivePhase],
  )

  const handleQuickAction = (phase) => {
    setActivePhase(phase)
    setSearchQuery('')
    setOpenStageIds([])
  }

  const handleSearch = (event) => {
    const value = event.target.value
    setSearchQuery(value)
    if (value) {
      setActivePhase('all')
    }
  }

  const methodCount = filteredStages.reduce(
    (total, stage) => total + stage.sections.reduce((sum, section) => sum + section.methods.length, 0),
    0,
  )

  const handleReset = () => {
    resetFilters()
    setOpenStageIds([])
  }

  const handleAIAnalyze = useCallback(
    async (message) => {
      setAiLoading(true)
      try {
        const aiResult = await analyzeProblem(message)
        setAiSummary(aiResult)
      } finally {
        setAiLoading(false)
      }
    },
    [],
  )

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#05050d] via-[#03030a] to-[#030306] pb-16 text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pt-8">
        <header className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b1a28] via-[#0b0b15] to-[#020204] p-6 shadow-glass">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={statflowIcon}
                alt="StatFlow mark"
                className="h-12 w-12 rounded-2xl border border-white/10 bg-white/10 p-2"
              />
              <div>
                <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">StatFlow</p>
                <h1 className="text-2xl font-semibold text-white">Personal statistical intelligence</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.5em] text-white/70">
              <span className="rounded-full border border-white/20 px-3 py-1">Pure frontend</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">StatFlow · decision engine</p>
              <p className="text-4xl font-bold text-white">StatFlow · statistical intelligence</p>
              <p className="text-white/70">
                Luminosity, structure, and reasoning for the analytical mind. StatFlow merges a decision wizard and
                AI reasoning into a premium statistical console.
              </p>
            </div>
            <img
              src={statflowLogo}
              alt="StatFlow logo"
              className="h-28 w-auto rounded-2xl border border-white/10 bg-white/5 p-3 shadow-neon"
            />
          </div>
        </header>

        <section className="space-y-6">
          <QuickActions actions={quickActions} activePhase={activePhase} onAction={handleQuickAction} />

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_70px_rgba(0,0,0,0.45)]">
              <Wizard
                recommendation={recommendation}
                aiSummary={aiSummary}
                aiLoading={aiLoading}
                onAnalyze={handleAIAnalyze}
              />
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
                <label className="block space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.4em] text-white/60">Global search</span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search methods, tags, reasoning..."
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-plasma-400/80"
                  />
                </label>
                <p className="mt-3 text-xs uppercase tracking-[0.4em] text-white/40">Instant filtering · keeps stage open</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/60">
                  <span>Decision stages</span>
                  <span className="text-white/40">Scroll to navigate</span>
                </div>
                <div className="max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/30">
                  <StageList
                    stages={filteredStages}
                    searchQuery={searchQuery}
                    selectedMethodId={selectedMethodId}
                    recommendedMethod={recommendation}
                    onMethodClick={handleMethodClick}
                    openStageIds={openStageIds}
                    setOpenStageIds={setOpenStageIds}
                  />
                </div>
              </div>
              <MethodDetail method={detailMethod} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
