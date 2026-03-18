import Header from './components/Header'
import Hero from './components/Hero'
import Architect from './components/Architect'
import Arsenal from './components/Arsenal'
import SocialProof from './components/SocialProof'
import Contact from './components/Contact'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <Architect />
      <Arsenal />
      <SocialProof />

      {/* Footer / Contact Section Wrapper */}
      <footer className="w-full flex flex-col bg-background-dark border-t border-surface-border mt-auto">
        <Contact />

        {/* Simple Footer Text */}
        <div className="mx-auto w-full max-w-7xl px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-surface-border">
          <p className="text-xs text-slate-500 font-mono">© 2026 AUTOBOT NEXUS SYSTEMS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">PRIVACY_PROTOCOL</a>
            <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">TERMS_OF_SERVICE</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
