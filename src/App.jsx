import { useCallback, useEffect, useMemo } from 'react'
import QuickActions from './components/QuickActions'
import Wizard from './components/Wizard'
import StageList from './components/StageList'
import FlowGraph from './components/FlowGraph'
import MethodDetail from './components/MethodDetail'
import MermaidSummary from './components/MermaidSummary'
import WorkflowTreeOverlay from './components/WorkflowTreeOverlay'
import { stages as stageData, quickActions, recommendationRules } from './data/stages'
import { mindmapStructure } from './data/mindmap'
import { useFlowStore } from './store/useFlowStore'

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

  const handleNodeClick = useCallback(
    (id) => {
      const stage = stageData.find((item) => item.id === id)
      if (stage) {
        setActivePhase(stage.phase)
        ensureStageOpen(id)
        const method = stage.sections[0]?.methods[0]
        if (method) selectMethod(method.id)
      }
    },
    [ensureStageOpen, selectMethod, setActivePhase],
  )

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#08070f] via-[#05050c] to-[#030309] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-8 pb-16">
        <header className="space-y-3 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-glass">
          <p className="text-[11px] uppercase tracking-[0.6em] text-white/50">
            StatFlow — Personal statistical decision system
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">StatFlow · statistical intelligence</h1>
              <p className="mt-2 max-w-2xl text-white/70">
                Transform your decision tree into a prod-level experience with guided recommendations, smart search, and luminosity at every step.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 text-xs uppercase tracking-[0.4em] text-white/60 md:items-end">
              <span className="rounded-full border border-white/20 px-4 py-1 text-[10px] font-semibold text-white/70">
                No backend · Pure UX
              </span>
              <span className="rounded-full border border-plasma-400/60 px-4 py-1 text-[10px] font-semibold text-plasma-100">
                Crafted for you
              </span>
            </div>
          </div>
        </header>

        <Wizard recommendation={recommendation} />

        <section className="space-y-6">
          <QuickActions actions={quickActions} activePhase={activePhase} onAction={handleQuickAction} />

          <div className="space-y-6">
            <FlowGraph
              stages={stageData}
              highlightedStageId={detailMethod?.stageId || recommendation?.stageId}
              activePhase={activePhase}
              onNodeClick={handleNodeClick}
              height={620}
            />
            <MermaidSummary />
            <WorkflowTreeOverlay data={mindmapStructure} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="text-xs uppercase tracking-[0.4em]">Status</span>
              <span>
                {filteredStages.length} stages · {methodCount} methods
              </span>
            </div>
            <button
              onClick={handleReset}
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70 transition hover:border-white/40"
            >
              Reset filters
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
              <label className="relative block">
                <span className="text-xs uppercase tracking-[0.4em] text-white/50">Global search</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search methods, tags, reasoning..."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-plasma-400/80"
                />
              </label>
            </div>
            <StageList
              stages={filteredStages}
              searchQuery={searchQuery}
              selectedMethodId={selectedMethodId}
              recommendedMethod={recommendation}
              onMethodClick={handleMethodClick}
              openStageIds={openStageIds}
              setOpenStageIds={setOpenStageIds}
            />
            <MethodDetail method={detailMethod} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
