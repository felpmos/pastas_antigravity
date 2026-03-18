import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { supabase } from '../../lib/supabase';
import {
    Loader2, Edit2, Check, X,
    Layers, Paperclip, History, Info,
    PlusCircle, Trash2, Download, CheckCircle2, Circle
} from 'lucide-react';
import { toast } from 'sonner';

type Subprocesso = {
    id: string;
    titulo: string;
    descricao: string;
    status: string;
    data_vencimento: string;
    perfis?: { email: string };
};

type Comentario = {
    id: string;
    texto: string;
    criado_em: string;
    perfis?: { email: string };
};

type Anexo = {
    id: string;
    nome_arquivo: string;
    caminho_storage: string;
    tamanho_bytes: number;
    criado_em: string;
    perfis?: { email: string };
};

type ProcessoDetalhes = {
    id: string;
    numero_sei: string;
    status: string;
    acompanhamento: string;
    numero_oficio: string;
    destinatario: string;
    tipo_fluxo: string;
    origem: string;
    data_cobranca: string;
    prioridade: boolean;
    data_processo: string;
    assunto: string;
    orgao: string;
    historico_logs: { log_texto: string; criado_em: string; perfis: { email: string } }[];
    subprocessos: Subprocesso[];
    comentarios: Comentario[];
    arquivos_anexos: Anexo[];
};

