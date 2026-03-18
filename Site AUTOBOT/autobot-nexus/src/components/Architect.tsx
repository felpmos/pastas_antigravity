export default function Architect() {
    return (
        <section className="relative flex flex-col pt-24 pb-20 overflow-x-hidden">
            {/* Radial Gradient for depth */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-deep-navy/20 via-background-dark/80 to-background-dark pointer-events-none"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-16 md:text-center max-w-3xl mx-auto">
                    <h2 className="font-display text-primary text-sm font-bold tracking-widest uppercase mb-3">O Arquiteto</h2>
                    <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white mb-6">
                        Engenharia de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Precisão</span>
                    </h1>
                    <p className="text-text-muted text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        Visualize como transformamos caos em processos estruturados. Nossos agentes operam com guardrails rígidos para garantir zero alucinação.
                    </p>
                </div>

                {/* Visualization Container */}
                <div className="relative w-full aspect-[16/12] md:aspect-[16/9] lg:aspect-[2/1] rounded-xl border border-white/10 bg-[#0E1217]/40 backdrop-blur-sm overflow-hidden group">

                    {/* Decorative Terminal Header */}
                    <div className="absolute top-0 left-0 w-full h-10 border-b border-white/5 bg-[#0E1217] flex items-center px-4 gap-2 z-20">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        <div className="ml-4 text-[10px] font-mono text-text-muted uppercase tracking-wider">workflow_v4.2.0_stable</div>
                    </div>

                    {/* Diagram Content */}
                    <div className="relative w-full h-full p-8 md:p-12 flex items-center justify-center">

                        {/* SVG Connecting Lines (Absolute behind nodes) */}
                        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="gradient-line" x1="0%" x2="100%" y1="0%" y2="0%">
                                    <stop offset="0%" stopColor="#374151" stopOpacity="0.2"></stop>
                                    <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.5"></stop>
                                    <stop offset="100%" stopColor="#374151" stopOpacity="0.2"></stop>
                                </linearGradient>
                                <filter id="glow-green">
                                    <feGaussianBlur result="coloredBlur" stdDeviation="2.5"></feGaussianBlur>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"></feMergeNode>
                                        <feMergeNode in="SourceGraphic"></feMergeNode>
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Path 1: Input to Orchestrator */}
                            <path d="M 15% 50% C 25% 50%, 25% 50%, 35% 50%" fill="none" stroke="#374151" strokeWidth="2"></path>
                            <path className="animate-flow" d="M 15% 50% C 25% 50%, 25% 50%, 35% 50%" fill="none" stroke="#00E5FF" strokeDasharray="10 100" strokeLinecap="round" strokeWidth="2"></path>

                            {/* Path 2: Orchestrator to Memory (Curved Top) */}
                            <path d="M 45% 45% C 45% 25%, 65% 25%, 65% 40%" fill="none" stroke="#374151" strokeWidth="2"></path>
                            <path className="animate-flow" d="M 45% 45% C 45% 25%, 65% 25%, 65% 40%" fill="none" filter="url(#glow-green)" stroke="#00FF94" strokeDasharray="20 200" strokeLinecap="round" strokeWidth="2" style={{ animationDelay: '0.5s' }}></path>

                            {/* Path 3: Orchestrator to Output (Right) */}
                            <path d="M 55% 50% C 65% 50%, 75% 50%, 85% 50%" fill="none" stroke="#374151" strokeWidth="2"></path>
                            <path className="animate-flow" d="M 55% 50% C 65% 50%, 75% 50%, 85% 50%" fill="none" filter="url(#glow-green)" stroke="#00FF94" strokeDasharray="15 150" strokeLinecap="round" strokeWidth="2" style={{ animationDelay: '1.2s' }}></path>

                            {/* Connection Line for Hotspot 1 (Bottom Left) */}
                            <line stroke="#374151" strokeDasharray="4 4" strokeWidth="1" x1="20%" x2="35%" y1="65%" y2="55%"></line>
                            {/* Connection Line for Hotspot 2 (Top Right) */}
                            <line stroke="#374151" strokeDasharray="4 4" strokeWidth="1" x1="75%" x2="68%" y1="30%" y2="45%"></line>
                        </svg>

                        {/* Nodes Container (Grid-like placement) */}
                        <div className="relative w-full h-full grid grid-cols-5 grid-rows-3 items-center justify-items-center z-10">

                            {/* NODE 1: User Input */}
                            <div className="col-start-1 row-start-2 flex flex-col items-center gap-3 group/node">
                                <div className="w-16 h-16 rounded-full bg-[#0E1217] border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all duration-300 group-hover/node:scale-110 group-hover/node:shadow-[0_0_25px_rgba(0,229,255,0.6)]">
                                    <span className="material-symbols-outlined text-primary text-3xl">person</span>
                                </div>
                                <div className="text-xs font-mono text-text-muted bg-[#0E1217] px-2 py-1 rounded border border-white/5">Trigger: Lead</div>
                            </div>

                            {/* NODE 2: The Orchestrator (Center) */}
                            <div className="col-start-3 row-start-2 flex flex-col items-center gap-4 group/node relative">
                                {/* Pulsing Ring */}
                                <div className="absolute inset-0 rounded-xl border border-primary/30 animate-pulse-glow -z-10 bg-primary/5"></div>
                                <div className="w-24 h-24 rounded-xl bg-[#0E1217] border border-primary flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)] z-10 transition-transform duration-300 group-hover/node:scale-105">
                                    <span className="material-symbols-outlined text-white text-4xl">neurology</span>
                                </div>
                                <div className="text-sm font-bold text-white bg-[#0E1217] px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">Orquestrador LLM</div>
                            </div>

                            {/* NODE 3: Vector Memory (Top Right Offset) */}
                            <div className="col-start-4 row-start-1 translate-y-8 translate-x-4 flex flex-col items-center gap-3 group/node">
                                <div className="w-16 h-16 rounded-lg bg-[#0E1217] border border-accent/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,148,0.1)] transition-all duration-300 group-hover/node:-translate-y-1 group-hover/node:shadow-[0_0_20px_rgba(0,255,148,0.4)]">
                                    <span className="material-symbols-outlined text-accent text-3xl">database</span>
                                </div>
                                <div className="text-xs font-mono text-text-muted">Vector DB</div>
                            </div>

                            {/* NODE 4: Output / Action (Right) */}
                            <div className="col-start-5 row-start-2 flex flex-col items-center gap-3 group/node">
                                <div className="w-16 h-16 rounded-full bg-[#0E1217] border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/node:border-accent group-hover/node:text-accent group-hover/node:shadow-[0_0_20px_rgba(0,255,148,0.3)] text-white">
                                    <span className="material-symbols-outlined text-3xl">send</span>
                                </div>
                                <div className="text-xs font-mono text-text-muted">Action: Reply</div>
                            </div>

                        </div>

                        {/* Hotspot 1: Orquestração (Floating Bottom Left) */}
                        <div className="absolute bottom-[15%] left-[10%] md:left-[15%] max-w-[200px] animate-float glass-panel p-4 rounded-lg z-20 pointer-events-none md:pointer-events-auto">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary text-sm">settings_suggest</span>
                                <h3 className="font-display text-sm font-bold text-white">Engenharia de Prompt</h3>
                            </div>
                            <p className="text-[11px] text-text-muted leading-relaxed">
                                Fluxos complexos geridos sem intervenção humana. Decisões baseadas em lógica rígida.
                            </p>
                        </div>

                        {/* Hotspot 2: Memória (Floating Top Right) */}
                        <div className="absolute top-[15%] right-[10%] md:right-[15%] max-w-[200px] animate-float glass-panel p-4 rounded-lg z-20 pointer-events-none md:pointer-events-auto" style={{ animationDelay: '1.5s' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-accent text-sm">memory</span>
                                <h3 className="font-display text-sm font-bold text-white">Memória Infinita</h3>
                            </div>
                            <p className="text-[11px] text-text-muted leading-relaxed">
                                Recuperação vetorial de todo histórico do cliente para contexto imediato.
                            </p>
                        </div>

                        {/* Hotspot 3: Output (Floating Right) */}
                        <div className="absolute bottom-[20%] right-[5%] md:right-[5%] max-w-[180px] animate-float glass-panel p-3 rounded-lg z-20 pointer-events-none md:pointer-events-auto hidden md:block" style={{ animationDelay: '2.5s' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-white text-xs">hub</span>
                                <h3 className="font-display text-xs font-bold text-white">Omnichannel</h3>
                            </div>
                            <div className="flex gap-2 mt-2 opacity-60">
                                <span className="material-symbols-outlined text-[16px]">chat</span>
                                <span className="material-symbols-outlined text-[16px]">mail</span>
                                <span className="material-symbols-outlined text-[16px]">api</span>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Gradient Fade */}
                    <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-background-dark to-transparent pointer-events-none z-30"></div>
                </div>

                {/* Feature Grid (Sub-explanation) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pb-16">
                    {/* Feature 1 */}
                    <div className="group p-6 rounded-xl border border-white/5 bg-surface hover:border-primary/50 transition-colors duration-300">
                        <div className="w-10 h-10 rounded-lg bg-deep-navy flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">precision_manufacturing</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-white mb-2">Zero Alucinação</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Nossos agentes não "criam". Eles seguem instruções precisas de engenharia para executar tarefas críticas sem erros.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group p-6 rounded-xl border border-white/5 bg-surface hover:border-accent/50 transition-colors duration-300">
                        <div className="w-10 h-10 rounded-lg bg-deep-navy flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                            <span className="material-symbols-outlined text-accent group-hover:text-white transition-colors">bolt</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-white mb-2">Latência Mínima</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Infraestrutura otimizada em Edge Computing para respostas instantâneas, não importa a carga de requisições.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group p-6 rounded-xl border border-white/5 bg-surface hover:border-primary/50 transition-colors duration-300">
                        <div className="w-10 h-10 rounded-lg bg-deep-navy flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">security</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-white mb-2">Segurança Total</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Seus dados não treinam modelos públicos. Ambientes isolados (VPC) para máxima privacidade corporativa.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    )
}
