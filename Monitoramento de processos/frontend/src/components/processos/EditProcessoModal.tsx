import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditProcessoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    processo: any | null; // inclui subprocessos: { id, status }[]
}

export function EditProcessoModal({ open, onOpenChange, onSuccess, processo }: EditProcessoModalProps) {
    const [loading, setLoading] = useState(false);

    const [dataProcesso, setDataProcesso] = useState('');
    const [numeroOficio, setNumeroOficio] = useState('');
    const [assunto, setAssunto] = useState('');
    const [destinatario, setDestinatario] = useState('');
    const [orgao, setOrgao] = useState('');
    const [numeroSei, setNumeroSei] = useState('');
    const [prioridade, setPrioridade] = useState(false);
    const [tipoFluxo, setTipoFluxo] = useState('EXTERNO - ENVIADOS');
    const [status, setStatus] = useState('pendente');

    useEffect(() => {
        if (processo && open) {
            setDataProcesso(processo.data_processo || '');
            setNumeroOficio(processo.numero_oficio || '');
            setAssunto(processo.assunto || '');
            setDestinatario(processo.destinatario || '');
            setOrgao(processo.orgao || '');
            setNumeroSei(processo.numero_sei || '');
            setPrioridade(processo.prioridade || false);
            setTipoFluxo(processo.tipo_fluxo || 'EXTERNO - ENVIADOS');
            setStatus(processo.status || 'pendente');
        }
    }, [processo, open]);

    // Gera linhas de log comparando antes/depois
    const gerarLogAlteracoes = (): string[] => {
        const labels: Record<string, { label: string; antes: any; depois: any }> = {
            data_processo: { label: 'Data', antes: processo?.data_processo, depois: dataProcesso || null },
            numero_oficio: { label: 'Número do Ofício', antes: processo?.numero_oficio, depois: numeroOficio || null },
            assunto: { label: 'Assunto', antes: processo?.assunto, depois: assunto || null },
            destinatario: { label: 'Destinatário', antes: processo?.destinatario, depois: destinatario || null },
            orgao: { label: 'Órgão', antes: processo?.orgao, depois: orgao || null },
            numero_sei: { label: 'Número SEI', antes: processo?.numero_sei, depois: numeroSei || null },
            prioridade: { label: 'Prioridade', antes: processo?.prioridade, depois: prioridade },
            tipo_fluxo: { label: 'Tipo / Fluxo', antes: processo?.tipo_fluxo, depois: tipoFluxo || null },
            status: { label: 'Status', antes: processo?.status, depois: status || null },
        };
        const normaliza = (v: any) => (v === null || v === undefined || v === '') ? '(vazio)' : String(v);
        const logs: string[] = [];
        for (const [campo, { label, antes, depois }] of Object.entries(labels)) {
            if (normaliza(antes) !== normaliza(depois)) {
                let textoAntes = normaliza(antes);
                let textoDepois = normaliza(depois);
                if (campo === 'data_processo') {
                    if (antes) textoAntes = new Date(antes).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                    if (depois) textoDepois = new Date(depois).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                }
                if (campo === 'prioridade') {
                    textoAntes = antes ? 'Sim (Prioritário)' : 'Não';
                    textoDepois = depois ? 'Sim (Prioritário)' : 'Não';
                }
                logs.push(`Campo "${label}" alterado: "${textoAntes}" → "${textoDepois}"`);
            }
        }
        return logs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!numeroSei.trim()) {
            toast.error('O número SEI é obrigatório.');
            return;
        }

        // Bloquear conclusão se houver subprocessos pendentes
        if (status === 'concluido') {
            const subs: any[] = processo?.subprocessos || [];
            const pendentes = subs.filter((s: any) => s.status !== 'concluido');
            if (pendentes.length > 0) {
                toast.error(`Não é possível concluir: existem ${pendentes.length} subprocesso(s) ainda em aberto.`);
                return;
            }
        }

        setLoading(true);
        try {
            if (!processo?.id) return;

            const { error } = await supabase.from('processos').update({
                data_processo: dataProcesso || null,
                numero_oficio: numeroOficio || null,
                assunto: assunto || null,
                destinatario: destinatario || null,
                orgao: orgao || null,
                numero_sei: numeroSei,
                prioridade,
                tipo_fluxo: tipoFluxo || null,
                status: status || 'pendente'
            }).eq('id', processo.id);

            if (error) {
                if (error.code === '23505') {
                    throw new Error('Já existe um processo com este Número SEI.');
                }
                throw error;
            }

            // Gerar e inserir log de alterações
            const linhasLog = gerarLogAlteracoes();
            if (linhasLog.length > 0) {
                const logTexto = `Processo editado:\n${linhasLog.join('\n')}`;
                await supabase.from('historico_logs').insert({
                    processo_id: processo.id,
                    log_texto: logTexto,
                });
            }

            toast.success('Processo atualizado com sucesso!');
            onSuccess();
            onOpenChange(false);

            // Reset form
            setDataProcesso('');
            setNumeroOficio('');
            setAssunto('');
            setDestinatario('');
            setOrgao('');
            setNumeroSei('');
            setPrioridade(false);
            setTipoFluxo('EXTERNO - ENVIADOS');
            setStatus('pendente');

        } catch (err: any) {
            console.error('Erro ao adicionar processo', err);

            // Tratamento de erro RLS (Row-Level Security) em PT-BR
            if (err.message && err.message.includes('row-level security')) {
                toast.error('Erro de permissão: Você não possui acesso para cadastrar novos processos.');
            } else {
                toast.error(err.message || 'Erro ao adicionar o processo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl text-foreground">Editar Processo: {processo?.numero_sei}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-foreground">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-1">Status Atual</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-input/50 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground"
                        >
                            <option value="pendente">Pendente</option>
                            <option value="em espera">Em Espera</option>
                            <option value="ativo">Ativo</option>
                            <option value="concluido">Concluído</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Data</label>
                            <input
                                type="date"
                                required
                                value={dataProcesso}
                                onChange={(e) => setDataProcesso(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground dark:[color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Número do Ofício</label>
                            <input
                                type="text"
                                value={numeroOficio}
                                required
                                onChange={(e) => setNumeroOficio(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                placeholder="000/2026"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Número SEI *</label>
                            <input
                                type="text"
                                required
                                value={numeroSei}
                                onChange={(e) => setNumeroSei(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                placeholder="0000.000000/0000-00"
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-foreground mb-1">Assunto</label>
                            <input
                                type="text"
                                required
                                value={assunto}
                                onChange={(e) => setAssunto(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                placeholder="Assunto do processo..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-1">Destinatário</label>
                            <input
                                type="text"
                                required
                                value={destinatario}
                                onChange={(e) => setDestinatario(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                placeholder="Destinatário"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Órgão</label>
                            <input
                                type="text"
                                required
                                value={orgao}
                                onChange={(e) => setOrgao(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                placeholder="Ex: SMAMS"
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-foreground mb-1">Tipo / Fluxo</label>
                            <select
                                value={tipoFluxo}
                                onChange={(e) => setTipoFluxo(e.target.value)}
                                className="w-full bg-input/50 border border-border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary text-foreground appearance-none"
                            >
                                <option value="EXTERNO - ENVIADOS">EXTERNO - ENVIADOS</option>
                                <option value="INTERNO - ENVIADOS">INTERNO - ENVIADOS</option>
                                <option value="INTERNO - RECEBIDOS">INTERNO - RECEBIDOS</option>
                                <option value="PAD">PAD</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 pt-2 pb-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={prioridade}
                                onChange={(e) => setPrioridade(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-danger"></div>
                            <span className="ml-3 text-sm font-semibold text-foreground">SIM, ESTE É UM PROCESSO PRIORITÁRIO.</span>
                        </label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-border mt-4">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-input/50 transition-colors text-foreground"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center min-w-[120px] px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar Dados'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
