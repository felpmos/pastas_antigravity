export default function SocialProof() {
    return (
        <section className="relative w-full border-y border-[#1F2937]/50 bg-[#050505] py-16 overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#1F2937 1px, transparent 1px), linear-gradient(90deg, #1F2937 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[100px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="layout-container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Label */}
                <div className="flex flex-col items-center justify-center mb-10 space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50"></span>
                        <h3 className="text-primary text-xs font-display font-bold uppercase tracking-[0.2em] px-2 text-center text-shadow-glow">
                            Trusted Networks & Integrations
                        </h3>
                        <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50"></span>
                    </div>
                    <p className="text-muted text-sm font-display tracking-wide">DEPLOYED IN PRODUCTION ENVIRONMENTS</p>
                </div>

                {/* Logo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 items-center justify-items-center">

                    {/* Logo 1: Tech Corp */}
                    <div className="group relative flex flex-col items-center justify-center p-4 transition-all duration-500 hover:scale-105 cursor-default">
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 blur-xl transition-colors duration-500 rounded-full"></div>
                        {/* Icon */}
                        <div className="text-[#4B5563] group-hover:text-[#E1E7EF] transition-colors duration-300">
                            <svg aria-label="Logo for Acme Engineering" className="h-10 w-auto fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 0L37.32 10V30L20 40L2.68 30V10L20 0ZM20 5L7 12.5V27.5L20 35L33 27.5V12.5L20 5Z"></path>
                                <path d="M20 10L28.66 15V25L20 30L11.34 25V15L20 10Z" opacity="0.5"></path>
                            </svg>
                        </div>
                        {/* Hover Label */}
                        <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-mono text-primary uppercase tracking-widest">
                            Data Systems
                        </span>
                    </div>

                    {/* Logo 2: Cyber Systems */}
                    <div className="group relative flex flex-col items-center justify-center p-4 transition-all duration-500 hover:scale-105 cursor-default">
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 blur-xl transition-colors duration-500 rounded-full"></div>
                        <div className="text-[#4B5563] group-hover:text-[#E1E7EF] transition-colors duration-300">
                            <svg aria-label="Logo for Cyberdyne Integrations" className="h-9 w-auto fill-current" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15" cy="15" r="10"></circle>
                                <circle cx="35" cy="15" r="10"></circle>
                                <circle cx="15" cy="35" r="10"></circle>
                                <rect height="15" rx="2" width="15" x="23" y="23"></rect>
                            </svg>
                        </div>
                        <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-mono text-primary uppercase tracking-widest">
                            Security
                        </span>
                    </div>

                    {/* Logo 3: Cloud Logic */}
                    <div className="group relative flex flex-col items-center justify-center p-4 transition-all duration-500 hover:scale-105 cursor-default">
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 blur-xl transition-colors duration-500 rounded-full"></div>
                        <div className="text-[#4B5563] group-hover:text-[#E1E7EF] transition-colors duration-300">
                            <svg aria-label="Logo for Cloud Logic" className="h-8 w-auto fill-current" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <path d="M32 2L2 18V46L32 62L62 46V18L32 2ZM32 8L54 20L32 32L10 20L32 8ZM8 24L28 35V56L8 44V24ZM36 56V35L56 24V44L36 56Z"></path>
                            </svg>
                        </div>
                        <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-mono text-primary uppercase tracking-widest">
                            Cloud Ops
                        </span>
                    </div>

                    {/* Logo 4: Neural Net */}
                    <div className="group relative flex flex-col items-center justify-center p-4 transition-all duration-500 hover:scale-105 cursor-default">
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 blur-xl transition-colors duration-500 rounded-full"></div>
                        <div className="text-[#4B5563] group-hover:text-[#E1E7EF] transition-colors duration-300">
                            <svg aria-label="Logo for Neural Net Inc" className="h-10 w-auto fill-current" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="none" stroke="currentColor" strokeWidth="8"></path>
                                <circle cx="50" cy="50" r="15"></circle>
                                <circle cx="50" cy="10" r="5"></circle>
                                <circle cx="90" cy="30" r="5"></circle>
                                <circle cx="90" cy="70" r="5"></circle>
                                <circle cx="50" cy="90" r="5"></circle>
                                <circle cx="10" cy="70" r="5"></circle>
                                <circle cx="10" cy="30" r="5"></circle>
                            </svg>
                        </div>
                        <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-mono text-primary uppercase tracking-widest">
                            AI Research
                        </span>
                    </div>

                    {/* Logo 5: Gov Tech */}
                    <div className="group relative flex flex-col items-center justify-center p-4 transition-all duration-500 hover:scale-105 cursor-default col-span-2 lg:col-span-1">
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 blur-xl transition-colors duration-500 rounded-full"></div>
                        <div className="text-[#4B5563] group-hover:text-[#E1E7EF] transition-colors duration-300">
                            <svg aria-label="Logo for GovTech Solutions" className="h-10 w-auto fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                                <path d="M2 17L12 22L22 17" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                                <path d="M2 12L12 17L22 12" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                        </div>
                        <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-mono text-primary uppercase tracking-widest">
                            Public Sector
                        </span>
                    </div>

                </div>

                {/* Connection Lines (Decorative) */}
                <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 flex justify-between px-10 pointer-events-none opacity-10">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary"></div>
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary"></div>
                </div>

            </div>
        </section>
    )
}
