import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

import { Process } from './useProcesses';

export interface ProcessLink {
    id: string;
    parent_process_id: string;
    child_process_id: string;
    created_at: string;
    child_process?: Process;
}

export function useProcessLinks(processId?: string) {
    return useQuery({
        queryKey: ['process_links', processId],
        enabled: !!processId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('process_links')
                .select(`
          *,
          child_process:child_process_id (*)
        `)
                .eq('parent_process_id', processId);
            if (error) throw error;
            return data as ProcessLink[];
        },
    });
}

export function useAddProcessLink(parentId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (childSei: string) => {
            const normalizedSei = childSei.trim();

            // Busca insensível e com wildcard nas pontas
            const searchPattern = `%${normalizedSei}%`;
            const { data: child, error: findErr } = await supabase
                .from('processes')
                .select('id')
                .ilike('sei_number', searchPattern)
                .maybeSingle();

            if (findErr) throw findErr;
            if (!child) throw new Error('Processo não encontrado com esse número SEI.');

            const { error } = await supabase.from('process_links').insert({
                parent_process_id: parentId,
                child_process_id: child.id,
            });
            if (error) {
                if (error.code === '23505') throw new Error('Este subprocesso já está vinculado.');
                throw error;
            }
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['process_links', parentId] }),
    });
}

export function useRemoveProcessLink(parentId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (linkId: string) => {
            const { error } = await supabase.from('process_links').delete().eq('id', linkId);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['process_links', parentId] }),
    });
}
