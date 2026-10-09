import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="mb-10 max-w-2xl md:mb-14">
      <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-6 bg-accent" />
        {kicker}
      </p>
      <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">{title}</h2>
      {children && <div className="mt-4 text-lg leading-relaxed text-muted">{children}</div>}
    </Reveal>
  )
}
