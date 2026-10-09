import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Moon, Sun, X } from 'lucide-react'

const links = [
  { href: '#overview', label: 'Overview' },
  { href: '#exploring', label: 'Exploring' },
  { href: '#team', label: 'Team' },
  { href: '#contact', label: 'Contact' },
]

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  const toggle = () => {
    setDark((d) => {
      try {
        localStorage.setItem('theme', d ? 'light' : 'dark')
      } catch {
        /* storage unavailable: theme still switches for this visit */
      }
      return !d
    })
  }
  return { dark, toggle }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ${
        scrolled || open ? 'border-b border-white/10 bg-[#070b14]/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5 font-display text-base font-semibold" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <path d="M5 9c0 9 4.5 16 11 16s11-7 11-16" fill="none" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" />
            <circle cx="5" cy="7" r="2.6" fill="#fbbf24" />
            <circle cx="27" cy="7" r="2.6" fill="#fbbf24" />
          </svg>
          <span>CV&nbsp;Dental</span>
        </a>

        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={toggle}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:bg-white/10 md:ml-2"
        >
          {dark ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:bg-white/10 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-5 md:hidden"
          >
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block border-t border-white/10 py-3.5 text-base font-medium text-white/85">
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
