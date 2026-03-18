import React from 'react';
import HeroSection from './components/HeroSection';
import CinematicIntro from './components/CinematicIntro';
import SpecialistsGrid from './components/SpecialistsGrid';
import TechSpecs from './components/TechSpecs';
import Nexus from './components/Nexus';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Global Navigation (Header) */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-[0_0_10px_rgba(6,224,249,0.3)]">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">AutoBot</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-slate-300 hover:text-brand-cyan text-sm font-medium transition-colors">Início</a>
            <a href="#specialists" className="text-slate-300 hover:text-brand-cyan text-sm font-medium transition-colors">Especialistas</a>
            <a href="#techspecs" className="text-slate-300 hover:text-brand-cyan text-sm font-medium transition-colors">Especificações Técnicas</a>
            <a href="#contact" className="text-slate-300 hover:text-brand-cyan text-sm font-medium transition-colors">Contato</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center justify-center h-10 px-6 rounded bg-brand-cyan hover:bg-cyan-400 text-black text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,224,249,0.4)]">
              Solicitar Demo
            </button>
            <button className="md:hidden text-slate-300 hover:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 w-full pt-16">
        <section id="home">
          <HeroSection />
        </section>

        <section id="cinema" className="border-t border-white/5 bg-[#0a0a0a]">
          <CinematicIntro />
        </section>

        <section id="specialists" className="border-t border-white/5 bg-[#06121e]">
          <SpecialistsGrid />
        </section>

        <section id="techspecs" className="border-t border-white/5 bg-[#050505]">
          <TechSpecs />
        </section>

        <section id="contact" className="border-t border-white/5 relative bg-[#020202]">
          <Nexus />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black py-12">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-brand-cyan">smart_toy</span>
            <span className="font-bold text-lg">AutoBot</span>
          </div>
          <div className="flex gap-8 flex-wrap justify-center">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Política de Privacidade</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Termos de Serviço</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Documentação</a>
          </div>
          <div className="text-slate-600 text-sm">
            © 2026 AutoBot AI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
