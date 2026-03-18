import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { FileText, AlertTriangle, Clock, Plus, Copy, Check, Search, Filter, CheckCircle2, X, Calendar } from 'lucide-react';
import { ProcessoModal } from '../components/processos/ProcessoModal';
import { NovoProcessoModal } from '../components/processos/NovoProcessoModal';
import { EditProcessoModal } from '../components/processos/EditProcessoModal';
import { toast } from 'sonner';

type PrioridadeRow = {
    id: string;
    numero_sei: string;
    assunto: string;
    data_processo: string;
    destinatario: string;
    orgao: string;
    status: string;
    data_cobranca: string;
    prioridade: boolean;
    tipo_fluxo: string;
    acompanhamento: string;
    ultimo_log: string;
    data_ultimo_log: string;
    subprocessos?: { id: string, status: string }[];
};

// Tipo do filtro de card ativo
type CardFilter = 'ativos' | 'atraso' | 'concluidos' | 'aguardando' | null;

export function Dashboard() {
    const [processos, setProcessos] = useState<PrioridadeRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProcessoId, setSelectedProcessoId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNovoModalOpen, setIsNovoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [processoToEdit, setProcessoToEdit] = useState<PrioridadeRow | null>(null);
    const [copiedSei, setCopiedSei] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Filtros
    const [searchQuery, setSearchQuery] = useState('');
    const [cardFilter, setCardFilter] = useState<CardFilter>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    useEffect(() => {
        async function fetchPrioridades() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('processos')
                    .select(`
                        *, 
                        historico_logs (log_texto, criado_em),
                        subprocessos (id, status)
                    `)
                    .order('criado_em', { ascending: false })
                    .limit(200);

                if (error) throw error;

                const processosFormatados = data?.map((p: any) => {
                    let ultimoLog = 'Sem registro';
                    let dataLog = '';
                    if (p.historico_logs && p.historico_logs.length > 0) {
                        const logMaisRecente = p.historico_logs[p.historico_logs.length - 1];
                        ultimoLog = logMaisRecente.log_texto;
                        dataLog = logMaisRecente.criado_em;
                    }
                    return { ...p, ultimo_log: ultimoLog, data_ultimo_log: dataLog };
                });

                setProcessos(processosFormatados || []);
            } catch (err) {
                console.error('Erro ao buscar processos:', err);
                toast.error('Erro ao buscar processos.');
            } finally {
                setLoading(false);
            }
        }
        fetchPrioridades();
    }, [refreshTrigger]);

    // Helpers
    const isAtrasado = (p: PrioridadeRow) => {
        if (!p.data_cobranca || p.status?.toLowerCase() === 'concluido') return false;
        const cobranca = new Date(p.data_cobranca);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return cobranca < hoje;
    };

    const totalAtivos = processos.filter(p => p.status?.toLowerCase() !== 'concluido').length;
    const totalAtraso = processos.filter(isAtrasado).length;
    const totalConcluidos = processos.filter(p => p.status?.toLowerCase() === 'concluido').length;
    const totalAguardando = processos.filter(p => p.status?.toLowerCase() === 'em espera').length;

    const handleCopySei = (sei: string) => {
        navigator.clipboard.writeText(sei);
        setCopiedSei(sei);
        toast.success(`Processo ${sei} copiado!`);
        setTimeout(() => setCopiedSei(null), 2000);
    };

    const handleOpenModal = (id: string) => {
        setSelectedProcessoId(id);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (processo: PrioridadeRow) => {
        setProcessoToEdit(processo);
        setIsEditModalOpen(true);
    };

    const handleCardClick = (card: CardFilter) => {
        // Clique no mesmo card já ativo → limpa filtro
        setCardFilter(prev => prev === card ? null : card);
    };

    const hasDateFilter = filterDateFrom || filterDateTo;

    const clearAllFilters = () => {
        setCardFilter(null);
        setSearchQuery('');
        setFilterDateFrom('');
        setFilterDateTo('');
    };

    const processosFiltrados = processos.filter(p => {
        // Filtro de texto
        const q = searchQuery.toLowerCase();
        const matchSearch = !q ||
            p.numero_sei.toLowerCase().includes(q) ||
            (p.assunto && p.assunto.toLowerCase().includes(q)) ||
            (p.tipo_fluxo && p.tipo_fluxo.toLowerCase().includes(q)) ||
            (p.destinatario && p.destinatario.toLowerCase().includes(q)) ||
            (p.orgao && p.orgao.toLowerCase().includes(q));

        // Filtro de card
        let matchCard = true;
        if (cardFilter === 'ativos') matchCard = p.status?.toLowerCase() !== 'concluido';
        else if (cardFilter === 'atraso') matchCard = isAtrasado(p);
        else if (cardFilter === 'concluidos') matchCard = p.status?.toLowerCase() === 'concluido';
        else if (cardFilter === 'aguardando') matchCard = p.status?.toLowerCase() === 'em espera';

        // Filtro de data
        let matchDate = true;
        if (p.data_processo) {
            const d = new Date(p.data_processo);
            if (filterDateFrom) matchDate = matchDate && d >= new Date(filterDateFrom);
            if (filterDateTo) matchDate = matchDate && d <= new Date(filterDateTo);
        } else if (hasDateFilter) {
            matchDate = false;
        }

        return matchSearch && matchCard && matchDate;
    });

    const cardBase = 'seía-card p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 select-none';
    const cardActive = 'ring-2 ring-offset-1 scale-[1.02]';

    return (
        <Layout>
            {/* Header de ações */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por SEI, assunto, destinatário, órgão..."
                        className="input-base pl-10 pr-4 py-2 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto relative">
                    {/* Botão Filtrar por Data */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${hasDateFilter ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
                        style={!hasDateFilter ? { backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' } : {}}
                    >
                        <Calendar className="w-4 h-4" />
                        {hasDateFilter ? 'Data Ativa' : 'Filtrar Data'}
                    </button>

                    {isFilterOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                            <div className="absolute top-12 left-0 w-72 bg-card border border-border shadow-xl rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Filtrar por Data</p>
                                    {hasDateFilter && (
                                        <button
                                            onClick={() => { setFilterDateFrom(''); setFilterDateTo(''); }}
                                            className="text-[10px] font-semibold text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            Limpar datas
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">De</label>
                                        <input
                                            type="date"
                                            value={filterDateFrom}
                                            onChange={(e) => setFilterDateFrom(e.target.value)}
                                            className="w-full text-sm bg-input/50 border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-foreground dark:[color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">Até</label>
                                        <input
                                            type="date"
                                            value={filterDateTo}
                                            onChange={(e) => setFilterDateTo(e.target.value)}
                                            className="w-full text-sm bg-input/50 border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary text-foreground dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="w-full py-1.5 text-xs font-bold text-white rounded-lg"
                                    style={{ backgroundColor: '#3b83f7' }}
                                >
                                    Aplicar
                                </button>
                            </div>
                        </>
                    )}

                    {/* Limpar todos os filtros */}
                    {(cardFilter || hasDateFilter || searchQuery) && (
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-400/40 bg-red-500/10 text-red-500 text-xs font-semibold transition-colors hover:bg-red-500/20"
                            title="Limpar todos os filtros"
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpar
                        </button>
                    )}

                    <button
                        onClick={() => setIsNovoModalOpen(true)}
                        className="btn-primary flex-1 md:flex-none justify-center"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Processo
                    </button>
                </div>
            </div>

            {/* Cards clicáveis superiores */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                {/* Card: Ativos */}
                <div
                    onClick={() => handleCardClick('ativos')}
                    className={`${cardBase} ${cardFilter === 'ativos' ? `${cardActive} ring-blue-500/60` : 'hover:shadow-lg'}`}
                    title="Clique para filtrar processos ativos"
                >
                    <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(59,131,247,0.12)' }}>
                        <FileText className="w-5 h-5" style={{ color: '#3b83f7' }} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Ativos</p>
                        <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalAtivos}</h3>
                    </div>
                    {cardFilter === 'ativos' && (
                        <div className="ml-auto">
                            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded">Ativo</span>
                        </div>
                    )}
                </div>

                {/* Card: Em Atraso */}
                <div
                    onClick={() => handleCardClick('atraso')}
                    className={`${cardBase} ${cardFilter === 'atraso' ? `${cardActive} ring-red-500/60` : 'hover:shadow-lg'}`}
                    title="Clique para filtrar processos em atraso"
                >
                    <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
                        <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Em Atraso</p>
                        <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalAtraso}</h3>
                    </div>
                    {cardFilter === 'atraso' && (
                        <div className="ml-auto">
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded">Ativo</span>
                        </div>
                    )}
                </div>

                {/* Card: Concluídos */}
                <div
                    onClick={() => handleCardClick('concluidos')}
                    className={`${cardBase} ${cardFilter === 'concluidos' ? `${cardActive} ring-green-500/60` : 'hover:shadow-lg'}`}
                    title="Clique para filtrar processos concluídos"
                >
                    <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                        <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Concluídos</p>
                        <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalConcluidos}</h3>
                    </div>
                    {cardFilter === 'concluidos' && (
                        <div className="ml-auto">
                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-1.5 py-0.5 rounded">Ativo</span>
                        </div>
                    )}
                </div>

                {/* Card: Aguardando */}
                <div
                    onClick={() => handleCardClick('aguardando')}
                    className={`${cardBase} ${cardFilter === 'aguardando' ? `${cardActive} ring-amber-500/60` : 'hover:shadow-lg'}`}
                    title="Clique para filtrar processos aguardando"
                >
                    <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}>
                        <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Aguardando</p>
                        <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalAguardando}</h3>
                    </div>
                    {cardFilter === 'aguardando' && (
                        <div className="ml-auto">
                            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded">Ativo</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabela de processos */}
            <div className="seía-card overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                            {cardFilter === 'ativos' && 'Processos Ativos'}
                            {cardFilter === 'atraso' && 'Processos em Atraso'}
                            {cardFilter === 'concluidos' && 'Processos Concluídos'}
                            {cardFilter === 'aguardando' && 'Aguardando Resposta'}
                            {!cardFilter && 'Todos os Processos'}
                        </h2>
                        {cardFilter && (
                            <button
                                onClick={() => setCardFilter(null)}
                                className="text-[10px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-0.5 rounded bg-muted transition-colors"
                            >
                                <X className="w-3 h-3" />
                                Ver todos
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-neutral">{processosFiltrados.length} processos</span>
                        {processos.length >= 200 && (
                            <span className="text-[10px] text-amber-500 font-semibold">Limite atingido — use os filtros</span>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="whitespace-nowrap" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
                                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>SEI</th>
                                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Assunto</th>
                                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Data</th>
                                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Destinatário</th>
                                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Tipo</th>
                                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Status</th>
                                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--muted-foreground)' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-10 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                        Carregando processos...
                                    </td>
                                </tr>
                            ) : processosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Filter className="w-8 h-8 text-muted-foreground/30" />
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {searchQuery || cardFilter || hasDateFilter
                                                    ? 'Nenhum processo encontrado para os filtros atuais.'
                                                    : 'Nenhum processo cadastrado.'}
                                            </p>
                                            {(cardFilter || hasDateFilter || searchQuery) && (
                                                <button onClick={clearAllFilters} className="text-xs text-primary font-semibold mt-1 hover:underline">
                                                    Limpar filtros e ver todos
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                processosFiltrados.map((p) => {
                                    const statusBadge = p.status === 'concluido'
                                        ? 'badge badge-success'
                                        : p.status === 'em espera'
                                            ? 'badge badge-warning'
                                            : isAtrasado(p)
                                                ? 'badge badge-danger'
                                                : 'badge badge-primary';

                                    return (
                                        <tr
                                            key={p.id}
                                            className="transition-colors"
                                            style={{ borderTop: '1px solid var(--border)' }}
                                            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--muted)'}
                                            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                                        >
                                            {/* SEI */}
                                            <td className="px-5 py-3.5">
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer group font-mono text-sm font-semibold transition-colors"
                                                    style={{ color: 'var(--foreground)' }}
                                                    onClick={() => handleCopySei(p.numero_sei)}
                                                    title="Clique para copiar"
                                                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#3b83f7'}
                                                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--foreground)'}
                                                >
                                                    {p.numero_sei}
                                                    {copiedSei === p.numero_sei
                                                        ? <Check className="w-3 h-3" style={{ color: '#22c55e' }} />
                                                        : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                </div>
                                                {p.prioridade && (
                                                    <span className="badge badge-danger mt-1 block w-fit">Urgente</span>
                                                )}
                                            </td>

                                            {/* Assunto */}
                                            <td className="px-5 py-3.5 text-sm truncate max-w-[220px]" style={{ color: 'var(--foreground)' }} title={p.assunto}>
                                                {p.assunto || <span className="text-muted-foreground italic text-xs">Não informado</span>}
                                            </td>

                                            {/* Data */}
                                            <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
                                                {p.data_processo
                                                    ? new Date(p.data_processo).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                                                    : <span className="text-muted-foreground">—</span>}
                                            </td>

                                            {/* Destinatário */}
                                            <td className="px-5 py-3.5 text-sm truncate max-w-[160px]" style={{ color: 'var(--foreground)' }} title={p.destinatario}>
                                                {p.destinatario || <span className="text-muted-foreground">—</span>}
                                            </td>

                                            {/* Tipo/Fluxo */}
                                            <td className="px-5 py-3.5">
                                                {p.tipo_fluxo ? (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide whitespace-nowrap"
                                                        style={{
                                                            color: 'var(--muted-foreground)',
                                                            borderColor: 'var(--border)',
                                                            backgroundColor: 'var(--muted)'
                                                        }}>
                                                        {p.tipo_fluxo}
                                                    </span>
                                                ) : <span className="text-muted-foreground text-sm">—</span>}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-3.5">
                                                <span className={statusBadge}>
                                                    {isAtrasado(p) && p.status !== 'concluido' ? 'Em Atraso' : (p.status || 'Pendente')}
                                                </span>
                                            </td>

                                            {/* Ações */}
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleOpenEditModal(p)}
                                                        className="text-xs font-semibold transition-colors"
                                                        style={{ color: '#8b5cf6' }}
                                                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#7c3aed'}
                                                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#8b5cf6'}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(p.id)}
                                                        className="text-xs font-semibold transition-colors"
                                                        style={{ color: '#3b83f7' }}
                                                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#2563eb'}
                                                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#3b83f7'}
                                                    >
                                                        Detalhes
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProcessoModal
                processoId={selectedProcessoId}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />

            <NovoProcessoModal
                open={isNovoModalOpen}
                onOpenChange={setIsNovoModalOpen}
                onSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />

            <EditProcessoModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                processo={processoToEdit}
            />
        </Layout>
    );
}
