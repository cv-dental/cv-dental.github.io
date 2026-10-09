import { motion } from 'motion/react'
import { Database, ScanSearch, Shapes } from 'lucide-react'
import { exploring, outputs } from '../content'
import { Reveal, SectionHeading } from './ui'

const icons = [Shapes, ScanSearch, Database]

export default function Exploring() {
  return (
    <section id="exploring" className="relative border-y border-line bg-bg-soft py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading kicker="What we're exploring" title="Three connected workstreams" />

        <div className="grid gap-5 md:grid-cols-3">
          {exploring.map((item, i) => {
            const Icon = icons[i]
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-line bg-card p-7 shadow-sm"
                >
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0" />
                  <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="relative mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="relative mt-2 leading-relaxed text-muted">{item.text}</p>
                </motion.article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-20">
          <h3 className="text-2xl font-semibold md:text-3xl">Expected outputs</h3>
        </Reveal>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {outputs.map((text, i) => (
            <Reveal key={text} delay={i * 0.08}>
              <li className="flex h-full gap-4 rounded-2xl border border-dashed border-line p-6">
                <span className="font-display text-3xl font-bold leading-none text-accent/70">0{i + 1}</span>
                <p className="leading-relaxed text-muted">{text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