interface ProcessoModalProps {
    processoId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ProcessoModal({ processoId, open, onOpenChange, onSuccess }: ProcessoModalProps) {
    const [processo, setProcesso] = useState<ProcessoDetalhes | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<ProcessoDetalhes>>({});
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'acompanhamento' | 'subs' | 'anexos' | 'logs'>('info');
    const [novoSub, setNovoSub] = useState({ titulo: '', descricao: '' });
    const [novoAcompanhamento, setNovoAcompanhamento] = useState('');
    const [uploadingAnexo, setUploadingAnexo] = useState(false);
    const [loadingSub, setLoadingSub] = useState<string | null>(null); // id do sub sendo atualizado

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !processo) return;
        setUploadingAnexo(true);
        try {
            const fileName = `${processo.id}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('anexos_processos')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });
            if (uploadError) throw uploadError;
            const { error: dbError } = await supabase.from('arquivos_anexos').insert({
                processo_id: processo.id,
                nome_arquivo: file.name,
                caminho_storage: fileName,
                tamanho_bytes: file.size
            });
            if (dbError) throw dbError;
            toast.success('Arquivo anexado com sucesso!');
            fetchProcesso();
        } catch (error: any) {
            console.error('Erro ao fazer upload:', error);
            toast.error('Erro ao anexar arquivo.');
        } finally {
            setUploadingAnexo(false);
            if (event.target) event.target.value = '';
        }
    };

    const handleDeleteAnexo = async (anexoId: string, caminho: string) => {
        if (!window.confirm('Deseja realmente excluir este anexo?')) return;
        try {
            await supabase.storage.from('anexos_processos').remove([caminho]);
            const { error } = await supabase.from('arquivos_anexos').delete().eq('id', anexoId);
            if (error) throw error;
            toast.success('Anexo removido!');
            fetchProcesso();
        } catch (err: any) {
            console.error(err);
            toast.error('Erro ao remover anexo.');
        }
    };

    const handleDownloadAnexo = async (caminho: string, nome: string) => {
        try {
            const { data, error } = await supabase.storage.from('anexos_processos').createSignedUrl(caminho, 60);
            if (error) throw error;
            const link = document.createElement('a');
            link.href = data.signedUrl;
            link.download = nome;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err: any) {
            console.error(err);
            toast.error('Erro ao baixar arquivo.');
        }
    };

    useEffect(() => {
        if (!processoId || !open) {
            setIsEditing(false);
            setActiveTab('info');
            return;
        }
        fetchProcesso();
    }, [processoId, open]);

    async function fetchProcesso() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('processos')
                .select(`
                    id, numero_sei, status, acompanhamento, tipo_fluxo, origem, data_cobranca, prioridade,
                    data_processo, assunto, orgao, numero_oficio, destinatario,
                    historico_logs (log_texto, criado_em, perfis(email)),
                    subprocessos (id, titulo, descricao, status, data_vencimento, perfis(email)),
                    comentarios (id, texto, criado_em, perfis(email)),
                    arquivos_anexos (id, nome_arquivo, caminho_storage, tamanho_bytes, criado_em, perfis(email))
                `)
                .eq('id', processoId)
                .single();
            if (error) throw error;
            setProcesso(data as unknown as ProcessoDetalhes);
            setFormData(data as unknown as ProcessoDetalhes);
        } catch (err: any) {
            console.error('Erro ao buscar processo', err);
            toast.error('Não foi possível carregar os detalhes do processo.');
        } finally {
            setLoading(false);
        }
    }

    // Gera linhas de log comparando antes/depois de cada campo
    const gerarLogAlteracoes = (antes: Partial<ProcessoDetalhes>, depois: Partial<ProcessoDetalhes>): string[] => {
        const labels: Record<string, string> = {
            data_processo: 'Data',
            numero_oficio: 'Número do Ofício',
            assunto: 'Assunto',
            destinatario: 'Destinatário',
            orgao: 'Órgão',
            tipo_fluxo: 'Tipo / Fluxo',
            prioridade: 'Prioridade',
            status: 'Status',
        };
        const logs: string[] = [];
        for (const campo of Object.keys(labels)) {
            const valorAntigo = (antes as any)[campo];
            const valorNovo = (depois as any)[campo];
            const normaliza = (v: any) => (v === null || v === undefined || v === '') ? '(vazio)' : String(v);
            if (normaliza(valorAntigo) !== normaliza(valorNovo)) {
                let textoNovo = normaliza(valorNovo);
                let textoAntigo = normaliza(valorAntigo);
                // Formate datas para exibição legível
                if (campo === 'data_processo' && valorNovo) {
                    textoNovo = new Date(valorNovo).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                }
                if (campo === 'data_processo' && valorAntigo) {
                    textoAntigo = new Date(valorAntigo).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                }
                if (campo === 'prioridade') {
                    textoNovo = valorNovo ? 'Sim (Prioritário)' : 'Não';
                    textoAntigo = valorAntigo ? 'Sim (Prioritário)' : 'Não';
                }
                logs.push(`Campo "${labels[campo]}" alterado: "${textoAntigo}" → "${textoNovo}"`);
            }
        }
        return logs;
    };

    const handleSave = async () => {
        if (!processo) return;
        setSaving(true);
        try {
            const upData: any = {
                prioridade: formData.prioridade,
                data_processo: formData.data_processo || null,
                numero_oficio: formData.numero_oficio || null,
                assunto: formData.assunto || null,
                destinatario: formData.destinatario || null,
                orgao: formData.orgao || null,
                tipo_fluxo: formData.tipo_fluxo || null,
            };

            const { error } = await supabase.from('processos').update(upData).eq('id', processo.id);
            if (error) throw error;

            // Gerar e inserir logs de alteração
            const linhasLog = gerarLogAlteracoes(processo, { ...processo, ...upData });
            if (linhasLog.length > 0) {
                const logTexto = `Processo atualizado via aba Informações:\n${linhasLog.join('\n')}`;
                await supabase.from('historico_logs').insert({
                    processo_id: processo.id,
                    log_texto: logTexto,
                });
            }

            toast.success('Processo atualizado com sucesso!');
            setIsEditing(false);
            if (onSuccess) onSuccess();
            fetchProcesso();
        } catch (err: any) {
            console.error('Erro ao atualizar processo', err);
            toast.error('Erro ao atualizar o processo.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddSub = async () => {
        if (!novoSub.titulo || !processo) return;
        try {
            const { error } = await supabase.from('subprocessos').insert({
                processo_id: processo.id,
                titulo: novoSub.titulo,
                descricao: novoSub.descricao
            });
            if (error) throw error;
            toast.success('Subprocesso adicionado!');
            setNovoSub({ titulo: '', descricao: '' });
            fetchProcesso();
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error('Erro ao adicionar subprocesso.');
        }
    };

    const handleAddAcompanhamento = async () => {
        if (!processo || !novoAcompanhamento.trim()) return;
        setSaving(true);
        try {
            const atual = processo.acompanhamento ? processo.acompanhamento + '\n\n' : '';
            const dataHora = new Date().toLocaleString('pt-BR');
            const novoTexto = `${atual}[${dataHora}] - ${novoAcompanhamento}`;
            const { error } = await supabase.from('processos').update({ acompanhamento: novoTexto }).eq('id', processo.id);
            if (error) throw error;
            toast.success('Acompanhamento adicionado com sucesso!');
            setNovoAcompanhamento('');
            fetchProcesso();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            toast.error('Erro ao adicionar acompanhamento.');
        } finally {
            setSaving(false);
        }
    };

    // Bloquear conclusão do processo se houver subprocessos pendentes
    const temSubsPendentes = processo?.subprocessos && processo.subprocessos.length > 0
        && processo.subprocessos.some(s => s.status !== 'concluido');

    const tabs = [
        { id: 'info', name: 'Informações', icon: Info },
        { id: 'acompanhamento', name: 'Acompanhamento', icon: Edit2 },
        { id: 'subs', name: 'Subprocessos', icon: Layers },
        { id: 'anexos', name: 'Anexos', icon: Paperclip },
        { id: 'logs', name: 'Histórico', icon: History },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col p-0 overflow-hidden bg-card">
                <DialogHeader className="p-6 pb-2 border-b border-border bg-muted/20">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-bold text-foreground">
                                Processo {processo?.numero_sei}
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground mt-1">ID: {processo?.id}</p>
                        </div>
                        {processo && !loading && (
                            <div className="flex items-center gap-2 mr-8">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-xs font-semibold hover:bg-secondary/80 transition-colors shadow-sm"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Editar Dados
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                            Salvar
                                        </button>
                                        <button
                                            onClick={() => { setIsEditing(false); setFormData(processo); }}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-md text-xs font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Aviso de subprocessos pendentes */}
                    {temSubsPendentes && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <Layers className="w-3.5 h-3.5 shrink-0" />
                            Este processo possui etapas (subprocessos) pendentes. Conclua todas as etapas antes de finalizar o processo.
                        </div>
                    )}

                    {/* Progress Bar */}
                    {processo && !loading && (
                        <div className="mt-4 mb-1 px-1">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Avanço Global do Processo</span>
                                <span className="text-[10px] font-bold text-primary">
                                    {processo.subprocessos?.length > 0
                                        ? Math.round((processo.subprocessos.filter(s => s.status === 'concluido').length / processo.subprocessos.length) * 100)
                                        : (processo.status === 'concluido' ? 100 : 0)}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${processo.subprocessos?.length > 0 ? Math.round((processo.subprocessos.filter(s => s.status === 'concluido').length / processo.subprocessos.length) * 100) : (processo.status === 'concluido' ? 100 : 0)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-1 mt-5">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 outline-none uppercase tracking-widest ${activeTab === tab.id
                                    ? 'border-primary text-primary bg-primary/5'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#3b83f7' }} />
                            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Carregando dados detalhados...</p>
                        </div>
                    ) : processo ? (
                        <div className="space-y-6">

                            {/* TAB: INFORMAÇÕES — mesmos campos do cadastro */}
                            {activeTab === 'info' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

                                        {/* Data */}
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data</p>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={formData.data_processo || ''}
                                                    onChange={(e) => setFormData({ ...formData, data_processo: e.target.value })}
                                                    className="w-full text-sm bg-input/50 border border-border rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-foreground dark:[color-scheme:dark]"
                                                />
                                            ) : (
                                                <p className="text-sm font-semibold text-foreground">
                                                    {processo.data_processo
                                                        ? new Date(processo.data_processo).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                                                        : 'Não informada'}
                                                </p>
                                            )}
                                        </div>

                                        {/* Número Ofício */}
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Número do Ofício</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.numero_oficio || ''}
                                                    onChange={(e) => setFormData({ ...formData, numero_oficio: e.target.value })}
                                                    className="w-full text-sm bg-input/50 border border-border rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                                    placeholder="000/2026"
                                                />
                                            ) : (
                                                <p className="text-sm font-semibold text-foreground">{processo.numero_oficio || '-'}</p>
                                            )}
                                        </div>

                                        {/* Número SEI — somente leitura */}
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Número SEI</p>
                                            <p className="text-sm font-semibold text-foreground">{processo.numero_sei || '-'}</p>
                                        </div>

                                        {/* Assunto — largura total */}
                                        <div className="space-y-1 lg:col-span-3">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assunto</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.assunto || ''}
                                                    onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                                                    className="w-full text-sm bg-input/50 border border-border rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                                    placeholder="Assunto do processo..."
                                                />
                                            ) : (
                                                <p className="text-sm font-semibold text-foreground">{processo.assunto || '-'}</p>
                                            )}
                                        </div>

                                        {/* Destinatário */}
                                        <div className="space-y-1 lg:col-span-2">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Destinatário</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.destinatario || ''}
                                                    onChange={(e) => setFormData({ ...formData, destinatario: e.target.value })}
                                                    className="w-full text-sm bg-input/50 border border-border rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                                />
                                            ) : (
                                                <p className="text-sm font-semibold text-foreground">{processo.destinatario || '-'}</p>
                                            )}
                                        </div>

                                        {/* Órgão */}
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Órgão</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.orgao || ''}
                                                    onChange={(e) => setFormData({ ...formData, orgao: e.target.value })}
                                                    className="w-full text-sm bg-input/50 border border-border rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                                    placeholder="Ex: SMAMS"
                                                />
                                            ) : (
                                                <p className="text-sm font-semibold text-foreground">{processo.orgao || '-'}</p>
                                            )}
                                        </div>

                                        {/* Tipo / Fluxo */}
                                        <div className="space-y-1 lg:col-span-2">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipo / Fluxo</p>
                                            {isEditing ? (
                                                <select
                                                    value={formData.tipo_fluxo || ''}
                                                    onChange={(e) => setFormData({ ...formData, tipo_fluxo: e.target.value })}
                                                    className="w-full text-sm bg-input/50 border border-border rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-foreground"
                                                >
                                                    <option value="EXTERNO - ENVIADOS">EXTERNO - ENVIADOS</option>
                                                    <option value="INTERNO - ENVIADOS">INTERNO - ENVIADOS</option>
                                                    <option value="INTERNO - RECEBIDOS">INTERNO - RECEBIDOS</option>
                                                    <option value="PAD">PAD</option>
                                                </select>
                                            ) : (
                                                <p className="text-sm font-semibold text-foreground">{processo.tipo_fluxo || 'Não informado'}</p>
                                            )}
                                        </div>

                                        {/* Prioritário */}
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Prioritário?</p>
                                            {isEditing ? (
                                                <label className="flex items-center gap-2 cursor-pointer mt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.prioridade || false}
                                                        onChange={(e) => setFormData({ ...formData, prioridade: e.target.checked })}
                                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-xs font-semibold text-foreground">Sim, processo prioritário</span>
                                                </label>
                                            ) : (
                                                <div className="mt-1">
                                                    {processo.prioridade ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-900/50 uppercase">
                                                            Alta Prioridade
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm font-semibold text-muted-foreground">Normal</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* TAB: ACOMPANHAMENTO */}
                            {activeTab === 'acompanhamento' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-muted/20 border border-border p-5 rounded-xl flex flex-col gap-3">
                                        <p className="text-xs font-bold text-foreground">Novo Acompanhamento</p>
                                        <textarea
                                            placeholder="Digite aqui o acompanhamento mais recente. Ele será adicionado ao histórico atual com data e hora..."
                                            value={novoAcompanhamento}
                                            onChange={(e) => setNovoAcompanhamento(e.target.value)}
                                            rows={3}
                                            className="w-full text-sm bg-input border border-border rounded-lg p-3 outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={handleAddAcompanhamento}
                                                disabled={!novoAcompanhamento || saving}
                                                className="px-4 py-2 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                                style={{ backgroundColor: '#3b83f7' }}
                                            >
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Registrar'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <p className="text-xs font-bold text-muted-foreground uppercase mb-4">Acompanhamento Geral Acumulado</p>
                                        <div className="bg-card border border-border rounded-xl p-5 min-h-[200px] shadow-inner font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                            {processo.acompanhamento || 'Sem acompanhamentos até o momento.'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: SUBPROCESSOS */}
                            {activeTab === 'subs' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-foreground">Gestão de Etapas (Subprocessos)</h3>
                                        <div className="text-[10px] text-muted-foreground font-medium uppercase">
                                            {processo.subprocessos?.filter(s => s.status === 'concluido').length || 0} de {processo.subprocessos?.length || 0} concluídos
                                        </div>
                                    </div>

                                    {temSubsPendentes && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400">
                                            <Layers className="w-3.5 h-3.5 shrink-0" />
                                            Finalize todas as etapas abaixo para poder concluir este processo.
                                        </div>
                                    )}

                                    {/* Novo Subprocesso Form */}
                                    <div className="bg-muted/20 border border-border p-4 rounded-xl flex flex-col gap-3">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Adicionar Nova Etapa</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Título da etapa..."
                                                value={novoSub.titulo}
                                                onChange={(e) => setNovoSub({ ...novoSub, titulo: e.target.value })}
                                                className="input-base flex-1 text-sm"
                                            />
                                            <button
                                                onClick={handleAddSub}
                                                className="p-1.5 text-white rounded-lg transition-colors shadow-sm"
                                                style={{ backgroundColor: '#3b83f7' }}
                                            >
                                                <PlusCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        {processo.subprocessos && processo.subprocessos.length > 0 ? (
                                            processo.subprocessos.map((sub) => {
                                                const concluido = sub.status === 'concluido';
                                                return (
                                                    <div key={sub.id} className={`group flex items-center justify-between p-4 border rounded-xl transition-all ${concluido ? 'bg-green-950/20 border-green-800/40' : 'bg-card border-border hover:shadow-md'}`}>
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                title={concluido ? 'Marcar como pendente' : 'Marcar como concluído'}
                                                                disabled={loadingSub === sub.id}
                                                                onClick={async () => {
                                                                    setLoadingSub(sub.id);
                                                                    const newStatus = concluido ? 'pendente' : 'concluido';
                                                                    await supabase.from('subprocessos').update({ status: newStatus }).eq('id', sub.id);
                                                                    await fetchProcesso();
                                                                    if (onSuccess) onSuccess();
                                                                    setLoadingSub(null);
                                                                }}
                                                                className={`shrink-0 transition-colors disabled:opacity-60 ${concluido ? 'text-green-500 hover:text-muted-foreground' : 'text-muted-foreground/40 hover:text-green-500'}`}
                                                            >
                                                                {loadingSub === sub.id
                                                                    ? <Loader2 className="w-6 h-6 animate-spin" />
                                                                    : concluido
                                                                        ? <CheckCircle2 className="w-6 h-6" />
                                                                        : <Circle className="w-6 h-6" />}
                                                            </button>
                                                            <div>
                                                                <p className={`text-sm font-bold ${concluido ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                                                    {sub.titulo}
                                                                </p>
                                                                {sub.descricao && <p className="text-xs text-muted-foreground">{sub.descricao}</p>}
                                                                {concluido && <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Concluído ✓</span>}
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-red-500 transition-all"
                                                            onClick={async () => {
                                                                if (!window.confirm('Remover esta etapa?')) return;
                                                                await supabase.from('subprocessos').delete().eq('id', sub.id);
                                                                fetchProcesso();
                                                                if (onSuccess) onSuccess();
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                                                <Layers className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">Nenhum subprocesso vinculado.</p>
                                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">Crie etapas para acompanhar o progresso real</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB: ANEXOS */}
                            {activeTab === 'anexos' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center group transition-colors block ${uploadingAnexo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        style={{ borderColor: 'var(--border)' }}
                                        onMouseEnter={(e) => { if (!uploadingAnexo) (e.currentTarget as HTMLElement).style.borderColor = '#3b83f7' }}
                                        onMouseLeave={(e) => { if (!uploadingAnexo) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
                                    >
                                        <input type="file" className="hidden" disabled={uploadingAnexo} onChange={handleFileUpload} />
                                        <div className="p-4 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(59,131,247,0.1)' }}>
                                            {uploadingAnexo ? <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#3b83f7' }} /> : <Paperclip className="w-8 h-8" style={{ color: '#3b83f7' }} />}
                                        </div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            {uploadingAnexo ? 'Fazendo upload...' : 'Upload de Documentação'}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                                            Clique para selecionar. Suporta PDFs, imagens e planilhas.
                                        </p>
                                        <div className="mt-4 flex justify-center">
                                            <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-bold transition-colors shadow-sm">
                                                Selecionar Arquivos
                                            </div>
                                        </div>
                                    </label>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Documentos Vinculados ({processo.arquivos_anexos?.length || 0})</p>
                                        {processo.arquivos_anexos && processo.arquivos_anexos.length > 0 ? (
                                            <div className="grid gap-3">
                                                {processo.arquivos_anexos.map((anexo) => (
                                                    <div key={anexo.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
                                                                <Paperclip className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold truncate text-foreground">{anexo.nome_arquivo}</p>
                                                                <p className="text-[10px] text-muted-foreground">
                                                                    {(anexo.tamanho_bytes / 1024 / 1024).toFixed(2)} MB • {new Date(anexo.criado_em).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleDownloadAnexo(anexo.caminho_storage, anexo.nome_arquivo)}
                                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                                                                title="Baixar Arquivo"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAnexo(anexo.id, anexo.caminho_storage)}
                                                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-muted rounded-lg transition-colors"
                                                                title="Excluir"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-muted/20 border border-dashed border-border rounded-xl">
                                                <p className="text-xs text-muted-foreground italic">Nenhum anexo disponível.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB: HISTÓRICO (LOGS) */}
                            {activeTab === 'logs' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-foreground">Rastreador de Auditoria</h3>
                                        <div className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold text-muted-foreground uppercase">Logs do Sistema</div>
                                    </div>
                                    {processo.historico_logs && processo.historico_logs.length > 0 ? (
                                        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                            {processo.historico_logs.sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()).map((log, i) => (
                                                <div key={i} className="relative group">
                                                    <div className="absolute -left-[19px] top-1.5 w-4 h-4 rounded-full border-4 shadow-sm group-hover:scale-125 transition-transform" style={{ borderColor: 'var(--card)', backgroundColor: '#3b83f7' }} />
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] font-bold uppercase" style={{ color: '#3b83f7' }}>
                                                                {new Date(log.criado_em).toLocaleDateString('pt-BR')}
                                                                <span className="mx-1.5 opacity-30 text-foreground">|</span>
                                                                {new Date(log.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            {log.perfis?.email && (
                                                                <span className="text-[10px] text-muted-foreground font-medium px-1.5 py-0.5 bg-muted rounded">
                                                                    {log.perfis.email.split('@')[0]}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">{log.log_texto}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-sm text-muted-foreground italic">Nenhuma movimentação automática registrada.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center py-20 space-y-4">
                            <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                                <X className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Processo não encontrado</h3>
                                <p className="text-sm text-muted-foreground">O item pode ter sido removido ou você não possui permissão de acesso.</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
