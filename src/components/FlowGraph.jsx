import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'

const defaultEdges = [
  ['pre', 'clean'],
  ['clean', 'eda'],
  ['eda', 'fe'],
  ['fe', 'compare'],
  ['compare', 'relate'],
  ['relate', 'predict'],
  ['predict', 'validate'],
  ['validate', 'time'],
  ['time', 'causal'],
  ['causal', 'bayesian'],
  ['bayesian', 'comms'],
]

export default function FlowGraph({ stages, highlightedStageId, activePhase, onNodeClick, height = 520 }) {
  const containerRef = useRef(null)
  const cyRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const elements = [
      ...stages.map((stage) => ({
        data: { id: stage.id, label: stage.title, phase: stage.phase },
      })),
      ...defaultEdges.map(([source, target]) => ({
        data: { id: `${source}-${target}`, source, target },
      })),
    ]

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': 120,
            'font-size': 12,
            'font-weight': 600,
            'text-valign': 'center',
            'text-halign': 'center',
            color: '#f8f8ff',
            'background-color': '#0f0f1a',
            'border-color': '#ffffff22',
            'border-width': 1,
            shape: 'round-rectangle',
            width: 150,
            height: 50,
            'overlay-padding': '6',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'line-color': '#ffffff15',
            'target-arrow-color': '#ffffff40',
          },
        },
        {
          selector: '.active',
          style: {
            'background-color': '#5b30ff',
            'border-color': '#534ab7',
            'border-width': 2,
            'text-outline-color': '#0f0f1a',
            'text-outline-width': 4,
          },
        },
        {
          selector: '.dim',
          style: {
            opacity: 0.25,
          },
        },
        {
          selector: 'edge.highlight',
          style: {
            'line-color': '#5b30ff',
            'target-arrow-color': '#5b30ff',
            width: 3,
          },
        },
        {
          selector: 'node.hover',
          style: {
            'border-color': '#ffffff80',
            'border-width': 2,
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        spacingFactor: 1.6,
        padding: 10,
        animate: true,
      },
    })

    cy.on('tap', 'node', (evt) => {
      onNodeClick?.(evt.target.id())
    })

    cy.on('mouseover', 'node', (evt) => {
      evt.target.addClass('hover')
    })
    cy.on('mouseout', 'node', (evt) => {
      evt.target.removeClass('hover')
    })

    cyRef.current = cy

    const handleResize = () => cy.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cy.destroy()
      cyRef.current = null
    }
  }, [stages, onNodeClick])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.nodes().forEach((node) => {
      node.removeClass('active')
      node.removeClass('dim')
    })
    cy.edges().forEach((edge) => {
      edge.removeClass('highlight')
      edge.removeClass('dim')
    })

    if (highlightedStageId) {
      const node = cy.getElementById(highlightedStageId)
      node.addClass('active')
      cy.edges().forEach((edge) => {
        if (edge.data('source') === highlightedStageId || edge.data('target') === highlightedStageId) {
          edge.addClass('highlight')
        }
      })
    }

    if (activePhase && activePhase !== 'all') {
      cy.nodes().forEach((node) => {
        if (node.data('phase') !== activePhase) {
          node.addClass('dim')
        }
      })
      cy.edges().forEach((edge) => {
        const sourcePhase = cy.getElementById(edge.data('source')).data('phase')
        const targetPhase = cy.getElementById(edge.data('target')).data('phase')
        if (sourcePhase !== activePhase || targetPhase !== activePhase) {
          edge.addClass('dim')
        }
      })
    }
  }, [highlightedStageId, activePhase])

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glass">
      <div className="text-[10px] uppercase tracking-[0.5em] text-white/50">Workflow graph</div>
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: height }} />
    </div>
  )
}
