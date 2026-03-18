export default function Contact() {
    return (
        <div className="flex-grow flex items-center justify-center relative overflow-hidden py-16 px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-[0.15]"></div>
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]"></div>
            </div>

            {/* The Handshake Component */}
            <div className="relative z-10 w-full max-w-xl">

                {/* Terminal Header Decorator */}
                <div className="flex justify-between items-end mb-4 px-1">
                    <div className="font-mono text-xs text-primary/80 tracking-widest uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        [ SYSTEM_ACCESS_GRANTED ]
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                        ID: #8X-2910 // V.4.2
                    </div>
                </div>

                {/* Terminal Container */}
                <div className="bg-[#000000] border border-surface-border rounded-lg shadow-2xl overflow-hidden relative group">

                    {/* Top Bar */}
                    <div className="h-8 bg-surface border-b border-surface-border flex items-center px-4 justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                            secure_uplink.sh
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 md:p-10 space-y-8">
                        <div className="space-y-2">
                            <h1 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Iniciar Protocolo
                            </h1>
                            <p className="text-sm text-slate-400 font-mono border-l-2 border-primary/30 pl-3">
                                Preencha os dados abaixo para iniciar a triagem automática de viabilidade.
                            </p>
                        </div>

                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

                            {/* Input Group: Nome */}
                            <div className="relative group">
                                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-primary transition-colors" htmlFor="name">
                  // Nome do Operador
                                </label>
                                <div className="relative">
                                    <span className="absolute left-0 top-2 text-slate-600 font-mono text-sm">&gt;</span>
                                    <input autoComplete="off" className="w-full bg-transparent border-0 border-b border-surface-border text-slate-200 placeholder-slate-700 pl-6 py-2 focus:ring-0 focus:border-primary font-mono text-sm transition-all duration-300" id="name" placeholder="Digite seu nome completo..." type="text" />
                                </div>
                            </div>

                            {/* Input Group: Empresa */}
                            <div className="relative group">
                                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-primary transition-colors" htmlFor="company">
                  // Organização
                                </label>
                                <div className="relative">
                                    <span className="absolute left-0 top-2 text-slate-600 font-mono text-sm">&gt;</span>
                                    <input autoComplete="off" className="w-full bg-transparent border-0 border-b border-surface-border text-slate-200 placeholder-slate-700 pl-6 py-2 focus:ring-0 focus:border-primary font-mono text-sm transition-all duration-300" id="company" placeholder="Nome da empresa..." type="text" />
                                </div>
                            </div>

                            {/* Grid for 2 columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Input Group: WhatsApp */}
                                <div className="relative group">
                                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-primary transition-colors" htmlFor="whatsapp">
                    // Frequência (WhatsApp)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-0 top-2 text-slate-600 font-mono text-sm">&gt;</span>
                                        <input autoComplete="off" className="w-full bg-transparent border-0 border-b border-surface-border text-slate-200 placeholder-slate-700 pl-6 py-2 focus:ring-0 focus:border-primary font-mono text-sm transition-all duration-300" id="whatsapp" placeholder="+55 (XX) XXXXX..." type="tel" />
                                    </div>
                                </div>

                                {/* Input Group: Volume Mensal */}
                                <div className="relative group">
                                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-primary transition-colors" htmlFor="volume">
                    // Volume de Dados
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-0 top-2 text-slate-600 font-mono text-sm">&gt;</span>
                                        <input autoComplete="off" className="w-full bg-transparent border-0 border-b border-surface-border text-slate-200 placeholder-slate-700 pl-6 py-2 focus:ring-0 focus:border-primary font-mono text-sm transition-all duration-300" id="volume" placeholder="Est. mensal..." type="number" />
                                    </div>
                                </div>
                            </div>

                            {/* Input Group: Gargalo (Select) */}
                            <div className="relative group">
                                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-primary transition-colors" htmlFor="bottleneck">
                  // Selecionar Vetor Crítico
                                </label>
                                <div className="relative">
                                    <span className="absolute left-0 top-2 text-slate-600 font-mono text-sm">&gt;</span>
                                    <select className="w-full bg-transparent border-0 border-b border-surface-border text-slate-200 pl-6 py-2 focus:ring-0 focus:border-primary font-mono text-sm transition-all duration-300 cursor-pointer appearance-none" id="bottleneck" defaultValue="">
                                        <option className="bg-surface text-slate-500" disabled value="">[ Selecione o maior gargalo ]</option>
                                        <option className="bg-surface" value="atendimento">Triagem de Atendimento</option>
                                        <option className="bg-surface" value="licitacao">Processamento de Documentos</option>
                                        <option className="bg-surface" value="agendamento">Agendamento & Follow-up</option>
                                        <option className="bg-surface" value="integracao">Integração de Sistemas Legados</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-0 top-2 text-slate-600 pointer-events-none text-sm">expand_more</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button className="relative w-full overflow-hidden group/btn rounded bg-gradient-to-r from-primary to-blue-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark" type="submit">
                                    <div className="relative bg-black/20 hover:bg-transparent transition-colors duration-300 rounded-[3px] py-4 px-6 flex items-center justify-center gap-3">
                                        <span className="font-display font-bold text-background-dark text-base tracking-wide uppercase group-hover/btn:text-white transition-colors duration-300">
                                            Ativar Automação
                                        </span>
                                        <span className="material-symbols-outlined text-background-dark group-hover/btn:text-white transition-colors duration-300 text-lg">
                                            bolt
                                        </span>
                                    </div>
                                </button>

                                {/* Micro-copy */}
                                <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500 font-mono">
                                    <span className="material-symbols-outlined text-sm text-accent">verified_user</span>
                                    <p>
                                        <span className="text-accent">STATUS:</span> Ao enviar, nossa automação iniciará a análise e entrará em contato em &lt; 2 minutos.
                                    </p>
                                </div>
                            </div>

                        </form>
                    </div>

                    {/* Decorative corner accents */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-lg pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-700/50 rounded-tl-lg pointer-events-none"></div>
                </div>
            </div>
        </div>
    )
}
