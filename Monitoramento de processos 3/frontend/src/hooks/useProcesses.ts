import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/types';

export type Process = Database['public']['Tables']['processes']['Row'] & {
    profiles?: { name: string } | null;
};

interface UseProcessesOptions {
    status?: string | null;
    type?: string;
    isPriority?: boolean | null;
    searchQuery?: string;
    dateFrom?: string;
    dateTo?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
}

export function useProcesses(options?: UseProcessesOptions) {
    return useQuery({
        queryKey: ['processes', options],
        queryFn: async () => {
            let query = supabase
                .from('processes')
                .select(`
          *,
          profiles:created_by (name)
        `)
                .is('deleted_at', null)
                .is('parent_process_id', null);

            if (options?.status) {
                query = query.eq('status', options.status);
            }

            if (options?.type) {
                query = query.eq('type', options.type);
            }

            if (options?.isPriority !== undefined && options?.isPriority !== null) {
                query = query.eq('is_priority', options.isPriority);
                // Prioritários concluídos/arquivados não são mais considerados prioritários ativos
                if (options.isPriority === true) {
                    query = query.not('status', 'in', '("COMPLETED","ARCHIVED")');
                }
            }

            if (options?.dateFrom) {
                query = query.gte('date', options.dateFrom);
            }
            if (options?.dateTo) {
                query = query.lte('date', options.dateTo);
            }

            if (options?.searchQuery) {
                query = query.or(`subject.ilike.%${options.searchQuery}%,sei_number.ilike.%${options.searchQuery}%,organ.ilike.%${options.searchQuery}%`);
            }

            const orderColumn = options?.orderBy || 'created_at';
            const orderAsc = options?.orderDirection === 'asc';
            query = query.order(orderColumn, { ascending: orderAsc });

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            return data as Process[];
        },
    });
}

export function useDeleteProcess() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('processes')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['processes'] });
        },
    });
}
