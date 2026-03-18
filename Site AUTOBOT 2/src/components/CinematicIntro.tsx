import React from 'react';

const CinematicIntro: React.FC = () => {
    return (
        <main className="flex flex-1 flex-col items-center justify-center py-20 relative min-h-screen">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 bg-brand-dark">
                {/* Abstract circuit pattern overlay */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#06e0f9 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
                {/* Central Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-brand-cyan/20 via-brand-dark/80 to-brand-dark"></div>
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent"></div>
            </div>

            <div className="relative z-10 flex w-full max-w-7xl flex-col items-center px-4 md:px-10">
                {/* Hero Content */}
                <div className="mt-10 flex flex-col items-center text-center">
                    {/* 3D Logo Visualization Placeholder */}
                    <div className="relative mb-12 flex items-center justify-center">
                        {/* Outer Glow Ring */}
                        <div className="absolute h-64 w-64 rounded-full bg-brand-cyan/20 blur-[60px] md:h-96 md:w-96"></div>

                        {/* Logo Structure */}
                        <div className="relative flex h-48 w-48 items-center justify-center md:h-64 md:w-64">
                            {/* Hexagon SVG Shape simulating the 3D logo */}
                            <svg className="h-full w-full drop-shadow-[0_0_15px_rgba(6,224,249,0.6)] text-brand-cyan fill-transparent stroke-current stroke-2" viewBox="0 0 200 200">
                                <path d="M100 10 L190 55 L190 145 L100 190 L10 145 L10 55 Z" strokeWidth="2"></path>
                                <circle className="opacity-80" cx="100" cy="100" r="30" strokeWidth="2"></circle>
                                <circle className="fill-brand-cyan blur-[2px]" cx="100" cy="10" r="6"></circle>
                                <circle className="fill-brand-cyan blur-[2px]" cx="190" cy="145" r="6"></circle>
                                <circle className="fill-brand-cyan blur-[2px]" cx="10" cy="145" r="6"></circle>
                                {/* Inner Circuit Lines */}
                                <path className="opacity-50" d="M100 40 L100 70" strokeWidth="1"></path>
                                <path className="opacity-50" d="M100 130 L100 160" strokeWidth="1"></path>
                                <path className="opacity-50" d="M70 100 L40 100" strokeWidth="1"></path>
                                <path className="opacity-50" d="M130 100 L160 100" strokeWidth="1"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-6xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">memory</span>
                            </div>
                        </div>
                    </div>

                    {/* Typography */}
                    <h1 className="mb-6 max-w-4xl text-5xl font-black leading-tight tracking-tighter text-white md:text-7xl lg:text-8xl" style={{ textShadow: "0 0 20px rgba(6, 224, 249, 0.5)" }}>
                        The Awakening<br />of Automation
                    </h1>
                    <p className="mb-10 max-w-2xl text-lg font-light leading-relaxed text-slate-300 md:text-xl">
                        Precision AI workflows powered by n8n. Step into the future of enterprise efficiency where intelligence meets execution.
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <button className="group relative flex h-14 items-center justify-center overflow-hidden rounded-lg bg-brand-cyan px-8 text-base font-bold text-brand-dark shadow-[0_0_20px_rgba(6,224,249,0.4)] transition-all hover:bg-brand-cyan/90 hover:shadow-[0_0_30px_rgba(6,224,249,0.6)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Enter Experience
                                <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </span>
                        </button>
                        <button className="group flex h-14 items-center justify-center rounded-lg border border-slate-700 bg-brand-dark/50 px-8 text-base font-medium text-slate-300 backdrop-blur-sm transition-all hover:border-brand-cyan/50 hover:bg-brand-cyan/10 hover:text-white">
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">play_circle</span>
                                Watch Demo
                            </span>
                        </button>
                    </div>

                    {/* Tech Stack Badge */}
                    <div className="mt-16 flex items-center gap-4 rounded-full border border-slate-800 bg-slate-900/50 px-6 py-2 backdrop-blur-md">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Powered by</span>
                        <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
                            <div className="flex items-center gap-1 text-white font-bold text-sm">
                                <span className="text-[#FF6584]">n8n</span>
                            </div>
                            <div className="flex items-center gap-1 text-white font-bold text-sm">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">OpenAI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CinematicIntro;
