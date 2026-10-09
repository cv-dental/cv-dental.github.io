import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Overview from './components/Overview'
import Exploring from './components/Exploring'
import Team from './components/Team'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Overview />
        <Exploring />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
