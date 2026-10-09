import { motion } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import JawCanvas from './JawCanvas'
import { site } from '../content'

const ease = [0.2, 0.7, 0.2, 1] as const

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-svh items-end overflow-hidden bg-[#070b14] pb-20 pt-56 text-white md:items-center md:pb-24 md:pt-28">
      {/* glow + grid backdrop */}
      <div className="bg-grid absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_70%_45%,black_20%,transparent_75%)]" />
      <div className="absolute -right-40 top-1/4 -z-20 h-[36rem] w-[36rem] rounded-full bg-teal-500/20 blur-[120px]" />
      <div className="absolute -left-40 bottom-0 -z-20 h-[28rem] w-[28rem] rounded-full bg-amber-500/10 blur-[120px]" />
      <JawCanvas className="absolute inset-0 -z-10 h-full w-full" />

      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="max-w-2xl md:max-w-[56%]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300" />
            Final year project
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            Computer Vision for Oral &amp;{' '}
            <span className="bg-gradient-to-r from-teal-200 via-teal-300 to-amber-200 bg-clip-text text-transparent">Maxillofacial</span>{' '}
            Surgical Applications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease }}
            className="mt-5 text-lg text-white/80 sm:text-xl"
          >
            {site.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-3 text-sm text-white/55"
          >
            {site.affiliation}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href="#team"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-teal-300 px-6 text-sm font-semibold text-[#04201c] shadow-[0_8px_30px_-6px_rgba(45,212,191,0.6)] transition hover:-translate-y-0.5 hover:bg-teal-200"
            >
              Meet the team
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/5"
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </div>

      <a href="#overview" aria-label="Scroll to overview" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 transition hover:text-white">
        <ArrowDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  )
}
