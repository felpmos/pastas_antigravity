import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcessLinks } from '../../hooks/useProcessLinks';
import { useAddProcessUpdate } from '../../hooks/useProcess';
import { useAuth } from '../../context/AuthContext';
import { useDeleteProcess, Process } from '../../hooks/useProcesses';
import EditProcessModal from './EditProcessModal';
import SubprocessFormModal from './SubprocessFormModal';
import { GitBranch, Trash2, Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const statusMap: Record<string, { label: string; color: string }> = {
    AWAITING: { label: 'Aguardando', color: 'text-yellow-500 bg-yellow-500/10' },
    IN_PROGRESS: { label: 'Em Andamento', color: 'text-blue-400 bg-blue-500/10' },
    AWAITING_SIGNATURE: { label: 'Aguard. Assinatura', color: 'text-blue-400 bg-blue-500/10' },
    COMPLETED: { label: 'Concluído', color: 'text-emerald-400 bg-emerald-500/10' },
    ARCHIVED: { label: 'Arquivado', color: 'text-slate-400 bg-slate-500/10' },
};

interface ProcessSubprocessesPanelProps {
    processId: string;
    parentSequentialId: number;
    parentSeiNumber: string;
}

export default function ProcessSubprocessesPanel({ processId, parentSequentialId, parentSeiNumber }: ProcessSubprocessesPanelProps) {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const { data: links, isLoading } = useProcessLinks(processId);
    const { mutateAsync: addUpdate } = useAddProcessUpdate();
    const { mutateAsync: deleteProcess } = useDeleteProcess();

    const [isSubprocessModalOpen, setIsSubprocessModalOpen] = useState(false);

    // For editing subprocess
    const [subprocessToEdit, setSubprocessToEdit] = useState<Process | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const canEdit = profile?.role !== 'VIEWER';

    const handleDeleteSubprocess = async (childId: string, subject: string, sei: string) => {
        const confirmed = window.confirm(`Deseja realmente excluir o subprocesso "${subject}"?\n\nEsta ação não poderá ser desfeita.`);
        if (!confirmed) return;
        try {
            await deleteProcess(childId);
            // Invalidate process_links so the list refreshes
            qc.invalidateQueries({ queryKey: ['process_links', processId] });
            await addUpdate({
                process_id: processId,
                content: `Subprocesso excluído: ${sei} — ${subject}`,
                created_by: profile?.id ?? '',
                is_system: true,
            });
            toast.success('Subprocesso excluído.');
        } catch (e) {
            toast.error('Erro ao excluir subprocesso.');
        }
    };

    // Guard defensivo: só inclui links com child_process válido e não deletado
    const activeLinks = (links || []).filter(l =>
        l?.child_process &&
        l.child_process.id &&
        !l.child_process.deleted_at
    );
    const completed = activeLinks.filter(l => l.child_process?.status === 'COMPLETED').length;
    const total = activeLinks.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="space-y-4">
            {isLoading ? (
                <div className="flex justify-center py-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-emerald-500" />
                </div>
            ) : (
                <>
                    {total > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Progresso dos subprocessos</span>
                                <span className="font-medium text-slate-200">{completed}/{total} concluídos ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {activeLinks.map((link) => {
                            const cp = link.child_process!;
                            const st = statusMap[cp?.status ?? 'AWAITING'];
                            return (
                                <div
                                    key={link.id}
                                    className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800/80 rounded-lg border border-slate-700/50 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/process/${cp?.id}`)}
                                >
                                    <GitBranch size={15} className="text-emerald-400 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        {/* TITLE: Subject (assunto) */}
                                        <p className="text-sm font-bold text-slate-200 truncate">
                                            {cp?.subject || '(Sem assunto)'}
                                        </p>
                                        {/* Secondary: compound ID and SEI */}
                                        <p className="text-xs font-mono text-slate-400 truncate">
                                            #{parentSequentialId}-{cp?.sequential_id} · {cp?.sei_number}
                                        </p>
                                    </div>
                                    {st && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${st.color}`}>
                                            {st.label}
                                        </span>
                                    )}
                                    {/* Action buttons — always visible, stop propagation */}
                                    {canEdit && (
                                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => {
                                                    if (cp) {
                                                        setSubprocessToEdit(cp as Process);
                                                        setIsEditModalOpen(true);
                                                    }
                                                }}
                                                className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 cursor-pointer transition-colors"
                                                title="Editar subprocesso"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => cp?.id && handleDeleteSubprocess(cp.id, cp?.subject ?? '', cp?.sei_number ?? '')}
                                                className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                                                title="Excluir subprocesso"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {activeLinks.length === 0 && (
                            <div className="text-center py-4 text-slate-500 text-sm flex flex-col items-center gap-2">
                                <GitBranch size={24} className="opacity-40" />
                                <p>Nenhum subprocesso vinculado.</p>
                            </div>
                        )}
                    </div>

                    {canEdit && (
                        <button
                            onClick={() => setIsSubprocessModalOpen(true)}
                            className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors py-2 cursor-pointer font-medium"
                        >
                            <Plus size={16} /> Adicionar Subprocesso
                        </button>
                    )}
                </>
            )}

            {subprocessToEdit && (
                <EditProcessModal
                    open={isEditModalOpen}
                    onOpenChange={(open) => {
                        setIsEditModalOpen(open);
                        if (!open) setTimeout(() => setSubprocessToEdit(null), 200);
                    }}
                    process={subprocessToEdit}
                />
            )}

            <SubprocessFormModal
                open={isSubprocessModalOpen}
                onOpenChange={setIsSubprocessModalOpen}
                parentProcessId={processId}
                parentSequentialId={parentSequentialId}
                parentSeiNumber={parentSeiNumber}
            />
        </div>
    );
}
