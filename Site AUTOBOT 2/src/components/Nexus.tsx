import React from 'react';

const Nexus: React.FC = () => {
    return (
        <section className="w-full px-6 py-20 bg-[#050505]">
            <div className="max-w-xl mx-auto rounded-2xl bg-[#000000] border border-gray-800 p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col gap-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white tracking-tight font-display mb-2">Iniciar Protocolo de Atendimento</h2>
                        <p className="text-slate-400 text-sm">Operação estruturada. Zero alucinação.</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase text-slate-500 font-medium tracking-wider">Nome do Operador</label>
                            <input
                                type="text"
                                className="bg-transparent border-0 border-b border-gray-700 focus:border-brand-cyan focus:ring-0 px-0 py-2 text-white placeholder-slate-600 transition-colors"
                                placeholder="Insira seu nome"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase text-slate-500 font-medium tracking-wider">Empresa / Instituição</label>
                            <input
                                type="text"
                                className="bg-transparent border-0 border-b border-gray-700 focus:border-brand-cyan focus:ring-0 px-0 py-2 text-white placeholder-slate-600 transition-colors"
                                placeholder="Insira sua organização"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase text-slate-500 font-medium tracking-wider">WhatsApp</label>
                            <input
                                type="tel"
                                className="bg-transparent border-0 border-b border-gray-700 focus:border-brand-cyan focus:ring-0 px-0 py-2 text-white placeholder-slate-600 transition-colors"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase text-slate-500 font-medium tracking-wider">Maior Gargalo Atual</label>
                            <select className="bg-transparent border-0 border-b border-gray-700 focus:border-brand-cyan focus:ring-0 px-0 py-2 text-white transition-colors">
                                <option value="" className="bg-black text-slate-400">Selecione o problema primário</option>
                                <option value="atendimento" className="bg-black text-white">Atendimento / Suporte</option>
                                <option value="processos" className="bg-black text-white">Processos Manuais Repetitivos</option>
                                <option value="vendas" className="bg-black text-white">Vendas e CRM</option>
                                <option value="dados" className="bg-black text-white">Tratamento de Dados</option>
                            </select>
                        </div>

                        <button className="mt-6 w-full h-14 rounded bg-gradient-to-r from-brand-cyan to-blue-600 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(6,224,249,0.3)] hover:shadow-[0_0_30px_rgba(6,224,249,0.5)] transition-all">
                            Ativar Automação
                        </button>

                        <p className="text-center text-xs text-slate-600 mt-2">
                            Ao enviar, nossa própria automação iniciará a triagem em &lt; 2 minutos.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Nexus;
