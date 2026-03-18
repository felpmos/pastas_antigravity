import { useState } from 'react';
import { useProcessUpdates, useAddProcessUpdate } from '../../hooks/useProcess';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Bot, MessageSquare } from 'lucide-react';

interface ProcessTimelineProps {
    processId: string;
    currentStatus: string;
    mode: 'history' | 'tracking';
}

export default function ProcessTimeline({ processId, currentStatus, mode }: ProcessTimelineProps) {
    const { profile } = useAuth();
    const { data: updates, isLoading } = useProcessUpdates(processId);
    const { mutateAsync: addUpdate, isPending } = useAddProcessUpdate();

    const [content, setContent] = useState('');
    const [status, setStatus] = useState(currentStatus);

    // Filtra por tipo: histórico = sistema, acompanhamento = usuário
    const filtered = updates?.filter(u =>
        mode === 'history' ? u.is_system : !u.is_system
    ) ?? [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile || !content.trim()) return;

        try {
            await addUpdate({
                process_id: processId,
                content,
                created_by: profile.id,
                new_status: status !== currentStatus ? status : undefined,
            });

            setContent('');
            toast.success('Nota adicionada com sucesso!');
        } catch (error: any) {
            toast.error('Erro ao adicionar nota.');
        }
    };

    if (isLoading) {
        return <div className="animate-pulse flex flex-col gap-4">
            <div className="h-20 bg-slate-800/50 rounded-md p-4"></div>
            <div className="h-20 bg-slate-800/50 rounded-md p-4"></div>
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Formulário de nova nota – apenas na aba Acompanhamento */}
            {mode === 'tracking' && (
                <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
                    <h3 className="text-sm font-medium text-slate-200 mb-4">Adicionar Nota</h3>

                    <div className="space-y-4">
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Descreva o andamento ou despacho..."
                            className="w-full h-24 bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 resize-none text-slate-200 placeholder:text-slate-500"
                        ></textarea>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isPending || !content.trim()}
                                className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                            >
                                {isPending ? 'Salvando...' : 'Salvar Nota'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Lista de entradas */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                {filtered.map((update) => (
                    <div key={update.id} className="relative flex items-start gap-4">
                        {/* Timeline dot */}
                        <div className={`flex items-center justify-center w-10 h-10 mt-1 rounded-full border shadow shrink-0 z-10 ${mode === 'history'
                            ? 'border-slate-700/50 bg-slate-900/80 text-slate-400'
                            : 'border-emerald-500/50 bg-emerald-900/50 text-emerald-400'
                            }`}>
                            {mode === 'history'
                                ? <Bot size={14} />
                                : <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            }
                        </div>

                        {/* Card */}
                        <div className="flex-1 bg-slate-900/50 border border-slate-800 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-slate-200 text-sm flex items-center gap-1.5">
                                    {mode === 'history' && <Bot size={12} className="text-slate-500" />}
                                    {mode === 'history'
                                        ? (update.profiles?.name ? `Sistema · por ${update.profiles.name}` : 'Sistema')
                                        : (update.profiles?.name || 'Usuário')
                                    }
                                </div>
                                <time className="text-xs text-slate-500">{format(new Date(update.created_at), 'dd/MM/yyyy HH:mm')}</time>
                            </div>
                            <div className="text-slate-400 text-sm whitespace-pre-wrap">
                                {update.content}
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center p-8 text-slate-500 text-sm flex flex-col items-center gap-2">
                        {mode === 'history'
                            ? <><Bot size={24} className="opacity-30" /><p>Nenhum log do sistema registrado.</p></>
                            : <><MessageSquare size={24} className="opacity-30" /><p>Nenhuma nota adicionada ainda.</p></>
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
