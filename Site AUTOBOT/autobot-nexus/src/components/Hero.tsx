export default function Hero() {
    return (
        <main className="relative z-10 flex flex-col justify-center min-h-screen pt-16">
            <div className="container mx-auto px-6 lg:px-12 h-full">
                <div className="flex flex-col lg:flex-row items-center h-full gap-12 lg:gap-20 py-12 lg:py-0">

                    {/* Left Column: Content */}
                    <div className="flex-1 flex flex-col justify-center space-y-8 max-w-2xl">
                        <div className="space-y-6">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 w-fit">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                <span className="text-xs font-medium text-text-muted uppercase tracking-wider font-body">Sistema Online</span>
                            </div>

                            {/* H1 */}
                            <h1 className="font-display font-bold text-5xl lg:text-7xl leading-[1.1] tracking-tight">
                                Sua Operação em <br />
                                <span className="text-gradient">Piloto Automático.</span>
                            </h1>

                            {/* Subhead */}
                            <p className="text-text-muted text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                                Agentes inteligentes que triam, respondem e resolvem. Produtividade máxima, <span className="text-white font-normal">zero alucinação</span>.
                            </p>
                        </div>

                        {/* CTA Group */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-primary text-primary font-bold text-base rounded-md overflow-hidden transition-all duration-300 hover:shadow-glow-primary hover:bg-primary/5">
                                <span className="relative z-10">Agende um Diagnóstico</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>

                            <div className="flex items-center gap-4 px-4 py-2 opacity-80">
                                <div className="flex -space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 border border-black flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                                    <div className="w-8 h-8 rounded-full bg-slate-600 border border-black flex items-center justify-center text-[10px] text-white font-bold">AM</div>
                                    <div className="w-8 h-8 rounded-full bg-slate-500 border border-black flex items-center justify-center text-[10px] text-white font-bold">+4</div>
                                </div>
                                <span className="text-sm text-text-muted">Empresas conectadas</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual (Network Node) */}
                    <div className="flex-1 w-full flex items-center justify-center lg:justify-end relative min-h-[400px] lg:min-h-[600px]">
                        {/* Abstract Schematic Visualization */}
                        <div className="relative w-full max-w-[500px] aspect-square">

                            {/* Central Core */}
                            <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm z-20 flex items-center justify-center animate-float">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-transparent border border-primary/50 flex items-center justify-center shadow-glow-primary">
                                    <span className="material-symbols-outlined text-primary text-4xl">hub</span>
                                </div>
                            </div>

                            {/* Orbit Rings */}
                            <div className="absolute inset-0 m-auto w-[60%] h-[60%] rounded-full border border-dashed border-white/10 animate-[spin_20s_linear_infinite] z-10"></div>
                            <div className="absolute inset-0 m-auto w-[90%] h-[90%] rounded-full border border-white/5 z-0"></div>

                            {/* Floating Nodes (Satellites) */}
                            {/* Node 1: Top Right (Data) */}
                            <div className="absolute top-[15%] right-[10%] p-3 rounded-lg bg-surface border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-3 animate-float-delayed z-30">
                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-sm">database</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-text-muted tracking-wider">Memória</span>
                                    <span className="text-xs font-bold text-white font-display">Vector DB Ready</span>
                                </div>
                                {/* Connector Line */}
                                <div className="absolute bottom-0 left-0 w-[1px] h-[100px] bg-gradient-to-b from-primary/20 to-transparent origin-bottom rotate-45 transform translate-y-full -translate-x-full -z-10"></div>
                            </div>

                            {/* Node 2: Bottom Left (Agent) */}
                            <div className="absolute bottom-[20%] left-[5%] p-3 rounded-lg bg-surface border border-accent/30 backdrop-blur-md shadow-lg flex items-center gap-3 animate-float z-30">
                                <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center animate-pulse-glow">
                                    <span className="material-symbols-outlined text-accent text-sm">smart_toy</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase text-text-muted tracking-wider">Agente Ativo</span>
                                    <span className="text-xs font-bold text-accent font-display">Triagem 98%</span>
                                </div>
                            </div>

                            {/* Node 3: Bottom Right (Output) */}
                            <div className="absolute bottom-[10%] right-[20%] p-2 rounded bg-surface/80 border border-white/10 backdrop-blur-sm z-20">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    <span className="text-[10px] font-mono text-primary">PROCESSING...</span>
                                </div>
                            </div>

                            {/* Connecting Lines (SVG Overlay) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30" viewBox="0 0 500 500">
                                <path d="M250 250 L 380 120" stroke="#00E5FF" strokeDasharray="4 4" strokeWidth="1"></path>
                                <path d="M250 250 L 120 380" stroke="#00FF94" strokeWidth="1"></path>
                                <circle cx="380" cy="120" fill="#00E5FF" r="3"></circle>
                                <circle cx="120" cy="380" fill="#00FF94" r="3"></circle>
                            </svg>

                            {/* Abstract Gradient Glow behind object */}
                            <div className="absolute inset-0 m-auto w-full h-full bg-primary rounded-full opacity-5 blur-[80px] z-0"></div>
                        </div>

                        {/* Code Snippet Decorator (Far Right Edge) */}
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden xl:block opacity-20 pointer-events-none">
                            <div className="font-mono text-xs text-primary leading-loose">
                                <div>&lt;Protocol type="neural"&gt;</div>
                                <div className="pl-4">&lt;Agent id="AYA-01" /&gt;</div>
                                <div className="pl-4">&lt;Status&gt;ONLINE&lt;/Status&gt;</div>
                                <div className="pl-4">&lt;Latency&gt;12ms&lt;/Latency&gt;</div>
                                <div>&lt;/Protocol&gt;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
