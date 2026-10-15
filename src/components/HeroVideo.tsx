import { useEffect, useRef } from 'react'

/**
 * Seamless 360° turntable of the segmented mandible (rendered from the real meshes).
 * The clip is rendered on pure black and drawn with `lighten`, so only the jaw shows over the hero backdrop.
 * Plays only while on screen; reduced-motion users get the still poster frame.
 */
export default function HeroVideo({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let onScreen = true
    const sync = () => {
      if (reduce.matches || !onScreen || document.hidden) v.pause()
      else v.play().catch(() => {})
    }
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      sync()
    })
    io.observe(v)
    document.addEventListener('visibilitychange', sync)
    reduce.addEventListener('change', sync)
    sync()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reduce.removeEventListener('change', sync)
    }
  }, [])

  return (
    <video
      ref={ref}
      className={`pointer-events-none aspect-square mix-blend-lighten ${className}`}
      poster="/video/mandible-poster.webp"
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      disablePictureInPicture
    >
      <source src="/video/mandible-turntable.webm" type="video/webm" />
      <source src="/video/mandible-turntable.mp4" type="video/mp4" />
    </video>
  )
}
