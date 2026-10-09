import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { externalSupervisors, students, supervisors } from '../content'
import type { Supervisor } from '../content'
import { Reveal, SectionHeading } from './ui'

function SupervisorCard({ s, label }: { s: Supervisor; label: string }) {
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{label}</p>
        <h4 className="mt-2 text-lg font-semibold">{s.name}</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted">{s.dept}</p>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
    </a>
  )
}

export default function Team() {
  return (
    <section id="team" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading kicker="Team & supervisors" title="The team" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <motion.figure
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group relative overflow-hidden rounded-3xl border border-line bg-card shadow-sm"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={s.photo}
                    width={640}
                    height={640}
                    alt={`Portrait of ${s.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-black/45 px-5 py-4 text-white backdrop-blur-md">
                  <p className="font-display text-xl font-semibold">{s.name}</p>
                </figcaption>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal-300 to-amber-300 transition-transform duration-500 group-hover:scale-x-100" />
              </motion.figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 mb-6">
          <h3 className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Academic supervisors <span className="h-px flex-1 bg-line" />
          </h3>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {supervisors.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.06}>
              <SupervisorCard s={s} label="Supervisor" />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 mb-6">
          <h3 className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            External supervisors <span className="h-px flex-1 bg-line" />
          </h3>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {externalSupervisors.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.06}>
              <SupervisorCard s={s} label="External supervisor" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
