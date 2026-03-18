import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProcess, useAddProcessUpdate } from '../hooks/useProcess';
import ProcessTimeline from '../components/processes/ProcessTimeline';
import ProcessAttachmentsPanel from '../components/processes/ProcessAttachmentsPanel';
import ProcessSubprocessesPanel from '../components/processes/ProcessSubprocessesPanel';
import EditProcessModal from '../components/processes/EditProcessModal';
import { useDeleteProcess } from '../hooks/useProcesses';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Copy, FileText, Calendar, Building, User, Tag, Edit, Paperclip, GitBranch, History, MessageSquare, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusMap: Record<string, { label: string; color: string }> = {
    AWAITING: { label: 'Aguardando', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    IN_PROGRESS: { label: 'Em Andamento', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    AWAITING_SIGNATURE: { label: 'Aguard. Assinatura', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    COMPLETED: { label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    ARCHIVED: { label: 'Arquivado', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

const typeMap: Record<string, string> = {
    EXTERNO_ENVIADO: 'Externo Enviado',
    EXTERNO_RECEBIDO: 'Externo Recebido',
    INTERNO_ENVIADO: 'Interno Enviado',
    INTERNO_RECEBIDO: 'Interno Recebido',
    PAD: 'PAD',
    CUSTOM: 'Personalizado',
};

type TabKey = 'history' | 'tracking' | 'attachments' | 'subprocesses';

export default function ProcessDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { data: process, isLoading } = useProcess(id);
    const { mutateAsync: deleteProcess, isPending: isDeleting } = useDeleteProcess();
    const { mutateAsync: addUpdate, isPending: isUpdatingStatus } = useAddProcessUpdate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('tracking');

    const canEdit = profile?.role !== 'VIEWER';
    const isSubprocess = !!process?.parent_process_id;

    const copySei = () => {
        if (process?.sei_number) {
            navigator.clipboard.writeText(process.sei_number);
            toast.success('Número SEI copiado!');
        }
    };

    if (!id) return null;

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500" />
            </div>
        );
    }

    if (!process) {
        return (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-3">
                <FileText size={40} className="opacity-30" />
                <p className="font-medium">Processo não encontrado.</p>
                <Link to="/" className="text-emerald-400 text-sm hover:underline">← Voltar ao dashboard</Link>
            </div>
        );
    }

    const status = statusMap[process.status ?? 'IN_PROGRESS'] ?? statusMap['IN_PROGRESS'];

    // Build tabs dynamically — hide subprocesses tab for subprocesses
    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        { key: 'tracking', label: 'Acompanhamento', icon: <MessageSquare size={16} /> },
        // Only show subprocesses tab for root processes (not subprocesses)
        ...(!isSubprocess ? [{ key: 'subprocesses' as TabKey, label: 'Subprocessos', icon: <GitBranch size={16} /> }] : []),
        { key: 'attachments', label: 'Anexos', icon: <Paperclip size={16} /> },
        { key: 'history', label: 'Histórico', icon: <History size={16} /> },
    ];

    const handleStatusChange = async (newStatus: string) => {
        if (!process || !profile || !id) return;
        try {
            await addUpdate({
                process_id: id,
                content: `Status alterado de "${statusMap[process.status ?? 'IN_PROGRESS'].label}" para "${statusMap[newStatus].label}"`,
                created_by: profile.id,
                new_status: newStatus,
                is_system: true,
            });
            toast.success('Status atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar status.');
        }
    };

    // Title: show subject instead of ID
    const displayTitle = process.subject || 'Sem assunto';

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                    <Link to={isSubprocess ? `/process/${process.parent_process_id}` : '/'} className="p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            {isSubprocess && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                    Subprocesso
                                </span>
                            )}
                            <h1 className="text-xl font-bold leading-tight">
                                {displayTitle}
                            </h1>
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${status.color}`}>
                                {status.label}
                            </span>
                        </div>
                        <button
                            onClick={copySei}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-emerald-400 transition-colors font-mono cursor-pointer"
                        >
                            <span>{process.sei_number}</span>
                            <Copy size={12} />
                        </button>
                    </div>
                </div>
                {/* Action buttons — aligned in a row */}
                <div className="flex gap-2 items-center shrink-0">
                    {canEdit && (
                        <>
                            <select
                                value={process.status ?? 'IN_PROGRESS'}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={isUpdatingStatus}
                                className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <option value="AWAITING">Aguardando</option>
                                <option value="IN_PROGRESS">Em Andamento</option>
                                <option value="AWAITING_SIGNATURE">Aguardando Ass./Aprovação</option>
                                <option value="COMPLETED">Concluído</option>
                                <option value="ARCHIVED">Arquivado</option>
                            </select>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <Trash2 size={16} /> Excluir
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-emerald-900/20"
                            >
                                <Edit size={16} /> Editar
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: <FileText size={16} className="text-emerald-400" />, label: 'Tipo', value: typeMap[process.type] ?? process.type },
                    { icon: <Calendar size={16} className="text-blue-400" />, label: 'Data', value: process.date ? format(new Date(process.date + 'T00:00:00'), 'dd/MM/yyyy') : '—' },
                    { icon: <Building size={16} className="text-emerald-400" />, label: 'Órgão', value: process.organ ?? '—' },
                    { icon: <User size={16} className="text-amber-400" />, label: 'Remetente/Dest.', value: process.sender_recipient ?? '—' },
                ].map((item, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            {item.icon} {item.label}
                        </div>
                        <p className="text-sm font-medium truncate" title={item.value}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Subject + Reference */}
            {process.reference_number && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Tag size={14} /> Referência
                    </div>
                    <p className="text-sm font-medium">{process.reference_number}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex border-b border-border flex-wrap sm:flex-nowrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${activeTab === tab.key
                                ? 'text-emerald-400 border-emerald-500 bg-emerald-500/5'
                                : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-5">
                    {activeTab === 'history' && id && (
                        <ProcessTimeline processId={id} currentStatus={process.status ?? 'IN_PROGRESS'} mode="history" />
                    )}
                    {activeTab === 'tracking' && id && (
                        <ProcessTimeline processId={id} currentStatus={process.status ?? 'IN_PROGRESS'} mode="tracking" />
                    )}
                    {activeTab === 'attachments' && id && <ProcessAttachmentsPanel processId={id} />}
                    {activeTab === 'subprocesses' && id && !isSubprocess && (
                        <ProcessSubprocessesPanel
                            processId={id}
                            parentSequentialId={process.sequential_id}
                            parentSeiNumber={process.sei_number ?? ''}
                        />
                    )}
                </div>
            </div>

            {canEdit && isEditModalOpen && (
                <EditProcessModal
                    process={process}
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                />
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 shrink-0 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-100">Excluir processo</h3>
                                <p className="text-sm text-slate-400 mt-2">
                                    Deseja realmente excluir este processo? <br />
                                    Esta ação não poderá ser desfeita.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await deleteProcess(id!);
                                        toast.success('Processo excluído do sistema.');
                                        navigate('/');
                                    } catch (error) {
                                        toast.error('Erro ao excluir processo.');
                                        setShowDeleteConfirm(false);
                                    }
                                }}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Excluindo...
                                    </>
                                ) : (
                                    'Sim, excluir processo'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
