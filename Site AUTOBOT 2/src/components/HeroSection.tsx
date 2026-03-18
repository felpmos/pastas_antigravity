import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="relative flex-grow flex items-center justify-center overflow-hidden py-12 md:py-20 lg:py-32 px-6">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#060ae0]/20 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-[1200px] w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

                {/* Left Column: Content */}
                <div className="flex flex-col items-start gap-8 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                        n8n Automation Expert
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
                        Evolua sua <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-cyan/80">Operação</span> com <br />
                        IA de Precisão
                    </h1>

                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg">
                        Automatize fluxos de trabalho complexos com a potência do n8n e inteligência artificial avançada para escalar sem limites.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                        <button className="group relative flex items-center justify-center h-14 px-8 rounded-lg bg-brand-cyan text-brand-dark text-base font-bold transition-all hover:scale-[1.02] shadow-[0_0_25px_-5px_rgba(6,224,249,0.5)] overflow-hidden border border-brand-cyan">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                            <span className="relative z-10 mr-2">Ver Automações em Ação</span>
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1 relative z-10">arrow_forward</span>
                        </button>

                        <button className="flex items-center justify-center h-14 px-8 rounded-lg bg-brand-gray border border-white/10 hover:border-brand-cyan/50 text-white text-base font-medium transition-all hover:bg-white/5">
                            <span className="material-symbols-outlined mr-2 text-brand-cyan">play_circle</span>
                            Demo em Vídeo
                        </button>
                    </div>

                    <div className="flex items-center gap-6 pt-8 border-t border-white/5 w-full">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAs5egkVJGxd0Zn3ifU3qEXeZpsK4_176jLv3PZrCzY9uwCAl4a3HcGt9WDsNVPvdnnz7shiZZQzTr98rdBxFwureU-v4PH92BGpvl12RYv7kXsD5o5hWmo-zqejekl8m-HKXxANMDAoCkcfk5-xlf81Rq_JIeCB9xKQznu5_2DUsk8sxCvnp6dBQ8XZaNuv1MwO0xQRZcS-UFGNOwgfiH9adbnS2rYW8jA71q_ABqDWt3q4Hwan7CDP6mC2dOhGKSoojQ3AuEVWlj4')" }}></div>
                            <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-slate-600 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC95QZ9FJlsWG5Si8BhZ9oNt0UX70RANhEGGPbo_cZj8KfDXSnncR0cTrQMZu5G45bpdxoofEBznewEzjBAL6-JGHCx8naeCSNc5pba6QtujL0v9-Q7IAt2ACNcN6z-rKDr0txsFHVj3DcGWMXJ2OjTbtcg6BrnpK28XBN_OpclgGwqyDR8hIEqQGaoWtTwcdYFhYQwfHXQ2UPYBAwYsUAqEl9Ty_-cotYz1cgGfIjL7Cy9CGJxCRwNu8Zia4ROugPYOcwwfMIJ3WQ5')" }}></div>
                            <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-slate-500 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWf5Xp3xTKh-I5ChZGh9KF_LmDfn4Ie4_H-_dJKKZD4jRew8zAa7FyMRg1LG5e9m5pkQmPDeR8-upU-e1r9LlfF9Omg82ckF-3j8VD7INt8O0plYfEGlCu5wjxn-itpFmXJsD0jIRQQ1vLIc4PMJPVbTvV1BPJYl2_16Q4gWzBzFQSZWB_Slhw6cF2xoH-dfx1E5hJxi2Gii3lVAYQUHs44wXLjqPGtcF-IBFJ7dVx2nTgoTkDbV3iOyn0Iw7odOkQ8R3IP2uTzgK8')" }}></div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="text-white font-bold">500+</span>
                                <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                            </div>
                            <span className="text-slate-500 text-sm">Empresas automatizadas</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visual */}
                <div className="relative w-full h-full min-h-[400px] flex items-center justify-center lg:justify-end">
                    <div className="relative w-full aspect-square max-w-[600px]">
                        {/* Main Visual Card */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#032846] to-brand-dark border border-white/10 shadow-2xl group">
                            {/* Background Grid Pattern */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#06e0f9 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

                            {/* 3D Render Image */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7MgNvw1WeLhLLb3yhT_u6YPWr5G_8sgu5hWdkNR9XcWEkkKL1z1kZuw1GapZcs47r48eJ7FIeRVGdsf4Vd1E0EeC0VkUn4qwrzuZv6j_Fw-7Mzt8IHHNHFg-qy_VdrIzvtnfguqaVcXGys7qIM8GwTYAgF4E3ti8z8_gpBllpL83fU9cNFC8smgWO8ft3LSDVfiBhr825XQ5kxRxVvUdCIS4oqyeu40iKFRlD7D2GA5jDnGrSyTsWvBZj26TCc9-T1ndD3x9O7cAn')" }}>
                                </div>
                            </div>

                            {/* Overlay UI Elements mimicking HUD */}
                            <div className="absolute top-6 left-6 p-3 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-mono text-green-400">SYSTEM OPTIMIZED</span>
                            </div>

                            <div className="absolute bottom-8 right-8 left-8 p-4 rounded-xl bg-brand-dark/80 backdrop-blur-lg border border-brand-cyan/30 flex items-center justify-between gap-4 shadow-lg translate-y-4 opacity-0 animate-[slideUp_0.8s_ease-out_0.5s_forwards]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-brand-cyan/20 text-brand-cyan">
                                        <span className="material-symbols-outlined">network_node</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Workflow Status</span>
                                        <span className="text-sm font-bold text-white">Processing Data...</span>
                                    </div>
                                </div>
                                <div className="text-brand-cyan font-mono text-sm">99.8%</div>
                            </div>
                        </div>

                        {/* Floating decorative elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand-cyan to-transparent rounded-full opacity-20 blur-xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-cyan rounded-full opacity-10 blur-2xl"></div>
                    </div>
                </div>

            </div>

            <style>{`
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
};

export default HeroSection;
