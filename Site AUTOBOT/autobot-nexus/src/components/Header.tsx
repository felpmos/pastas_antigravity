export default function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 w-full border-b border-white/10 glass-header flex items-center justify-between px-6 lg:px-12 transition-all duration-300">
            <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">
                {/* Logo Section */}
                <a aria-label="AutoBot Home" className="group flex items-center gap-2 outline-none" href="#">
                    <div className="flex items-center font-display text-2xl font-bold tracking-tight text-white">
                        <span>AutoB</span>
                        <span className="relative mx-[1px] flex size-3 items-center justify-center">
                            <span className="absolute inline-block size-3 rounded-full bg-primary shadow-glow-primary"></span>
                        </span>
                        <span>t</span>
                    </div>
                </a>

                {/* Desktop Navigation Links (Center) */}
                <div className="hidden md:flex items-center gap-8">
                    <a className="text-sm font-medium text-[#E1E7EF] transition-colors duration-200 hover:text-primary hover:shadow-glow-primary" href="#">
                        Início
                    </a>
                    <a className="text-sm font-medium text-[#E1E7EF] transition-colors duration-200 hover:text-primary hover:shadow-glow-primary" href="#">
                        Especialistas
                    </a>
                    <a className="text-sm font-medium text-[#E1E7EF] transition-colors duration-200 hover:text-primary hover:shadow-glow-primary" href="#">
                        Como Funciona
                    </a>
                </div>

                {/* CTA & Mobile Menu Trigger (Right) */}
                <div className="flex items-center gap-4">
                    {/* Primary CTA */}
                    <button className="group relative overflow-hidden rounded bg-primary px-5 py-2 text-sm font-bold text-background-dark transition-all duration-300 hover:shadow-glow-primary hover:-translate-y-0.5 active:translate-y-0 relative z-10 flex items-center gap-2">
                        Solicitar Demo
                        <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
                    </button>

                    {/* Mobile Menu Button (Visible on small screens) */}
                    <button className="flex md:hidden size-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}
