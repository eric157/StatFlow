import { useCallback, useEffect, useState } from 'react'
import Tree from 'react-d3-tree'
import { toPng, toSvg } from 'html-to-image'

const downloadBlob = (blob, fileName) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 60000)
}

const palette = ['#5b30ff', '#3dd598', '#f4a261', '#ff5e8d', '#66c0ff']

export default function WorkflowTreeOverlay({ data }) {
  const [isOpen, setIsOpen] = useState(false)
  const [orientation, setOrientation] = useState('vertical')
  const [scale, setScale] = useState(1)

  const download = useCallback(
    async (format) => {
      const container = document.querySelector('.workflow-tree-canvas')
      if (!container) return
      try {
        if (format === 'png') {
          const dataUrl = await toPng(container, { cacheBust: true, pixelRatio: 3 })
          const blob = await (await fetch(dataUrl)).blob()
          downloadBlob(blob, 'statflow-tree.png')
        } else if (format === 'svg') {
          const dataUrl = await toSvg(container)
          const blob = new Blob([dataUrl], { type: 'image/svg+xml' })
          downloadBlob(blob, 'statflow-tree.svg')
        } else if (format === 'json') {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          downloadBlob(blob, 'statflow-tree.json')
        }
      } catch (error) {
        console.error('Download failed', error)
      }
    },
    [data],
  )

  useEffect(() => {
    const handleKey = (event) => {
      if (!isOpen) return
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen])

  const treeProps = useCallback(
    () => ({
      data,
      orientation,
      collapsible: false,
      pathFunc: 'step',
      translate: orientation === 'horizontal' ? { x: 180, y: 400 } : { x: 900, y: 80 },
      zoom: scale,
      scaleExtent: [0.5, 2.5],
      nodeSize: { x: 300, y: 120 },
    }),
    [data, orientation, scale],
  )

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.4em] text-white/75 transition hover:border-plasma-400/60 hover:text-white"
        >
          Open workflow tree
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch overflow-hidden bg-black/75 backdrop-blur-lg">
          <div className="relative m-auto flex max-w-[90vw] flex-1 flex-col rounded-3xl border border-white/10 bg-[#050510] shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">Statistical tree</p>
                <h3 className="text-xl font-semibold text-white">Full workflow storyboard</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrientation((prev) => (prev === 'vertical' ? 'horizontal' : 'vertical'))}
                  className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
                >
                  {orientation === 'vertical' ? 'Horizontal' : 'Vertical'}
                </button>
                <button
                  onClick={() => setScale((prev) => Math.min(2.5, prev + 0.2))}
                  className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
                >
                  Zoom +
                </button>
                <button
                  onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
                  className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
                >
                  Zoom -
                </button>
                <button
                  onClick={() => download('png')}
                  className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
                >
                  PNG
                </button>
                <button
                  onClick={() => download('svg')}
                  className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
                >
                  SVG
                </button>
                <button
                  onClick={() => download('json')}
                  className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
                >
                  JSON
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-plasma-400/70 bg-plasma-500/20 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-plasma-100"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="workflow-tree-canvas min-h-[60vh] w-full">
                <Tree {...treeProps()} zoomable={false} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
