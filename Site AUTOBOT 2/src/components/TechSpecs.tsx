import React from 'react';

const TechSpecs: React.FC = () => {
    return (
        <section className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-16">
            {/* Page Header */}
            <div className="flex flex-col gap-4 mb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>Tech Specs</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-brand-cyan">Glow & Pulse Logic</span>
                </div>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Glow & Pulse Logic</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            Technical specifications for implementing AutoBot's signature glow and pulse animations. These effects utilize hardware-accelerated CSS properties and Framer Motion orchestration to ensure 60fps performance on all devices.
                        </p>
                    </div>
                </div>
            </div>

            {/* Card Hover State Section */}
            <section className="mb-12">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded bg-brand-cyan/20 text-brand-cyan">
                        <span className="material-symbols-outlined text-[20px]">style</span>
                    </span>
                    Card Hover State
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual Component */}
                    <div className="flex flex-col">
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-brand-gray p-8 md:p-12 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
                            {/* Background Grid Pattern */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#9aafbc 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

                            {/* The Interactive Card */}
                            <div className="relative w-full max-w-sm rounded-xl bg-brand-dark border border-white/10 p-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,224,249,0.4)] hover:border-brand-cyan cursor-pointer group/card z-10">
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-brand-dark">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-cyan/30 opacity-80"></div>
                                    <img className="object-cover w-full h-full opacity-60 mix-blend-overlay group-hover/card:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSj8LhOhQY2Z2SrHhbxH61_dvK-MUoWU8KvNUbnsxU2n70mTxLq3hP0PQ484It8QzGr_DullVT0dF1SA8IiwhG_x4BlKX9rx3s5WTAaWDEEnOwVc1X6MTeN-BylYz0z9h2hIj3a6AvMU-3l_md5rm0q4n4x3i4-OOSQjTrh9vauXIZNGu-ObsUieq57Di4NqRNovqjOEelX4yMBtUaSlMAtcg22-sB3mGO40fQA8ZWi50jiyTFJKylNDASt2Jwh-CS_7QT6PNcRgOw" alt="Cyberpunk grid landscape" />
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-[10px] text-brand-cyan font-bold border border-brand-cyan/30">
                                        V 2.0
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="h-1 w-12 bg-brand-cyan rounded-full mb-4 group-hover/card:w-20 transition-all duration-300"></div>
                                    <h4 className="text-white text-xl font-bold mb-2 group-hover/card:text-brand-cyan transition-colors">System Diagnostics</h4>
                                    <p className="text-slate-400 text-sm mb-4">Real-time monitoring of node performance and glowing border logic.</p>
                                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-700 border border-brand-dark"></div>
                                            <div className="w-6 h-6 rounded-full bg-slate-600 border border-brand-dark"></div>
                                        </div>
                                        <span className="text-xs text-brand-cyan font-medium flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                            Execute <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-brand-cyan"></span>
                                <span>Border: Primary Cyan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-brand-cyan/40"></span>
                                <span>Shadow: 20px Blur</span>
                            </div>
                        </div>
                    </div>

                    {/* Technical Diagram / Logic */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#0f1b23] rounded-xl border border-white/10 p-6 shadow-lg h-full">
                            <h4 className="text-lg font-bold text-white mb-6">Motion Variants (Framer Motion)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#0f1b23] p-4 rounded-lg border-l-2 border-brand-cyan">
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-2">Initial State</div>
                                    <div className="font-mono text-sm text-slate-200">
                                        opacity: 0<br />
                                        scale: 0.8<br />
                                        rotate: -10deg
                                    </div>
                                </div>
                                <div className="bg-[#0f1b23] p-4 rounded-lg border-l-2 border-green-500">
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-2">Animate State</div>
                                    <div className="font-mono text-sm text-slate-200">
                                        opacity: 1<br />
                                        scale: 1<br />
                                        rotate: 0deg<br />
                                        transition: &#123; duration: 0.6 &#125;
                                    </div>
                                </div>
                                <div className="bg-[#0f1b23] p-4 rounded-lg border-l-2 border-yellow-500">
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-2">Hover State</div>
                                    <div className="font-mono text-sm text-slate-200">
                                        scale: 1.05<br />
                                        boxShadow: "0px 0px 8px rgb(6,224,249)"
                                    </div>
                                </div>
                                <div className="bg-[#0f1b23] p-4 rounded-lg border-l-2 border-purple-500">
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-2">Pulse (Loop)</div>
                                    <div className="font-mono text-sm text-slate-200">
                                        scale: [1, 1.02, 1]<br />
                                        opacity: [1, 0.8, 1]<br />
                                        transition: &#123; repeat: Infinity, duration: 3 &#125;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default TechSpecs;
