import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Process } from './useProcesses';
import { Database } from '../lib/types';

export type ProcessUpdate = Database['public']['Tables']['process_updates']['Row'] & {
    profiles?: { name: string } | null;
};

export function useProcess(id?: string) {
    return useQuery({
        queryKey: ['process', id],
        enabled: !!id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('processes')
                .select(`
          *,
          profiles:created_by (name)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Process;
        },
    });
}

export function useProcessUpdates(processId?: string) {
    return useQuery({
        queryKey: ['process_updates', processId],
        enabled: !!processId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('process_updates')
                .select(`
          *,
          profiles:created_by (name)
        `)
                .eq('process_id', processId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as ProcessUpdate[];
        },
    });
}

export function useAddProcessUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updateInfo: {
            process_id: string;
            content: string;
            created_by: string;
            new_status?: string;
            is_system?: boolean;
        }) => {

            // 1. Inserir o update
            const { error: updateError } = await supabase
                .from('process_updates')
                .insert({
                    process_id: updateInfo.process_id,
                    content: updateInfo.content,
                    created_by: updateInfo.created_by,
                    is_system: updateInfo.is_system ?? false,
                });

            if (updateError) throw updateError;

            // 2. Atualizar o status do processo se fornecido
            if (updateInfo.new_status) {
                const { error: statusError } = await supabase
                    .from('processes')
                    .update({ status: updateInfo.new_status })
                    .eq('id', updateInfo.process_id);

                if (statusError) throw statusError;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['process_updates', variables.process_id] });
            queryClient.invalidateQueries({ queryKey: ['process', variables.process_id] });
            queryClient.invalidateQueries({ queryKey: ['processes'] });
        },
    });
}
