import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type Img = { src: string; w: number; h: number; alt: string }
type Case = { id: string; label: string; before: Img; after: Img; lesion: boolean }

const cases: Case[] = [
  {
    id: 'healthy',
    label: 'Jaw & teeth',
    before: { src: '/img/scan-healthy-raw.webp', w: 1232, h: 760, alt: 'Raw 3D CT rendering of a lower jaw with teeth' },
    after: { src: '/img/scan-healthy-ai.webp', w: 1232, h: 760, alt: 'The same jaw after segmentation: bone in green, teeth in yellow' },
    lesion: false,
  },
  {
    id: 'tumour',
    label: 'Jaw with a tumour',
    before: { src: '/img/scan-tumour-raw.webp', w: 1280, h: 754, alt: 'Raw 3D CT rendering of a lower jaw affected by a tumour' },
    after: { src: '/img/scan-tumour-ai.webp', w: 1280, h: 754, alt: 'The same jaw after segmentation, with the tumour highlighted in orange' },
    lesion: true,
  },
]

/** Before/after comparison: drag (or use arrow keys) to reveal the segmented result. */
export default function CompareSlider() {
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState(50)
  const stage = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const c = cases[active]

  const fromPointer = (e: PointerEvent) => {
    const r = stage.current!.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)))
  }

  return (
    <div>
      <div role="tablist" aria-label="Choose an example" className="mb-4 inline-flex gap-1 rounded-full border border-line bg-card p-1">
        {cases.map((k, i) => (
          <button
            key={k.id}
            role="tab"
            aria-selected={i === active}
            onClick={() => {
              setActive(i)
              setPos(50)
            }}
            className={`relative h-9 rounded-full px-4 text-sm font-medium transition-colors ${i === active ? 'text-accent-fg' : 'text-muted hover:text-fg'}`}
          >
            {i === active && <motion.span layoutId="tab-pill" className="absolute inset-0 -z-0 rounded-full bg-accent" />}
            <span className="relative">{k.label}</span>
          </button>
        ))}
      </div>

      <div
        ref={stage}
        className="relative cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(70%_70%_at_50%_45%,#123047_0%,#070b14_80%)] shadow-2xl shadow-black/30 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-teal-300"
        style={{ aspectRatio: `${c.before.w} / ${c.before.h}` }}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          fromPointer(e)
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={c.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <img src={c.before.src} width={c.before.w} height={c.before.h} alt={c.before.alt} loading="lazy" decoding="async" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
            <img
              src={c.after.src}
              width={c.after.w}
              height={c.after.h}
              alt={c.after.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            />
          </motion.div>
        </AnimatePresence>

        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-200 backdrop-blur">AI result</span>
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">Raw scan</span>

        <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-teal-300 shadow-[0_0_14px_rgba(45,212,191,0.8)]" style={{ left: `${pos}%` }}>
          <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-teal-300 text-[#04201c] shadow-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M9 6 3 12l6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(+e.target.value)}
          aria-label="Reveal the AI result"
          className="absolute inset-0 h-full w-full opacity-0"
          style={{ pointerEvents: 'none' }}
        />
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
        <li className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[#8cc79a]" />Bone</li>
        <li className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[#f2d9a0]" />Teeth</li>
        {c.lesion && <li className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-[#e8622c]" />Tumour</li>}
      </ul>
    </div>
  )
}
