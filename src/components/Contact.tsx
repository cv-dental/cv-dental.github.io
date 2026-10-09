import { Mail } from 'lucide-react'
import { site } from '../content'
import { Reveal } from './ui'

export default function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-[#070b14] py-24 text-white md:py-32">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_50%_40%,black_10%,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[120px]" />
      <Reveal className="mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Have questions or want to collaborate?</h2>
        <p className="mt-5 text-lg text-white/70">
          Contact me at{' '}
          <a href={`mailto:${site.email}`} className="font-medium text-teal-200 underline decoration-teal-200/40 underline-offset-4 hover:decoration-teal-200">
            {site.email}
          </a>
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-teal-300 px-7 text-sm font-semibold text-[#04201c] shadow-[0_8px_30px_-6px_rgba(45,212,191,0.6)] transition hover:-translate-y-0.5 hover:bg-teal-200"
        >
          <Mail className="h-4 w-4" />
          Send an email
        </a>
      </Reveal>
    </section>
  )
}
