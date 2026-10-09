import { overview } from '../content'
import CompareSlider from './CompareSlider'
import { Reveal, SectionHeading } from './ui'

export default function Overview() {
  return (
    <section id="overview" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading kicker="Overview" title="Planning jaw reconstruction, with computer vision" />
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
          <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
            {overview.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <CompareSlider />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
