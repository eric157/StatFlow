import { useMemo, useRef, useState } from 'react'
import Tree from 'react-d3-tree'
import { toPng, toSvg } from 'html-to-image'

const downloadBlob = (blob, fileName) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 60000)
}

export default function MindMap({ data }) {
  const containerRef = useRef(null)
  const [orientation, setOrientation] = useState('vertical')

  const treeProps = useMemo(
    () => ({
      collapsible: false,
      depthFactor: 190,
      translate: orientation === 'horizontal' ? { x: 60, y: 250 } : { x: 400, y: 60 },
      orientation,
      pathFunc: 'elbow',
      zoomable: true,
      nodeSize: { x: 200, y: 120 },
    }),
    [orientation],
  )

  const download = async (format) => {
    if (!containerRef.current) return
    try {
      if (format === 'png') {
        const dataUrl = await toPng(containerRef.current, { cacheBust: true })
        const blob = await (await fetch(dataUrl)).blob()
        downloadBlob(blob, 'statflow-mindmap.png')
      } else if (format === 'svg') {
        const dataUrl = await toSvg(containerRef.current)
        const blob = new Blob([dataUrl], { type: 'image/svg+xml' })
        downloadBlob(blob, 'statflow-mindmap.svg')
      } else if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        downloadBlob(blob, 'statflow-mindmap.json')
      }
    } catch (error) {
      console.error('Download failed', error)
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_40px_90px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">Mind map</p>
          <h3 className="text-xl font-semibold text-white">Statistical workflow tree</h3>
        </div>
        <div className="flex items-center gap-2">
          {['vertical', 'horizontal'].map((mode) => (
            <button
              key={mode}
              onClick={() => setOrientation(mode)}
              className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.3em] ${
                orientation === mode
                  ? 'border-plasma-300 bg-plasma-500/20 text-plasma-100'
                  : 'border-white/10 text-white/60'
              }`}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={() => download('png')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
          >
            Download PNG
          </button>
          <button
            onClick={() => download('svg')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
          >
            Download SVG
          </button>
          <button
            onClick={() => download('json')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
          >
            Download data
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="mindmap-canvas h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20"
      >
        <Tree data={data} {...treeProps} />
      </div>
    </div>
  )
}
