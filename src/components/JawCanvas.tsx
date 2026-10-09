import { useEffect, useRef } from 'react'

type Vec3 = [number, number, number]
type Model = { points: Vec3[]; edges: [number, number][]; teeth: [number, number][] }

// Procedural mandible: a horseshoe-shaped body rising into two rami, plus a row of teeth.
function buildJaw(): Model {
  const U = 46
  const M = 10
  const bodyEnd = 0.7
  const thMax = 1.2
  const points: Vec3[] = []
  const edges: [number, number][] = []
  const teeth: [number, number][] = []

  const centre = (u: number): { c: Vec3; t: Vec3; r: number } => {
    const a = Math.abs(u)
    const s = u < 0 ? -1 : 1
    if (a <= bodyEnd) {
      const th = (u / bodyEnd) * thMax
      return { c: [1.15 * Math.sin(th), -0.06 * Math.cos(th), 0.95 * Math.cos(th) - 0.3], t: [Math.cos(th), 0, -0.82 * Math.sin(th)], r: 0 }
    }
    const k = (a - bodyEnd) / (1 - bodyEnd)
    const e = centre(s * bodyEnd)
    return { c: [e.c[0] + s * 0.06 * k, e.c[1] + 0.9 * k - 0.1 * k * k, e.c[2] - 0.32 * k], t: e.t, r: k }
  }

  for (let i = 0; i < U; i++) {
    const u = -1 + (2 * i) / (U - 1)
    const C = centre(u)
    const tl = Math.hypot(C.t[0], C.t[2])
    const T: Vec3 = [C.t[0] / tl, 0, C.t[2] / tl]
    const N: Vec3 = [T[2], 0, -T[0]]
    const r = Math.min(1, C.r * 2.2)
    const s = r * r * (3 - 2 * r) // smoothstep: body section -> ramus section
    const sign = u < 0 ? -1 : 1
    let A2: Vec3 = [T[0] * s * sign, 1 - s, T[2] * s * sign]
    const l2 = Math.hypot(...A2)
    A2 = [A2[0] / l2, A2[1] / l2, A2[2] / l2]
    const rad1 = 0.13 - 0.05 * s
    const rad2 = 0.27
    for (let j = 0; j < M; j++) {
      const ph = (j / M) * Math.PI * 2
      const cp = Math.cos(ph)
      const sp = Math.sin(ph)
      points.push([
        C.c[0] + N[0] * cp * rad1 + A2[0] * sp * rad2,
        C.c[1] + N[1] * cp * rad1 + A2[1] * sp * rad2,
        C.c[2] + N[2] * cp * rad1 + A2[2] * sp * rad2,
      ])
      const idx = i * M + j
      edges.push([idx, i * M + ((j + 1) % M)])
      if (i < U - 1) edges.push([idx, idx + M])
    }
  }

  const count = 14
  for (let q = 0; q < count; q++) {
    const uu = -0.62 + (1.24 * q) / (count - 1)
    const c = centre(uu).c
    const base: Vec3 = [c[0], c[1] + 0.27, c[2]]
    const top: Vec3 = [base[0], base[1] + (Math.abs(uu) > 0.32 ? 0.16 : 0.22), base[2]]
    const b = points.length
    points.push(base, top)
    teeth.push([b, b + 1])
  }
  return { points, edges, teeth }
}

/** Slowly rotating wireframe jaw. Pauses off-screen, in hidden tabs and for reduced motion. */
export default function JawCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const model = buildJaw()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let w = 0
    let h = 0
    let angle = -0.6
    let running = false
    let visible = true
    let last = 0
    let raf = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const wide = w >= 768
      const cx = wide ? w * 0.75 : w * 0.5
      const cy = wide ? h * 0.5 : Math.max(150, h * 0.21)
      const scale = wide ? Math.min(w * 0.14, h * 0.27) : Math.min(w * 0.27, 100)
      const tilt = 0.32
      const ca = Math.cos(angle), sa = Math.sin(angle), ct = Math.cos(tilt), st = Math.sin(tilt)
      const P = model.points
      const n = P.length
      const sx = new Float32Array(n), sy = new Float32Array(n), dz = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        const [px, py, pz] = P[i]
        const x = px * ca + pz * sa
        let z = -px * sa + pz * ca
        const y = py * ct - z * st
        z = py * st + z * ct
        const f = 3.4 / (3.4 - z)
        sx[i] = cx + x * f * scale
        sy[i] = cy - y * f * scale
        dz[i] = z
      }

      // Bone mesh in three depth buckets: one path per bucket keeps this cheap.
      const buckets: [number, number][][] = [[], [], []]
      for (const e of model.edges) {
        const d = (dz[e[0]] + dz[e[1]]) / 2
        buckets[d < -0.35 ? 0 : d < 0.35 ? 1 : 2].push(e)
      }
      const boneAlpha = [0.1, 0.2, 0.36]
      buckets.forEach((list, b) => {
        ctx.beginPath()
        for (const e of list) {
          ctx.moveTo(sx[e[0]], sy[e[0]])
          ctx.lineTo(sx[e[1]], sy[e[1]])
        }
        ctx.strokeStyle = `rgba(153, 246, 228, ${boneAlpha[b]})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      ctx.lineCap = 'round'
      for (const t of model.teeth) {
        const a = 0.35 + (0.5 * (dz[t[0]] + 1.2)) / 2.4
        ctx.beginPath()
        ctx.moveTo(sx[t[0]], sy[t[0]])
        ctx.lineTo(sx[t[1]], sy[t[1]])
        ctx.strokeStyle = `rgba(251, 191, 36, ${a})`
        ctx.lineWidth = 4
        ctx.stroke()
      }

      ctx.fillStyle = 'rgba(220, 255, 250, 0.4)'
      for (let j = 0; j < n; j += 2) if (dz[j] > 0) ctx.fillRect(sx[j] - 0.75, sy[j] - 0.75, 1.5, 1.5)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    const tick = (t: number) => {
      if (!running) return
      const dt = last ? Math.min(t - last, 50) : 16
      last = t
      angle += dt * 0.00018
      draw()
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (running || reduce.matches || !visible || document.hidden) return
      running = true
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : start())
    const onMotion = () => (reduce.matches ? stop() : start())
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    reduce.addEventListener('change', onMotion)
    resize()
    start()

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      reduce.removeEventListener('change', onMotion)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
