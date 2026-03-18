import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Process } from '../../hooks/useProcesses';
import { useAddProcessUpdate } from '../../hooks/useProcess';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

interface EditProcessModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    process: Process;
}

export default function EditProcessModal({ open, onOpenChange, process }: EditProcessModalProps) {
    const { profile } = useAuth();
    const queryClient = useQueryClient();
    const { mutateAsync: addUpdate } = useAddProcessUpdate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [subject, setSubject] = useState(process.subject);
    const [type, setType] = useState(process.type);
    const [date, setDate] = useState(process.date ? process.date.split('T')[0] : '');
    const [reference, setReference] = useState(process.reference_number || '');
    const [senderOrRecipient, setSenderOrRecipient] = useState(process.sender_recipient || '');
    const [organ, setOrgan] = useState(process.organ || '');
    const [isPriority, setIsPriority] = useState(process.is_priority || false);

    useEffect(() => {
        if (open) {
            setSubject(process.subject);
            setType(process.type);
            setDate(process.date ? process.date.split('T')[0] : '');
            setReference(process.reference_number || '');
            setSenderOrRecipient(process.sender_recipient || '');
            setOrgan(process.organ || '');
            setIsPriority(process.is_priority || false);
        }
    }, [open, process]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            const { data, error } = await supabase
                .from('processes')
                .update({
                    subject,
                    type,
                    date,
                    reference_number: reference,
                    sender_recipient: senderOrRecipient,
                    organ,
                    is_priority: isPriority,
                })
                .eq('id', process.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            toast.success('Processo atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['process', process.id] });
            queryClient.invalidateQueries({ queryKey: ['processes'] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Erro ao atualizar processo.');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setLoading(true);
        try {
            await updateMutation.mutateAsync();
            await addUpdate({
                process_id: process.id,
                content: `Processo editado. Dados atualizados (Assunto, Tipo, etc).`,
                created_by: profile.id,
                is_system: true,
            });
        } catch (error) {
            console.error('Falha ao atualizar o processo e seu histórico', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-slate-50">
                <DialogHeader>
                    <DialogTitle className="text-xl">Editar Processo: {process.sei_number}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Atualize as informações do processo administrativo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-sm font-medium text-slate-300">Data do Processo *</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Assunto *</label>
                        <input
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Descreva o assunto principal do processo"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Tipo de Processo *</label>
                        <select
                            required
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                        >
                            <option value="EXTERNO_ENVIADO">Externo Enviado</option>
                            <option value="INTERNO_ENVIADO">Interno Enviado</option>
                            <option value="INTERNO_RECEBIDO">Interno Recebido</option>
                            <option value="PAD">PAD</option>
                            <option value="CUSTOM">Personalizado</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Remetente/Destinatário</label>
                            <input
                                value={senderOrRecipient}
                                onChange={(e) => setSenderOrRecipient(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Órgão</label>
                            <input
                                value={organ}
                                onChange={(e) => setOrgan(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 mt-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Referência/Ofício</label>
                            <input
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Ex: Ofício nº 123/2026"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                            <input
                                type="checkbox"
                                id="edit_priority"
                                checked={isPriority}
                                onChange={(e) => setIsPriority(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                            />
                            <label htmlFor="edit_priority" className="text-sm font-medium text-amber-400 cursor-pointer">
                                Marcar como Prioritário
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 mt-6">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
