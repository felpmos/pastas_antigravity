import React from 'react';

const SpecialistsGrid: React.FC = () => {
    const specialists = [
        {
            name: "Lia",
            role: "CRM Specialist",
            desc: "Manages customer relationships, updates records automatically, and schedules follow-ups with human-like empathy.",
            icon: "support_agent",
            status: "Online",
            color: "text-green-400",
            bg: "bg-green-500/10 border-green-500/20"
        },
        {
            name: "Marcus",
            role: "Data Analyst",
            desc: "Processes large datasets, generates insightful reports, and predicts trends with 99.9% accuracy.",
            icon: "analytics",
            status: "Idle",
            color: "text-slate-400",
            bg: "bg-slate-800 border-slate-700"
        },
        {
            name: "Evie",
            role: "Content Creator",
            desc: "Drafts engaging blog posts, social media captions, and email newsletters in your brand voice.",
            icon: "edit_note",
            status: "Online",
            color: "text-green-400",
            bg: "bg-green-500/10 border-green-500/20"
        },
        {
            name: "Rex",
            role: "Security Monitor",
            desc: "Continuously scans for vulnerabilities and monitors system health 24/7 with zero downtime.",
            icon: "shield",
            status: "Online",
            color: "text-green-400",
            bg: "bg-green-500/10 border-green-500/20"
        },
        {
            name: "Codex",
            role: "DevOps Engineer",
            desc: "Automates deployment pipelines, manages cloud infrastructure, and optimizes code performance.",
            icon: "code",
            status: "Training",
            color: "text-yellow-400",
            bg: "bg-yellow-500/10 border-yellow-500/20"
        },
        {
            name: "Nova",
            role: "Marketing Strategist",
            desc: "Analyzes market trends, optimizes ad spend, and generates comprehensive marketing campaign strategies.",
            icon: "rocket_launch",
            status: "Offline",
            color: "text-slate-400",
            bg: "bg-slate-800 border-slate-700"
        }
    ];

    return (
        <section className="w-full max-w-7xl px-6 py-24 mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                    Neural Network Active
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl leading-tight">
                    Deploy Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white">Autonomous Workforce</span>
                </h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mt-4">
                    Select from our grid of specialized AI agents designed to automate complex workflows with enterprise-grade precision.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialists.map((agent, i) => (
                    <div key={i} className="bg-brand-gray/60 backdrop-blur-md border border-white/5 group relative flex flex-col p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-cyan hover:shadow-[0_0_20px_rgba(6,224,249,0.2)]">
                        <div className="relative z-10 flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-brand-dark flex items-center justify-center text-slate-300 group-hover:text-white border border-white/10 group-hover:border-brand-cyan/30 transition-colors">
                                <span className="material-symbols-outlined text-[28px]">{agent.icon}</span>
                            </div>
                            <div className={`px-2 py-1 rounded border text-xs font-medium ${agent.bg} ${agent.color}`}>
                                {agent.status}
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col gap-2 mb-6">
                            <h3 className="text-white text-xl font-bold">{agent.name}</h3>
                            <p className="text-slate-400 font-medium text-sm group-hover:text-brand-cyan transition-colors">{agent.role}</p>
                            <p className="text-slate-400 text-sm leading-relaxed mt-2">
                                {agent.desc}
                            </p>
                        </div>

                        <div className="mt-auto relative z-10 pt-4 border-t border-white/5">
                            <button className="w-full h-10 rounded-lg bg-brand-dark hover:bg-black text-white text-sm font-bold transition-all border border-white/5 hover:border-white/10 flex items-center justify-center gap-2 group-hover:border-brand-cyan/30">
                                <span>View Details</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section >
    );
};

export default SpecialistsGrid;
