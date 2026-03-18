import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useAddProcessUpdate } from '../../hooks/useProcess';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

interface SubprocessFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parentProcessId: string;
    parentSequentialId: number;
    parentSeiNumber: string;
}

export default function SubprocessFormModal({ open, onOpenChange, parentProcessId, parentSequentialId, parentSeiNumber }: SubprocessFormModalProps) {
    const { profile } = useAuth();
    const queryClient = useQueryClient();
    const { mutateAsync: addUpdate } = useAddProcessUpdate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [subject, setSubject] = useState('');
    const [seiNumber, setSeiNumber] = useState(parentSeiNumber);
    const [type, setType] = useState('EXTERNO_ENVIADO');
    const [status, setStatus] = useState('AWAITING');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reference, setReference] = useState('');
    const [senderOrRecipient, setSenderOrRecipient] = useState('');
    const [organ, setOrgan] = useState('');
    const [isPriority, setIsPriority] = useState(false);

    const resetForm = () => {
        setSubject('');
        setSeiNumber(parentSeiNumber); // re-fill with parent SEI
        setType('EXTERNO_ENVIADO');
        setStatus('AWAITING');
        setDate(new Date().toISOString().split('T')[0]);
        setReference('');
        setSenderOrRecipient('');
        setOrgan('');
        setIsPriority(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setLoading(true);

        try {
            // 1. Criar o processo (que será o subprocesso)
            const { data: childProcess, error } = await supabase.from('processes').insert({
                subject,
                sei_number: seiNumber,
                type,
                status,
                date,
                reference_number: reference,
                sender_recipient: senderOrRecipient,
                organ,
                is_priority: isPriority,
                created_by: profile.id,
                parent_process_id: parentProcessId // Define que é filho
            }).select().single();

            if (error) {
                throw error;
            }

            // 2. Adicionar o criador como ADMIN em process_permissions
            if (childProcess) {
                const { error: permError } = await supabase.from('process_permissions').insert({
                    process_id: childProcess.id,
                    user_id: profile.id,
                    level: 'ADMIN',
                    granted_by: profile.id
                });

                if (permError) console.error('Erro ao definir permissão:', permError);

                // 3. Vincular em process_links
                const { error: linkError } = await supabase.from('process_links').insert({
                    parent_process_id: parentProcessId,
                    child_process_id: childProcess.id,
                    created_by: profile.id
                });

                if (linkError) console.error('Erro ao vincular subprocesso:', linkError);

                // 4. Adicionar log no processo pai
                await addUpdate({
                    process_id: parentProcessId,
                    content: `Subprocesso criado e vinculado: ${seiNumber} (Assunto: ${subject})`,
                    created_by: profile.id,
                    is_system: true,
                });
            }

            toast.success('Subprocesso cadastrado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['process_links', parentProcessId] });
            queryClient.invalidateQueries({ queryKey: ['processes'] });
            resetForm();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar subprocesso.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-slate-50">
                <DialogHeader>
                    <DialogTitle className="text-xl">Novo Subprocesso (Processo #{parentSequentialId})</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Os dados preenchidos serão utilizados para criar o subprocesso, que será vinculado automaticamente a este processo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-medium text-slate-300">Número SEI</label>
                            <input
                                value={seiNumber}
                                readOnly
                                className="w-full bg-slate-700/30 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-400 cursor-not-allowed select-none"
                            />
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-medium text-slate-300">Data do Subprocesso *</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Assunto *</label>
                        <input
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Descreva o assunto principal do subprocesso"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Tipo de Processo *</label>
                            <select
                                required
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                            >
                                <option value="EXTERNO_ENVIADO">Externo Enviado</option>
                                <option value="INTERNO_ENVIADO">Interno Enviado</option>
                                <option value="INTERNO_RECEBIDO">Interno Recebido</option>
                                <option value="PAD">PAD</option>
                                <option value="CUSTOM">Personalizado</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Status Inicial *</label>
                            <select
                                required
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50"
                            >
                                <option value="AWAITING">Aguardando</option>
                                <option value="IN_PROGRESS">Em Andamento</option>
                                <option value="AWAITING_SIGNATURE">Aguardando Assinatura</option>
                                <option value="COMPLETED">Concluído</option>
                            </select>
                        </div>
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
                                id="priority_sub"
                                checked={isPriority}
                                onChange={(e) => setIsPriority(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                            />
                            <label htmlFor="priority_sub" className="text-sm font-medium text-amber-400 cursor-pointer">
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
                            {loading ? 'Criando...' : 'Adicionar Subprocesso'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
