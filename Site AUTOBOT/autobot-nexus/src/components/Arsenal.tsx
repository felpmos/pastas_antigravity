export default function Arsenal() {
    return (
        <section className="flex-grow flex flex-col items-center justify-center py-20 relative overflow-hidden">
            {/* Decorative radial gradient for depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-navy/40 rounded-full blur-[120px] -z-10"></div>

            <div className="container mx-auto px-6 max-w-7xl z-10">

                {/* Section Header */}
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-xs font-mono text-primary uppercase tracking-widest">MODULES_V.1.0</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">The Arsenal</h2>
                    </div>
                    <p className="max-w-md text-slate-400 text-sm md:text-base font-light leading-relaxed">
                        Unidades autônomas especializadas projetadas para fluxos de trabalho de precisão. Implante inteligência modular sem alucinações.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                    {/* Card 1: Agente Aya */}
                    <article className="agent-card group relative flex flex-col justify-between rounded-xl border border-white/5 bg-surface/40 backdrop-blur-md p-8 overflow-hidden">
                        {/* Tech Spec Line */}
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="flex items-start justify-between mb-8">
                            <div className="icon-container flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all duration-300">
                                <span className="material-symbols-outlined text-3xl">account_balance</span>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-navy border border-white/5 px-3 py-1 text-xs font-medium text-primary tracking-wide">
                                GESTÃO PÚBLICA
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-display text-2xl font-bold text-white group-hover:text-primary transition-colors">Agente Aya</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                Automação de processos licitatórios e atendimento ao cidadão com conformidade legal verificada em tempo real.
                            </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                            <span className="font-mono text-xs text-slate-500">v.2.4.1 • STATUS: ONLINE</span>
                            <span className="arrow-icon material-symbols-outlined text-slate-500 transition-transform duration-300">north_east</span>
                        </div>
                    </article>

                    {/* Card 2: Agente Nexus */}
                    <article className="agent-card group relative flex flex-col justify-between rounded-xl border border-white/5 bg-surface/40 backdrop-blur-md p-8 overflow-hidden">
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="flex items-start justify-between mb-8">
                            <div className="icon-container flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all duration-300">
                                <span className="material-symbols-outlined text-3xl">hub</span>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-navy border border-white/5 px-3 py-1 text-xs font-medium text-primary tracking-wide">
                                OPERAÇÕES
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-display text-2xl font-bold text-white group-hover:text-primary transition-colors">Agente Nexus</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                Rastreamento logístico em tempo real e previsão de inventário baseada em modelos preditivos de demanda.
                            </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                            <span className="font-mono text-xs text-slate-500">v.1.8.0 • STATUS: ONLINE</span>
                            <span className="arrow-icon material-symbols-outlined text-slate-500 transition-transform duration-300">north_east</span>
                        </div>
                    </article>

                    {/* Card 3: Agente Void */}
                    <article className="agent-card group relative flex flex-col justify-between rounded-xl border border-white/5 bg-surface/40 backdrop-blur-md p-8 overflow-hidden">
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="flex items-start justify-between mb-8">
                            <div className="icon-container flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all duration-300">
                                <span className="material-symbols-outlined text-3xl">shield_lock</span>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-navy border border-white/5 px-3 py-1 text-xs font-medium text-primary tracking-wide">
                                CYBERSEC
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-display text-2xl font-bold text-white group-hover:text-primary transition-colors">Agente Void</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                Detecção de anomalias de rede e protocolos de resposta a ameaças automatizados em milissegundos.
                            </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                            <span className="font-mono text-xs text-slate-500">v.3.0.2 • STATUS: IDLE</span>
                            <span className="arrow-icon material-symbols-outlined text-slate-500 transition-transform duration-300">north_east</span>
                        </div>
                    </article>

                    {/* Card 4: Agente Pulse */}
                    <article className="agent-card group relative flex flex-col justify-between rounded-xl border border-white/5 bg-surface/40 backdrop-blur-md p-8 overflow-hidden">
                        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="flex items-start justify-between mb-8">
                            <div className="icon-container flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all duration-300">
                                <span className="material-symbols-outlined text-3xl">query_stats</span>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-navy border border-white/5 px-3 py-1 text-xs font-medium text-primary tracking-wide">
                                CRM INTELIGENTE
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-display text-2xl font-bold text-white group-hover:text-primary transition-colors">Agente Pulse</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                Qualificação de leads high-ticket e engajamento omnichannel 24/7 com memória contextual persistente.
                            </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                            <span className="font-mono text-xs text-slate-500">v.1.2.5 • STATUS: ONLINE</span>
                            <span className="arrow-icon material-symbols-outlined text-slate-500 transition-transform duration-300">north_east</span>
                        </div>
                    </article>

                </div>

                {/* Bottom Decoration: Engineering Schematic Lines */}
                <div className="mt-20 flex justify-center opacity-30">
                    <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                </div>
                <div className="mt-4 text-center">
                    <p className="font-mono text-[10px] text-slate-600 tracking-[0.2em] uppercase">System Architecture // Level 1</p>
                </div>

            </div>
        </section>
    )
}
