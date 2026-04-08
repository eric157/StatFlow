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

const palette = ['#5b30ff', '#3dd598', '#f4a261', '#ff5e8d', '#66c0ff']

export default function MindMap({ data }) {
  const containerRef = useRef(null)
  const [orientation, setOrientation] = useState('vertical')

  const treeProps = useMemo(
    () => ({
      collapsible: false,
      depthFactor: 180,
      translate: orientation === 'horizontal' ? { x: 70, y: 280 } : { x: 420, y: 60 },
      orientation,
      pathFunc: 'elbow',
      zoomable: true,
      scaleExtent: [0.5, 1.5],
      nodeSize: { x: 240, y: 120 },
    }),
    [orientation],
  )

  const renderNode = ({ nodeDatum }) => {
    const color = palette[nodeDatum.depth % palette.length]
    return (
      <g>
        <rect
          x={-110}
          y={-25}
          rx={18}
          ry={18}
          width={220}
          height={50}
          fill={color}
          opacity={0.85}
          stroke="#ffffff55"
          strokeWidth={1}
        />
        <foreignObject x={-100} y={-20} width={200} height={40}>
          <div className="text-[11px] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <strong className="block text-[14px]" style={{ letterSpacing: '0.02em' }}>
              {nodeDatum.name}
            </strong>
          </div>
        </foreignObject>
      </g>
    )
  }

  const download = async (format) => {
    if (!containerRef.current) return
    try {
      if (format === 'png') {
        const dataUrl = await toPng(containerRef.current, { cacheBust: true, pixelRatio: 3, backgroundColor: '#050509' })
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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#06060d] to-[#0f0f18] p-4 shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">Mind map</p>
          <h3 className="text-xl font-semibold text-white">Statistical workflow tree</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['vertical', 'horizontal'].map((mode) => (
            <button
              key={mode}
              onClick={() => setOrientation(mode)}
              className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.3em] ${
                orientation === mode
                  ? 'border-plasma-300 bg-plasma-500/20 text-plasma-100'
                  : 'border-white/15 text-white/60'
              }`}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={() => download('png')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
          >
            PNG
          </button>
          <button
            onClick={() => download('svg')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
          >
            SVG
          </button>
          <button
            onClick={() => download('json')}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70"
          >
            JSON
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="mindmap-canvas relative h-[460px] w-full overflow-auto rounded-3xl border border-white/10 bg-gradient-to-br from-[#03030a] to-[#090919] p-2"
      >
        <Tree
          data={data}
          {...treeProps}
          styles={{
            links: { stroke: '#ffffff1f', strokeWidth: 2 },
          }}
          renderCustomNodeElement={(rd3tProps) => renderNode(rd3tProps)}
        />
      </div>
    </div>
  )
}
